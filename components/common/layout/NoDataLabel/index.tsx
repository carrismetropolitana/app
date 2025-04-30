/* * */

import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

/* * */

interface NoDataLabelProps {
	fill?: boolean
	text?: string
	withMinHeight?: boolean
}

/* * */
export function NoDataLabel({ fill, text, withMinHeight }: NoDataLabelProps) {
	//

	//
	// A. Setup variables

	const { t } = useTranslation('translation', { keyPrefix: 'layout.NoDataLabel' });

	const styles = StyleSheet.create({
		container: {
			flex: 1,
			flexDirection: 'row',
			marginTop: '100%',
			opacity: 0.15,
			textTransform: 'uppercase',
		},
		fill: {
			height: '100%',
			justifyContent: 'center',
			textAlign: 'center',
			width: '100%',
		},
		text: {
			fontSize: 20,
			fontWeight: 'bold',
			letterSpacing: 1,
			textAlign: 'center',
		},
		withMinHeight: {
			padding: 30,
		},
	});

	const containerStyle = [
		styles.container,
		fill && styles.fill,
		withMinHeight && styles.withMinHeight,
	];

	//
	// B. Render Components

	return (
		<View style={containerStyle}>
			<Text style={styles.text}>{text || t('default')}</Text>
		</View>
	);

	//
}
