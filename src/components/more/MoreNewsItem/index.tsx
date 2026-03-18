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
			onPress={() => onClick(item.id)}
			role="button"
			style={styles.container}
		>
			<Image
				resizeMode="contain"
				source={{ uri: item.featured_image?.thumbnailURL ?? item.featured_image?.url }}
				style={styles.image}
			/>
		</TouchableOpacity>
	);
}
