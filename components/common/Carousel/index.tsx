/* * */
import type { SimplifiedAlert } from '@/types/alerts.types';

import { AlertActivePeriodStart } from '@/components/alerts/AlertActivePeriod';
import { Routes } from '@/utils/routes';
import { Text } from '@rn-vui/themed';
import { IconCircleArrowRightFilled } from '@tabler/icons-react-native';
import { Link } from 'expo-router';
import React, { memo } from 'react';
import {
	Dimensions,
	FlatList,
	Pressable,
	View,
} from 'react-native';

import { styles } from './styles';

/* * */

const Carousel = memo(({ slides }: { slides: SimplifiedAlert[] }) => {
	//

	//
	// A. Setup variables
	const alertCarouselStyles = styles();
	const { width } = Dimensions.get('window');

	//
	// C. Render components

	return (
		<FlatList
			data={slides}
			decelerationRate="fast"
			keyExtractor={item => item.alert_id}
			showsHorizontalScrollIndicator={false}
			snapToInterval={width}
			style={alertCarouselStyles.list}
			renderItem={({ index, item }) => (
				<Pressable accessibilityLabel={`Alert ${index + 1}`} accessibilityRole="button">
					<View style={alertCarouselStyles.imageContainer}>
						<Link href={`${Routes.CARRIS_METROPOLITANA}/alerts/${item.alert_id}`} style={alertCarouselStyles.container} target="_parent">
							<AlertActivePeriodStart date={item.start_date} size="sm" />
							<View style={alertCarouselStyles.bodyContentContainer}>
								<Text style={alertCarouselStyles.title}>{item.title}</Text>
								<IconCircleArrowRightFilled fill={alertCarouselStyles.container.backgroundColor} size={16} style={alertCarouselStyles.icon} />
							</View>
						</Link>
					</View>
				</Pressable>
			)}
			horizontal
		/>
	);
},

	//
);

export default Carousel;
