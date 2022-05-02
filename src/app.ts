import type { Application } from 'express'
import cors from 'cors'
import express from 'express'
import routers from './routers'
import { database } from './database'


let app: Application

async function shutdown(): Promise<void> {
  await database.disconnect()
}

async function initializeApp(): Promise<Application> {

  await database.connect()

  app = express()
  app.use(
    cors({
      origin: '*',
      allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'X-Access-Token',
      ],
      methods: 'GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS',
    }),
  )
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use('/', routers)
  app.locals.shutdown = shutdown

  return app
}

export default initializeApp
