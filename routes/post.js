import express from "express";
import multer from "multer";
import { storage } from "../cloudinary";
const router = express.Router({ mergeParams: true });
const upload = multer({ storage });

import * as Post from "../controllers/post";
import * as middlewares from "../middlewares";
import { wrapAsync } from "../utils";

//Create Post
router.post(
	"",
	middlewares.isSignIn,
	middlewares.isUser,
	upload.single("image"),
	wrapAsync(middlewares.validatePost),
	wrapAsync(Post.create)
);

//Edit Post
router.put(
	"/:postId",
	middlewares.isSignIn,
	middlewares.isPostAuthor,
	upload.single("image"),
	wrapAsync(middlewares.validatePost),
	wrapAsync(Post.update)
);

//Delete Post
router.delete(
	"/:postId",
	middlewares.isSignIn,
	middlewares.isPostAuthor,
	wrapAsync(Post.remove)
);

//Show Post
router.get("/:postId", wrapAsync(Post.get));

export default router;
