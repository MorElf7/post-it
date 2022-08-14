import Comment from "../models/comment";
import Post from "../models/post";
import User from "../models/user";
import { ExpressError } from "../utils";

export const create = async (req, res) => {
	const { userId, postId } = req.params;
	const comment = new Comment(req.body);
	const post = await Post.findById(postId);
	comment.user = req.user._id;
	comment.post = post;
	post.comments.push(comment);
	if (post.comments.length >= 2) {
		post.comments.sort((a, b) => {
			return a.createdAt < b.createdAt ? 1 : -1;
		});
	}
	await comment.save();
	await post.save();
	const data = { status: 200, message: "" };
	res.json(data);
};

export const update = async (req, res) => {
	const { userId, postId, commentId } = req.params;
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
	const comment = await Comment.findById(commentId);
	if (!comment) {
		const data = {
			status: 404,
			message: "Comment not found",
		};
		throw new ExpressError(data.message, data.status);
	}
	await comment.updateOne(req.body);
	const data = { status: 200, message: "" };
	res.json(data);
};

export const remove = async (req, res) => {
	const { userId, postId, commentId } = req.params;
	const user = User.findById(userId);
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
	const comment = await Comment.findById(commentId);
	if (!comment) {
		const data = {
			status: 404,
			message: "Comment not found",
		};
		throw new ExpressError(data.message, data.status);
	}
	post.comments = post.comments.filter((e) => !e.equals(commentId));
	await post.save();
	await comment.deleteOne();
	const data = { status: 200, message: "" };
	res.json(data);
};
