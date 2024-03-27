export const formatDate = (date: Date) => {
	const d = new Date(date);
	const pad = (num: number) => (num < 10 ? `0${num}` : num);
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}:${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};
