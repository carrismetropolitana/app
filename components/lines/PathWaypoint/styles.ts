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

	const containerBase = {
		flex: 1,
		flexDirection: 'row' as const,
		gap: theming.sizeSpacing10,
		padding: theming.sizeSpacing20,
	};

	/* * */
	/* CONTAINER */
	const container = {
		...containerBase,
	};

	//
	// B. Render Components

	return StyleSheet.create({
		container: {
			...container,
		},
		isFirstStop: {
			...containerBase,
			paddingTop: theming.sizeSpacing20,
		},
		isLastStop: {
			...containerBase,
			paddingBottom: theming.sizeSpacing20,
		},
		isSelected: {
			...containerBase,
			backgroundColor,
			elevation: 4,
			shadowColor: '#000',
			shadowOffset: { height: 0, width: 0 },
			shadowOpacity: 0.15,
			shadowRadius: 30,
			zIndex: 10,
		},
		/* * */
		/* DETAILS WRAPPER */
		detailsWrapper: {
			flex: 1,
			flexDirection: 'column',
			gap: theming.sizeSpacing15,
			paddingBottom: theming.sizeSpacing15,
			paddingTop: theming.sizeSpacing20,

		},
	});

	//
};
