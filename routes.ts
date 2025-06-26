/**
* this are the public routes
* logged out users can access this route
*/

export const publicRoutes = [
    '/', "/auth/new-verification"
]

export const authRoutes = [
    '/auth/register',
    '/auth/login',
    "/auth/error",
    "/auth/reset",
    "/auth/new-password" // THIS IS HERE BECAUSE WE ONLY WANT IT TO BE AVAILABLE TO LOGGED IN USERS
]

export const apiAuthPrefix = '/api/auth'


export const  DEFAULT_LOGIN_REDIRECT = "/settings"