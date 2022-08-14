import express from "express";
import multer from "multer";
import { storage } from "../config/cloudinary.js";
const router = express.Router({ mergeParams: true });
const upload = multer({ storage });

import * as Community from "../controllers/community";
import * as middlewares from "../middlewares";
import { wrapAsync } from "../utils";

//List all
router.get("/", wrapAsync(Community.index));

//Create
router.get(
	"/new",
	// middlewares.isSignIn,
	Community.newCommunity
);

router.post(
	"/",
	middlewares.isSignIn,
	upload.single("logo"),
	wrapAsync(Community.create)
);

//Edit
router.get(
	"/:communityId/settings",
	middlewares.isSignIn,
	middlewares.isAdmin,
	upload.single("logo"),
	wrapAsync(Community.settings)
);

router.put(
	"/:communityId",
	middlewares.isSignIn,
	middlewares.isAdmin,
	wrapAsync(Community.update)
);

//Delete
router.delete("/:communityId", wrapAsync(Community.remove));

//Show
router.get("/:communityId", wrapAsync(Community.show));

//New Post
router.get(
	"/:communityId/posts/new",
	middlewares.isSignIn,
	middlewares.isMember,
	wrapAsync(Community.newPost)
);

router.post(
	"/:communityId/posts",
	middlewares.isSignIn,
	middlewares.isMember,
	wrapAsync(Community.createPost)
);

export default router;
