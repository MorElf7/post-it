import bcrypt from "bcrypt";
import localStrategy from "passport-local";
import User from "../models/user";

export default function (passport) {
	passport.use(
		new localStrategy((username, password, done) => {
			User.findOne({ username: username }, (err, user) => {
				if (err) return done(err);
				if (!user)
					return done(null, false, {
						status: 401,
						message: "Incorrect username or password",
					});
				bcrypt.compare(password, user.password, (err, result) => {
					if (err) return done(err);
					if (result === true) {
						return done(null, user);
					} else {
						return done(null, false, {
							status: 401,
							message: "Incorrect username or password",
						});
					}
				});
			});
		})
	);

	passport.serializeUser((user, cb) => {
		cb(null, user.id);
	});
	passport.deserializeUser((id, cb) => {
		User.findOne({ _id: id }, (err, user) => {
			const userInformation = {
				_id: user._id,
				username: user.username,
				email: user.email,
				avatar: user.avatar,
				follows: user.follows,
				bio: user.bio,
				posts: user.posts,
				joinedAt: user.joinedAt,
			};
			cb(err, userInformation);
		});
	});
}
