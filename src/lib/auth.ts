import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import LinkedIn from "next-auth/providers/linkedin";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { verifyFirebaseToken } from "@/lib/firebase";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    ...(process.env.AUTH_LINKEDIN_ID && process.env.AUTH_LINKEDIN_SECRET
      ? [
          LinkedIn({
            clientId: process.env.AUTH_LINKEDIN_ID,
            clientSecret: process.env.AUTH_LINKEDIN_SECRET,
            authorization: { params: { scope: "openid profile email" } },
          }),
        ]
      : []),
    Credentials({
      id: "firebase",
      credentials: {
        idToken: { label: "ID Token", type: "text" },
        provider: { label: "Provider", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.idToken || credentials?.provider !== "firebase") return null;

        try {
          const decoded = await verifyFirebaseToken(credentials.idToken as string);
          const email = decoded.email || "";
          const name = decoded.name || email.split("@")[0] || "User";
          const photo = decoded.picture || "";

          let user = await db.user.findUnique({ where: { email } });

          if (!user) {
            const [firstName, ...lastParts] = name.split(" ");
            user = await db.user.create({
              data: {
                email,
                firstName,
                lastName: lastParts.join(" ") || "",
                avatarUrl: photo,
              },
            });
          }

          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
            image: user.avatarUrl,
          };
        } catch {
          return null;
        }
      },
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(credentials.password as string, user.passwordHash);

        if (!isValid || user.banned) return null;

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          image: user.avatarUrl,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      if (user || account) {
        const dbUser = await db.user.findUnique({
          where: { email: token.email! },
        });
        if (dbUser) {
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as unknown as Record<string, string>).id = token.id as string;
        (session.user as unknown as Record<string, string>).role = (token.role as string) || "USER";
      }
      return session;
    },
  },
});
