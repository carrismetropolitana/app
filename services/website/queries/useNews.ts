import { useQuery } from '@tanstack/react-query';

import { getNews } from '../fetchers/news';

export const useWebsiteNews = () =>
	useQuery({
		queryFn: getNews,
		queryKey: ['websiteNews'],
	});
