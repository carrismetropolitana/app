/* * */

import { useProfileContext } from '@/contexts/Profile.context';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';

import { useStyles } from './styles';

/* * */

const AVAILABLE_ACCENT_COLORS = [
	{ color_code: '#3d85c6', id: 'proxima' },
	{ color_code: '#c61d23', id: 'longa' },
	{ color_code: '#fdb71a', id: 'rapida' },
	{ color_code: '#bb3e96', id: 'inter-regional' },
	{ color_code: '#0c807e', id: 'mar' },
	{ color_code: '#ff6900', id: 'turistica' },
];

/* * */

export function ProfileEditPersonaAccent() {
	//

	//
	// A. Setup variables

	const profileContext = useProfileContext();

	const { t } = useTranslation('translation', { keyPrefix: 'profile.ProfileEditPersonaAccent' });

	//
	// D. Render Components

	return (
		<View aria-label={t('label')} role="radiogroup" style={useStyles().container}>
			{AVAILABLE_ACCENT_COLORS.map(item => (
				<TouchableOpacity
					key={item.id}
					aria-label={t(`accent_colors.${item.id}`)}
					disabled={profileContext.data.accent_color === item.color_code}
					onPress={() => profileContext.actions.setAccentColor(item.color_code)}
					role="radio"
					style={[useStyles().accentOption, {
						backgroundColor: profileContext.data.accent_color === item.color_code ? 'transparent' : item.color_code,
						borderColor: profileContext.data.accent_color === item.color_code ? item.color_code : 'transparent',
					}]}
				/>
			))}
		</View>
	);

	//
}
