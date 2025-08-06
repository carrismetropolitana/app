/* * */

import { useLinesListContext } from '@/contexts/LinesList.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { Input } from '@rn-vui/themed';
import { IconSearch } from '@tabler/icons-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

/* * */

export default function LineSearchBar() {
	//

	//
	// A. Setup variables

	const themeContext = useThemeContext();
	const { t } = useTranslation('translation', { keyPrefix: 'common.LineSearchBar' });
	const linesListContext = useLinesListContext();
	const [lineSearch, setLineSearch] = useState<string>('');
	const fontColor = themeContext.theme.mode === 'light' ? theming.colorSystemText400 : theming.colorSystemText200;

	//
	// B. Render components

	return (
		<View style={{ padding: 20 }}>
			<Input
				clearButtonMode="always"
				containerStyle={{ borderRadius: 30 }}
				inputContainerStyle={{ bottom: 7, height: 50, left: 15 }}
				leftIcon={<IconSearch color={fontColor} size={22} />}
				placeholder={t('placeholder')}
				placeholderTextColor={fontColor}
				style={{ color: fontColor, fontSize: 18, fontWeight: theming.fontWeightSemibold as '600' }}
				value={lineSearch}
				onChangeText={(text) => {
					setLineSearch(text);
					if (linesListContext && linesListContext.actions && typeof linesListContext.actions.updateFilterBySearch === 'function') {
						linesListContext.actions.updateFilterBySearch(text);
					}
				}}
			/>
		</View>
	);

	//
}
