export interface User {
  _id: string
  name: string
  nickname: string
  email: string
  password: string
  userRole: string
}

export interface Movie {
  id: number
  backdropPath: string
  title: string
  overview: string
  posterPath: string
  releaseDate: string
}

export interface UserMovie {
  _id: string
  movie: Movie
  user: User
}

export interface Emotion {
  emoji: string
  description: string
}
export interface Review {
  _id: string
  userMovie: UserMovie
  text: string
  likes: number
  loggedAt: Date
  rewatch: boolean
  emotions: Emotion[]
}