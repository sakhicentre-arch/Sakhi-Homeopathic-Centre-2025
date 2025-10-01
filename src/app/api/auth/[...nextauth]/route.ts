import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // TEMPORARY: Hard-coded admin credentials for testing
        if (credentials?.email === 'sakhicentre@gmail.com' && credentials?.password === 'password123') {
          return {
            id: '1',
            email: 'sakhicentre@gmail.com',
            name: 'Dr. Admin',
            role: 'ADMIN'
          }
        }
        
        if (credentials?.email === 'test@test.com' && credentials?.password === '123456') {
          return {
            id: '2',
            email: 'test@test.com',
            name: 'Test User',
            role: 'USER'
          }
        }
        
        return null
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
    error: '/admin/login'
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/admin')) return url
      return `${baseUrl}/admin`
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    }
  },
  session: {
    strategy: 'jwt'
  }
})

export { handler as GET, handler as POST }
