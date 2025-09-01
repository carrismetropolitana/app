/* * */

import { Loader } from '@/components/common/Loader';
// import { useConsentContext } from '@/contexts/Consent.context';
import { useLocaleContext } from '@/contexts/Locale.context';
import { useProfileContext } from '@/contexts/Profile.context';
import { theming } from '@/theme/Variables';
import { IconHeart, IconHeartFilled } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';

import { favoriteToggleStyles } from './styles';

/* * */

interface Props {
	classNames?: string
	color: string
	isActive: boolean | null
	onToggle: () => void
	type: 'lines' | 'stops'
}
/* * */

export function FavoriteToggle({ color, isActive, onToggle, type }: Props) {
	//

	//
	// A. Setup variables

	const profileContext = useProfileContext();
	const localeContext = useLocaleContext();
	const { t } = useTranslation('common.favoriteToggle');

	// const consentContext = useConsentContext();

	//
	// B. Handle actions

	// const handleRequestConsent = () => {
	// 	consentContext.actions.ask();
	// };

	//
	// C. Render components

	if (profileContext.flags.is_loading) {
		return (
			<View style={favoriteToggleStyles.container}>
				<Loader visible />
			</View>
		);
	}

	// if (!profileContext.flags.is_enabled) {
	// 	return (
	// 		<TouchableOpacity onPress={handleRequestConsent} style={favoriteToggleStyles.container}>
	// 			<View style={[favoriteToggleStyles.container, favoriteToggleStyles.disabled]}>
	// 				<IconHeartX />
	// 			</View>
	// 		</TouchableOpacity>
	// 	);
	// }

	if (isActive) {
		return (
			<TouchableOpacity onPress={onToggle}>
				<View style={favoriteToggleStyles.container}>
					<IconHeartFilled
						accessibilityHint={`${t('filledAccessibilityHint')} ${type}`}
						accessibilityLabel={`${t('filledAccessibilityLabel')} ${type}`}
						accessibilityLanguage={localeContext.locale}
						accessibilityRole="button"
						color={theming.colorBrand}
						fill={color}
					/>
				</View>
			</TouchableOpacity>
		);
	}

	return (
		<TouchableOpacity onPress={onToggle}>
			<View style={favoriteToggleStyles.container}>
				<IconHeart
					accessibilityHint={`${t('unfilledAccessibilityHint')} ${type}`}
					accessibilityLabel={`${t('unfilledAccessibilityLabel')} ${type}`}
					accessibilityLanguage={localeContext.locale}
					accessibilityRole="button"
					color={theming.colorSystemText300}
				/>
			</View>
		</TouchableOpacity>
	);

	//
}
