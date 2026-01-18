namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: 'development' | 'production' | 'test'
    NEXT_URL?: string

    NEXT_STATUS?: 'development' | 'production' | 'test'

    NEXT_MONGO_DB?: string

    CLOUDINARY_CLOUD_NAME?: string
    CLOUDINARY_API_KEY?: string
    CLOUDINARY_API_SECRET?: string

    TELEGRAM_BOT_TOKEN?: string
    TELEGRAM_BOT_CHAT_ID?: string

    NOVA_POSHTA_API_URL?: string
    NOVA_POSHTA_API_KEY?: string

    INSTAGRAM_TOKEN?: string
    INSTAGRAM_ID?: string

    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID?: string

    NEXTAUTH_SECRET?: string
  }
}
