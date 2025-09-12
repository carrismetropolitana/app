/* * */

import { ProfileEditPersonaAccent } from '@/components/profile/edit/ProfileEditPersonaAccent';
import { UserPersona } from '@/components/profile/persona/UserPersona';
import { View } from 'react-native';

import styles from './styles';

/* * */

export function ProfileEditPersona() {
	return (
		<View style={styles.container}>
			<UserPersona size="lg" withEditButtons />
			<ProfileEditPersonaAccent />
		</View>
	);
}
