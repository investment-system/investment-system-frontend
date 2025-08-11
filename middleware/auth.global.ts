export default defineNuxtRouteMiddleware((to) => {
    const role = useCookie<string>('role').value
    console.log('Middleware: path=', to.path, 'role=', role)

    const LOGIN_ROUTES = {
        admin: '/administrators/auth/login',
        member: '/member/auth/login'
    }

    const PUBLIC_ROUTES = [
        '/member/auth/login',
        '/member/auth/signup',
        '/administrators/auth/login'
    ]

    const normalizedPath = to.path.replace(/\/$/, '') // remove trailing slash

    if (PUBLIC_ROUTES.includes(normalizedPath)) {
        console.log('Public route, allow access')
        return
    }

    if (to.path.startsWith('/administrators') && role !== 'admin') {
        console.log('Redirect to admin login')
        return navigateTo(LOGIN_ROUTES.admin)
    }

    if (to.path.startsWith('/member') && role !== 'member') {
        console.log('Redirect to member login')
        return navigateTo(LOGIN_ROUTES.member)
    }
})
