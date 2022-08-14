import { cloudinary } from "./config/cloudinary";
import Comment from "./models/comment";
import Community from "./models/community";
import Post from "./models/post";
import User from "./models/user";
import {
	changePasswordSchema,
	commentSchema,
	postSchema,
	userSchema,
} from "./schemas";
import { ExpressError } from "./utils";

export const isSignIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl;
		return res.status(401).json({
			status: 401,
			message: "Unauthorized",
		});
	}
	next();
};

export const isPostAuthor = async (req, res, next) => {
	const { userId, postId } = req.params;
	const post = await Post.findById(postId);
	if (!post) {
		const data = {
			status: 404,
			message: "Not found",
		};
		throw new ExpressError(data.message, data.status);
	}
	if (!post.user.equals(req.user._id)) {
		const data = {
			status: 403,
			message: "You do not have permission",
		};
		throw new ExpressError(data.message, data.status);
	}
	next();
};

export const isCommentAuthor = async (req, res, next) => {
	const { userId, postId, commentId } = req.params;
	const comment = await Comment.findById(commentId);
	if (!comment) {
		const data = {
			status: 404,
			message: "Not found",
			// redirectUrl: `/${userId}/posts/${postId}`,
		};
		throw new ExpressError(data.message, data.status);
	}
	if (!comment.user.equals(req.user._id)) {
		const data = {
			status: 403,
			message: "You do not have permission",
			// redirectUrl: `/${userId}/posts/${postId}`,
		};
		throw new ExpressError(data.message, data.status);
	}
	next();
};

export const isMember = async (req, res, next) => {
	const { communityId } = req.params;
	const community = await Community.findById(communityId);
	if (!community.members.find((e) => e._id.equals(req.user._id))) {
		const data = {
			status: 403,
			message: "You do not have permission",
			// redirectUrl: `/communities/${communityId}`,
		};
		throw new ExpressError(data.message, data.status);
	}
	next();
};

export const isMods = async (req, res, next) => {
	const { communityId } = req.params;
	const community = await Community.findById(communityId);
	if (!community.moderators.find((e) => e._id.equals(req.user._id))) {
		const data = {
			status: 403,
			message: "You do not have permission",
			// redirectUrl: `/communities/${communityId}`,
		};
		throw new ExpressError(data.message, data.status);
	}
	next();
};

export const isAdmin = async (req, res, next) => {
	const { communityId } = req.params;
	const community = await Community.findById(communityId);
	if (!community.admin.equals(req.user._id)) {
		const data = {
			status: 403,
			message: "You do not have permission",
			// redirectUrl: `/communities/${communityId}`,
		};
		throw new ExpressError(data.message, data.status);
	}
	next();
};

export const isUser = async (req, res, next) => {
	const { userId } = req.params;
	const user = await User.findById(userId);
	if (!User) {
		const data = {
			status: 404,
			message: "Not found",
		};
		throw new ExpressError(data.message, data.status);
	}
	if (!user._id.equals(req.user._id)) {
		const data = {
			status: 403,
			message: "You do not have permission",
		};
		throw new ExpressError(data.message, data.status);
	}
	next();
};

export const validatePost = async (req, res, next) => {
	const obj = { post: JSON.parse(req.body.post) };
	const { error } = postSchema.validate(obj);
	if (error) {
		if (req.file) {
			await cloudinary.uploader.destroy(req.file.filename);
		}
		const msg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

export const validateUser = async (req, res, next) => {
	const obj = { user: JSON.parse(req.body.user) };
	const { error } = userSchema.validate(obj);
	if (error) {
		if (req.file) {
			await cloudinary.uploader.destroy(req.file.filename);
		}
		const msg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

export const validateChangePassword = (req, res, next) => {
	const { error } = changePasswordSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

export const validateComment = (req, res, next) => {
	const { error } = commentSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};
