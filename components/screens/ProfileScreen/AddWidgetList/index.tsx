/* * */

import { Section } from '@/components/common/layout/Section';
import { AddWidgetListItem } from '@/components/screens/ProfileScreen/AddWidgetListItem';
import { IconArrowLoopRight, IconBellRinging, IconBusStop } from '@tabler/icons-react-native';
import { View } from 'react-native';

import styles from './styles';

/* * */

export const AddWidgetList = () => {
	//

	//
	// A. Setup Variables

	const addWidgetListStyles = styles();
	//
	// B. Render Components

	return (
		<View style={addWidgetListStyles.addFavoritesSection}>
			<Section heading="Adicionar novo widget" />
			<AddWidgetListItem icon={<IconBusStop color="#FF6900" size={24} />} label="Paragem Favorita" route="/addFavoriteStop" />
			<AddWidgetListItem icon={<IconArrowLoopRight color="#C61D23" size={24} />} label="Linha Favorita" route="/addFavoriteLine" />
			<AddWidgetListItem icon={<IconBellRinging color="#0C807E" size={24} />} label="Notificações Inteligentes" route="/addSmartNotification" />
		</View>
	);
};
