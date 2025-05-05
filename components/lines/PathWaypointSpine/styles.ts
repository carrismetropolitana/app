import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		paddingVertical: theming.sizeSpacing20,
		width: 16,
	},
	containerFirstStop: {
		borderTopLeftRadius: 999,
		borderTopRightRadius: 999,
		paddingVertical: 0,
	},
	containerFirstStopSelected: {
		paddingVertical: 0,
	},
	containerLastStop: {
		alignSelf: 'flex-start',
		borderBottomLeftRadius: 999,
		borderBottomRightRadius: 999,
		paddingBottom: 1,
	},
	containerLastStopSelected: {
		paddingBottom: 0,
	},
	containerSelected: {
		paddingVertical: theming.sizeSpacing20,
	},

	marker: {
		aspectRatio: 1,
		borderRadius: 999,
		margin: 6,
		width: 10,
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
});
