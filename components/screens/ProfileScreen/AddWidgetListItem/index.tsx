/* * */

import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { ListItem, Text } from '@rn-vui/themed';
import { IconCirclePlus } from '@tabler/icons-react-native';
import { router } from 'expo-router';

import styles from './styles';

/* * */

interface Props {
	icon: React.ReactNode
	label: string
	route: string
}

export const AddWidgetListItem = ({ icon, label, route }: Props) => {
	//

	//
	// A. Setup Variables

	const themeContext = useThemeContext();
	const addWidgetListItemStyles = styles();

	//
	// B. Render Components
	return (
		<ListItem onPress={() => router.push(route)}>
			<Text>{icon}</Text>
			<ListItem.Content><ListItem.Title style={addWidgetListItemStyles.listTitle}><Text>{label}</Text></ListItem.Title></ListItem.Content>
			<IconCirclePlus color={themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight100 : theming.colorSystemBackgroundDark100} fill="#3CB43C" size={24} />
		</ListItem>
	);
};
