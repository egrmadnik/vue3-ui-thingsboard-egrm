# Frontend ↔ ThingsBoard Backend Connection

## Overview

This app uses a centralized Axios client (`defHttp`) configured with environment variables and a Vite dev proxy to connect to the ThingsBoard REST and WebSocket APIs. Authentication uses a Bearer token in the `X-Authorization` header with automatic refresh.

## HTTP base and URL building

- Source: `src/utils/http/axios/index.ts`
- The HTTP client (`defHttp`) is built with env-derived settings from `useGlobSetting()`:
  - `apiUrl`: from `VITE_GLOB_API_URL`. Empty in `.env.development`, so dev uses same-origin + proxy.
  - `urlPrefix`: from `VITE_GLOB_API_URL_PREFIX`.
  - With `joinPrefix: true`, a request URL becomes: `urlPrefix + url`. Since defaults are empty, API paths should start with `/api/...`.
- Relevant options (see `createAxios()` and `requestOptions`):
  - `authenticationScheme: 'Bearer'`
  - `authenticationHeader: 'X-Authorization'`
  - `requestOptions.apiUrl = globSetting.apiUrl`
  - `requestOptions.urlPrefix = globSetting.urlPrefix`

## Development proxy (Vite) → ThingsBoard

- Source: `.env.development`, `build/options/server.ts`, `build/config/index.ts`
- `.env.development`:
  ```env
  VITE_PROXY = [["/api","http://127.0.0.1:8080/api",false]]
  ```
- `build/options/server.ts` converts this into a Vite proxy configuration:
  - Proxies `/api/...` to `http://127.0.0.1:8080/api/...`.
  - Uses `rewrite` to strip the leading `/api` from the request path and relies on `/api` already present in the target.
- Effect: in development, the frontend can call `/api/...` without CORS issues; Vite forwards requests to the ThingsBoard backend.

## Production base URL

- Source: `.env.production`
- Set these for your deployment:
  ```env
  VITE_GLOB_API_URL = https://your-thingsboard-host
  VITE_GLOB_API_URL_PREFIX = /api
  ```
- In production, `defHttp` composes `apiUrl + urlPrefix + request.url` for all requests.

## Authentication and tokens

- Source: `src/utils/http/axios/index.ts`, `src/store/modules/user.ts`, `src/api/tb/login.ts`
- Request interceptor (`requestInterceptors`):
  - Adds header `X-Authorization: Bearer <token>` when a token exists (`getToken()`).
- Response processing (`transformRequestHook`):
  - If the backend returns a new token in response header `X-Authorization`, it saves it via `userStore.setToken(...)`.
- Token refresh (`responseInterceptorsCatch`):
  - On HTTP 401 with `errorCode == 11` (token expired), it uses `refreshTokenApi(refreshToken)` and retries the original request when the refresh succeeds.

## WebSocket connection (telemetry)

- Source: `.env.*`, `src/hooks/setting/index.ts`
- Env var: `VITE_GLOB_API_URL_WEBSOCKET = /api/ws`.
- `useGlobSetting()` computes `websocketPath`:
  - Development: resolves to the proxy host + `/api/ws` (e.g., `ws://127.0.0.1:8080/api/ws`).
  - Production: `wss?://<location.host>/api/ws`.
- This matches ThingsBoard’s WS endpoint under `/api/ws`.

## How to point the frontend to your backend

- Development (`.env.development`):
  - Local ThingsBoard (default):
    ```env
    VITE_PROXY = [["/api","http://127.0.0.1:8080/api",false]]
    ```
  - Public demo:
    ```env
    VITE_PROXY = [["/api","https://demo.thingsboard.io/api",true]]
    ```
- Production (`.env.production`):
  ```env
  VITE_GLOB_API_URL = https://your-thingsboard-host
  VITE_GLOB_API_URL_PREFIX = /api
  VITE_GLOB_API_URL_WEBSOCKET = /api/ws
  ```

## Key files

- `src/utils/http/axios/index.ts` — HTTP client, headers, token handling, refresh logic.
- `.env.development`, `.env.production` — API root/prefix, proxy, WS path.
- `build/options/server.ts` — Vite proxy setup and path rewrite.
- `src/hooks/setting/index.ts` — Computed API and WebSocket endpoints.

## Summary

- In development, the app calls `/api/...` and Vite proxies to your ThingsBoard server (default `127.0.0.1:8080`).
- In production, it uses `VITE_GLOB_API_URL` + `VITE_GLOB_API_URL_PREFIX` to reach the ThingsBoard REST API.
- All requests include `X-Authorization: Bearer <token>`; tokens are auto-refreshed when expired; WebSocket connects via `/api/ws`.
