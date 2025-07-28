/* * */

import { Section } from '@/components/common/layout/Section';
import { AddWidgetListItem } from '@/components/screens/ProfileScreen/AddWidgetListItem';
import { IconArrowLoopRight, IconBellRinging, IconBusStop } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import styles from './styles';

/* * */

export const AddWidgetList = () => {
	//

	//
	// A. Setup Variables

	const addWidgetListStyles = styles();
	const { t } = useTranslation('translation', { keyPrefix: 'profile' });
	//
	// B. Render Components

	return (
		<View style={addWidgetListStyles.addFavoritesSection}>
			<Section heading={t('addNewWidgetSectionTitle')} />
			<AddWidgetListItem icon={<IconBusStop color="#FF6900" size={24} />} label={t('addWidgetStopListItemTitle')} route="/addFavoriteStop" />
			<AddWidgetListItem icon={<IconArrowLoopRight color="#C61D23" size={24} />} label={t('addWidgetLineListItemTitle')} route="/addFavoriteLine" />
			<AddWidgetListItem icon={<IconBellRinging color="#0C807E" size={24} />} label={t('addWidgetSmartNotificationListItemTitle')} route="/addSmartNotification" />
		</View>
	);
};
