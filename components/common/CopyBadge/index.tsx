/* * */

import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { copyBadgeStyles } from './styles';

/* * */

interface Props {
	hasBorder?: boolean
	label?: string
	size?: 'lg' | 'md'
	value: number | string
}

/* * */

export function CopyBadge({ hasBorder = true, label, size = 'md', value }: Props) {
	//

	//
	// A. Setup variables

	const [validClipboard, setValidClipboard] = useState<boolean>(false);

	const styles = [
		hasBorder && copyBadgeStyles.hasBorder,
		size === 'lg' && copyBadgeStyles.sizeLg,
		size === 'md' && copyBadgeStyles.sizeMd,
	];

	//
	// B. Handle actions

	const handleCopy = async (value: number | string) => {
		try {
			await Clipboard.setStringAsync(value.toString());
			const readClipboard = await Clipboard.getStringAsync();
			setValidClipboard(readClipboard === value.toString());
		}
		catch (error) {
			console.error('Failed to copy to clipboard:', error);
			setValidClipboard(false);
		}
	};

	//
	// B. Render components

	return (

		<TouchableOpacity onPress={() => handleCopy(value)} style={[copyBadgeStyles.container, styles]}>
			<Text style={copyBadgeStyles.text}>{validClipboard ? 'Copied' : label ? label : value}</Text>
		</TouchableOpacity>
	);

	//
}
