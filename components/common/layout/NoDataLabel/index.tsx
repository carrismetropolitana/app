/* * */

import { Surface } from '@/components/common/layout/Surface';
import { theming } from '@/theme/Variables';
import { IconBusOff } from '@tabler/icons-react-native';
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
				<View style={noDataLabelStyles.headerEmoji}>
					<IconBusOff color={theming.colorBrand} size={30} />
				</View>
				<Text style={noDataLabelStyles.text}>{text || t('default')}</Text>
			</View>
		</Surface>
	);

	//
}
