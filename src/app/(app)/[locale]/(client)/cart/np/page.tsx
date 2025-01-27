import { updateNovaPoshta as updateNovaPoshta } from '@/server/delivery/update-nova-poshta'

export default async function NP() {
  await updateNovaPoshta()

  return (
    <div>
      <div className="flex">111111111111</div>
    </div>
  )
}
