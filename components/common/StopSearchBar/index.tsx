/* * */

import type { Stop } from '@carrismetropolitana/api-types/network';

import { useStopsListContext } from '@/contexts/StopsList.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { Input, Text } from '@rn-vui/themed';
import { IconSearch } from '@tabler/icons-react-native';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import Counter from '../Counter';

/* * */

interface Props {
	counter?: boolean
	disabled?: boolean
}

/* * */

export default function StopSearchBar({ counter = true, disabled = false }: Props) {
	//

	//
	// A. Setup variables

	const { t } = useTranslation('translation', { keyPrefix: 'common.StopSearchBar' });
	const stopsListContext = useStopsListContext();
	const themeContext = useThemeContext();
	const allStops = stopsListContext.data.filtered;
	const [stopSearch, setStopSearch] = useState<string>('');
	const fontColor = themeContext.theme.mode === 'light' ? theming.colorSystemText400 : theming.colorSystemText200;

	const filteredStops = useMemo(() => {
		return allStops.filter((stop: Stop) => stop.long_name.toLowerCase().includes(stopSearch.toLowerCase()) || String(stop.id).includes(stopSearch));
	}, [allStops, stopSearch]);

	//
	// B. Render components

	return (
		<View style={{ padding: 20 }}>
			<Input
				clearButtonMode="always"
				containerStyle={{ borderRadius: 30 }}
				disabled={disabled}
				inputContainerStyle={{ bottom: 7, height: 50, left: 15 }}
				leftIcon={<IconSearch color={fontColor} size={22} />}
				placeholder={t('placeholder')}
				placeholderTextColor={fontColor}
				style={{ color: fontColor, fontSize: 18, fontWeight: theming.fontWeightSemibold as '600' }}
				value={stopSearch}
				onChangeText={(text) => {
					setStopSearch(text);
					if (stopsListContext && stopsListContext.actions && typeof stopsListContext.actions.updateFilterBySearch === 'function') {
						stopsListContext.actions.updateFilterBySearch(text);
					}
				}}
			/>
			{counter && <Counter quantity={filteredStops.length} type="stops" />}
		</View>
	);

	//
}
