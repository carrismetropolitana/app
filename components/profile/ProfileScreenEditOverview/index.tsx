/* * */

import { UserAvatar } from '@/components/profile/UserAvatar';
import { useLocaleContext } from '@/contexts/Locale.context';
import { useProfileContext } from '@/contexts/Profile.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { CheckBox } from '@rn-vui/themed';
import { IconCircle, IconCircleFilled } from '@tabler/icons-react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import styles from './styles';

/* * */

export function ProfileScreenEditOverview() {
	//

	//
	// A. Setup variables

	const profileContext = useProfileContext();
	const themeContext = useThemeContext();
	const localeContext = useLocaleContext();
	const profileEditModalStyles = styles();

	const accentColors = [
		{ code: 'rgba(61,133,198,1)', name: 'Azul' },
		{ code: 'rgba(198,29,35,1)', name: 'Vermelho' },
		{ code: 'rgba(253,183,26,1)', name: 'Amarelo' },
		{ code: 'rgba(187,62,150,1)', name: 'Roxo' },
		{ code: 'rgba(12,128,126,1)', name: 'Verde Esmeralda' },
		{ code: 'rgba(255,105,0,1)', name: 'Laranja' },
	];
	const backgroundColor = themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight100 : theming.colorSystemBackgroundDark100;
	const [accentColor, setAccentColor] = useState<null | string>(profileContext.data.accent_color || null); ;
	const { t } = useTranslation('translation', { keyPrefix: 'profileEdit' });

	//
	// B. Handle actions

	useEffect(() => {
		profileContext.actions.setAccentColor(accentColor || '');
	}, [accentColor]);

	//
	// D. Render Components

	return (
		<View style={profileEditModalStyles.container}>
			<UserAvatar
				onClickBack={profileContext.actions.setPreviousPersona}
				onClickRandom={profileContext.actions.fetchPersona}
				size="lg"
			/>
			<View style={{ alignItems: 'center', flexDirection: 'row', gap: 0, justifyContent: 'center', marginVertical: 20 }}>
				{accentColors.map((item, index) => (
					<CheckBox
						key={index}
						accessibilityHint={t('changeAccentColorHint')}
						accessibilityLabel={t('changeAccentColorLabel', { color: item.name, state: accentColor === item.code ? 'selecionado' : 'deselecionado' })}
						accessibilityLanguage={localeContext.locale}
						accessibilityRole="checkbox"
						accessibilityState={{ checked: accentColor === item.code }}
						checked={accentColor === item.code}
						checkedIcon={<IconCircle color={item.code} fill="#FFFFFF" size={32} />}
						containerStyle={{ backgroundColor: backgroundColor, padding: 0 }}
						onPress={() => setAccentColor(item.code)}
						uncheckedIcon={<IconCircleFilled color="#FFFFFF" fill={item.code} size={32} />}
					/>
				))}
			</View>
		</View>
	);

	//
}
