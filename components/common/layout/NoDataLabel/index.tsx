/* * */

import { Surface } from '@/components/common/layout/Surface';
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
export function NoDataLabel({ text }: NoDataLabelProps) {
	//

	//
	// A. Setup variables

	const { t } = useTranslation('translation', { keyPrefix: 'layout.NoDataLabel' });
	const noDataLabelStyles = styles();

	//
	// B. Render Components

	return (
		<Surface>
			<View style={noDataLabelStyles.wrapper}>
				<Text style={noDataLabelStyles.headerEmoji}>✨</Text>
				<Text style={noDataLabelStyles.text}>{text || t('default')}</Text>
			</View>
		</Surface>
	);

	//
}
