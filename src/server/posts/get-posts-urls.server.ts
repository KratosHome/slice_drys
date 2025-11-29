import { connectToDbServer } from "@/server/connect-to-db.server";
import { Post } from "@/server/posts/post-schema.server";

export async function getPostsUrls() {
  "use server";
  try {
    await connectToDbServer();

    const posts = await Post.find({}).select("slug").lean();

    const postsWithLowercaseSlug = posts.map((item) => ({
      ...item,
      slug: item.slug.toLowerCase(),
    }));

    return {
      data: postsWithLowercaseSlug,
      success: true,
      message: "Posts URLs retrieved",
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      message: `Can't retrieve posts URLs: ${error}`,
    };
  }
}
