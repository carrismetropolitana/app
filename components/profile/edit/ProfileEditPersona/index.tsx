/* * */

import { ProfileEditPersonaAccent } from '@/components/profile/edit/ProfileEditPersonaAccent';
import { UserPersona } from '@/components/profile/persona/UserPersona';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function ProfileEditPersona() {
	return (
		<View style={useStyles().container}>
			<UserPersona size="lg" withEditButtons />
			<ProfileEditPersonaAccent />
		</View>
	);
}
