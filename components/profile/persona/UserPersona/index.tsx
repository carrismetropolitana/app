/* * */

import { UserPersonaEdit, type UserPersonaEditProps } from '@/components/profile/persona/UserPersonaEdit';
import { UserPersonaImage, type UserPersonaImageProps } from '@/components/profile/persona/UserPersonaImage';
import { View } from 'react-native';

import styles from './styles';

/* * */

type UserPersonaProps = Partial<UserPersonaEditProps> & Partial<UserPersonaImageProps>;

/* * */

export function UserPersona({ onClickBack, onClickRandom, size = 'md' }: UserPersonaProps) {
	return (
		<View style={styles.container}>
			<UserPersonaImage size={size} />
			{onClickBack && onClickRandom && <UserPersonaEdit onClickBack={onClickBack} onClickRandom={onClickRandom} />}
		</View>
	);
}
