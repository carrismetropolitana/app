/* * */

import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	return StyleSheet.create({
		marker: {
			aspectRatio: 1,
			borderRadius: 999,
			margin: 6,
			width: 5,
		},
		markerDisabled: {
			aspectRatio: 1,
			borderRadius: 999,
			margin: 6,
			width: 5,
		},
		markerFavorite: {
			margin: 3,
			marginTop: 0,
			transform: [{ translateY: -3 }],
		},
		markerFirstStop: {
			transform: [{ translateY: 2 }],
		},
		markerFirstStopFavorite: {
			transform: [],
		},
		markerFirstStopNext: {
			display: 'none',
		},
		markerLastStopNext: {
			aspectRatio: 1,
			backgroundColor: '#000000',
			borderRadius: 999,
			margin: 3,
			transform: [{ translateY: 0 }],
		},
		markerMiddleNext: {
			aspectRatio: 1,
			borderRadius: 999,
			margin: 6,
			width: 10,
		},
		markerNext: {
			aspectRatio: 1,
			backgroundColor: '#000000',
			borderRadius: 999,
			margin: 3,
			transform: [{ translateY: -3 }],
		},
		markerSelected: {
			margin: 4,
		},
		stopSequence: {
			aspectRatio: 1,
			borderRadius: 999,
			fontSize: 12,
			fontWeight: '800',
			margin: 0,
			textAlign: 'left',
			transform: [{ translateY: 2 }],
			width: '100%',
		},
		stopSequenceFirstStop: {
			transform: [{ translateY: 6 }],
		},
		stopSequenceLastStop: {
			transform: [{ translateY: -6 }],
		},
		topChevron: {
			backgroundColor: '#000000',
			borderRadius: 999,
		},
	});
};
