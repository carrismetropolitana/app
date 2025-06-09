import type { FeatureCollection, Point, Position } from 'geojson';

import { MapViewRef } from '@maplibre/maplibre-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as turf from '@turf/turf';
import React, { createContext, useContext, useEffect, useState } from 'react';

const ASYNC_STORAGE_KEYS = {
	viewport_height: 'map|viewport_height',
};

const DEFAULT_OPTIONS = {
	viewport_height: { max: 600, min: 300 },
};

// Extend MapViewRef to include setCamera
interface ExtendedMapViewRef extends MapViewRef {
	fitBounds(coordinates: Position, coordinates1: Position, arg2: { padding: number }): unknown
	setCamera: (options: {
		animationDuration: number
		centerCoordinate: [number, number]
		zoom: number
	}) => void
}

interface MapOptionsContextState {
	actions: {
		centerMap: (coordinates: [number, number][]) => void
		setMap: (map: ExtendedMapViewRef) => void
		setStyle: (value: MapStyle) => void
		setViewportHeight: (value: number) => void
	}
	data: {
		map: ExtendedMapViewRef | undefined
		style: string
		viewport_height: null | number
	}
	flags: {
		is_loading: boolean
	}
}

const MapOptionsContext = createContext<MapOptionsContextState | undefined>(undefined);

export function useMapOptionsContext() {
	const context = useContext(MapOptionsContext);
	if (!context) {
		throw new Error('useMapOptionsContext must be used within a MapOptionsContextProvider');
	}
	return context;
}

export const MapOptionsContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [dataViewportHeightState, setDataViewportHeightState] = useState<MapOptionsContextState['data']['viewport_height']>(null);
	const [dataStyleState, setDataStyleState] = useState<MapOptionsContextState['data']['style']>('map');
	const [dataMapState, setDataMapState] = useState<ExtendedMapViewRef | undefined>(undefined);

	useEffect(() => {
		const getViewportHeight = async () => {
			try {
				const storedHeight = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.viewport_height);
				if (storedHeight !== null) {
					setDataViewportHeightState(Number(storedHeight));
				}
			}
			catch (error) {
				console.error('Error reading viewport height from storage', error);
			}
		};
		getViewportHeight();
	}, []);

	useEffect(() => {
		const saveViewportHeight = async () => {
			if (dataViewportHeightState === null) return;
			try {
				await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.viewport_height, String(dataViewportHeightState));
			}
			catch (error) {
				console.error('Error saving viewport height to storage', error);
			}
		};
		saveViewportHeight();
	}, [dataViewportHeightState]);

	const setViewportHeight = (value: number) => {
		if (value < DEFAULT_OPTIONS.viewport_height.min) value = DEFAULT_OPTIONS.viewport_height.min;
		if (value > DEFAULT_OPTIONS.viewport_height.max) value = DEFAULT_OPTIONS.viewport_height.max;
		setDataViewportHeightState(value);
	};

	const setStyle = (value: MapStyle) => {
		setDataStyleState(value);
	};

	const setMap = (map: ExtendedMapViewRef) => {
		setDataMapState(map);
	};

	const centerMap = (coordinates: [number, number][]) => {
		if (!dataMapState || !coordinates.length) return;

		const featureCollection: FeatureCollection<Point> = {
			features: coordinates.map(coord => ({
				geometry: {
					coordinates: coord,
					type: 'Point',
				},
				properties: {},
				type: 'Feature',
			})),
			type: 'FeatureCollection',
		};

		const bbox = turf.bbox(featureCollection);
		// Derive center from bbox.
		const [minLng, minLat, maxLng, maxLat] = bbox;
		const center: [number, number] = [(minLng + maxLng) / 2, (minLat + maxLat) / 2];
		const zoom = 10;

		dataMapState.setCamera({
			animationDuration: 1000,
			centerCoordinate: center,
			zoom,
		});
	};

	const contextValue: MapOptionsContextState = {
		actions: {
			centerMap,
			setMap,
			setStyle,
			setViewportHeight,
		},
		data: {
			map: dataMapState,
			style: dataStyleState,
			viewport_height: dataViewportHeightState,
		},
		flags: {
			is_loading: false,
		},
	};

	// E. Render the context provider
	return (
		<MapOptionsContext.Provider value={contextValue}>
			{children}
		</MapOptionsContext.Provider>
	);
};
