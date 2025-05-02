/* * */

import { BrandsOperators, IconsConnections, IconsFacilities } from '@/settings/assets.settings';
import { Image } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { styles } from './styles';

/* * */

interface Props {
	category: 'connections' | 'facilities' | 'operators'
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

	let iconSrc: string;

	switch (category) {
		case 'connections':
			iconSrc = IconsConnections[name as keyof typeof IconsConnections];
			break;
		case 'facilities':
			iconSrc = IconsFacilities[name as keyof typeof IconsFacilities];
			break;
		case 'operators':
			iconSrc = BrandsOperators[name as keyof typeof BrandsOperators];
			break;
	}

	//
	// C. Render components

	if (!iconSrc) {
		return null;
	}

	return (
		<View style={styles.container}>
			<Image alt={t(`${category}.${name}`)} src={iconSrc} />
		</View>
	);

	//
}
