// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
    const role = useCookie('role').value

    // Always allow access to login pages
    if (to.path === '/administrators/auth/login' || to.path === '/member/auth/login') {
        return
    }

    // Protect admin routes
    if (to.path.startsWith('/administrators') && role !== 'admin') {
        return navigateTo('/administrators/auth/login')
    }

    // Protect member routes
    if (to.path.startsWith('/member') && role !== 'member') {
        return navigateTo('/member/auth/login')
    }
})
