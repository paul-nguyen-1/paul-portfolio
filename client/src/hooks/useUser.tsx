import { useCallback, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

export type FirebaseResponse = {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
};

type AuthState = {
  idToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const AUTH_STORAGE_KEY = "authToken_alfredai";

const initialState: AuthState = {
  idToken: null,
  refreshToken: null,
  expiresAt: null,
  status: "idle",
  error: null,
};

const computeExpiredToken = (expiresIn: string) =>
  Date.now() + Number(expiresIn || 0) * 1000 - 60_000;

export const restoreFromStorage = createAsyncThunk(
  "auth/restoreFromStorage",
  async () => {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as {
        idToken: string;
        refreshToken: string;
        expiresAt: number;
      };
    } catch {
      return null;
    }
  }
);

export const loginThunk = createAsyncThunk<
  FirebaseResponse,
  { email: string; password: string; apiBase: string }
>("auth/login", async ({ email, password, apiBase }) => {
  const res = await fetch(`${apiBase}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return (await res.json()) as FirebaseResponse;
});

export const refreshThunk = createAsyncThunk<
  FirebaseResponse,
  { refreshToken: string; apiBase: string }
>("auth/refresh", async ({ refreshToken, apiBase }) => {
  const res = await fetch(`${apiBase}/user/refresh-auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return (await res.json()) as FirebaseResponse;
});

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.idToken = null;
      state.refreshToken = null;
      state.expiresAt = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem(AUTH_STORAGE_KEY);
    },
    setTokensFromResponse(state, action: PayloadAction<FirebaseResponse>) {
      const { idToken, refreshToken, expiresIn } = action.payload;
      const expiresAt = computeExpiredToken(expiresIn);
      state.idToken = idToken;
      state.refreshToken = refreshToken;
      state.expiresAt = expiresAt;
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ idToken, refreshToken, expiresAt })
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreFromStorage.fulfilled, (state, action) => {
        if (action.payload) {
          state.idToken = action.payload.idToken;
          state.refreshToken = action.payload.refreshToken;
          state.expiresAt = action.payload.expiresAt;
        }
      })
      .addCase(loginThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { idToken, refreshToken, expiresIn } = action.payload;
        const expiresAt = computeExpiredToken(expiresIn);
        state.idToken = idToken;
        state.refreshToken = refreshToken;
        state.expiresAt = expiresAt;
        localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({ idToken, refreshToken, expiresAt })
        );
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Login failed";
      })
      .addCase(refreshThunk.fulfilled, (state, action) => {
        const { idToken, refreshToken, expiresIn } = action.payload;
        const expiresAt = computeExpiredToken(expiresIn);
        state.idToken = idToken;
        state.refreshToken = refreshToken;
        state.expiresAt = expiresAt;
        localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({ idToken, refreshToken, expiresAt })
        );
      })
      .addCase(refreshThunk.rejected, (state, action) => {
        state.error = action.error.message || "Token refresh failed";
        state.idToken = null;
        state.refreshToken = null;
        state.expiresAt = null;
        localStorage.removeItem(AUTH_STORAGE_KEY);
      });
  },
});

export const { logout, setTokensFromResponse } = slice.actions;
export const authReducer = slice.reducer;

export const useUser = () => {
  const dispatch = useDispatch();
  const { idToken, refreshToken, expiresAt, status, error } = useSelector(
    (state: any) => state.auth as AuthState
  );

  const restoredRef = useRef(false);
  useEffect(() => {
    if (!restoredRef.current) {
      restoredRef.current = true;
      dispatch(restoreFromStorage() as any);
    }
  }, [dispatch]);

  useEffect(() => {
    if (!refreshToken || !expiresAt) return;
    const apiBase = `${import.meta.env.VITE_ALFRED_BACKEND_ENDPOINT}`;
    const msUntilRefresh = Math.max(expiresAt - Date.now() - 15_000, 0);
    const timer = setTimeout(() => {
      dispatch(refreshThunk({ refreshToken, apiBase }) as any);
    }, msUntilRefresh);
    return () => clearTimeout(timer);
  }, [dispatch, refreshToken, expiresAt]);

  const login = useCallback(
    async (email: string, password: string, apiBase?: string) => {
      const base = apiBase ?? `${import.meta.env.VITE_ALFRED_BACKEND_ENDPOINT}`;
      await dispatch(
        loginThunk({ email, password, apiBase: base }) as any
      ).unwrap();
    },
    [dispatch]
  );

  const doLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const isAuthenticated = useMemo(() => Boolean(idToken), [idToken]);

  return {
    idToken,
    refreshToken,
    expiresAt,
    status,
    error,
    isAuthenticated,
    login,
    logout: doLogout,
  };
};
