import type { PropsWithChildren, ReactElement } from 'react';

import { ThemedView } from '@/components/ThemedView';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StyleSheet } from 'react-native';
import Animated, {
	interpolate,
	useAnimatedRef,
	useAnimatedStyle,
	useScrollViewOffset,
} from 'react-native-reanimated';

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
	headerBackgroundColor: { dark: string, light: string }
	headerImage: ReactElement
}>;

export default function ParallaxScrollView({
	children,
	headerBackgroundColor,
	headerImage,
}: Props) {
	const colorScheme = useColorScheme() ?? 'light';
	const scrollRef = useAnimatedRef<Animated.ScrollView>();
	const scrollOffset = useScrollViewOffset(scrollRef);
	const bottom = useBottomTabOverflow();
	const headerAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateY: interpolate(
						scrollOffset.value,
						[-HEADER_HEIGHT, 0, HEADER_HEIGHT],
						[-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75],
					),
				},
				{
					scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
				},
			],
		};
	});

	return (
		<ThemedView style={styles.container}>
			<Animated.ScrollView
				ref={scrollRef}
				contentContainerStyle={{ paddingBottom: typeof bottom === 'number' ? bottom : 0 }}
				scrollEventThrottle={16}
				scrollIndicatorInsets={{ bottom: typeof bottom === 'number' ? bottom : 0, left: 0, right: 0, top: 0 }}
			>
				<Animated.View
					style={[
						styles.header,
						{ backgroundColor: headerBackgroundColor[colorScheme] },
						headerAnimatedStyle,
					]}
				>
					{headerImage}
				</Animated.View>
				<ThemedView style={styles.content}>{children}</ThemedView>
			</Animated.ScrollView>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	content: {
		flex: 1,
		gap: 16,
		overflow: 'hidden',
		padding: 32,
	},
	header: {
		height: HEADER_HEIGHT,
		overflow: 'hidden',
	},
});
