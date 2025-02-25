import { Browser } from "puppeteer"
import { Logger } from "../logger"
import { EventEmitter } from "events"
import { ScraperEvent } from "../../events/scraper-event"

export enum ScraperState {
  READY,
  STARTED,
  STOPPED
}

export interface ScraperProps {
  readonly logger: Logger
}

export abstract class Scraper {
  browser?: Browser
  readonly emitter: EventEmitter = new EventEmitter()
  private _state: ScraperState = ScraperState.READY
  protected _startDate?: Date
  protected _endDate?: Date

  constructor(protected props: ScraperProps) { }

  public get state(): ScraperState {
    return this._state
  }

  protected get logger(): Logger {
    return this.props.logger
  }

  public get startDate(): Date | undefined {
    return this._startDate
  }

  public get endDate(): Date | undefined {
    return this._endDate
  }

  protected abstract _start(): Promise<void>

  protected async beforeStart(): Promise<void> {
    if (!this.browser) throw Error("browser is not defined")
    this._startDate = new Date(Date.now())
    this.emitter.emit(ScraperEvent.SCRAPER_STARTED, this)
  }

  protected async beforeStop(): Promise<void> { }

  protected async afterStop(): Promise<void> {
    this._endDate = new Date(Date.now())
    this.emitter.emit(ScraperEvent.SCRAPER_STOPPED, this)
  }

  async start(): Promise<void> {
    if (this._state === ScraperState.READY) {
      this._state = ScraperState.STARTED
      await this.beforeStart()
      this.logger.info('Scraper iniciado')
      return this._start()
        .catch(err => {
          if (err instanceof Error) {
            this.logger.error(`${err.name}: ${err.message}`)
            throw err
          }
        })
        .finally(() => this.stop())
    } else if (this.state === ScraperState.STOPPED) {
      return this.reset().then(() => this.start())
    }
  }

  async reset(): Promise<void> {
    this._state = ScraperState.READY
    this._startDate = undefined
    this._endDate = undefined
    this.emitter.emit(ScraperEvent.SCRAPER_RESETED, this)
    this.logger.info('Scraper resetado')
  }

  async stop(): Promise<void> {
    if (this.state === ScraperState.STARTED) {
      this._state = ScraperState.STOPPED
      await this.beforeStop()
      this.logger.info('Scraper encerrado')
      await this.browser?.close()
      await this.afterStop()
    }
  }

}