import { useQuery } from "@tanstack/react-query";
import { getNews } from "../fetchers/news";

export const useWebsiteNews = () =>
	useQuery({
		queryKey: ["websiteNews"],
		queryFn: getNews,
	});
