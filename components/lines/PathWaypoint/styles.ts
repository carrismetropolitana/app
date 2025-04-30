import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

export const styles = () => {
	//

	//
	// A. Setup variables

	const { theme } = useThemeContext();
	const isLight = theme.mode === 'light';
	const backgroundColor = isLight
		? theming.colorSystemBackgroundLight200
		: theming.colorSystemBackgroundDark200;
	const fontColor = isLight
		? theming.colorSystemText100
		: theming.colorSystemText300;

	/* * */
	/* CONTAINER */
	const container = {
		gap: theming.sizeSpacing10,
		padding: theming.sizeSpacing20,
	};
	//
	// B. Render Components

	return StyleSheet.create({
		container: {
			...container,
		},
		isFirstStop: {
			...container,
			paddingTop: theming.sizeSpacing20,
		},
		isLastStop: {
			...container,
			paddingBottom: theming.sizeSpacing20,
		},
		isSelected: {
			...container,
			backgroundColor: backgroundColor,
			boxShadow: '0 0 30 0 rgba(0, 0, 0, 0.15)',
			zIndex: 10,
		},
		/* * */
		/* DETAILS WRAPPER */
		detailsWrapper: {
			display: 'flex',
			flexDirection: 'column',
			gap: theming.sizeSpacing15,
			paddingBottom: theming.sizeSpacing15,
			paddingTop: theming.sizeSpacing20,
		},

		// .isFirstStop .detailsWrapper {
		// 	paddingTop: 2px;
		// }

		// .isFirstStop.isSelected .detailsWrapper {
		// 	paddingTop: 2px;
		// }

		// .isSelected .detailsWrapper {
		// 	padding: theming.sizeSpacing20;
		// }

	});

	//
};
