import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
if (!process.env.NODE_ENV !== "production") {
	dotenv.config();
}

import bcrypt from "bcrypt";
import mongoose from "mongoose";
import Post from "../models/post";
import User from "../models/user";

const saltRounds = parseInt(process.env.SALTROUNDS) || 12;
// const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/PostIt";
const dbUrl = "mongodb://127.0.0.1:27017/PostIt";
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Database connected");
});

const captitalize = (s) => {
	const lower = s.toLowerCase();
	return s.charAt(0).toUpperCase() + lower.slice(1);
};

const accounts = [
	"tim",
	"tom",
	"bob",
	"brad",
	"jerry",
	"colt",
	"jose",
	"alex",
	"steve",
	"stephen",
];

const seedDB = async () => {
	for (let acc of accounts) {
		const password = acc;
		const newUser = new User({
			email: acc + "@gmail.com",
			username: acc,
			password,
			bio: "Hey, I am " + captitalize(acc),
			joinedAt: Date.now(),
			avatar: {},
		});
		const hash = await bcrypt.hash(password, 12);
		newUser.password = hash;
		newUser.avatar.url =
			"https://res.cloudinary.com/damrqx5dg/image/upload/v1651280572/PostIt/default_avatar_rm90mb.jpg";
		newUser.avatar.filename = "default_avatar_rm90mb";
		newUser.follows.push(newUser._id);
		for (let i = 1; i <= 50; i++) {
			const post = new Post({
				title: "Post Number " + i.toString(),
				description: "Just Do It",
				joinedAt: Date.now(),
				user: newUser._id,
			});
			newUser.posts.push(post);
			await post.save();
		}

		newUser.posts.sort((a, b) => {
			return a.updatedAt > b.updatedAt ? 1 : -1;
		});

		await newUser.save();
	}
	console.log("Done!");
};

seedDB();
