import { updateNovaPoshta as updateNovaPoshta } from '@/server/delivery/update-nova-poshta'
//import { getNovaPoshtaAllCities } from '@/server/delivery/get-nova-poshta'

export default async function NP() {
  await updateNovaPoshta()
  //const test = getNovaPoshtaAllCities()

  return (
    <div>
      <div className="flex">111111111111</div>
    </div>
  )
}
