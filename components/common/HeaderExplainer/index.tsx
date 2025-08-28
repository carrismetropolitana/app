/* * */
import { VideoExplainer } from '@/components/common/VideoExplainer';
import { Text } from '@rn-vui/themed';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import styles from './styles';

/* * */

interface Props {
	heading: string
	subheading: string
}

/* * */
export const HeaderExplainer = ({ heading, subheading }: Props) => {
	//

	//
	// A. Setup Variables

	const headerExplainerStyles = styles();
	const { t } = useTranslation('translation', { keyPrefix: 'common.headerExplainer' });

	//
	// B. Render Componnent

	return (
		<>
			<View style={headerExplainerStyles.firstHeader}>
				<Text accessibilityHint={t('headingAccessibilityHint')} accessibilityLabel={t('headingAccessibilityLabel')} accessibilityRole="header" style={headerExplainerStyles.heading}>{heading}</Text>
				<Text accessibilityHint={t('')} accessibilityLabel={t('')} accessibilityRole="text" style={headerExplainerStyles.subheading}>{subheading}</Text>
			</View>
			<VideoExplainer />
		</>
	);
	//
};
