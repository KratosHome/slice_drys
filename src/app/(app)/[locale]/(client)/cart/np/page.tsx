import { updateNovaPoshta as updateNovaPoshta } from '@/server/delivery/update-nova-poshta'

export default async function NP() {
  const response = await fetch('/api/update-nova-poshta', {
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error('Failed to update Nova Poshta')
  }
}
