/* * */

import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

export const styles = () => {
	const { theme } = useThemeContext();
	const isLight = theme.mode === 'light';
	const backgroundColor = isLight
		? theming.colorSystemBackgroundLight200
		: theming.colorSystemBackgroundDark200;

	return StyleSheet.create({
		// CONTAINER
		container: {
			alignItems: 'flex-start',
			backgroundColor: backgroundColor,
			flexDirection: 'column',
			gap: 10,
			justifyContent: 'flex-start',
		},

		// BADGES WRAPPER
		badgesWrapper: {
			alignItems: 'center',
			flexDirection: 'row',
			gap: 5,
			justifyContent: 'flex-start',
		},

		// HEADING WRAPPER
		headingWrapper: {
			alignItems: 'flex-start',
			flexDirection: 'column',
			justifyContent: 'flex-start',
		},

		// NAME WRAPPER
		nameWrapper: {
			alignItems: 'center',
			flexDirection: 'row',
			flexWrap: 'wrap',
			gap: 5,
			justifyContent: 'flex-start',
		},

		// HEADING SECTION / ROW
		headingSectionRow: {
			alignItems: 'center',
			flexDirection: 'row',
			gap: 15,
			justifyContent: 'flex-start',
		},

		// ICONS WRAPPER
		iconsDivider: {
			backgroundColor: '#E0E0E0',
			height: 20,
			minWidth: 2,
		},

		iconsWrapper: {
			alignItems: 'center',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			padding: 20,
			paddingTop: 0,
			width: '100%',
		},
	});
};
