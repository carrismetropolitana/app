/* * */

import { Text, TextInput, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface TextInputFieldProps {
	accessibilityLabel?: string
	description?: string
	label?: string
	onChange: (value: string) => void
	placeholder?: string
	value: null | string | undefined
	withBorderBottom?: boolean
	withBorderTop?: boolean
}

/* * */

export function TextInputField({ accessibilityLabel, description, label, onChange, placeholder, value, withBorderBottom, withBorderTop }: TextInputFieldProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	//
	// B. Render components

	return (
		<View style={[
			styles.container,
			withBorderBottom && styles.withBorderBottom,
			withBorderTop && styles.withBorderTop,
		]}
		>
			{label && <Text accessible={false} style={styles.label}>{label}</Text>}
			{description && <Text accessible={false} style={styles.description}>{description}</Text>}
			<TextInput
				accessibilityLabel={accessibilityLabel}
				onChangeText={onChange}
				placeholder={placeholder}
				returnKeyType="done"
				style={styles.input}
				value={value ?? ''}
			/>
		</View>
	);

	//
};
