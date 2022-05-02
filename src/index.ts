import type { Application } from 'express'
import type { Server } from 'http'
import 'source-map-support/register'
import http from 'http'
import initializeApp from './app'

enum SYSTEM_STATUS {
  PENDING = 'PENDING',
  READY = 'READY',
  SHUTTING_DOWN = 'SHUTTING_DOWN',
}

let app: Application, server: Server
let status: SYSTEM_STATUS = SYSTEM_STATUS.PENDING

process.on('uncaughtException', (error: Error) => {
  console.error(error)
  process.exit(1)
})

function onListening(error: Error) {
  if (error) {
    throw error
  }

  const addr = server.address()
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`

  console.log(`Listening on ${bind}`)
}

function onTerminating(signal: string): void {
  console.log(`'${signal}' signal received.`)

  if (status === SYSTEM_STATUS.SHUTTING_DOWN) {
    return
  }

  console.log('Draining request(s) and closing http server')

  server.close(() => {
    console.log('Http server closed.')

    return app.locals
      .shutdown()
      .then(() => {
        console.log('gracefully shutdown completed')
        process.exit(0)
      })
      .catch((err: Error) => {
        console.log(err)
        process.exit(1)
      })
  })
}

initializeApp()
  .then((result) => {
    app = result
    server = http.createServer(app)

    // server.on('error', onError)
    server.on('listening', onListening)

    // handle terminating signal from outside
    process.on('SIGTERM', onTerminating)
    process.on('SIGINT', onTerminating)
    process.on('SIGQUIT', onTerminating)
    process.on('SIGTSTP', onTerminating)

    // Listen on provided port, on all network interfaces.
    // server.listen(config.appPort)
    status = SYSTEM_STATUS.READY
  })
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })
