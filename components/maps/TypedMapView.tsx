// Typed map view; takes in typed props for vehicles, stops and shapes

import type { ApiTypes } from '@/services/api/types';

interface TypedMapViewProps {
	shapes?: ApiTypes.Shape[]
	stops?: ApiTypes.Stop[]
	vehicles?: ApiTypes.Vehicle[]
}

export const TypedMapView = ({
	shapes,
	stops,
	vehicles,
}: TypedMapViewProps) => {};
