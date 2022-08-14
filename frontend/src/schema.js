import sanitizeHtml from "sanitize-html";
import * as yup from "yup";
import * as Validation from "./utils/validationHelper";

const errorString = {
	notMongoObjectId: "The id is not valid",
	passwordInvalid:
		"Password can only contain letters, numbers, and special characters (!@#$%^&*)",
	usernameInvalid:
		"Username can only contain letters, numbers, dashes, and underscores",
	emailInvalid: "Not a valid email address",
};

yup.addMethod(
	yup.string,
	"escapeHTML",
	function (errorMessage = "Must not contain HTML") {
		return this.test("escapeHtml", errorMessage, function (value) {
			const { path, createError } = this;
			const clean = sanitizeHtml(value, {
				allowedTags: [],
				allowedAttributes: {},
			});
			if (clean !== value) {
				return createError({ path, message: errorMessage });
			}
			return true;
		});
	}
);

export const userSchema = yup.object({
	avatar: yup
		.mixed()
		.test("fileSize", "The file is too large", (value) => {
			if (value.length === 0) {
				return true;
			}
			return value.length > 0 && value[0]?.size <= 3000000;
		})
		.test("fileType", "We only support jpeg", (value) => {
			if (value.length === 0) {
				return true;
			}
			return value.length > 0 && value[0]?.type === "image/jpeg";
		}),
	user: yup
		.object({
			username: yup
				.string()
				.trim()
				.required(Validation.RequiredValidation("Username"))
				.min(3, Validation.StringMinLength("Username", 3))
				.max(20, Validation.StringMaxLength("Username", 20))
				.matches(/^[0-9a-zA-Z-_]+$/, errorString.usernameInvalid)
				.escapeHTML(),
			email: yup
				.string()
				.trim()
				.required(Validation.RequiredValidation("Email"))
				.email(errorString.emailInvalid)
				.escapeHTML(),
			bio: yup.string().escapeHTML(),
			posts: yup.array(),
			joinedAt: yup.date(),
		})
		.required(),
});

export const postSchema = yup.object({
	image: yup
		.mixed()
		.test("fileSize", "The file is too large", (value) => {
			if (value.length === 0) {
				return true;
			}
			return value.length > 0 && value[0]?.size <= 5000000;
		})
		.test("fileType", "We only support jpeg", (value) => {
			if (value.length === 0) {
				return true;
			}
			return value.length > 0 && value[0]?.type === "image/jpeg";
		}),
	post: yup
		.object({
			title: yup
				.string()
				.max(100, "Title too long")
				.required(Validation.RequiredValidation("Title"))
				.escapeHTML(),
			description: yup
				.string()
				.required(Validation.RequiredValidation("Description"))
				.escapeHTML(),
		})
		.required(),
});

export const signInSchema = yup
	.object({
		username: yup
			.string()
			.trim()
			.required(Validation.RequiredValidation("Username"))
			.min(3, Validation.StringMinLength("Username", 3))
			.max(20, Validation.StringMaxLength("Username", 20))
			.matches(/^[0-9a-zA-Z-_]+$/, errorString.usernameInvalid)
			.escapeHTML(),
		password: yup
			.string()
			.trim()
			.required(Validation.RequiredValidation("Password"))
			.min(3, Validation.StringMinLength("Password", 3))
			.max(20, Validation.StringMaxLength("Password", 20))
			.matches(/^[0-9a-zA-Z!@#$%^&*]+$/, errorString.passwordInvalid)
			.escapeHTML(),
	})
	.required();

export const signUpSchema = yup
	.object({
		username: yup
			.string()
			.trim()
			.required(Validation.RequiredValidation("Username"))
			.min(3, Validation.StringMinLength("Username", 3))
			.max(20, Validation.StringMaxLength("Username", 20))
			.matches(/^[0-9a-zA-Z-_]+$/, errorString.usernameInvalid)
			.escapeHTML(),
		email: yup
			.string()
			.trim()
			.required(Validation.RequiredValidation("Email"))
			.email(errorString.emailInvalid)
			.escapeHTML(),
		password: yup
			.string()
			.trim()
			.required(Validation.RequiredValidation("Password"))
			.min(3, Validation.StringMinLength("Password", 3))
			.max(20, Validation.StringMaxLength("Password", 20))
			.matches(/^[0-9a-zA-Z!@#$%^&*]+$/, errorString.passwordInvalid)
			.escapeHTML(),
		confirmPassword: yup
			.string()
			.trim()
			.required(Validation.RequiredValidation("Confirm Password"))
			.oneOf(
				[yup.ref("password")],
				"Confirm password does not match password"
			)
			.escapeHTML(),
	})
	.required();

export const changePasswordSchema = yup
	.object({
		oldPassword: yup
			.string()
			.trim()
			.required(Validation.RequiredValidation("Current password"))
			.min(3, Validation.StringMinLength("Current password", 3))
			.max(20, Validation.StringMaxLength("Current password", 20))
			.matches(/^[0-9a-zA-Z!@#$%^&*]+$/, errorString.passwordInvalid)
			.escapeHTML(),
		newPassword: yup
			.string()
			.trim()
			.required(Validation.RequiredValidation("New password"))
			.min(3, Validation.StringMinLength("New password", 3))
			.max(20, Validation.StringMaxLength("New password", 20))
			.matches(/^[0-9a-zA-Z!@#$%^&*]+$/, errorString.passwordInvalid)
			.escapeHTML(),
		confirmPassword: yup
			.string()
			.trim()
			.required(Validation.RequiredValidation("Confirm password"))
			.oneOf(
				[yup.ref("newPassword")],
				"Confirm password does not match new password"
			)
			.escapeHTML(),
	})
	.required();

export const followSchema = yup
	.object({
		follow: yup
			.string()
			.trim()
			.length(24, errorString.not_mongo_objectid)
			.matches(/^[0-9a-f]$/, errorString.not_mongo_objectid)
			.escapeHTML(),
		unfollow: yup
			.string()
			.trim()
			.length(24, errorString.not_mongo_objectid)
			.matches(/^[0-9a-f]$/, errorString.not_mongo_objectid)
			.escapeHTML(),
	})
	.required();

export const commentSchema = yup
	.object({
		content: yup.string().required().escapeHTML(),
	})
	.required();
