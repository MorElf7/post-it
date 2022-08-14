export default function (utcTime) {
	const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const locale = Intl.DateTimeFormat().resolvedOptions().locale;
	return new Date(utcTime).toLocaleString(locale, {
		timeZone: currentTimeZone,
	});
}
