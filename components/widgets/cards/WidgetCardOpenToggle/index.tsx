/* * */

import { useSystemVariables } from '@/theme/global';
import { IconChevronDown, IconChevronLeft } from '@tabler/icons-react-native';
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
				? <IconChevronDown color={systemVariables.text[300]} size={28} />
				: <IconChevronLeft color={systemVariables.text[300]} size={28} />}
		</View>
	);

	//
}
