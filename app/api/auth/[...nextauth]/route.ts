import NextAuth from 'next-auth'
import { connect } from '@/dbConfig/dbConfig'
import { option } from './option'
connect()

export const handler = NextAuth(option)

export const GET = handler
export const POST = handler