import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';

export default function StopDetailPager() {
	const images = [
		'https://picsum.photos/id/1011/600/400',
		'https://picsum.photos/id/1025/600/400',
		'https://picsum.photos/id/1035/600/400',
	];
	const [currentPage, setCurrentPage] = useState(0);

	return (
		<View style={styles.container}>
			<PagerView
				initialPage={0}
				onPageSelected={e => setCurrentPage(e.nativeEvent.position)}
				style={styles.pager}
			>
				{images.map((uri, i) => (
					<View key={i} style={styles.page}>
						<Image source={{ uri: uri }} style={styles.image} />
					</View>
				))}
			</PagerView>

			<View style={styles.dotsContainer}>
				{images.map((_, i) => (
					<View
						key={i}
						style={[
							styles.dot,
							i === currentPage ? styles.dotActive : styles.dotInactive,
						]}
					/>
				))}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { backgroundColor: '#fff', flex: 1, height: 300, width: '100%' },
	dot: {
		borderRadius: 5,
		height: 10,
		marginHorizontal: 6,
		width: 10,
	},
	dotActive: { backgroundColor: '#333' },
	dotInactive: { backgroundColor: '#ccc' },
	dotsContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		paddingVertical: 12,
	},
	image: { borderRadius: 8, height: 300, width: '100%' },
	page: { alignItems: 'center', justifyContent: 'center' },
	pager: { flex: 1, width: '100%' },
});
