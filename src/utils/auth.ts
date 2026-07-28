export function authUser() {
    if (typeof window === "undefined") {
        return null;
    }

    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
        return null;
    }

    try {
        return JSON.parse(storedUser);
    } catch {
        return null;
    }
}

export function authUserId(): string | null {
    const user = authUser();

    return user?.id ?? null;
}

export function authUserRole(): string | null {
    const user = authUser();

    return user?.role?.name ?? null;
}

export function getAccessToken(): string | null {
    if (typeof window === "undefined") {
        return null;
    }

    return localStorage.getItem("accessToken");
}

export function getRefreshToken(): string | null {
    if (typeof window === "undefined") {
        return null;
    }

    return localStorage.getItem("refreshToken");
}

export function isAuthenticated(): boolean {
    return getAccessToken() !== null;
}

export function setAuthData(data: any): void {
    if (typeof window === "undefined") {
        return;
    }
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("user",JSON.stringify(data.user));
}

export function clearAuthData(): void {
    if (typeof window === "undefined") {
        return;
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
}