export interface User {
  id: string
  name: string
  nickname: string
  email: string
  password: string
  userRole: string
}

export interface UserMovie {
  id: string
  idMovie: number
  user: User
  loggedAt: Date
  rewatch: boolean
}

export interface Review {
  id: string
  userMovie: UserMovie
  text: string
  likes: number
}