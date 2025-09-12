/* * */

import { IconChevronRight } from '@tabler/icons-react-native';
import { useRouter } from 'expo-router';
import { type ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { styles } from './styles';

/* * */

export interface ListSectionItemProps {
	icon?: ReactNode
	key: string
	label: string
	link: string
	replaceChevron?: ReactNode
}

/* * */

export function ListSectionItem({ icon, label, link, replaceChevron }: ListSectionItemProps) {
	//

	//
	// A. Setup variables

	const router = useRouter();

	//
	// B. Render components

	return (
		<TouchableOpacity onPress={() => router.push(link)} role="listitem" style={styles.container}>
			<View style={styles.icon}>{icon}</View>
			<View style={{ flex: 1 }}>
				<Text style={styles.label}>{label}</Text>
			</View>
			{replaceChevron ? replaceChevron : <IconChevronRight color="#C0C0C8" size={24} />}
		</TouchableOpacity>
	);

	//
}
