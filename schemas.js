import JoiBase from "joi";
import sanitizeHtml from "sanitize-html";

const extension = (joi) => ({
	type: "string",
	base: joi.string(),
	messages: {
		"string.escapeHTML": "{{#label}} must not include HTML!",
	},
	rules: {
		escapeHTML: {
			validate(value, helpers) {
				const clean = sanitizeHtml(value, {
					allowedTags: [],
					allowedAttributes: {},
				});
				if (clean !== value)
					return helpers.error("string.escapeHTML", { value });
				return clean;
			},
		},
	},
});

const Joi = JoiBase.extend(extension);

export const postSchema = Joi.object({
	image: Joi.object({
		url: Joi.string().allow("").required().escapeHTML(),
		filename: Joi.string().allow("").required().escapeHTML(),
	}),
	post: Joi.object({
		title: Joi.string().required().escapeHTML(),
		description: Joi.string().required().escapeHTML(),
	}).required(),
});

export const userSchema = Joi.object({
	avatar: Joi.object({
		url: Joi.string().allow("").required().escapeHTML(),
		filename: Joi.string().allow("").required().escapeHTML(),
	}),
	user: Joi.object({
		username: Joi.string().alphanum().required().escapeHTML(),
		email: Joi.string().email().required().escapeHTML(),
		bio: Joi.string().allow("").escapeHTML(),
		posts: Joi.array(),
		joinedAt: Joi.date(),
	}).required(),
});

export const changePasswordSchema = Joi.object({
	oldPassword: Joi.string().alphanum().allow("").required().escapeHTML(),
	newPassword: Joi.string().alphanum().allow("").required().escapeHTML(),
});

export const followUserSchema = Joi.object({
	follow: Joi.string().hex().length(24).allow("").escapeHTML(),
	unfollow: Joi.string().hex().length(24).allow("").escapeHTML(),
});

export const signInSchema = Joi.object({
	username: Joi.string()
		.min(3)
		.max(20)
		.pattern(/^[0-9a-zA-Z-_]+$/)
		.required()
		.escapeHTML(),
	password: Joi.string().min(3).max(20).alphanum().required().escapeHTML(),
});

export const signUpSchema = Joi.object({
	username: Joi.string()
		.min(3)
		.max(20)
		.pattern(/^[0-9a-zA-Z-_]+$/)
		.required()
		.escapeHTML(),
	password: Joi.string().min(3).max(20).alphanum().required().escapeHTML(),
	email: Joi.string().email().required().escapeHTML(),
});

export const commentSchema = Joi.object({
	content: Joi.string().required().escapeHTML(),
});
