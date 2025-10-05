/* * */

import { useSystemVariables } from '@/theme/global';
import { IconHeart, IconHeartFilled } from '@tabler/icons-react-native';
import * as Haptics from 'expo-haptics';
import { TouchableOpacity } from 'react-native';

import { useStyles } from './styles';

/* * */

interface FavoriteToggleProps {
	color?: string
	isActive: boolean | null
	onToggle: () => void
}

/* * */

export function FavoriteToggle({ color, isActive, onToggle }: FavoriteToggleProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();
	const systemVariables = useSystemVariables();

	//
	// B. Handle actions

	const handlePressIn = () => {
		if (!onToggle) return;
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		onToggle();
	};

	//
	// C. Render components

	if (isActive) {
		return (
			<TouchableOpacity onPressIn={handlePressIn} style={styles.container}>
				<IconHeartFilled color={color} size={28} />
			</TouchableOpacity>
		);
	}

	return (
		<TouchableOpacity onPressIn={handlePressIn} style={styles.container}>
			<IconHeart color={systemVariables.text[300]} size={28} />
		</TouchableOpacity>
	);

	//
}
