import { apiConfig } from "@/environments/api";
import { authUserId, getAccessToken } from "@/utils/auth";
import { sweetalert } from "@/utils/sweetalert";

type RequestOptions = RequestInit & {
  headers?: Record<string, string>;
};

function buildUrl(path: string): string {
  const baseUrl = apiConfig.apiBaseUrl.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
}

function getAccessTokens(): string | null {
  return getAccessToken();
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
  const accessToken = getAccessTokens();

  const response = await fetch(buildUrl(path), {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(options.headers ?? {}),
    },
    body: JSON.stringify(withDefaultBody(body)),
    ...options,
  });

  return handleResponse<T>(response);
};


const get = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const accessToken = getAccessTokens();
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


export const apiService = {
  get,
  post,
  put,
  patch,
  delete: remove,
};
