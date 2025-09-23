/* * */

import { useSystemVariables } from '@/theme/global';
import { IconChevronRight } from '@tabler/icons-react-native';
import { useRouter } from 'expo-router';
import { type ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { useStyles } from './styles';

/* * */

export interface ListSectionItemProps {
	description?: string
	icon?: ReactNode
	key: string
	label: string
	link?: string
	onPress?: () => void
	replaceChevron?: ReactNode
	size?: 'md' | 'sm'
}

/* * */

export function ListSectionItem({ description, icon, label, link, onPress, replaceChevron, size = 'md' }: ListSectionItemProps) {
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

	if (label && description) {
		return (
			<TouchableOpacity onPress={handlePress} role="listitem" style={styles.container}>
				{icon && <View style={styles.icon}>{icon}</View>}
				<View style={styles.contentWrapper}>
					<Text style={[styles.label, styles.labelSm]}>{label}</Text>
					<Text style={styles.description}>{description}</Text>
				</View>
				{replaceChevron ? replaceChevron : <IconChevronRight color={systemVariables.text[400]} size={24} />}
			</TouchableOpacity>
		);
	}

	return (
		<TouchableOpacity onPress={handlePress} role="listitem" style={styles.container}>
			{icon && <View style={styles.icon}>{icon}</View>}
			<View style={styles.contentWrapper}>
				<Text style={[styles.label, size === 'md' ? styles.labelMd : styles.labelSm]}>{label}</Text>
			</View>
			{replaceChevron ? replaceChevron : <IconChevronRight color={systemVariables.text[400]} size={24} />}
		</TouchableOpacity>
	);

	//
}
