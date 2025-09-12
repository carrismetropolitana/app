/* * */

import { UserPersonaEdit } from '@/components/profile/persona/UserPersonaEdit';
import { UserPersonaImage, type UserPersonaImageProps } from '@/components/profile/persona/UserPersonaImage';
import { View } from 'react-native';

import styles from './styles';

/* * */

type UserPersonaProps = Partial<UserPersonaImageProps> & { withEditButtons?: boolean };

/* * */

export function UserPersona({ size = 'md', withEditButtons }: UserPersonaProps) {
	return (
		<View style={styles.container}>
			<UserPersonaImage size={size} />
			{withEditButtons && <UserPersonaEdit />}
		</View>
	);
}
