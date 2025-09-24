/* * */

import { type GeneralStatusMessage } from '@/types/general-status';
import { IconAlertOctagonFilled, IconCircleCheckFilled, IconInfoSquareFilled, IconPlus, IconTrafficCone, IconX } from '@tabler/icons-react-native';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface HomeScreenGeneralStatusItemProps {
	data: GeneralStatusMessage
}

/* * */

export function HomeScreenGeneralStatusItem({ data }: HomeScreenGeneralStatusItemProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const [isExpanded, setIsExpanded] = useState(true);

	const { t } = useTranslation('translation', { keyPrefix: 'home.HomeScreenGeneralStatusItem' });

	//
	// B. Handle actions

	const handlePress = () => {
		setIsExpanded(prev => !prev);
		Haptics.selectionAsync();
	};

	//
	// C. Render components

	return (
		<Pressable onPress={handlePress} style={[styles.container, data.severity && styles[data.severity]]}>
			<View style={styles.row}>
				{data.severity === 'ok' && <IconCircleCheckFilled color="#ffffff" size={24} />}
				{data.severity === 'info' && <IconInfoSquareFilled color="#ffffff" size={24} />}
				{data.severity === 'warning' && <IconTrafficCone color="#ffffff" size={24} />}
				{data.severity === 'danger' && <IconAlertOctagonFilled color="#ffffff" size={24} />}
				<Text style={styles.label}>{t('label')}</Text>
				{isExpanded ? <IconX color="#ffffff" opacity={0.75} size={24} /> : <IconPlus color="#ffffff" opacity={0.75} size={24} />}
			</View>
			{isExpanded && <Text style={styles.title}>{data.title}</Text>}
		</Pressable>
	);

	//
}
