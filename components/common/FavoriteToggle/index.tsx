/* * */

import { Loader } from '@/components/common/Loader';
import { useConsentContext } from '@/contexts/Consent.context';
import { useProfileContext } from '@/contexts/Profile.context';
import { IconHeart, IconHeartFilled, IconHeartX } from '@tabler/icons-react-native';
import { TouchableOpacity, View } from 'react-native';

import { favoriteToggleStyles } from './styles';

/* * */

interface Props {
	classNames?: string
	color: string
	isActive: boolean | null
	onToggle: () => void
}

/* * */

export function FavoriteToggle({ color, isActive, onToggle }: Props) {
	//

	//
	// A. Setup variables

	const profileContext = useProfileContext();
	const consentContext = useConsentContext();

	//
	// B. Handle actions

	const handleRequestConsent = () => {
		consentContext.actions.ask();
	};

	//
	// C. Render components

	if (profileContext.flags.is_loading) {
		return (
			<View style={favoriteToggleStyles.container}>
				<Loader visible />
			</View>
		);
	}

	if (!profileContext.flags.is_enabled) {
		return (
			<TouchableOpacity onPress={handleRequestConsent} style={favoriteToggleStyles.container}>
				<View style={[favoriteToggleStyles.container, favoriteToggleStyles.disabled]}>
					<IconHeartX />
				</View>
			</TouchableOpacity>
		);
	}

	if (isActive) {
		return (
			<TouchableOpacity onPress={onToggle}>
				<View style={favoriteToggleStyles.container}>
					<IconHeartFilled style={{ backgroundColor: color }} />
				</View>
			</TouchableOpacity>
		);
	}

	return (
		<TouchableOpacity onPress={onToggle}>
			<View style={favoriteToggleStyles.container}>
				<IconHeart />
			</View>
		</TouchableOpacity>
	);

	//
}
