import { BlocksSettings } from '@/components/admin/blocks-settings/blocks-settings'
import { NewBlockSettings } from '@/components/admin/blocks-settings/new-block-settings'

export default async function AdminBlocksSettings({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <div className="px-5">
      <div className="w-full items-center justify-between">
        <h1 className="text-xl font-bold">
          {locale == 'uk' ? 'Налаштування блоків' : 'Blocks Settings'}
          <div className="admin-content">
            <NewBlockSettings locale={locale} />
            <BlocksSettings locale={locale} />
          </div>
        </h1>
      </div>
    </div>
  )
}
