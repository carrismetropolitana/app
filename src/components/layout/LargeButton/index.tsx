/* * */

import { Text, TouchableOpacity } from 'react-native';

import { useStyles } from './styles';

/* * */

interface LargeButtonProps {
	disabled?: boolean
	label: string
	onPress: () => void
	type: 'danger' | 'primary' | 'secondary'
}

/* * */

export function LargeButton({ disabled, label, onPress, type = 'primary' }: LargeButtonProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	//
	// B. Handle actions

	const handlePress = () => {
		if (disabled) return;
		onPress();
	};

	//
	// C. Render components

	if (type === 'secondary') {
		return (
			<TouchableOpacity disabled={disabled} onPress={handlePress}>
				<Text style={[styles.button, styles.typeSecondary, disabled && styles.stateDisabled]}>{label}</Text>
			</TouchableOpacity>
		);
	}

	if (type === 'danger') {
		return (
			<TouchableOpacity disabled={disabled} onPress={handlePress}>
				<Text style={[styles.button, styles.typeDanger, disabled && styles.stateDisabled]}>{label}</Text>
			</TouchableOpacity>
		);
	}

	return (
		<TouchableOpacity disabled={disabled} onPress={handlePress}>
			<Text style={[styles.button, styles.typePrimary, disabled && styles.stateDisabled]}>{label}</Text>
		</TouchableOpacity>
	);

	//
}
