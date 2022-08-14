import { configureStore } from "@reduxjs/toolkit";
import pageReducer from "./page/pageSlice";
import postReducer from "./post/postSlice";
import userReducer from "./user/userSlice";

export const store = configureStore({
	reducer: {
		user: userReducer,
		page: pageReducer,
		post: postReducer,
	},
});
