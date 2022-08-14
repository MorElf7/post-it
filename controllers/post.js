import { cloudinary } from "../config/cloudinary";
import Post from "../models/post";
import User from "../models/user";
import { ExpressError } from "../utils";

export const index = async (req, res) => {
	const posts = await Post.find({});
	const data = { posts, pageTitle: "All Posts", status: 200, message: "" };
	res.json(data);
};

export const create = async (req, res) => {
	const { userId } = req.params;
	const user = await User.findById(userId);
	if (!user) {
		const data = {
			status: 404,
			message: "User not found",
		};
		throw new ExpressError(data.message, data.status);
	}
	const post = new Post(JSON.parse(req.body.post));
	post.user = user;
	user.posts.push(post);
	if (req.file) {
		post.image = {};
		post.image.url = req.file.path;
		post.image.filename = req.file.filename;
	}
	await post.save();
	await user.save();
	const data = { status: 200, message: "New post created" };
	res.json(data);
};

export const update = async (req, res) => {
	const { userId, postId } = req.params;
	const user = await User.findById(userId);
	if (!user) {
		const data = {
			status: 404,
			message: "User not found",
		};
		throw new ExpressError(data.message, data.status);
	}
	const post = await Post.findById(postId);
	if (!post) {
		const data = {
			status: 404,
			message: "Post not found",
		};
		throw new ExpressError(data.message, data.status);
	}
	await post.updateOne(JSON.parse(req.body.post));
	if (req.file) {
		if (post.image?.filename) {
			await cloudinary.uploader.destroy(post.image.filename);
		}
		post.image.url = req.file.path;
		post.image.filename = req.file.filename;
	}
	await post.save();
	const data = { status: 200, message: "Post updated successfully" };
	res.json(data);
};

export const remove = async (req, res) => {
	const { userId, postId } = req.params;
	const user = await User.findById(userId);
	if (!user) {
		const data = {
			status: 404,
			message: "User not found",
		};
		throw new ExpressError(data.message, data.status);
	}
	const post = await Post.findById(postId);
	if (!post) {
		const data = {
			status: 404,
			message: "Post not found",
		};
		throw new ExpressError(data.message, data.status);
	}
	user.posts = user.posts.filter((e) => !e.equals(postId));
	if (post.image?.filename) {
		await cloudinary.uploader.destroy(post.image.filename);
	}
	await user.save();
	await Post.findByIdAndDelete(postId);
	const data = { status: 200, message: "Post deleted successfully" };
	res.json(data);
};

export const get = async (req, res) => {
	const { postId, userId } = req.params;
	const user = await User.findById(userId);
	if (!user) {
		const data = {
			status: 404,
			message: "User not found",
		};
		throw new ExpressError(data.message, data.status);
	}
	const post = await Post.findById(postId)
		.populate({ path: "user", select: ["username", "_id", "avatar"] })
		.populate({
			path: "comments",
			populate: { path: "user", select: ["username", "_id", "avatar"] },
		});
	if (!post) {
		const data = {
			status: 404,
			message: "Post not found",
		};
		throw new ExpressError(data.message, data.status);
	}
	post.comments.sort((a, b) => {
		return a.createdAt < b.createdAt ? 1 : -1;
	});
	const pageTitle = post.title;
	const data = { pageTitle, post, status: 200, message: "" };
	res.json(data);
};
