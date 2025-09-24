/* * */

import { type News } from '@/types/news.types';
import { Image, TouchableOpacity } from 'react-native';

import styles from './styles';

/* * */

interface MoreNewsItemProps {
	item: News
	onClick: (newsId: string) => void
}

/* * */

export function MoreNewsItem({ item, onClick }: MoreNewsItemProps) {
	return (
		<TouchableOpacity
			accessibilityRole="button"
			aria-label={item.title}
			onPress={() => onClick(item._id)}
			role="button"
			style={styles.container}
		>
			<Image
				resizeMode="contain"
				source={{ uri: item.cover_image_src }}
				style={styles.image}
			/>
		</TouchableOpacity>
	);
}
