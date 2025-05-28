/**
* this are the public routes
* logged out users can access this route
*/

export const publicRoutes = [
    '/'
]

export const authRoutes = [
    '/auth/register',
    '/auth/login',
]

export const apiAuthPrefix = '/api/auth'


export const  DEFAULT_LOGIN_REDIRECT = "/settings"