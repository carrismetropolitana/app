import { keepPreviousData, useQuery } from '@tanstack/react-query';

export const useLines = () =>
	useQuery({
		placeholderData: keepPreviousData,
		queryFn: async () => {
			const response = await fetch(
				'https://api.carrismetropolitana.pt/v2/lines',
			);
			return response.json();
		},
		queryKey: ['lines'],
		refetchInterval: 180_000,
	});
