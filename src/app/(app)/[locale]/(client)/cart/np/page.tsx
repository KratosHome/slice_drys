import { createPost } from '@/server/delivery/update-nova-poshta'

export default async function NP() {
  await createPost()

  return (
    <div>
      <div className="flex">111111111111</div>
    </div>
  )
}
