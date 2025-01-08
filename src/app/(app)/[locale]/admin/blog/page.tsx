import EditorPost from '@/components/admin/editor-post/editor-post'
import { ProductList } from '@/components/admin/post-list/post-list'

export default async function Blog({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const posts: IGetPost = {
    product: [
      {
        _id: '123',
        title: { en: 'Sample Title', uk: 'Приклад заголовка' },
        content: { en: 'Sample content', uk: 'Приклад змісту' },
        img: 'https://example.com/image.jpg',
        author: { en: 'Author Name', uk: "Ім'я автора" },
        slug: 'sample-title',
        metaDescription: {
          en: 'Sample meta description',
          uk: 'Приклад мета опису',
        },
        keywords: { en: ['sample', 'example'], uk: ['приклад', 'зразок'] },
        readingTime: 5,
      },
    ],
    success: true,
    message: 'Posts successfully retrieved',
  }
  return (
    <div className="px-5">
      <div className="flex items-end justify-between">
        <h1 className="text-xl font-bold">Пости</h1>
        <EditorPost buttonTitle="створити" />
      </div>
      <ProductList data={posts} />
    </div>
  )
}
