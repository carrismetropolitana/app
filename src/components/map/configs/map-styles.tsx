/* * */

export type MapStyle = 'map';

interface MapStyleConfig {
	max_zoom: number
	min_zoom: number
	value: string
}

/* * */

export const MAP_STYLES: Record<MapStyle, MapStyleConfig> = {

	map: {
		max_zoom: 18,
		min_zoom: 5,
		value: 'https://maps.carrismetropolitana.pt/styles/default/style.json',
	},

};
