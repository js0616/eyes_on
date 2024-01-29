import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "./reducers/themeSlice";
import userSlice from "./reducers/userSlice";
import facilitySlice from "./reducers/facilitySlice";

export default configureStore({
  reducer: {
    theme: themeSlice,
    user: userSlice,
    facility: facilitySlice,
  },
});