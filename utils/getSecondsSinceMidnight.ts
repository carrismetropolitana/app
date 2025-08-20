export function getSecondsSinceMidnight(date: Date) {
	return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
}
