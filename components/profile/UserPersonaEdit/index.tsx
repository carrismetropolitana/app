/* * */

import { useProfileContext } from '@/contexts/Profile.context';
import { IconArrowNarrowLeft, IconArrowsShuffle } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';

import styles from './styles';

/* * */

export interface UserPersonaEditProps {
	onClickBack: () => void
	onClickRandom: () => void
}

/* * */

export function UserPersonaEdit({ onClickBack, onClickRandom }: UserPersonaEditProps) {
	//

	//
	// A. Setup variables

	const profileContext = useProfileContext();

	const { t } = useTranslation('translation', { keyPrefix: 'profile.UserPersonaEdit' });

	//
	// B. Render components

	return (
		<View style={styles.container}>
			<TouchableOpacity aria-label={t('go_back')} onPress={onClickBack} style={styles.button}>
				<IconArrowNarrowLeft color={profileContext.data.accent_color ?? '#000000'} size={30} />
			</TouchableOpacity>
			<TouchableOpacity aria-label={t('randomize')} onPress={onClickRandom} style={styles.button}>
				<IconArrowsShuffle color={profileContext.data.accent_color ?? '#000000'} size={26} />
			</TouchableOpacity>
		</View>
	);

	//
};
