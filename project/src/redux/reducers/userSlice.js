import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: {},
    tutorialMode: true,
    isLoggedIn: false, 
    isSplash: true,
  },
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
      state.isLoggedIn = true;
    },
    setTutorialMode: (state) => {
      state.tutorialMode = !state.tutorialMode;
    },
    logout: (state) => {
      state.userInfo = {};
      state.isLoggedIn = false;
      sessionStorage.removeItem('isLoggedIn');
    },
    setIsSplash: (state) => {
      state.isSplash = false;
    },
  },
});

export const { setUserInfo, setTutorialMode, logout, setIsSplash } = userSlice.actions;
export default userSlice.reducer;