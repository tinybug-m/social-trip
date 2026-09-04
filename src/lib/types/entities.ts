import { Tables } from './database'

export type PostType = 'post' | 'reel'

export type Post = Tables<'posts'>
export type Rating = Tables<'ratings'>
export type Comment = Tables<'comments'>
export type Profile = Tables<'profiles'>
export type Message = Tables<'messages'>
