import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "expo-router";

// more like useFocusedVehicles
export const useVehicles = () => {
	const isFocused = useNavigation().isFocused();

	return useQuery({
		queryKey: ["vehicles"],
		queryFn: async () => {
			console.log("Fetching vehicles...");
			const response = await fetch(
				"https://api.carrismetropolitana.pt/v2/vehicles",
			);
			const vehicles = await response.json();
			console.log(`Fetched ${vehicles.length} vehicles`);
			return vehicles;
		},
		refetchInterval: 5000,
		enabled: isFocused,
	});
};
