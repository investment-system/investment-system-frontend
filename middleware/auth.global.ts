export default defineNuxtRouteMiddleware((to) => {
    const role = useCookie('role').value

    if (to.path === '/administrators/auth/login' || to.path === '/member/auth/login') {
        return
    }

    if (to.path.startsWith('/administrators') && role !== 'admin') {
        return navigateTo('/administrators/auth/login')
    }

    if (to.path.startsWith('/member') && role !== 'member') {
        return navigateTo('/member/auth/login')
    }
})
