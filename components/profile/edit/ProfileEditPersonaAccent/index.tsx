/* * */

import { useAccountContext } from '@/contexts/Account.context';
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

	const styles = useStyles();

	const accountContext = useAccountContext();

	const { t } = useTranslation('translation', { keyPrefix: 'profile.ProfileEditPersonaAccent' });

	//
	// B. Render Components

	return (
		<View aria-label={t('label')} role="radiogroup" style={styles.container}>
			{AVAILABLE_ACCENT_COLORS.map(item => (
				<TouchableOpacity
					key={item.id}
					aria-label={t(`accent_colors.${item.id}`)}
					disabled={accountContext.data.account?.persona?.accent_color === item.color_code}
					onPress={() => accountContext.actions.update('persona.accent_color', item.color_code)}
					role="radio"
					style={[styles.accentOption, {
						backgroundColor: accountContext.data.account?.persona?.accent_color === item.color_code ? 'transparent' : item.color_code,
						borderColor: accountContext.data.account?.persona?.accent_color === item.color_code ? item.color_code : 'transparent',
					}]}
				/>
			))}
		</View>
	);

	//
}
