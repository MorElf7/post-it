// import dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
// if (!process.env.NODE_ENV !== "production") {
// 	dotenv.config({ silent: true });
// }
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import MongoDBStore from "connect-mongo";
import cors from "cors";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import session from "express-session";
import helmet from "helmet";
import methodOverride from "method-override";
import mongoose from "mongoose";
import passport from "passport";
import _ from "./config/env.js";
import localStrategy from "./config/passport";

import * as allowedContent from "./allowedContent";
import Post from "./models/post";
import User from "./models/user";
import commentRouter from "./routes/comment";
import communityRouter from "./routes/community";
import postRouter from "./routes/post";
import userRouter from "./routes/user";
import { ExpressError, wrapAsync } from "./utils";

const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/PostIt";
// const dbUrl = "mongodb://127.0.0.1:27017/PostIt";
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Database connected");
});

const app = express();

const port = process.env.PORT || 8000;
app.listen(port, () => {
	console.log(`Serving on port ${port}`);
});

app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(
	cors({
		origin: [
			process.env.FRONTEND_APP_URL,
			"http://localhost:3000",
			"http://localhost:8000",
			"https://post-it-fullstack.herokuapp.com",
			"https://post-it-social-media.netlify.app",
		], //location of react app
		credentials: true,
	})
);
app.use(express.static(new URL("./static", import.meta.url).pathname));
app.use(mongoSanitize());

app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: ["'self'"],
			connectSrc: ["'self'", ...allowedContent.connectSrcUrls],
			scriptSrc: [
				"'unsafe-inline'",
				"'self'",
				...allowedContent.scriptSrcUrls,
			],
			styleSrc: [
				"'self'",
				"'unsafe-inline'",
				...allowedContent.styleSrcUrls,
			],
			workerSrc: ["'self'", "blob:"],
			objectSrc: [],
			imgSrc: [
				"'self'",
				"blob:",
				"data:",
				"https://res.cloudinary.com/damrqx5dg/",
				"https://images.unsplash.com/",
			],
			fontSrc: ["'self'", ...allowedContent.fontSrcUrls],
			scriptSrcAttr: ["'unsafe-inline'"],
		},
	})
);

const secret = process.env.SECRET || "developmentsecret";

const store = MongoDBStore.create({
	mongoUrl: dbUrl,
	secret,
	touchAfter: 2 * 60 * 60,
});

store.on("error", function (e) {
	console.log("Session store error", e);
});

const sessionConfig = {
	store,
	name: "session",
	secret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24,
		maxAge: 1000 * 60 * 60 * 24,
	},
};
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
localStrategy(passport);

app.use(function (req, res, next) {
	if (req.isAuthenticated()) {
		res.cookie("checkSession", true, {
			expires: Date.now() + 1000 * 60 * 60 * 24,
			maxAge: 1000 * 60 * 60 * 24,
		});
	}
	next();
});

//Home page
app.get(
	"/api",
	wrapAsync(async (req, res) => {
		let posts = null;
		if (req.user) {
			const user = await User.findById(req.user._id);
			posts = await Post.find({ user: { $in: user.follows } }).populate(
				"user"
			);
			posts.sort((a, b) => {
				return a.createdAt < b.createdAt ? 1 : -1;
			});
		}
		const data = { posts, pageTitle: "Home" };
		res.json(data);
	})
);

//Get current user
app.get(
	"/api/user",
	wrapAsync(async (req, res) => {
		if (!req.isAuthenticated()) {
			const data = {
				status: 401,
				message: "User not signed in",
			};
			throw new ExpressError(data.message, data.status);
		}
		const data = { currentUser: req.user, status: 200, message: "" };
		return res.json(data);
	})
);

//Recent Posts
app.get(
	"/api/posts",
	wrapAsync(async (req, res) => {
		let posts = await Post.find({}).populate("user");
		posts.sort((a, b) => {
			return a.createdAt < b.createdAt ? 1 : -1;
		});
		const data = { posts, pageTitle: "Recent Posts", status: 200 };
		return res.json(data);
	})
);

//Search
app.post(
	"/api/search",
	wrapAsync(async (req, res) => {
		const { name } = req.body;
		User.createIndexes();
		let list = await User.find({ $text: { $search: name } }).populate(
			"posts"
		);
		Post.createIndexes();
		const posts = await Post.find({ $text: { $search: name } }).populate(
			"user"
		);
		list.push(...posts);
		const data = {
			result: list,
			pageTitle: "Search",
			status: 200,
		};
		return res.json(data);
	})
);

// app.use('/api/communities', communityRouter)
app.use("/api/:userId/posts", postRouter);
app.use("/api/:userId/posts/:postId/comments", commentRouter);
app.use("/api/", userRouter);

// if (process.env.NODE_ENV === "production") {
app.use(express.static(path.resolve(__dirname, "./frontend/build")));
app.get("*", (req, res) => {
	res.sendFile(path.resolve(__dirname, "./frontend/build", "index.html"));
});
// }

app.all("*", (req, res, next) => {
	next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
	const { status = 500 } = err;
	if (!err.message) err.message = "Something went wrong!";
	const data = { status, message: err.message, pageTitle: "Error" };
	res.json(data);
});
