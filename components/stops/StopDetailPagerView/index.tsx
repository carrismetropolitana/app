import React, { useState } from 'react';
import { Image, View } from 'react-native';
import PagerView from 'react-native-pager-view';

import { styles } from './styles';

export default function StopDetailPager() {
	const images = [
		'https://picsum.photos/id/1011/600/400',
		'https://picsum.photos/id/1025/600/400',
		'https://picsum.photos/id/1035/600/400',
	];
	const [currentPage, setCurrentPage] = useState(0);

	const stopDetailPagerStyles = styles();

	return (
		<View style={stopDetailPagerStyles.container}>
			<PagerView
				initialPage={0}
				onPageSelected={e => setCurrentPage(e.nativeEvent.position)}
				style={stopDetailPagerStyles.pager}
			>
				{images.map((uri, i) => (
					<View key={i} style={stopDetailPagerStyles.page}>
						<Image source={{ uri: uri }} style={stopDetailPagerStyles.image} />
					</View>
				))}
			</PagerView>

			<View style={stopDetailPagerStyles.dotsContainer}>
				{images.map((_, i) => (
					<View
						key={i}
						style={[
							stopDetailPagerStyles.dot,
							i === currentPage ? stopDetailPagerStyles.dotActive : stopDetailPagerStyles.dotInactive,
						]}
					/>
				))}
			</View>
		</View>
	);
}
