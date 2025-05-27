import React, { useCallback } from 'react';
import { VirtualizedList, StyleSheet } from 'react-native';
import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { MemoizedLineItem } from '@/components/common/LineItem';

interface Props {
	data: any[];
	icon?: React.ReactNode;
	itemClick?: (item: any) => void;
	items?: number;
	municipality?: string[];
	size?: 'lg' | 'md';
}

export function VirtualizedListingLines({ data, icon, itemClick, items = 10, municipality, size = 'lg', }: Props) {
	const getItem = useCallback((d: any[], i: number) => d[i], []);
	const getItemCount = useCallback((d: any[]) => d.length, []);

	const renderItem = useCallback(({ item }) => (
			<MemoizedLineItem
				lineData={item}
				municipality={municipality}
				size={size}
				onPress={() => itemClick?.(item)}
				icon={icon}
			/>
		),[municipality, size, itemClick, icon]
	);

	const getItemLayout = useCallback(
		(_: any, index: number) => {
			const height = size === 'lg' ? 100 : 60;
			return { length: height, offset: height * index, index };
		},[size]
	);

	return (
		<VirtualizedList
			style={styles.list}
			data={data}
			getItem={getItem}
			getItemCount={getItemCount}
			keyExtractor={(item) => item.id}
			renderItem={renderItem}
			initialNumToRender={items}
			removeClippedSubviews
			maxToRenderPerBatch={10}
			updateCellsBatchingPeriod={50}
			windowSize={5}
			getItemLayout={getItemLayout}
			scrollEnabled
			showsVerticalScrollIndicator={false}
			ListEmptyComponent={<NoDataLabel />}
		/>
	);
}

const styles = StyleSheet.create({
	list: {
		flex: 1,
	},
});

export const MemoizedListingLines = React.memo(VirtualizedListingLines);
