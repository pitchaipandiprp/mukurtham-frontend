import { apiConfig } from "@/environments/api";
import { authUserId, getAccessToken, getRefreshToken, setAccessToken, clearAuthData } from "@/utils/auth";
import { sweetalert } from "@/utils/sweetalert";

type RequestOptions = RequestInit & {
  headers?: Record<string, string>;
};

function buildUrl(path: string): string {
  const baseUrl = apiConfig.apiBaseUrl.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
}

function withDefaultBody(body: any) {
  const userId = authUserId();
  return userId ? { ...body, user_id: userId } : body;
}

const requestWithBody = async <T>(
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  body: unknown,
  options: RequestOptions = {},
): Promise<T> => {

  const makeRequest = async (token: string | null) => {

    const isFormData = body instanceof FormData;

    const userId = authUserId();

    if (isFormData && userId) {
      body.append("user_id", userId);
    }

    const headers = new Headers();

    headers.set("Accept", "application/json");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    if (!isFormData) {
      headers.set("Content-Type", "application/json");
    }

    if (options.headers) {
      const customHeaders = new Headers(
        options.headers
      );

      customHeaders.forEach((value, key) => {
        headers.set(key, value);
      });
    }

    return fetch(
      buildUrl(path),
      {
        ...options,
        method,
        headers,
        body: isFormData ? body as FormData : JSON.stringify(withDefaultBody(body)),
      }
    );
  };

  let accessToken = getAccessToken();

  let response = await makeRequest(accessToken);

  // Access token expired
  if (response.status === 401) {

    const newAccessToken = await refreshAccessToken();

    if (!newAccessToken) {
      clearAuthData();
      window.location.href = "/login";
      throw new Error("Session expired. Please login again.");
    }

    // Retry original request
    response = await makeRequest(newAccessToken);
  }

  return handleResponse<T>(response);
};


const get = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const accessToken = getAccessToken();
  const userId = authUserId();

  const url = new URL(
    buildUrl(path),
    window.location.origin
  );

  if (userId) {
    url.searchParams.set(
      "user_id",
      String(userId)
    );
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(options.headers ?? {}),
    },
    ...options,
  });

  return handleResponse<T>(response);
};

const post = async <T>(path: string, body: unknown, options: RequestOptions = {}): Promise<T> => {
  return requestWithBody<T>("POST", path, body, options);
};

const put = async <T>(path: string, body: unknown, options: RequestOptions = {}): Promise<T> => {
  return requestWithBody<T>("PUT", path, body, options);
};

const patch = async <T>(path: string, body: unknown, options: RequestOptions = {}): Promise<T> => {
  return requestWithBody<T>("PATCH", path, body, options);
};

const remove = async <T>(path: string, body: unknown, options: RequestOptions = {}): Promise<T> => {
  return requestWithBody<T>("DELETE", path, body, options);
};


async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";

  const payload = contentType.includes("application/json")
    ? ((await response.json()) as T)
    : ((await response.text()) as unknown as T);

  if (response.status === 400 || response.status === 422) {
    let title = "Error";
    let message = "Request failed";

    if (typeof payload === 'object' && payload !== null) {
      const errorPayload = payload as {
        message?: string;
        errors?: Array<{
          msg?: string;
        }>
      }

      if (errorPayload.message) {
        message = errorPayload.message;
      }

      if (Array.isArray(errorPayload.errors) && errorPayload.errors.length > 0) {
        title = message;
        message = errorPayload.errors[0]?.msg ?? "Error";
      }
    }

    await sweetalert.error(message, title);
    // throw new Error(message);
  }

  return payload;
}



async function refreshAccessToken(): Promise<string | null> {
  let isRefreshing = false;
  let refreshPromise: Promise<string | null> | null = null;

  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;

  refreshPromise = (async () => {
    try {
      const response = await fetch(
        buildUrl("/auth/refresh-token"),
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh_token: refreshToken,
          }),
        }
      );

      if (!response.ok) {
        clearAuthData();
        return null;
      }

      const data = await response.json();

      const newAccessToken = data?.access_token ?? data?.data?.access_token;

      if (!newAccessToken) {
        clearAuthData();
        return null;
      }

      setAccessToken(newAccessToken);

      return newAccessToken;
    } catch (error) {
      console.error("Refresh token error:", error);
      clearAuthData();
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}


export const apiService = {
  get,
  post,
  put,
  patch,
  delete: remove,
};
