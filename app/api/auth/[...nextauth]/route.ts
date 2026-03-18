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

        const { data: user, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', credentials.email)
          .single();

        if (error || !user) {
          console.error(JSON.stringify({ event: "AuthenticationFailure", reason: error ?? "User not found", email: credentials.email }));
          return null;
        }

        // For a real app, you'd use a hashing library like bcrypt to compare passwords
        if ('password' in user && user.password === credentials.password) {
          console.info(JSON.stringify({ event: "AuthenticationSuccess", userId: user.id }));
          return { id: user.id, name: user.name, email: user.email, shopifyCustomerId: user.shopify_customer_id };
        } else {
          console.warn(JSON.stringify({ event: "AuthenticationFailure", reason: "Invalid password", email: credentials.email }));
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
        Object.assign(session.user, { shopifyCustomerId: token.shopifyCustomerId });
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.shopifyCustomerId = ('shopifyCustomerId' in user) ? user.shopifyCustomerId : null;
      }
      return token;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
