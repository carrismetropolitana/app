/* * */

import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { styles } from './styles';

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
	const noDataLabelStyles = styles();

	const containerStyle = [
		noDataLabelStyles.container,
		fill && noDataLabelStyles.fill,
		withMinHeight && noDataLabelStyles.withMinHeight,
	];

	//
	// B. Render Components

	return (
		<View style={containerStyle}>
			<Text style={noDataLabelStyles.text}>{text || t('default')}</Text>
		</View>
	);

	//
}
