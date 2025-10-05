/* * */

import { AccountEditDelete } from '@/components/account/edit/AccountEditDelete';
import { AccountEditPersona } from '@/components/account/edit/AccountEditPersona';
import { AccountEditProfile } from '@/components/account/edit/AccountEditProfile';
import { Container } from '@/components/layout/Container';

/* * */

export function AccountEdit() {
	return (
		<Container>
			<AccountEditPersona />
			<AccountEditProfile />
			<AccountEditDelete />
		</Container>
	);
}
