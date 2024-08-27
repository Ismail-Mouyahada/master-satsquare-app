export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    

    '/event/:path*',
    '/associations/:path*',
    '/events/:path*',
    '/questions/:path*',
    '/quizform/:path*',
    '/quizzes/:path*',
    '/ranking/:path*',
    '/rewards/:path*',
    '/roles/:path*',
    '/profile/:path*',
    '/scores/:path*',
    '/sponsors/:path*',
    '/users/:path*',
    '/utilisateurs/:path*',
    // '/wallet-balance/:path*',
    // '/api/associations/:path*',
    // '/api/check-invoice-status/:path*',
    // '/api/create-invoice/:path*',
    // '/api/decode-invoice/:path*',
    // '/api/disassociate-wallet/:path*',
    // '/api/event/:path*',
    // '/api/associations/:path*',
    // '/api/events/:path*',
    // '/api/get-wallet-details/:path*',
    // '/api/link-wallet/:path*',
    // '/api/pay-invoice/:path*',
    // '/api/questions/:path*',
    // '/api/quizform/:path*',
    // '/api/quizzes/:path*',
    // '/api/ranking/:path*',
    // '/api/rewards/:path*',
    // '/api/roles/:path*',
    // '/api/profile/:path*',
    // '/api/home/:path*',
    // '/api/manager/:path*',
    // '/api/scores/:path*',
    // '/api/sponsors/:path*',
    // '/api/update-wallet/:path*',
    // '/api/users/:path*',
    // '/api/utilisateurs/:path*',
    // '/api/wallet-balance/:path*'
  ]
};