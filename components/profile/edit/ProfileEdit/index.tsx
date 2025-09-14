/* * */

import { Container } from '@/components/layout/Container';
import { ProfileEditForm } from '@/components/profile/edit/ProfileEditForm';
import { ProfileEditPersona } from '@/components/profile/edit/ProfileEditPersona';

/* * */

export function ProfileEdit() {
	return (
		<Container>
			<ProfileEditPersona />
			<ProfileEditForm />
		</Container>
	);
}
