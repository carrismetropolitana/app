/* * */

import { useSystemVariables } from '@/theme/global';
import { IconCaretDownFilled, IconCaretLeftFilled } from '@tabler/icons-react-native';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface WidgetCardOpenToggleProps {
	isOpen: boolean
}

/* * */

export function WidgetCardOpenToggle({ isOpen }: WidgetCardOpenToggleProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();
	const systemVariables = useSystemVariables();

	//
	// B. Render components

	return (
		<View style={styles.container}>
			{isOpen
				? <IconCaretDownFilled color={systemVariables.text[400]} size={28} />
				: <IconCaretLeftFilled color={systemVariables.text[400]} size={28} />}
		</View>
	);

	//
}
