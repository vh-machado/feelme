export interface User {
  _id: string
  name: string
  nickname: string
  email?: string
  password?: string
  userRole?: string
  avatar: string
  followers: number
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

export interface EmotionCounter {
  emoji: string
  description: string
  counter: number
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