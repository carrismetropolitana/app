// Typed map view; takes in typed props for vehicles, stops and shapes

import type { ApiTypes } from "@/services/api/types";

interface TypedMapViewProps {
	vehicles?: ApiTypes.Vehicle[];
	stops?: ApiTypes.Stop[];
	shapes?: ApiTypes.Shape[];
}

export const TypedMapView = ({
	vehicles,
	stops,
	shapes,
}: TypedMapViewProps) => {};
