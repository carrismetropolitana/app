import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { MemoizedLineItem } from '@/components/common/LineItem';
import React, { useCallback } from 'react';
import { StyleSheet, VirtualizedList } from 'react-native';

interface Props {
	data: any[]
	icon?: React.ReactNode
	itemClick?: (item: any) => void
	items?: number
	municipality?: string[]
	size?: 'lg' | 'md'
}

export function VirtualizedListingLines({ data, icon, itemClick, items = 10, municipality, size = 'lg' }: Props) {
	const getItem = useCallback((d: any[], i: number) => d[i], []);
	const getItemCount = useCallback((d: any[]) => d.length, []);

	const renderItem = useCallback(({ item }) => (
		<MemoizedLineItem
			icon={icon}
			lineData={item}
			municipality={municipality}
			onPress={() => itemClick?.(item)}
			size={size}
		/>
	), [municipality, size, itemClick, icon],
	);

	const getItemLayout = useCallback(
		(_: any, index: number) => {
			const height = size === 'lg' ? 100 : 60;
			return { index, length: height, offset: height * index };
		}, [size],
	);

	return (
		<VirtualizedList
			data={data}
			getItem={getItem}
			getItemCount={getItemCount}
			getItemLayout={getItemLayout}
			initialNumToRender={items}
			keyExtractor={item => item.id}
			ListEmptyComponent={<NoDataLabel />}
			maxToRenderPerBatch={10}
			renderItem={renderItem}
			showsVerticalScrollIndicator={false}
			style={styles.list}
			updateCellsBatchingPeriod={50}
			windowSize={5}
			removeClippedSubviews
			scrollEnabled
		/>
	);
}

const styles = StyleSheet.create({
	list: {
		flex: 1,
	},
});

export const MemoizedListingLines = React.memo(VirtualizedListingLines);
