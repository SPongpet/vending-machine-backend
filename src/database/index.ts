import type { Connection, ConnectionOptions } from 'typeorm'
import { createConnection, getConnectionOptions } from 'typeorm'

export class Database {
  private _connection: Connection
  private _connectionOptions: ConnectionOptions

  async connect(): Promise<Connection> {
    console.log('database connecting')

    this._connectionOptions = await getConnectionOptions()
    this._connection = await createConnection(this._connectionOptions)

    console.log('database connected')

    return this._connection
  }

  async disconnect(): Promise<boolean> {
    console.log('database disconnecting')

    if (this._connection) {
      await this._connection.close()
    }

    console.log('database disconnected')

    return true
  }
}

export const database = new Database()
