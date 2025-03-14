'use client';

/* * */

import { MapViewToolbar } from '@/components/map/MapViewToolbar';
import { useMapOptionsContext } from '@/contexts/MapOptions.context';
import { useMap } from '@/hooks/useMap';
import { IconsMap } from '@/settings/assets.settings';
import { mapDefaultConfig } from '@/settings/map.settings';
import Map, { FullscreenControl, GeolocateControl, Image, NavigationControl, ScaleControl } from '@maplibre/maplibre-react-native';
import { useCallback, useState } from 'react';

import styles from './styles.module.css';

/* * */

const MAP_LOAD_ASSETS = [
	{ name: 'cmet-bus-delay', sdf: false, url: IconsMap.bus_delay },
	{ name: 'cmet-bus-regular', sdf: false, url: IconsMap.bus_regular },
	{ name: 'cmet-bus-error', sdf: false, url: IconsMap.bus_error },
	{ name: 'cmet-pin', sdf: false, url: IconsMap.pin },
	{ name: 'cmet-shape-direction', sdf: true, url: IconsMap.shape_direction },
	{ name: 'cmet-stop-selected', sdf: false, url: IconsMap.stop_selected },
	{ name: 'cmet-store-busy', sdf: false, url: IconsMap.store_busy },
	{ name: 'cmet-store-closed', sdf: false, url: IconsMap.store_closed },
	{ name: 'cmet-store-open', sdf: false, url: IconsMap.store_open },
];

/* * */

export type MapStyle = 'map' | 'satellite';

interface Props {
	children: React.ReactNode
	fullscreen?: boolean
	geolocate?: boolean
	interactiveLayerIds?: string[]
	mapStyle?: MapStyle
	navigation?: boolean
	onCenterMap?: () => void
	onClick?: (event: unknown) => void
	onMoveEnd?: () => void
	onMoveStart?: () => void
	scale?: boolean
	scrollZoom?: boolean
	toolbar?: boolean
}

/* * */

export function MapView({
	children,
	fullscreen = true,
	geolocate = true,
	interactiveLayerIds = [],
	mapStyle,
	navigation = true,
	onCenterMap,
	onClick,
	onMoveEnd,
	onMoveStart,
	scale = false,
	scrollZoom = true,
	toolbar = true,
}: Props) {
	const mapRef = useMap();
	const mapOptionsContext = useMapOptionsContext();
	const [cursor, setCursor] = useState<string>('auto');
	const mapStyleValue = mapStyle ?? mapOptionsContext.data.style;

	const handleMoveStart = useCallback(() => {
		setCursor('grab');
		onMoveStart?.();
	}, [onMoveStart]);

	const handleMoveEnd = useCallback(() => {
		setCursor('auto');
		onMoveEnd?.();
	}, [onMoveEnd]);

	return (
		<div className={styles.container}>
			{toolbar && <MapViewToolbar className={styles.toolbar} onCenterMap={onCenterMap} />}

			<Map
				ref={mapRef}
				attributionEnabled={false}
				initialViewState={mapDefaultConfig.initialViewState}
				onPress={onClick}
				onTouchEnd={handleMoveEnd}
				onTouchStart={handleMoveStart}
				scrollZoom={scrollZoom}
				style={{ height: '100%', width: '100%' }}
				styleUrl={mapDefaultConfig.styles[mapStyleValue]}
			>
				{/* Directly add Image components without Images wrapper */}
				{MAP_LOAD_ASSETS.map(asset => (
					<Image
						key={asset.name}
						image={asset.url}
						name={asset.name}
						sdf={asset.sdf}
					/>
				))}

				{navigation && <NavigationControl />}
				{fullscreen && <FullscreenControl />}
				{geolocate && <GeolocateControl />}
				{scale && <ScaleControl />}

				<div className={styles.childrenWrapper}>
					{children}
				</div>
			</Map>

			<div className={styles.attributionWrapper}>
				<a href="https://maplibre.org/" target="_blank">MapLibre</a>
				<a href="https://www.openmaptiles.org/" target="_blank">© OpenMapTiles</a>
				<a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>
			</div>
		</div>
	);
}
