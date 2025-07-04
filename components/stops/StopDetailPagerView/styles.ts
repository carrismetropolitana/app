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
	const fontColor = isLight
		? theming.colorPrimaryBlack
		: theming.colorSystemText300;

	return StyleSheet.create({
		container: { backgroundColor: backgroundColor, flex: 1, height: 300, width: '100%' },
		dot: {
			borderRadius: 5,
			height: 10,
			marginHorizontal: 6,
			width: 10,
		},
		dotActive: { backgroundColor: '#333' },
		dotInactive: { backgroundColor: '#ccc' },
		dotsContainer: {
			flexDirection: 'row',
			justifyContent: 'center',
			paddingVertical: 12,
		},
		image: { borderRadius: 8, height: 300, width: '100%' },
		page: { alignItems: 'center', justifyContent: 'center' },
		pager: { flex: 1, width: '100%' },

	});
};
