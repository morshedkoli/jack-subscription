import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
const adminPassword = process.env.ADMIN_PASSWORD;

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = (credentials.email as string).toLowerCase().trim();
        const password = credentials.password as string;

        if (
          adminEmail &&
          adminPassword &&
          email === adminEmail &&
          password === adminPassword
        ) {
          return {
            id: "admin",
            email: adminEmail,
            name: "Administrator",
            role: "admin",
            image: null,
          };
        }
        
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = "admin";
      }
      return session;
    },
  },
});
