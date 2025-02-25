import { ClusterCommand, ClusterCommandType, ClusterScraper } from "./cluster-scraper";
import { ClusterEvent } from "./events/cluster-event";
import { RabbitMQEvent } from "./events/rabbitmq-event";
import { ScraperEvent } from "./events/scraper-event";
import { MarketScraper } from "./models/scraper/market-scraper";
import { GuanabaraScraper } from "./scrapers/guanabara/guanabara-scraper";
import { MundialScraper } from "./scrapers/mundial/mundial-scraper";
import { UnidosScraper } from "./scrapers/unidos/unidos-scraper";
import { Server } from "./server";
import { RabbitMQService } from "./services/rabbitmq-service";

require('dotenv').config();

function createConsumer(cluster: ClusterScraper, rabbitMQService: RabbitMQService, consumerTag: string, queue: string) {
  rabbitMQService.addConsumer(consumerTag, queue, async (msg) => {
    if (!msg) return
    const payload = JSON.parse(msg.content.toString()) as ClusterCommand
    switch (payload.command) {
      case ClusterCommandType.START:
        if (payload.market) cluster.start(payload.market)
        break
      case ClusterCommandType.START_ALL:
        cluster.startAll()
        break
    }
  })
}

function createProducer(cluster: ClusterScraper, rabbitMQService: RabbitMQService) {
  cluster.scrapers.values().forEach(scraper => {
    scraper.emitter.on(ScraperEvent.SCRAPER_STOPPED, (sc: MarketScraper) => {
      if (sc.productLength > 0)
        rabbitMQService.sendMessage(sc.payload, "scraper-data-queue").then(() => {
          console.log(`Scraper ${sc.market.name} sent ${sc.productLength} products to queue`);
        });
    });
  });
}

(async () => {
  const queue = 'scraper-control-queue'
  const consumerTag = 'scraper-control'
  const scraperList = [
    new UnidosScraper(),
    new MundialScraper(),
    new GuanabaraScraper(),
    // new PrezunicScraper()
  ]
  
  const rabbitMQService = RabbitMQService.getInstance()
  const cluster = ClusterScraper.getInstance()
  await Promise.all([
    new Promise(resolve => rabbitMQService.eventEmitter.once(RabbitMQEvent.RABBITMQ_CONNECTED, resolve)),
    new Promise(resolve => cluster.eventEmitter.once(ClusterEvent.CLUSTER_READY, resolve)),
  ])
  cluster.addScrapers(...scraperList)
  createConsumer(cluster, rabbitMQService, consumerTag, queue);
  createProducer(cluster, rabbitMQService);
  new Server(3000)
})();


