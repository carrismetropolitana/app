import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useLines = () =>
    useQuery({
        queryKey: ["lines"],
        queryFn: async () => {
            const response = await fetch(
                "https://api.carrismetropolitana.pt/v2/lines"
            );
            return response.json();
        },
        refetchInterval: 180_000,
        placeholderData: keepPreviousData,
    });
