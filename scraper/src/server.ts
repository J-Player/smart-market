import express, { json } from 'express'
import { ClusterScraper } from './cluster-scraper'

export class Server {

  readonly cluster = ClusterScraper.getInstance()

  constructor(private port = 3000, private app = express()) {
    this.init()
  }

  private init() {
    this.app.use(json())
    this.app.get('/scrapers/info', async (req, res) => {
      res.status(200).send(await this.cluster.getInfo())
    })
    this.app.get('/scrapers/start/all', async (req, res) => {
      this.cluster.startAll().then(() => {
        res.status(201).send({
          message: 'All scrapers is starting...'
        })
      }).catch(err => res.status(500).send({
        message: err.message
      }))
    })
    this.app.get('/scrapers/start/:market', async (req, res) => {
      this.cluster.start(req.params.market).then(() => {
        res.status(200).send({
          message: 'Scraper is starting...'
        })
      }).catch(err => res.status(500).send({
        message: err.message
      }))
    })
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`)
    })
  }
}