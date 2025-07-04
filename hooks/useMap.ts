import { MapContext } from '@/contexts/Map.context';
import { useContext } from 'react';

export function useMap() {
	const { mapInstance } = useContext(MapContext);
	return mapInstance;
}
