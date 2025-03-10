import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/userModels";
import bcrypt from "bcryptjs";

export const option = {
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "email", type: "text", placeholder: "Email" },
        password: {
          label: "password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials: any) {
        const { email, password } = credentials;
        console.log(email);
        console.log(password);

        const user = await User.findOne({ email: email });

        console.log(user);
        if (!user) {
          return null;
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
          return null;
        }

        return {
          id: user._id,
          name: user.userName,
          email: user.email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login", // Custom login page
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    session: ({ session, token, user }: any) => {
      // console.log(session)
      // console.log(user)
      if (session && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};
