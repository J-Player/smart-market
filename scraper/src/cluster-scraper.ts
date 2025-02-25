import { EventEmitter } from "events"
import { Cluster } from "puppeteer-cluster"
import { equalsIgnoreCase } from "./common/utils"
import { ClusterEvent } from "./events/cluster-event"
import { MarketScraper } from "./models/scraper/market-scraper"
import { ScraperState } from "./models/scraper/scraper"
import { LaunchOptions } from "puppeteer"

export enum ClusterCommandType {
  START = 'start',
  START_ALL = 'start-all',
}

export interface ClusterCommand {
  command: ClusterCommandType,
  market?: string,
}

export class ClusterScraper {

  readonly scrapers: Map<string, MarketScraper> = new Map()
  readonly eventEmitter = new EventEmitter()
  private cluster!: Cluster<MarketScraper, void>

  private static instance: ClusterScraper

  private constructor() {
    this.init()
  }

  static getInstance(): ClusterScraper {
    if (!ClusterScraper.instance) {
      ClusterScraper.instance = new ClusterScraper()
    }
    return ClusterScraper.instance
  }

  private async init() {
    this.cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_BROWSER,
      maxConcurrency: 3,
      timeout: 5 * 60 * 1000,
      retryLimit: 3,
      retryDelay: 10000,
      workerCreationDelay: 1000,
      sameDomainDelay: 1000,
      skipDuplicateUrls: true,
      monitor: true,
      puppeteerOptions: {
        headless: false,
        defaultViewport: {
          width: 1360,
          height: 768
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36 OPR/117.0.0.0'
        }
      } as LaunchOptions
    })
    this.cluster.on('taskerror', (err, data: MarketScraper) => {
      if (err instanceof Error)
        console.log(`Error while running scraper ${data.market.name}: [${err.name}] ${err.message}`)
      })
    await this.cluster.task(({ data: scraper, page }) => {
      scraper.browser = page.browser()
      return scraper.start()
    })
    this.eventEmitter.emit(ClusterEvent.CLUSTER_READY)
  }

  async getInfo(): Promise<any[]> {
    return this.scrapers.values().map(sc => ({
      market: sc.market.name,
      state: ScraperState[sc.state],
      startedAt: sc.startDate,
      stoppedAt: sc.endDate,
    })).toArray()
  }

  async addScrapers(...scrapers: MarketScraper[]): Promise<void> {
    return scrapers
      .filter(scraper => !this.scrapers.has(scraper.market.name))
      .forEach(scraper => this.scrapers.set(scraper.market.name, scraper))
  }

  async start(key: string): Promise<void> {
    if (this.scrapers.size === 0) throw new Error('No scrapers found')
    const keys = this.scrapers.keys()
    const keyFound = keys.find(k => equalsIgnoreCase(k, key))
    if (!keyFound) throw new Error(`Scraper not found: ${key}`)
    const scraper = this.scrapers.get(keyFound)
    return this.cluster.queue(scraper!)
  }

  async startAll(): Promise<void> {
    return this.scrapers.values()
      .filter(scraper => scraper.state !== ScraperState.STARTED)
      .forEach(scraper => this.cluster.queue(scraper))
  }

}