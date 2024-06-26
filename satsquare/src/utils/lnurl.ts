import { OAuthConfig, OAuthUserConfig } from "next-auth/providers";

export default function LNURLAuthProvider<P>(options: any): OAuthConfig<P> {
  return {
    id: "lnurl-auth",
    name: "LNURL-auth",
    type: "oauth",
    version: "2.0",
    scope: "openid email profile",
    params: { grant_type: "authorization_code" },
    accessTokenUrl: `${process.env.NEXTAUTH_URL}/oauth/token`,
    requestTokenUrl: `${process.env.NEXTAUTH_URL}/oauth/authorize`,
    authorizationUrl: `${process.env.NEXTAUTH_URL}/oauth/authorize?response_type=code`,
    profileUrl: `${process.env.NEXTAUTH_URL}/oauth/me`,
    async profile(profile: any) {
      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
      };
    },
    ...options,
  };
}