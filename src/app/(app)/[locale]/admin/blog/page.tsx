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
    img: 'https://example.com/image.jpg',
    author: 'John Doe',
    date: new Date('2023-10-15'),
    slug: 'example-title',
    metaDescription: 'This is an example of a meta description.',
    keywords: ['example', 'post', 'typescript'],
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
