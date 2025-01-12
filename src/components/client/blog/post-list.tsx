import PostCard from './post-card'

interface BlogProps {
  posts: IPost[]
}

export default function PostList({ posts }: BlogProps) {
  return (
    <div>
      {' '}
      {posts.length > 0 && (
        <div className="m-20">
          <div className="mb-10 mt-10 flex justify-between">
            {posts.slice(0, 2).map((post, index) => (
              <div className="flex w-full" key={index}>
                <div key={index} className="flex w-full">
                  <PostCard
                    key={index}
                    image={post.img}
                    date={new Date(post.updatedAt).toLocaleDateString('uk-UA')}
                    title={post.title}
                    slag={post.slug}
                  />
                </div>
                {index !== 1 && (
                  <div className="m-1 ml-2 h-full border-l border-dashed border-black"></div>
                )}
              </div>
            ))}
          </div>
          <div className="my-4 border-t border-dashed border-black"></div>

          <div className="mb-10 mt-10 flex justify-between">
            {posts.slice(2, 5).map((post, index) => (
              <div className="flex w-full" key={index}>
                <div key={index} className="flex w-full items-stretch">
                  <PostCard
                    key={index}
                    image={post.img}
                    date={new Date(post.updatedAt).toLocaleDateString('uk-UA')}
                    title={post.title}
                    slag={post.slug}
                  />
                </div>
                {index !== 2 && (
                  <div className="m-1 ml-2 h-full border-l border-dashed border-black"></div>
                )}
              </div>
            ))}
          </div>

          <div className="mb-10 mt-10 flex justify-between">
            {posts.slice(5).map((post, index) => (
              <div className="flex w-full" key={index}>
                <div key={index} className="flex w-full items-stretch">
                  <PostCard
                    key={index}
                    image={post.img}
                    date={new Date(post.updatedAt).toLocaleDateString('uk-UA')}
                    title={post.title}
                    slag={post.slug}
                  />
                </div>
                {index !== 2 && (
                  <div className="m-1 ml-2 h-full border-l border-dashed border-black"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
