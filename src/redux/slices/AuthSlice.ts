import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define types for user & token
interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  auth: {
    user: User | null;
    token: string | null;
  };
}

// Fetch token and user from localStorage with types
const token: string | null = localStorage.getItem("token");
const user: User | null = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user")!)
  : null;

//   Set initial state with types
const initialAuthState: AuthState = {
  isAuthenticated: !!user,
  auth: { token: token || null, user: user || null },
};

const authenticateSlice = createSlice({
  name: "authenticate",
  initialState: initialAuthState,
  reducers: {
    // Function to login
    login(state, action: PayloadAction<{token : string, user: User}>) {
      const { token, user } = action.payload;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      state.isAuthenticated = true;
      state.auth = { token, user };
    },

    // Function to logout
    logout(state) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      state.isAuthenticated = false;
      state.auth = { token: null, user: null };
    },
  },
});

export const {login, logout } = authenticateSlice.actions;
export default authenticateSlice.reducer;
