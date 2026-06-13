import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/encryption";
import { syncToMailchimp } from "@/lib/mailchimp";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          access_type: "offline",
          prompt: "consent",
          scope: [
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/analytics.readonly",
            "https://www.googleapis.com/auth/webmasters.readonly",
          ].join(" "),
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!account || account.provider !== "google") return false;

      // user.id is set by the PrismaAdapter after it creates/finds the User row
      if (!user.id) return true; // let adapter finish, tokens stored below

      try {
        const encryptedAccess = await encrypt(account.access_token ?? "");
        const encryptedRefresh = await encrypt(account.refresh_token ?? "");
        const expiresAt = account.expires_at
          ? new Date(account.expires_at * 1000)
          : new Date(Date.now() + 3600 * 1000);

        // Update the adapter-created User row with our extra fields.
        // googleId = providerAccountId so we can look it up for API calls.
        const dbUser = await prisma.user.update({
          where: { id: user.id },
          data: {
            googleId: account.providerAccountId,
            accessToken: encryptedAccess,
            refreshToken: encryptedRefresh,
            tokenExpiresAt: expiresAt,
            lastLoginAt: new Date(),
          },
        });

        // Fire-and-forget Mailchimp sync — never blocks sign-in
        if (!dbUser.mailchimpSynced) {
          syncToMailchimp(dbUser.id, dbUser.email, dbUser.name ?? "")
            .then(() => console.log("[Mailchimp] Sync succeeded for:", dbUser.email))
            .catch((err) => {
              console.error("[Mailchimp] Sync FAILED — full error:");
              console.dir(err, { depth: null });
            });
        }
      } catch (error) {
        console.error("[Auth] Failed to persist user tokens:", error);
        // Non-fatal — user still gets signed in
      }

      return true;
    },

    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
    error: "/auth/error",
  },
  session: {
    strategy: "database",
  },
});