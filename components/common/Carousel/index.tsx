/* * */
import type { SimplifiedAlert } from '@/types/alerts.types';

import { AlertActivePeriodStart } from '@/components/alerts/AlertActivePeriod';
import { useLocaleContext } from '@/contexts/Locale.context';
import { openWebView } from '@/utils/openWebView';
import { Text } from '@rn-vui/themed';
import { IconCircleArrowRightFilled } from '@tabler/icons-react-native';
import React, { memo } from 'react';
import {
	Dimensions,
	FlatList,
	Pressable,
	TouchableOpacity,
	View,
} from 'react-native';

import { styles } from './styles';

/* * */

const Carousel = memo(({ slides }: { slides: SimplifiedAlert[] }) => {
	//

	//
	// A. Setup variables

	const localeContext = useLocaleContext();
	const alertCarouselStyles = styles();
	const { width } = Dimensions.get('window');

	//
	// C. Render components() => openWebView({ locale: localeContext.locale, url: 'https://carrismetropolitana.pt/about' })

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
						<TouchableOpacity onPress={() => openWebView({ locale: localeContext.locale, url: `https://carrismetropolitana.pt/alerts/${item.alert_id}` })} style={alertCarouselStyles.container}>
							<AlertActivePeriodStart date={item.start_date} size="sm" />
							<View style={alertCarouselStyles.bodyContentContainer}>
								<Text style={alertCarouselStyles.title}>{item.title}</Text>
								<IconCircleArrowRightFilled fill={alertCarouselStyles.container.backgroundColor} size={16} style={alertCarouselStyles.icon} />
							</View>
						</TouchableOpacity>
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
