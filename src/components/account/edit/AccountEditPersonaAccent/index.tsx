/* * */

import { useAccountContext } from '@/contexts/Account.context';
import { resources } from '@/i18n';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';

import { useStyles } from './styles';

/* * */

type AccentColor = keyof typeof resources['en']['translation']['account']['AccountEditPersonaAccent']['accent_colors'];

const AVAILABLE_ACCENT_COLORS: { color_code: string, id: AccentColor }[] = [
	{ color_code: '#3d85c6', id: 'proxima' },
	{ color_code: '#c61d23', id: 'longa' },
	{ color_code: '#fdb71a', id: 'rapida' },
	{ color_code: '#bb3e96', id: 'inter-regional' },
	{ color_code: '#0c807e', id: 'mar' },
	{ color_code: '#ff6900', id: 'turistica' },
];

/* * */

export function AccountEditPersonaAccent() {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const accountContext = useAccountContext();

	const { t } = useTranslation();

	//
	// B. Render components

	return (
		<View aria-label={t($ => $.account.AccountEditPersonaAccent.label)} role="radiogroup" style={styles.container}>
			{AVAILABLE_ACCENT_COLORS.map(item => (
				<TouchableOpacity
					key={item.id}
					aria-label={t($ => $.account.AccountEditPersonaAccent.accent_colors[item.id])}
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
