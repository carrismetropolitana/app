import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

export const styles = () => {
	//

	//
	// A. Render Components

	return StyleSheet.create({
		text: {
			color: theming.colorRealtime100,
		},
		textMuted: {
			color: theming.colorSystemText200,
		},
		vehiclesCounter: {
			alignItems: 'center',
			backgroundColor: '#FFFFFF',
			borderRadius: 999,
			bottom: 0,
			color: theming.colorRealtime100,
			flexDirection: 'row',
			fontSize: 10,
			fontWeight: '600',
			gap: 20,
			height: 32,
			marginBottom: 12,
			marginLeft: 10,
			minWidth: 50,
			paddingHorizontal: 16,
			paddingVertical: 4,
			position: 'absolute',

		},
		zeroCount: {
			alignItems: 'center',
			alignSelf: 'flex-start',
			backgroundColor: '#FFFFFF',
			borderRadius: 999,
			bottom: 0,
			color: theming.colorRealtime100,
			flexDirection: 'row',
			fontSize: 10,
			fontWeight: '600',
			gap: 20,
			height: 32,
			justifyContent: 'center',
			left: 0,
			marginBottom: 12,
			marginLeft: 10,
			minWidth: 50,
			paddingHorizontal: 16,
			paddingVertical: 4,
			position: 'absolute',
		},
		/* * */
	});

	//
};
