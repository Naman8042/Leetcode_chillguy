import CredentialsProvider from "next-auth/providers/credentials"; 
import User from "@/models/userModels";
import bcrypt from "bcryptjs";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

export const option = {
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Email" },
        password: { label: "Password", type: "password", placeholder: "Password" },
      },
      
      async authorize(credentials) {
        // Ensure credentials exist and assert its type
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("Missing credentials");
        }

        const { email, password } = credentials as { email: string; password: string };

        console.log(email);
        console.log(password);

        const user = await User.findOne({ email });

        console.log(user);
        if (!user) {
          return null;
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.userName,
          email: user.email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    session: ({ session, token }: { session: Session; token: JWT }) => {
      if (session?.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
};
