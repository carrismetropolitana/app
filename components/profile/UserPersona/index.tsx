/* * */

import { UserPersonaEdit, type UserPersonaEditProps } from '@/components/profile/UserPersonaEdit';
import { UserPersonaImage, type UserPersonaImageProps } from '@/components/profile/UserPersonaImage';
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
