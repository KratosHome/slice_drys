import PostCard from './post-card'

interface BlogProps {
  posts: IPost[]
}

export default function PostList({ posts }: BlogProps) {
  if (!posts.length) return <h1>Оце трагедія! Біжимо писати для вас пости!</h1>
  return (
    <div className="mt-[50px] flex flex-col gap-[44] lg:mt-[108px]">
      <div className="grid justify-center gap-7 md:grid-cols-2 md:gap-[50px]">
        {posts.slice(0, 2).map((post, index) => {
          return (
            <PostCard
              key={post._id}
              post={posts[index]}
              variant="big"
              className=""
            />
          )
        })}
      </div>
      <span className="mb-[35px] border-t border-dashed border-black"></span>
      <div className="grid grid-cols-2 md:grid-cols-3 md:gap-[clamp(24px,calc(24px+46*(100vw-768px)/672),70px)] md:gap-x-[86px]">
        {posts.slice(2).map((post, index) => {
          return (
            <PostCard
              key={post._id}
              post={posts[index]}
              className="md:cols-span-1"
            />
          )
        })}
      </div>
    </div>
  )
}
