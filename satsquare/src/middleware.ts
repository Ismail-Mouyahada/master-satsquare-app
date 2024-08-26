export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    '/associations/:path*',
    '/check-invoice-status/:path*',
    '/create-invoice/:path*',
    '/decode-invoice/:path*',
    '/disassociate-wallet/:path*',
    '/event/:path*',
    '/associations/:path*',
    '/events/:path*',
    '/get-wallet-details/:path*',
    '/link-wallet/:path*',
    '/pay-invoice/:path*',
    '/questions/:path*',
    '/quizform/:path*',
    '/quizzes/:path*',
    '/ranking/:path*',
    '/rewards/:path*',
    '/roles/:path*',
    '/profile/:path*',
    '/home/:path*',
    '/manager/:path*',
    '/scores/:path*',
    '/sponsors/:path*',
    '/update-wallet/:path*',
    '/users/:path*',
    '/utilisateurs/:path*',
    '/wallet-balance/:path*'
  ]
};