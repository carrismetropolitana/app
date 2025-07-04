/* * */

import React, { memo, useCallback } from 'react';
import {
	Dimensions,
	FlatList,
	Image,
	Pressable,
	StyleSheet,
	View,
} from 'react-native';

/* * */

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
	image: {
		borderRadius: 12,
		height: '100%',
		resizeMode: 'cover',
		width: '100%',
	},
	imageContainer: {
		alignItems: 'center',
		elevation: 6,
		justifyContent: 'center',
		padding: 14,
		shadowColor: '#000',
		shadowOffset: { height: 0, width: 0 },
		shadowOpacity: 0.05,
		shadowRadius: 5,
		width,
	},
	list: {
		height: 250,
	},
});
const RemoteImageCarousel = memo(({ imageUrls, onImagePress }: { imageUrls: string[], onImagePress: (index: number) => void }) => {
	//

	//
	// A. Handle actions

	const handlePress = useCallback((index: number) => {
		onImagePress(index);
	}, [onImagePress]);

	//
	// B. Render components

	return (
		<FlatList
			data={imageUrls}
			decelerationRate="fast"
			keyExtractor={item => item}
			showsHorizontalScrollIndicator={false}
			snapToInterval={width}
			style={styles.list}
			renderItem={({ index, item }) => (
				<Pressable accessibilityLabel={`Image ${index + 1}`} accessibilityRole="button" onPress={() => handlePress(index)}>
					<View style={styles.imageContainer}>
						<Image source={{ uri: item }} style={styles.image} />
					</View>
				</Pressable>
			)}
			horizontal
		/>
	);
},

	//
);

export default RemoteImageCarousel;
