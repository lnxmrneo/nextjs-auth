import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { NextAuthOptions} from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from './db';
import { compare } from 'bcrypt';

export const authOptions:NextAuthOptions = {
    adapter: PrismaAdapter(db),
    secret: process.env.NEXTAUTH_SECRET,
    session:{
        strategy: 'jwt',
    },
    pages:{
        signIn: '/sign-in',
    },
    
    providers: [
        CredentialsProvider({
          credentials: {
            email: { label: "email", type: "email", placeholder: "email@email.email" },
            password: { label: "Password", type: "password" },
          },
          async authorize(credentials) {
            
            if (!credentials?.email || !credentials?.password) {
                return null;
            }
            
            const existingUser = await db.user.findUnique({
                where: {email: credentials?.email}
            })


            if (!existingUser) return null;

            const passwordMatch = await compare(credentials.password, existingUser.password);

            if (!passwordMatch) return null;

            console.log(credentials)

            return {
                id: `${existingUser.id}`,
                username: existingUser.username,
                email: existingUser.email
            }
          }
        })
      ],
      callbacks:{
        async jwt({token, user}){
          if(user){
            token.id= user.id
            return {
              ...token,
              username: user.username,
              
            }
          }
          return token;
        },
        async session({ session, user, token }){
          if (token?.id) token.id = token.id;
          return {
            ...session,
            user:{
              ...session.user,
              username: token.username
            }
          }
        }
      },
}