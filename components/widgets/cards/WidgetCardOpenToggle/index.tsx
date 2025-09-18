/* * */

import { useSystemVariables } from '@/theme/global';
import { IconChevronDown, IconChevronLeft } from '@tabler/icons-react-native';
import { TouchableOpacity, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface WidgetCardOpenToggleProps {
	isOpen: boolean
	onToggle: () => void
}

/* * */

export function WidgetCardOpenToggle({ isOpen, onToggle }: WidgetCardOpenToggleProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();
	const systemVariables = useSystemVariables();

	//
	// B. Render components

	return (
		<TouchableOpacity onPress={onToggle}>
			<View style={styles.container}>
				{isOpen
					? <IconChevronDown color={systemVariables.text[300]} size={28} />
					: <IconChevronLeft color={systemVariables.text[300]} size={28} />}
			</View>
		</TouchableOpacity>
	);

	//
}
