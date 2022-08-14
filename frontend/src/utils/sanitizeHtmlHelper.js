import sanitizeHtml from "sanitize-html";

export default function (value, originalValue) {
	return this.isType(value) && value !== null ? sanitizeHtml(value) : value;
}
