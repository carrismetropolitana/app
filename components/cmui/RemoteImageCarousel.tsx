import {
	View,
	FlatList,
	Image,
	Dimensions,
	StyleSheet,
	Pressable,
} from "react-native";

const { width } = Dimensions.get("window");

const RemoteImageCarousel = ({
	imageUrls,
	onImagePress,
}: {
	imageUrls: string[];
	onImagePress: (index: number) => void;
}) => {
	return (
		<FlatList
			data={imageUrls}
			keyExtractor={(item, index) => index.toString()}
			horizontal
			showsHorizontalScrollIndicator={false}
			snapToInterval={width}
			decelerationRate="fast"
			style={{ height: 250 }}
			renderItem={({ item }) => (
				<Pressable onPress={() => onImagePress(imageUrls.indexOf(item))}>
					<View style={styles.imageContainer}>
						{/* TODO: cache images for offline fallback, consider requesting with If-Modified-Since header */}
						<Image source={{ uri: item }} style={styles.image} />
					</View>
				</Pressable>
			)}
		/>
	);
};

const styles = StyleSheet.create({
	imageContainer: {
		width,
		justifyContent: "center",
		alignItems: "center",
		padding: 14,

		shadowColor: "#000", // shadow color for ios
		shadowOffset: { width: 0, height: 0 }, // offset for shadow
		shadowOpacity: 0.05, // shadow transparency
		shadowRadius: 5, // blur radius for shadow
		elevation: 6, // shadow for android
	},
	image: {
		width: "100%",
		height: "100%",
		resizeMode: "cover",
		borderRadius: 12,
	},
});

export default RemoteImageCarousel;
