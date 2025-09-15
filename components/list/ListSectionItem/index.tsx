/* * */

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

	const router = useRouter();

	//
	// B. Handle actions

	const handlePress = () => {
		if (link) router.push(link);
		else if (onPress) onPress();
	};

	//
	// B. Render components

	return (
		<TouchableOpacity onPress={handlePress} role="listitem" style={useStyles().container}>
			{icon && <View style={useStyles().icon}>{icon}</View>}
			<View style={{ flex: 1 }}>
				<Text style={useStyles().label}>{label}</Text>
			</View>
			{replaceChevron ? replaceChevron : <IconChevronRight color="#C0C0C8" size={24} />}
		</TouchableOpacity>
	);

	//
}
