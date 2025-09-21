/* * */

import { useSystemVariables } from '@/theme/global';
import { IconChevronRight } from '@tabler/icons-react-native';
import { useRouter } from 'expo-router';
import { type ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { useStyles } from './styles';

/* * */

export interface ListSectionItemProps {
	icon?: ReactNode
	key: string
	label: string
	link?: string
	onPress?: () => void
	replaceChevron?: ReactNode
}

/* * */

export function ListSectionItem({ icon, label, link, onPress, replaceChevron }: ListSectionItemProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();
	const systemVariables = useSystemVariables();

	const router = useRouter();

	//
	// B. Handle actions

	const handlePress = () => {
		if (link) router.push(link);
		else if (onPress) onPress();
	};

	//
	// C. Render components

	return (
		<TouchableOpacity onPress={handlePress} role="listitem" style={styles.container}>
			{icon && <View style={styles.icon}>{icon}</View>}
			<View style={{ flex: 1 }}>
				<Text style={styles.label}>{label}</Text>
			</View>
			{replaceChevron ? replaceChevron : <IconChevronRight color={systemVariables.text[400]} size={24} />}
		</TouchableOpacity>
	);

	//
}
