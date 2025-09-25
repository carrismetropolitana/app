/* * */

import { Text } from '@rn-vui/themed';
import * as Haptics from 'expo-haptics';
import { Pressable, View } from 'react-native';

import { useStyles } from './styles';

/* * */

export interface SegmentedControlOptionProps {
	icon?: React.ReactNode
	label: string
	value: string
}

interface SegmentedControlProps {
	onChange?: (value: string) => void
	options: SegmentedControlOptionProps[]
	value: string
}

/* * */

export function SegmentedControl({ onChange, options, value }: SegmentedControlProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	//
	// B. Handle actions

	const handlePress = (value: string) => {
		if (!onChange) return;
		onChange(value);
		Haptics.selectionAsync();
	};

	//
	// C. Render components

	return (
		<View style={styles.container}>

			{options.map(option => (
				<Pressable
					key={option.value}
					onPress={() => handlePress(option.value)}
					style={[styles.segment, value === option.value && styles.segmentSelected]}
				>

					{option.icon && <View style={styles.icon}>{option.icon}</View>}

					<Text style={styles.label}>{option.label}</Text>

				</Pressable>
			))}

		</View>
	);

	//
}
