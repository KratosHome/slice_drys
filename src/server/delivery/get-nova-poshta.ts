import { connectToDb } from '@/server/connectToDb'
import { NovaPoshta } from './novaPoshtaSchema'

export async function getNovaPoshtaCities() {
  try {
    await connectToDb()