/* * */

import { IconsFacilities } from '@/settings/assets.settings';
import { Image } from '@rn-vui/themed';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { styles } from './styles';

/* * */

interface Props {
	category: 'facilities'
	name: string
}

/* * */

export function IconDisplay({ category, name }: Props) {
	//

	//
	// A. Setup variables

	const { t } = useTranslation('IconDisplay');

	//
	// B. Transform data

	let iconSrc: string | undefined;

	switch (category) {
		case 'facilities':
			iconSrc = IconsFacilities[name as keyof typeof IconsFacilities];
			break;
		default:
			iconSrc = '';
			break;
	}

	//
	// C. Render components

	if (!iconSrc) {
		return null;
	}

	return (
		<View style={styles.container}>
			<Image accessibilityLabel={t(`${category}.${name}`)} source={typeof iconSrc === 'string' ? { uri: iconSrc } : iconSrc} style={{ height: 32, width: 32 }} />
		</View>
	);

	//
}
