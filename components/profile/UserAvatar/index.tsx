/* * */

import { UserAvatarEdit, type UserAvatarEditProps } from '@/components/profile/UserAvatarEdit';
import { UserAvatarImage, type UserAvatarImageProps } from '@/components/profile/UserAvatarImage';
import { View } from 'react-native';

import styles from './styles';

/* * */

type UserAvatarProps = Partial<UserAvatarEditProps> & Partial<UserAvatarImageProps>;

/* * */

export function UserAvatar({ onClickBack, onClickRandom, size = 'md' }: UserAvatarProps) {
	return (
		<View style={styles.container}>
			<UserAvatarImage size={size} />
			{onClickBack && onClickRandom && <UserAvatarEdit onClickBack={onClickBack} onClickRandom={onClickRandom} />}
		</View>
	);
}
