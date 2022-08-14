import mongoose from "mongoose";
import Post from "./post";
const Schema = mongoose.Schema;

const avatarSchema = new Schema(
	{
		url: String,
		filename: String,
	},
	{
		toObject: { virtuals: true },
		toJSON: { virtuals: true },
	}
);

avatarSchema.virtual("thumbnail").get(function () {
	return this.url.replace("/upload", "/upload/w_120,h_120,c_fill");
});
avatarSchema.virtual("smallAvatar").get(function () {
	return this.url.replace("/upload", "/upload/w_50,h_50,c_fill");
});

const userSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	avatar: avatarSchema,
	follows: [
		{
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	],
	bio: String,
	posts: [
		{
			type: Schema.Types.ObjectId,
			ref: "Post",
		},
	],
	joinedAt: Date,
});

userSchema.post("findOneAndDelete", async function (doc) {
	if (doc) {
		await Post.deleteMany({
			_id: doc.posts,
		});
	}
});

userSchema.index({ username: "text" });

export default mongoose.model("User", userSchema);
