import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../../api";

const initialState = {
	value: { comments: [] },
	status: 0,
	message: "",
};

const postSlice = createSlice({
	name: "post",
	initialState,
	reducers: {},
	extraReducers(builder) {
		builder.addCase(createPost.fulfilled, (state, action) => {
			const response = action.payload;
			return {
				...state,
				status: response.status,
				message: response.message,
			};
		});
		builder.addCase(updatePost.fulfilled, (state, action) => {
			const response = action.payload;
			return {
				...state,
				status: response.status,
				message: response.message,
			};
		});
		builder.addCase(deletePost.fulfilled, (state, action) => {
			const response = action.payload;
			return {
				...state,
				value: initialState.value,
				status: response.status,
				message: response.message,
			};
		});
		builder.addCase(getPostData.fulfilled, (state, action) => {
			const response = action.payload;
			return {
				...state,
				value: response.post,
				status: response.status,
				message: response.message,
			};
		});
		builder.addCase(createComment.fulfilled, (state, action) => {
			const response = action.payload;
			return {
				...state,
				status: response.status,
				message: response.message,
			};
		});
		builder.addCase(updateComment.fulfilled, (state, action) => {
			const response = action.payload;
			return {
				...state,
				status: response.status,
				message: response.message,
			};
		});
		builder.addCase(deleteComment.fulfilled, (state, action) => {
			const response = action.payload;
			return {
				...state,
				status: response.status,
				message: response.message,
			};
		});
	},
});

export const createPost = createAsyncThunk("post/createPost", async (data) => {
	return (await api.createPost(data.userId, data.formData)).data;
});

export const updatePost = createAsyncThunk("post/updatePost", async (data) => {
	return (await api.updatePost(data.userId, data.postId, data.formData)).data;
});

export const deletePost = createAsyncThunk("post/deletePost", async (data) => {
	return (await api.deletePost(data.userId, data.postId)).data;
});

export const createComment = createAsyncThunk(
	"post/createComment",
	async (data) => {
		return (await api.createComment(data.userId, data.postId, data.comment))
			.data;
	}
);

export const updateComment = createAsyncThunk(
	"post/updateComment",
	async (data) => {
		return (
			await api.updateComment(
				data.userId,
				data.postId,
				data.commentId,
				data.comment
			)
		).data;
	}
);

export const deleteComment = createAsyncThunk(
	"post/deleteComment",
	async (data) => {
		return (
			await api.deleteComment(data.userId, data.postId, data.commentId)
		).data;
	}
);

export const getPostData = createAsyncThunk(
	"post/getPostData",
	async (data) => {
		return (await api.getPost(data.userId, data.postId)).data;
	}
);

export const getPost = (state) => state.post.value;

export const getResponseStatusPost = (state) => ({
	status: state.post.status,
	message: state.post.message,
});
export const getFlashPost = (state) => {
	let flash = null;
	if (200 <= state.post.status && state.post.status < 300) {
		flash = "success";
	} else if (400 <= state.post.status && state.post.status < 500) {
		flash = "error";
	}
	return {
		flash,
		flashMessage: state.post.message,
	};
};

export const {} = postSlice.actions;
export default postSlice.reducer;
