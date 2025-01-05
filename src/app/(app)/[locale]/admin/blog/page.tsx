import EditorPost from '@/components/admin/editor-post/editor-post'

export default async function Blog({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const post: IPostLocal = {
    _id: '12345',
    title: {
      en: 'Example Title 1',
      uk: 'Приклад заголовку',
    },
    content: {
      en: '{"ops":[{"insert":"test en\\n"}]}',
      uk: '{"ops":[{"insert":"test uk\\n"}]}',
    },
    img: 'https://res.cloudinary.com/dohos5iu3/image/upload/v1736102699/post-slice/wuupmp14ariplq1pixu0.png',
    author: {
      en: 'Jon Dou',
      uk: 'Валер"ян Ібрагімович',
    },
    date: new Date('2023-10-15'),
    slug: 'example-title',
    metaDescription: {
      en: 'Jon Dou',
      uk: 'Валер"ян Ібрагімович',
    },
    keywords: {
      en: ['example', 'post', 'typescript'],
      uk: ['example', 'post', 'тест'],
    },
    readingTime: 5,
  }

  return (
    <div className="px-5">
      <div className="flex items-end justify-between">
        <h1 className="text-xl font-bold">Пости</h1>
        <EditorPost buttonTitle="створити" />
        <EditorPost buttonTitle="редагувати" post={post} />
      </div>
    </div>
  )
}
