/* * */

import { Text, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface ListFootnoteProps {
	text: string
}

/* * */

export function ListFootnote({ text }: ListFootnoteProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	//
	// B. Render components

	return (
		<View style={styles.container}>
			<Text style={styles.text}>{text}</Text>
		</View>
	);

	//
}
