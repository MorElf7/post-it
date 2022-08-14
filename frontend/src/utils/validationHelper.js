export function RequiredValidation(label) {
	return `${label} is required`;
}

export function StringMinLength(label, minLength) {
	return `${label} must be at least ${minLength} characters`;
}

export function StringMaxLength(label, maxLength) {
	return `${label} must be at most ${maxLength} characters`;
}

export function escapeHtml(label) {
	return `${label} must not contain HTML`;
}
