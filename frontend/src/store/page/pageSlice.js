import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../../api";

const initialState = {
	title: "Home",
	message: "",
	status: 0,
	value: {
		posts: [],
		user: { username: "", avatar: {}, follows: [], posts: [] },
		comments: [],
		searchResults: [],
	},
};

export const pageSlice = createSlice({
	name: "page",
	initialState,
	reducers: {
		updatePageTitle: (state, action) => {
			return {
				...state,
				title: action.payload,
			};
		},
		updateFlashShow: (state, action) => {
			return {
				...state,
				flash: action.payload,
			};
		},
		updateFlashType: (state, action) => {
			return {
				...state,
				flashType: action.payload,
			};
		},
	},
	extraReducers(builder) {
		builder.addCase(getHomePage.fulfilled, (state, action) => {
			const response = action.payload;
			return {
				...state,
				title: response.pageTitle,
				value: {
					...state.value,
					posts: response.posts,
				},
				status: response.status,
			};
		});
		builder.addCase(getRecentPosts.fulfilled, (state, action) => {
			const response = action.payload;
			return {
				...state,
				title: response.pageTitle,
				value: {
					...state.value,
					posts: response.posts,
				},
				status: response.status,
			};
		});
		builder.addCase(getSearchResult.fulfilled, (state, action) => {
			const response = action.payload;
			return {
				...state,
				title: response.pageTitle,
				value: {
					...state.value,
					searchResults: response.result,
				},
				status: response.status,
			};
		});
		builder.addCase(getUserData.fulfilled, (state, action) => {
			const response = action.payload;
			if (!response.user) {
				return {
					...state,
					status: response.status,
					message: response.message,
					value: {
						...state.value,
						user: {
							username: "",
							avatar: {},
							follows: [],
							posts: [],
						},
					},
				};
			}
			return {
				...state,
				title: response.pageTitle,
				status: response.status,
				message: response.message,
				value: {
					...state.value,
					user: response.user,
				},
			};
		});
	},
});

export const getHomePage = createAsyncThunk("page/getHomePage", async () => {
	return (await api.getHomePage()).data;
});

export const getRecentPosts = createAsyncThunk(
	"page/getRecentPosts",
	async () => {
		return (await api.getRecentPosts()).data;
	}
);

export const getUserData = createAsyncThunk("user/getUserData", async (id) => {
	return (await api.getUser(id)).data;
});

export const getSearchResult = createAsyncThunk(
	"user/getSearchResult",
	async (data) => {
		return (await api.getSearchResult(data)).data;
	}
);

export const getFlashShow = (state) => state.page.flash;
export const getFlashType = (state) => state.page.flashType;
export const getPagePosts = (state) => state.page.value.posts;
export const getPageUser = (state) => state.page.value.user;
export const getPageCommnents = (state) => state.page.value.comments;
export const getResult = (state) => state.page.value.searchResults;

export const getPageTitle = (state) => state.page.title;

export const getResponseStatusPage = (state) => ({
	status: state.page.status,
	message: state.page.message,
});
export const getFlashPage = (state) => {
	let flash = null;
	if (200 <= state.page.status && state.page.status < 300) {
		flash = "success";
	} else if (400 <= state.page.status && state.page.status < 500) {
		flash = "error";
	}
	return {
		flash,
		flashMessage: state.page.message,
	};
};

export const { updatePageTitle, updateFlashShow, updateFlashType } =
	pageSlice.actions;
export default pageSlice.reducer;
