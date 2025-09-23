/* * */

import { useLocaleContext } from '@/contexts/Locale.context';
import { useStopsListContext } from '@/contexts/OldStopsList.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { Input } from '@rn-vui/themed';
import { IconSearch } from '@tabler/icons-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import Counter from '../Counter';

/* * */

interface Props {
	counter?: boolean
	disabled?: boolean
	onPress?: () => void
}

/* * */

export default function StopSearchBar({ counter = true, disabled = false, onPress }: Props) {
	const { t } = useTranslation('translation', { keyPrefix: 'common.StopSearchBar' });
	const stopsListContext = useStopsListContext();
	const themeContext = useThemeContext();
	const localeContext = useLocaleContext();
	const [stopSearch, setStopSearch] = useState<string>('');
	const fontColor = themeContext.theme.mode === 'light' ? theming.colorSystemText400 : theming.colorSystemText200;
	const filteredStops = stopsListContext.data.filtered;

	return (

		<View style={{ padding: 20 }}>
			<Input
				accessibilityHint={t('stopSearchBarAcessibilityHint')}
				accessibilityLabel={t('stopSearchBarAcessibilityLabel')}
				accessibilityLanguage={localeContext.data.locale}
				accessibilityRole="search"
				clearButtonMode="always"
				containerStyle={{ borderRadius: 30 }}
				disabled={disabled}
				inputContainerStyle={{ bottom: 7, height: 50 }}
				leftIcon={<IconSearch color={fontColor} size={22} />}
				onPress={onPress}
				placeholder={t('placeholder')}
				placeholderTextColor={fontColor}
				style={{ color: fontColor, fontSize: 18, fontWeight: theming.fontWeightSemibold as '600' }}
				value={stopSearch}
				onChangeText={(text) => {
					setStopSearch(text);
					stopsListContext.actions.updateFilterBySearch(text);
				}}
			/>
			{counter && <Counter quantity={filteredStops.length} type="stops" />}
		</View>
	);
}
