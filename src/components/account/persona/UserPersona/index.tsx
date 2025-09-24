/* * */

import { UserPersonaEdit } from '@/components/account/persona/UserPersonaEdit';
import { UserPersonaImage, type UserPersonaImageProps } from '@/components/account/persona/UserPersonaImage';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

type UserPersonaProps = Partial<UserPersonaImageProps> & { withEditButtons?: boolean };

/* * */

export function UserPersona({ size = 'md', withEditButtons }: UserPersonaProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	//
	// B. Render components

	return (
		<View style={styles.container}>
			<UserPersonaImage size={size} />
			{withEditButtons && <UserPersonaEdit />}
		</View>
	);

	//
}
