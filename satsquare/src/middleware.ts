export { default } from "next-auth/middleware";

export const config = {
    matcher: ['/utilisateurs/:path*', '/roles/:path*', /* '/quizzes/:path*', */ '/ranking/:path*', '/sponsors/:path*', '/associations/:path*', '/reward/:path*', '/evenements/:path*', '/profile/:path*', '/lightning/:path*', '/configurations/:path*'],
  }