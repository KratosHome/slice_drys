enum InstaMediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  CAROUSEL_ALBUM = 'CAROUSEL_ALBUM',
}

interface InstaBasePost {
  id: string
  caption: string
  media_type: InstaMediaType.IMAGE | InstaMediaType.VIDEO
  permalink: string
}
interface InstaSimplePost extends InstaBasePost {
  media_type: InstaMediaType.IMAGE | InstaMediaType.VIDEO
  thumbnail_url?: string
  media_url: string
}
interface InstaCarouselAlbumPost extends InstaBasePost {
  children: {
    data: InstaSimplePost[]
  }
}

type InstaFeed = InstaSimplePost | InstaCarouselAlbumPost
