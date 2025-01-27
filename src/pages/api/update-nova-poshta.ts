import { updateNovaPoshta } from '@/server/delivery/update-nova-poshta'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    try {
      await updateNovaPoshta()
      res.status(200).json({ message: 'Nova Poshta updated successfully' })
    } catch (error) {
      res.status(500).json({ error: 'Failed to update Nova Poshta, ' + error })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
