import { NEWS_URL } from "../constants";

export const getNews = async (): Promise<NewsData[]> => {
	const response = await fetch(NEWS_URL);
	return await response.json();
};
