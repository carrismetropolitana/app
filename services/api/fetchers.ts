import { API_URL } from "./constants";
import type { ApiTypes } from "./types";

export const getStops = async (): Promise<ApiTypes.Stop[]> => {
	const response = await fetch(`${API_URL}/stops`);
	return await response.json();
};
