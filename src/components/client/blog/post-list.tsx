import PostCard from './post-card'

interface BlogProps {
  posts: IPost[]
}

export default function PostList({ posts }: BlogProps) {
  return (
    <div>
      {posts.length > 0 && (
        <div className="m-20">
          <div className="mb-10 mt-10 flex justify-between">
            <div className="flex w-full flex-wrap">
              <div className="flex sm:w-1/2">
                <PostCard post={posts[0]} />
                <div className="m-1 ml-2 h-full border-l border-dashed border-white sm:border-black"></div>
              </div>
              <div className="flex sm:w-1/2">
                <PostCard post={posts[1]} />
                <div className="m-1 ml-2 h-full border-l border-dashed border-white"></div>
              </div>
            </div>
          </div>

          <div className="my-4 border-t border-dashed border-black"></div>

          <div className="mb-10 mt-10 flex justify-between">
            <div className="flex w-full flex-wrap">
              <div className="mb-10 flex w-1/2 sm:w-1/3">
                <PostCard post={posts[2]} />
                <div className="m-1 ml-2 h-full border-l border-dashed border-white sm:border-black"></div>
              </div>
              <div className="mb-10 flex w-1/2 sm:w-1/3">
                <PostCard post={posts[3]} />
                <div className="m-1 ml-2 h-full border-l border-dashed border-white sm:border-black"></div>
              </div>
              <div className="mb-10 flex w-1/2 sm:w-1/3">
                <PostCard post={posts[4]} />
                <div className="m-1 ml-2 h-full border-l border-dashed border-white"></div>
              </div>
              <div className="mb-10 flex w-1/2 sm:w-1/3">
                <PostCard post={posts[5]} />
                <div className="m-1 ml-2 h-full border-l border-dashed border-white sm:border-black"></div>
              </div>
              <div className="mb-10 flex w-1/2 sm:w-1/3">
                <PostCard post={posts[6]} />
                <div className="m-1 ml-2 h-full border-l border-dashed border-white sm:border-black"></div>
              </div>
              <div className="mb-10 flex w-1/2 sm:w-1/3">
                <PostCard post={posts[7]} />
                <div className="m-1 ml-2 h-full border-l border-dashed border-white"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
