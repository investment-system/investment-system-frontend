export default defineNuxtRouteMiddleware((to) => {
    const role = useCookie<string>('role').value

    const LOGIN_ROUTES = {
        admin: '/administrators/auth/login',
        member: '/member/auth/login'
    }

    // Public pages for each role group
    const PUBLIC_ROUTES = [
        '/member/auth/login',
        '/member/auth/signup',
        '/administrators/auth/login'
    ]

    if (PUBLIC_ROUTES.includes(to.path)) {
        return
    }

    if (to.path.startsWith('/administrators') && role !== 'admin') {
        return navigateTo(LOGIN_ROUTES.admin)
    }

    if (to.path.startsWith('/member') && role !== 'member') {
        return navigateTo(LOGIN_ROUTES.member)
    }
})
