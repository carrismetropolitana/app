/* * */

import { ProfileEditPersonaAccent } from '@/components/profile/edit/ProfileEditPersonaAccent';
import { UserPersona } from '@/components/profile/persona/UserPersona';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function ProfileEditPersona() {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	//
	// B. Render components

	return (
		<View style={styles.container}>
			<UserPersona size="lg" withEditButtons />
			<ProfileEditPersonaAccent />
		</View>
	);

	//
}
