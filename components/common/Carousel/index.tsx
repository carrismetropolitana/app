/* * */
import { AlertActivePeriodStart } from '@/components/alerts/AlertActivePeriodEnd';
import { SimplifiedAlert } from '@/types/alerts.types.js';
import { RoutesSchedule } from '@/utils/routes';
import { Text } from '@rn-vui/themed';
import { IconCircleArrowRightFilled } from '@tabler/icons-react-native';
import { Link } from 'expo-router';
import React, { memo, useCallback } from 'react';
import {
	Dimensions,
	FlatList,
	Pressable,
	View,
} from 'react-native';

import { styles } from './styles';

/* * */

const Carousel = memo(({ onAlertPress, slides }: { onAlertPress: (index: number) => void, slides: SimplifiedAlert[] }) => {
	//

	//
	// A. Setup variables
	const alertCarouselStyles = styles();
	const { width } = Dimensions.get('window');

	//
	// B. Handle actions

	const handlePress = useCallback((index: number) => {
		onAlertPress(index);
	}, [onAlertPress]);

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
				<Pressable accessibilityLabel={`Alert ${index + 1}`} accessibilityRole="button" onPress={() => handlePress(index)}>
					<View style={alertCarouselStyles.imageContainer}>
						{/* style={alertCarouselStyles.container} */}
						<Link href={`${RoutesSchedule.ALERTS.route}/${item.alert_id}`} onPress={() => onAlertPress} target="_blank">
							<AlertActivePeriodStart date={item.start_date} size="sm" />
							{/* style={alertCarouselStyles.title} */}
							<Text>
								{item.title}
								{/* style={alertCarouselStyles.icon} */}
								<IconCircleArrowRightFilled size={16} />
							</Text>
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
