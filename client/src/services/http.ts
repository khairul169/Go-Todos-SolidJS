type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const BASE_URL = "http://localhost:5000/api";

const http = async <T>(
  url: string,
  method: HttpMethod = "GET",
  body?: object,
  options?: RequestInit
) => {
  const { headers: optHeaders, ...restOptions } = options || {};
  const headers: any = {};

  if (typeof body === "object") {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(BASE_URL + url, {
    method,
    body: typeof body === "object" ? JSON.stringify(body) : body,
    headers: { ...headers, ...(optHeaders || {}) },
    ...restOptions,
  });

  const result = await response.json();

  if (response.status < 200 || response.status >= 300) {
    throw new Error(result.message || "Unexpected error!");
  }

  return result as T;
};

export default http;
