import client, { Channel, ChannelModel, Replies } from 'amqplib'
import { EventEmitter } from 'events'
import { RabbitMQEvent } from '../events/rabbitmq-event'

export class RabbitMQService {
  private channelModel!: ChannelModel
  private channel!: Channel
  private consumers: Map<string, Replies.Consume> = new Map()
  private static INSTANCE?: RabbitMQService
  readonly eventEmitter = new EventEmitter()

  public static getInstance(): RabbitMQService {
    if (!RabbitMQService.INSTANCE) {
      RabbitMQService.INSTANCE = new RabbitMQService()
    }
    return RabbitMQService.INSTANCE
  }

  private constructor() {
    this.init()
  }

  private async init(): Promise<void> {
    const user = process.env.RABBITMQ_USER || 'guest' 
    const pass = process.env.RABBITMQ_PASS || 'guest'
    const host = process.env.RABBITMQ_HOST || 'localhost'
    const port = process.env.RABBITMQ_PORT ? parseInt(process.env.RABBITMQ_PORT) : 5672
    this.channelModel = await client.connect(`amqp://${user}:${pass}@${host}:${port}`)
    this.channel = await this.channelModel.createChannel()
    this.eventEmitter.emit(RabbitMQEvent.RABBITMQ_CONNECTED)
    console.log('Connected to RabbitMQ server')
  }

  public async addConsumer(consumerTag: string, queue: string, callback: (msg: client.ConsumeMessage | null) => Promise<void>) {
    if (this.consumers.has(consumerTag)) throw new Error(`Consumer "${consumerTag}" already exists`)
    await this.channel.checkQueue(queue)
    const consumer = await this.channel.consume(queue, callback, { consumerTag: queue, noAck: false })
    this.consumers.set(consumerTag, consumer)
  }

  public async removeConsumer(consumerTag: string) {
    if (!this.consumers.has(consumerTag)) throw new Error(`Consumer "${consumerTag}" does not exist`)
    await this.channel.cancel(consumerTag).then(() => {
      this.consumers.delete(consumerTag)
    })
  }

  public async sendMessage(payload: any, queue: string): Promise<void> {
    const message = JSON.stringify(payload)
    await this.channel.checkQueue(queue)
    this.channel.sendToQueue(queue, Buffer.from(message))
  }
}