/* * */

import { useAccessibilityContext } from '@/contexts/Accessibility.context';
import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();
	const acessibilityContext = useAccessibilityContext();

	return StyleSheet.create({
		container: {
			alignItems: 'center',
			backgroundColor: systemVariables.background[100],
			display: 'flex',
			flexDirection: 'row',
			gap: 20,
			justifyContent: 'space-between',
			padding: 15,
			width: '100%',
		},
		divider: {
			color: systemVariables.text[200],
			fontSize: 18,
			fontWeight: 700,
		},
		input: {
			backgroundColor: systemVariables.background[200],
			borderRadius: 8,
			color: systemVariables.text[100],
			fontSize: 18,
			fontWeight: 600,
			paddingVertical: 8,
			textAlign: 'center',
			width: 50,
		},
		text: {
			color: systemVariables.text[200],
			fontSize: acessibilityContext.flags.screen_reader ? 20 : 18,
			fontWeight: 600,
		},
		wrapper: {
			alignItems: 'center',
			display: 'flex',
			flexDirection: 'row',
			gap: 5,
			justifyContent: 'center',
		},
	});
};
