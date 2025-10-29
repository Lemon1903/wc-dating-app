import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { loginSchema } from "@/lib/validators/user";
import { getUserByEmail } from "@/services/userService";

export const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validate credentials
        const validationResult = loginSchema.safeParse(credentials);
        if (!validationResult.success) {
          return null;
        }

        const { email, password } = validationResult.data;

        // Find user
        const user = await getUserByEmail(email);
        if (!user) {
          return null;
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return null;
        }

        // Return user object (without password)
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  pages: {
    signIn: "/", // Use your login page
  },
  session: {
    strategy: "jwt" as const,
  },
});

export { handler as GET, handler as POST };

