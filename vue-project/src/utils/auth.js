export function getCurrentAuthority() {
    return ["admin"];
}

export function checkAuthority(authority) {
    const current = getCurrentAuthority();
    return current.some(item => authority.includes(item));
}

export function isLogin() {
    const current = getCurrentAuthority();
    return current && current[0] !== "guest";
}