'use server'
import mongoose from 'mongoose'

interface Connection {
  isConnected?: number
}

const connection: Connection = {}

export const connectToDbServer = async (): Promise<void> => {
  'use server'
  try {
    if (connection.isConnected) {
      console.warn('Using existing connection')

      return
    }

    const db = await mongoose.connect(`${process.env.NEXT_MONGO_DB}`)
    connection.isConnected = db.connections[0].readyState
  } catch (error) {
    console.error('Connect to Db error', error)
  }
}
