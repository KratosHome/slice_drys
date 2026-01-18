interface ISession {
  user: {
    email: string
    name: string
    image?: string
  }
}

interface IUserSession {
  expires: string
  user: IUser
}
