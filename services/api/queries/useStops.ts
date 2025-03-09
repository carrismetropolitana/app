import { useQuery } from "@tanstack/react-query";
import { getStops } from "../fetchers";
import { useNavigation } from "expo-router";

export const useStops = ({ needsFocus }: { needsFocus?: boolean }) =>
	useQuery({
		queryKey: ["stops"],
		queryFn: getStops,
		refetchInterval: 300_000,
		enabled: (needsFocus && useNavigation().isFocused()) || !needsFocus,
	});
