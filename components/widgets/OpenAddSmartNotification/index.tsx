/* * */

import { Section } from '@/components/common/layout/Section'; ;
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { ListItem, Text } from '@rn-vui/themed';
import { IconNotification } from '@tabler/icons-react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import styles from './styles';

/* * */

interface Props {
	disabled: boolean
	heading: string

	patternId?: string
	subheading: string
}

export const OpenAddSmartNotification = ({ disabled, heading = '', patternId, subheading = '' }: Props) => {
	//

	//
	// A. Setup variables

	const openAddSmartNotificationStyles = styles();
	const linesDetailContext = useLinesDetailContext();
	const { t } = useTranslation('translation', { keyPrefix: 'common' });

	//
	// C. Render Components

	return (
		<View style={{ marginBottom: 30, marginTop: 10 }}>
			<View
				accessibilityHint={t('openAddSmartNotificationAccessibilityHint')}
				accessibilityLabel={t('openAddSmartNotificationAccessibilityLabel')}
				accessibilityRole="text"
				style={openAddSmartNotificationStyles.sectionContainer}
			>
				<Section heading={heading} subheading={subheading} />
			</View>
			<ListItem
				disabled={disabled}
				disabledStyle={openAddSmartNotificationStyles.disabled}
				onPress={() =>
					patternId ? router.push(`/addSmartNotification?patternId=${patternId}`) : router.push(`/addSmartNotification?lineId=${linesDetailContext.data.line?.id}`)}
			>
				<IconNotification color="#E64B23" size={24} />
				<ListItem.Content>
					<ListItem.Title style={openAddSmartNotificationStyles.listTitle}>
						<Text>{t('enable_notifications')}</Text>
					</ListItem.Title>
				</ListItem.Content>
			</ListItem>

		</View>
	);

	//
};
