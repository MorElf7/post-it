import axios from "axios";

const config = {
	baseURL: "/api",
	withCredentials: true,
	validateStatus: (status) => {
		return status < 500;
	},
};

const api = axios.create(config);

//Get Home Page
export async function getHomePage() {
	return await api.get("/");
}

//Get recent posts
export async function getRecentPosts() {
	return await api.get("/posts");
}

//Get search results
export async function getSearchResult(data) {
	return await api.post("/search", data);
}

//--------------USER-OPERATION--------------------------------------------------
//Log In
export async function logIn(data) {
	return await api.post("/users/signin", data);
}

//Log Out
export function logOut() {
	return api.get("/users/signout");
}

//Get current user, logged in user
export async function getCurrentUser() {
	return await api.get("/user");
}

//Register user
export async function signUp(data) {
	return await api.post("/users", data);
}

//Get user
export async function getUser(id) {
	return await api.get(`/${id}`);
}

//Update user
export async function updateUser(id, formData) {
	return await api.post(`/${id}?_method=PUT`, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
}

//Update user password
export async function updatePassword(id, data) {
	return await api.patch(`/${id}/password`, data);
}

//Follow/Unfollow a user
export async function followUser(id, data) {
	return await api.patch(`/${id}`, data);
}

//Delete user
export async function deleteUser(id) {
	return await api.delete(`/${id}`);
}

//--------------POST_OPERATION--------------------------------------------------
//Create post
export async function createPost(userId, data) {
	return await api.post(`/${userId}/posts`, data, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
}

//Update post
export async function updatePost(userId, postId, data) {
	return await api.post(`/${userId}/posts/${postId}?_method=PUT`, data, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
}

//Delete post
export async function deletePost(userId, postId) {
	return await api.delete(`/${userId}/posts/${postId}`);
}

//Get post
export async function getPost(userId, postId) {
	return await api.get(`/${userId}/posts/${postId}`);
}

//-------------COMMENT-OPERATION----------------------------------------------------------------------
//Create comment
export async function createComment(userId, postId, data) {
	return await api.post(`/${userId}/posts/${postId}/comments`, data);
}

//Update comment
export async function updateComment(userId, postId, commentId, data) {
	return await api.put(
		`/${userId}/posts/${postId}/comments/${commentId}`,
		data
	);
}

//Delete comment
export async function deleteComment(userId, postId, commentId) {
	return await api.delete(`/${userId}/posts/${postId}/comments/${commentId}`);
}
