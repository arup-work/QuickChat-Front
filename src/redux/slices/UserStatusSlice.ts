import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserStatus {
  userId: string;
  status: string;
  lastSeen: string | null;
}

interface UserStatusState {
  statuses: Record<string, UserStatus>;
}

const initialState: UserStatusState = {
  statuses: {},
};

const userStatusSlice = createSlice({
  name: "userStatus",
  initialState,
  reducers: {
    updateUserStatus: (state, action: PayloadAction<UserStatus>) => {
      const { userId, status, lastSeen } = action.payload;
      state.statuses[userId] = { userId, status, lastSeen };
    },
    setAllUserStatuses: (state, action: PayloadAction<UserStatus[]>) => {
      state.statuses = action.payload.reduce((acc, status) => {
        acc[status.userId] = status;
        return acc;
      }, {} as Record<string, UserStatus>);
    }
  },
});

export const { updateUserStatus, setAllUserStatuses } = userStatusSlice.actions;

export default userStatusSlice.reducer;

