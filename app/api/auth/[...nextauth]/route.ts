import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { supabase } from '../../../../lib/supabaseClient'; // Using the mock client

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials) { // Removed req
        if (!credentials) {
          return null;
        }

        const { data: users, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', credentials.email);

        if (error || !users || users.length === 0) {
          return null;
        }
        
        const user = users[0];

        // For a real app, you'd use a hashing library like bcrypt to compare passwords
        if ('password' in user && user.password === credentials.password) {
          return { id: user.id, name: user.name, email: user.email };
        } else {
          return null;
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET, // Using environment variable
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
