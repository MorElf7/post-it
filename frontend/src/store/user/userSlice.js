import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../../api";

const initialState = {
	value: { _id: "", follows: [] },
	message: "",
	status: 0,
	redirectUrl: "/",
};

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {},
	extraReducers(builder) {
		builder.addCase(logIn.fulfilled, (state, action) => {
			const response = action.payload;
			if (400 <= response.status && response.status < 500) {
				return {
					...state,
					message: response.message,
					status: response.status,
				};
			}
			return {
				...state,
				message: response.message,
				status: response.status,
				redirectUrl: response.redirectUrl,
			};
		});
		builder.addCase(logOut.fulfilled, (state, action) => {
			const response = action.payload;
			if (400 <= response.status && response.status < 500) {
				return {
					...state,
					message: response.message,
					status: response.status,
				};
			}
			return {
				...state,
				message: response.message,
				status: response.status,
			};
		});
		builder.addCase(signUp.fulfilled, (state, action) => {
			const response = action.payload;
			if (400 <= response.status && response.status < 500) {
				return {
					...state,
					message: response.message,
					status: response.status,
				};
			}
			return {
				...state,
				message: response.message,
				status: response.status,
				redirectUrl: response.redirectUrl,
			};
		});
		builder.addCase(getCurrentUser.fulfilled, (state, action) => {
			const response = action.payload;
			if (400 <= response.status && response.status < 500) {
				return {
					...state,
					value: initialState.value,
					status: response.status,
				};
			}
			return {
				...state,
				value: response.currentUser,
			};
		});
		builder.addCase(deleteUser.fulfilled, (state, action) => {
			const response = action.payload;
			return {
				...state,
				value: initialState.value,
				status: response.status,
				message: response.message,
			};
		});
		builder.addCase(followUser.fulfilled, (state, action) => {
			const response = action.payload;
			return {
				...state,
				status: response.status,
				message: response.message,
			};
		});
		builder.addCase(updatePassword.fulfilled, (state, action) => {
			const response = action.payload;
			return {
				...state,
				status: response.status,
				message: response.message,
			};
		});
		builder.addCase(updateUser.fulfilled, (state, action) => {
			const response = action.payload;
			return {
				...state,
				status: response.status,
				message: response.message,
			};
		});
	},
});

export const logIn = createAsyncThunk("user/logIn", async (data) => {
	return (await api.logIn(data)).data;
});

export const logOut = createAsyncThunk("user/logOut", async () => {
	return (await api.logOut()).data;
});

export const signUp = createAsyncThunk("user/signUp", async (data) => {
	return (await api.signUp(data)).data;
});

export const getCurrentUser = createAsyncThunk(
	"user/getCurrentUser",
	async () => {
		return (await api.getCurrentUser()).data;
	}
);

export const followUser = createAsyncThunk("user/followUser", async (data) => {
	if (data.follow) {
		return (await api.followUser(data.id, { follow: data.follow })).data;
	}
	if (data.unfollow) {
		return (await api.followUser(data.id, { unfollow: data.unfollow }))
			.data;
	}
});

export const updatePassword = createAsyncThunk(
	"user/updatePassword",
	async (data) => {
		return (await api.updatePassword(data.id, data.body)).data;
	}
);

export const deleteUser = createAsyncThunk("user/deleteUser", async (id) => {
	return (await api.deleteUser(id)).data;
});

export const updateUser = createAsyncThunk("user/updateUser", async (data) => {
	return (await api.updateUser(data.id, data.formData)).data;
});

export const getUser = (state) => state.user.value;

export const getResponseStatusUser = (state) => ({
	status: state.user.status,
	message: state.user.message,
});
export const getFlashUser = (state) => {
	let flash = null;
	if (200 <= state.user.status && state.user.status < 300) {
		flash = "success";
	} else if (400 <= state.user.status && state.user.status < 500) {
		flash = "error";
	}
	return {
		flash,
		flashMessage: state.user.message,
	};
};
export const getRedirectUser = (state) => state.user.redirectUrl;

export const {} = userSlice.actions;
export default userSlice.reducer;
