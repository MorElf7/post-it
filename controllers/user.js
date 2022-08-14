import bcrypt from "bcrypt";
import passport from "passport";
import { cloudinary } from "../config/cloudinary";
import User from "../models/user";
import { ExpressError } from "../utils";

const saltRounds = parseInt(process.env.SALTROUNDS) || 12;

export const index = async (req, res) => {
	const users = await User.find({});
	const data = { users, pageTitle: "All Users" };
	res.json(data);
};

export const signup = async (req, res, next) => {
	const { username, email, password } = req.body;
	const user = await User.findOne({ username });
	if (user) {
		const data = {
			status: 405,
			message: `User with username ${username} already exist`,
		};
		throw new ExpressError(data.message, data.status);
	}
	const newUser = new User({
		email,
		username,
		bio: "",
		joinedAt: Date.now(),
		avatar: {},
	});
	const hash = await bcrypt.hash(password, saltRounds);
	newUser.password = hash;
	newUser.avatar.url =
		"https://res.cloudinary.com/damrqx5dg/image/upload/v1651280572/PostIt/default_avatar_rm90mb.jpg";
	newUser.avatar.filename = "default_avatar_rm90mb";
	newUser.follows.push(newUser._id);
	await newUser.save();
	res.cookie("checkSession", true, {
		// expires: Date.now() + 1000 * 60 * 60 * 24,
		maxAge: 1000 * 60 * 60 * 24,
		sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // must be 'none' to enable cross-site delivery
		secure: process.env.NODE_ENV === "production", // must be true if sameSite='none'
	});
	req.login(newUser, (err) => {
		if (err) return next(err);
		const data = {
			status: 200,
			message: "Welcome to PostIt",
			redirectUrl: `/${newUser._id}`,
		};
		res.json(data);
	});
};

export const login = (req, res, next) => {
	passport.authenticate("local", (err, user, info) => {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.status(401).json(info);
		}
		if (req.user && !req.user._id.equals(user._id)) {
			throw new ExpressError("Another user has already logged in", 401);
		}
		req.logIn(user, (err) => {
			if (err) {
				return next(err);
			}
			return next();
		});
	})(req, res, next);
};

export const postSignIn = (req, res) => {
	const redirectUrl = req.session.returnTo || "/";
	delete req.session.returnTo;
	let data;
	if (req.user) {
		data = {
			status: 200,
			message: "Signed In",
			redirectUrl,
		};
	}
	res.cookie("checkSession", true, {
		// expires: Date.now() + 1000 * 60 * 60 * 24,
		sameSite: "none",
		secure: "true",
		maxAge: 1000 * 60 * 60 * 24,
		// sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // must be 'none' to enable cross-site delivery
		// secure: process.env.NODE_ENV === "production", // must be true if sameSite='none'
	});
	res.json(data);
};

export const signout = (req, res) => {
	req.logout();
	res.clearCookie("session");
	res.cookie("checkSession", false);
	const data = { status: 200, message: "Signed Out" };
	res.json(data);
};

export const show = async (req, res) => {
	const { userId } = req.params;
	const user = await User.findById(userId).populate("posts");
	if (!user) {
		const data = {
			status: 404,
			message: "User not found",
		};
		throw new ExpressError(data.message, data.status);
	}
	user.posts.sort((a, b) => {
		return a.createdAt < b.createdAt ? 1 : -1;
	});
	const pageTitle = user.username;
	const data = { pageTitle, user, status: 200, message: "" };
	res.json(data);
};

export const update = async (req, res) => {
	const { userId } = req.params;
	const obj = JSON.parse(req.body.user);
	const user = await User.findById(userId);
	if (user.avatar.filename !== "default_avatar_rm90mb") {
		await cloudinary.uploader.destroy(user.avatar.filename);
	}
	await user.updateOne(obj);
	if (req.file) {
		user.avatar.url = req.file.path;
		user.avatar.filename = req.file.filename;
	}
	await user.save();
	const data = {
		status: 200,
		message: "Profile saved successfully",
	};
	res.json(data);
};

export const updatePassword = async (req, res) => {
	const { userId } = req.params;
	const { oldPassword, newPassword } = req.body;
	const user = await User.findById(userId);
	const result = await bcrypt.compare(oldPassword, user.password);
	if (result) {
		const newHash = await bcrypt.hash(newPassword, saltRounds);
		user.password = newHash;
	} else {
		const data = {
			status: 401,
			message: "Old password is incorrect",
		};
		throw new ExpressError(data.message, data.status);
	}
	await user.save();
	const data = {
		status: 200,
		message: "Password updated",
	};
	res.json(data);
};

export const follow = async (req, res) => {
	const { userId } = req.params;
	const { follow, unfollow } = req.body;
	const user = await User.findById(userId);
	if (follow) {
		user.follows.push(follow);
		await user.save();
		const data = {
			status: 200,
			message: "",
		};
		res.json(data);
	} else if (unfollow) {
		user.follows = user.follows.filter((e) => !e._id.equals(unfollow));
		await user.save();
		const data = {
			status: 200,
			message: "",
		};
		res.json(data);
	}
};

export const remove = async (req, res) => {
	const { userId } = req.params;
	const user = await User.findById(userId);
	if (!user) {
		const data = {
			status: 404,
			message: "User not found",
		};
		throw new ExpressError(data.message, data.status);
	}
	if (user.avatar.filename) {
		await cloudinary.uploader.destroy(user.avatar.filename);
	}
	req.logout();
	await User.findByIdAndDelete(userId);
	res.clearCookie("session");
	res.cookie("checkSession", false);
	const data = {
		status: 200,
		message: "Account Deleted",
	};
	res.json(data);
};
