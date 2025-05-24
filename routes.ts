// Routes that are accessible without authentication
export const publicRoutes = [
    '/',
    '/about',
    '/contact',
    '/T&Q',

]

// Routes that are used for authentication
export const authRoutes = [
    '/auth/login',
    '/auth/register',
    '/verify'
]

export const adminOnlyRoutes = [
    '/admin/*'
]

// Prefix for ap authentication routes
export const apiAuthPrefix = '/api/auth'



export const DEFAULT_USER_LOGIN_REDIRECT = '/'