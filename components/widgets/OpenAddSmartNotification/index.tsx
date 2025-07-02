/* * */

import { Section } from '@/components/common/layout/Section'; ;
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { ListItem, Text } from '@rn-vui/themed';
import { IconNotification } from '@tabler/icons-react-native';
import { router } from 'expo-router';
import { View } from 'react-native';

import styles from './styles';

/* * */

interface Props {
	disabled: boolean
	heading: string
	subheading: string
}

export const OpenAddSmartNotification = ({ disabled, heading, subheading }: Props) => {
	//

	//
	// A. Setup Variables

	const openAddSmartNotificationStyles = styles();
	const linesDetailContext = useLinesDetailContext();

	//
	// B. Handle Actions

	//
	// C. Render Components

	return (
		<View style={{ marginBottom: 30 }}>
			<Section
				heading={heading}
				subheading={subheading}
			/>
			<ListItem disabled={disabled} disabledStyle={openAddSmartNotificationStyles.disabled} onPress={() => router.push(`/addSmartNotification/?LineId=${linesDetailContext.data.line?.id}`)}>
				<IconNotification color="#E64B23" size={24} />
				<ListItem.Content>
					<ListItem.Title style={openAddSmartNotificationStyles.listTitle}>
						<Text>Ativar Notificações</Text>
					</ListItem.Title>
				</ListItem.Content>
				<ListItem.Chevron />
			</ListItem>
		</View>
	);

	//
};
