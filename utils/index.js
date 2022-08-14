class ExpressError extends Error {
	constructor(message, statusCode) {
		super();
		this.message = message;
		this.status = statusCode;
	}
}

const wrapAsync = (f) => {
	return (req, res, next) => {
		f(req, res, next).catch(next);
	};
};

export { ExpressError, wrapAsync };
