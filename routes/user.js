import express from "express";
import multer from "multer";
import { storage } from "../config/cloudinary.js";
const router = express.Router({ mergeParams: true });
const upload = multer({ storage });

import * as User from "../controllers/user";
import * as middlewares from "../middlewares";
import { wrapAsync } from "../utils";

//List all users
router.get("/users", wrapAsync(User.index));

//Sign up
router.post("/users", wrapAsync(User.signup));

router.post("/users/signin", User.login, User.postSignIn);

//Sign Out
router.get("/users/signout", middlewares.isSignIn, User.signout);

//Show User
router.get("/:userId", wrapAsync(User.show));

//Update user data except password
router.put(
	"/:userId",
	middlewares.isSignIn,
	middlewares.isUser,
	upload.single("avatar"),
	wrapAsync(middlewares.validateUser),
	wrapAsync(User.update)
);

//Update password
router.patch(
	"/:userId/password",
	middlewares.isSignIn,
	middlewares.isUser,
	middlewares.validateChangePassword,
	wrapAsync(User.updatePassword)
);

//Follow/Unfollow user
router.patch("/:userId", middlewares.isSignIn, wrapAsync(User.follow));

//Delete User
router.delete(
	"/:userId",
	middlewares.isSignIn,
	middlewares.isUser,
	wrapAsync(User.remove)
);

export default router;
