import PostCard from './post-card'

interface BlogProps {
  posts: IPost[]
}

export default function PostList({ posts }: BlogProps) {
  return (
    <div className="w-[100%]">
      {posts.length > 0 && (
        <div className="w-[100%]">
          <div className="mb-10 mt-10 flex justify-between">
            <div className="flex w-full flex-wrap justify-between">
              <div className="flex w-[100%] sm:w-[45%]">
                <PostCard post={posts[0]} />
              </div>
              <div className="ml-1 hidden h-full border-l border-dashed border-black sm:block sm:w-[1%]"></div>

              <div className="flex w-[100%] sm:w-[45%]">
                <PostCard post={posts[1]} />
              </div>
            </div>
          </div>
          <div className="my-4 border-t border-dashed border-black"></div>

          <div className="mb-10 mt-10 flex justify-between">
            <div className="flex w-full flex-wrap justify-between">
              <div className="flex w-[47%] sm:w-[30%]">
                <PostCard post={posts[2]} />
              </div>
              {posts[3] ? (
                <div
                  className={`m-1 ml-1 hidden ${!posts[5] ? 'h-[90%]' : 'h-[45%]'} border-l border-dashed border-black sm:block`}
                ></div>
              ) : (
                ''
              )}
              <div className="flex w-[47%] sm:w-[30%]">
                <PostCard post={posts[3]} />
              </div>
              {posts[4] ? (
                <div
                  className={`m-1 ml-1 hidden ${!posts[5] ? 'h-[90%]' : 'h-[45%]'} border-l border-dashed border-black sm:block`}
                ></div>
              ) : (
                ''
              )}
              <div className="flex w-[47%] sm:w-[30%]">
                <PostCard post={posts[4]} />
              </div>

              <div className="flex w-[47%] sm:w-[30%]">
                <PostCard post={posts[5]} />
              </div>
              {posts[6] ? (
                <div className="m-1 ml-1 hidden h-[45%] border-l border-dashed border-black sm:block"></div>
              ) : (
                ''
              )}
              <div className="flex w-[47%] sm:w-[30%]">
                <PostCard post={posts[6]} />
              </div>
              {posts[7] ? (
                <div className="m-1 ml-1 hidden h-[45%] border-l border-dashed border-black sm:block"></div>
              ) : (
                ''
              )}

              <div className="flex w-[47%] sm:w-[30%]">
                <PostCard post={posts[7]} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
