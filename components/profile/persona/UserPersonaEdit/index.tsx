/* * */

import { useProfileContext } from '@/contexts/Profile.context';
import { IconArrowNarrowLeft, IconArrowsShuffle } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function UserPersonaEdit() {
	//

	//
	// A. Setup variables

	const profileContext = useProfileContext();

	const { t } = useTranslation('translation', { keyPrefix: 'profile.UserPersonaEdit' });

	//
	// B. Render components

	return (
		<View style={useStyles().container}>
			<TouchableOpacity aria-label={t('go_back')} onPress={profileContext.actions.setPreviousPersona} style={useStyles().button}>
				<IconArrowNarrowLeft color={profileContext.data.accent_color ?? '#000000'} size={30} />
			</TouchableOpacity>
			<TouchableOpacity aria-label={t('randomize')} onPress={profileContext.actions.fetchPersona} style={useStyles().button}>
				<IconArrowsShuffle color={profileContext.data.accent_color ?? '#000000'} size={26} />
			</TouchableOpacity>
		</View>
	);

	//
};
