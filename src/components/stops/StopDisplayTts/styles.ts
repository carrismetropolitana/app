import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

export const styles = () => {
	//

	//
	// A. Render Components

	return StyleSheet.create({
		icon: {

			color: theming.colorSystemText300,
		},

		isPlaying: {
			color: theming.colorSystemText200,
		},
	});
	//
};
