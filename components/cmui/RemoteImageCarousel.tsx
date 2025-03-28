import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import {
	Dimensions,
	FlatList,
	Image,
	Pressable,
	StyleSheet,
	View,
} from 'react-native';

const { width } = Dimensions.get('window');

const RemoteImageCarousel = ({
	imageUrls,
	onImagePress,
}: {
	imageUrls: string[]
	onImagePress: (index: number) => void
}) => {
	const themeContext = useThemeContext();

	const styles = StyleSheet.create({
		image: {
			borderRadius: 12,
			boxShadow: themeContext.theme.mode === 'light' ? `0 0 10 ${theming.colorSystemBorder100}` : `0 0 10 ${theming.colorSystemText200}`,
			height: '100%',
			resizeMode: 'cover',
			width: '100%',

		},
		imageContainer: {
			alignItems: 'center',
			elevation: 6, // shadow for android
			justifyContent: 'center',

			padding: 14,
			shadowColor: '#000', // shadow color for ios
			shadowOffset: { height: 0, width: 0 }, // offset for shadow
			shadowOpacity: 0.05, // shadow transparency
			shadowRadius: 5, // blur radius for shadow
			width,

		},
	});
	return (
		<FlatList
			data={imageUrls}
			decelerationRate="fast"
			keyExtractor={(item, index) => index.toString()}
			showsHorizontalScrollIndicator={false}
			snapToInterval={width}
			style={{ height: 250 }}
			renderItem={({ item }) => (
				<Pressable onPress={() => onImagePress(imageUrls.indexOf(item))}>
					<View style={styles.imageContainer}>
						{/* TODO: cache images for offline fallback, consider requesting with If-Modified-Since header */}
						<Image source={{ uri: item }} style={styles.image} />
					</View>
				</Pressable>
			)}
			horizontal
		/>
	);
};

export default RemoteImageCarousel;
