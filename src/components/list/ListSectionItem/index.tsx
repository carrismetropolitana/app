/* * */

import { SafePressable } from '@/components/common/SafePressable';
import { useSystemVariables } from '@/theme/global';
import { IconChevronRight } from '@tabler/icons-react-native';
import { type Href, useRouter } from 'expo-router';
import { type ReactNode } from 'react';
import { Text, View } from 'react-native';

import { useStyles } from './styles';

/* * */

export interface ListSectionItemProps {
	accessibilityHint?: string
	accessibilityLabel?: string
	accessibilityLanguage?: string
	description?: string
	disabled?: boolean
	icon?: ReactNode
	key: string
	label: string
	link?: Href
	onPress?: () => void
	replaceChevron?: ReactNode
	size?: 'md' | 'sm'
}

/* * */

export function ListSectionItem({ accessibilityHint, accessibilityLabel, accessibilityLanguage, description, disabled, icon, label, link, onPress, replaceChevron, size = 'md' }: ListSectionItemProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();
	const systemVariables = useSystemVariables();

	const router = useRouter();

	//
	// B. Handle actions

	const handlePress = () => {
		if (disabled) return;
		if (link) router.push(link);
		else if (onPress) onPress();
	};

	//
	// C. Render components

	return (
		<SafePressable
			accessibilityHint={accessibilityHint}
			accessibilityLabel={accessibilityLabel}
			accessibilityLanguage={accessibilityLanguage}
			disabled={disabled}
			onPress={handlePress}
			style={[styles.container, disabled && styles.containerDisabled]}
		>
			{icon && <View style={styles.icon}>{icon}</View>}
			<View style={styles.contentWrapper}>
				<Text style={[styles.label, description ? styles.labelSm : (size === 'md' ? styles.labelMd : styles.labelSm)]}>{label}</Text>
				{!!description && <Text style={styles.description}>{description}</Text>}
			</View>
			{replaceChevron ? replaceChevron : <IconChevronRight color={systemVariables.text[400]} size={24} />}
		</SafePressable>
	);

	//
}
