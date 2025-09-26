/* * */

import { HomeScreenListEmpty } from '@/components/home/HomeScreenListEmpty';
import { HomeScreenListFooter } from '@/components/home/HomeScreenListFooter';
import { HomeScreenListHeader } from '@/components/home/HomeScreenListHeader';
import { WidgetCard } from '@/components/widgets/cards/WidgetCard';
import { useAccountContext } from '@/contexts/Account.context';
import { type Widget } from '@/schemas/widgets';
import * as Haptics from 'expo-haptics';
import { useMemo } from 'react';
import { ActivityIndicator, View } from 'react-native';
import DragList, { type DragListRenderItemInfo } from 'react-native-draglist';

import { useStyles } from './styles';

/* * */

export function HomeScreen() {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const accountContext = useAccountContext();

	//
	// B. Transform data

	const sortedWidgetsList = useMemo(() => {
		if (!accountContext.data.account?.widgets.length) return [];
		return accountContext.data.account.widgets.sort((a, b) => (a.settings.display_order ?? 0) - (b.settings.display_order ?? 0));
	}, [accountContext.data.account?.widgets]);

	//
	// C. Handle actions

	async function onReordered(fromIndex: number, toIndex: number) {
		// Provide haptic feedback on reorder
		await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		// Create a copy of the current widgets list
		// as to not mutate the React state directly
		const localCopyOfList = [...sortedWidgetsList];
		// Splice out the item being moved
		const listSegment = localCopyOfList.splice(fromIndex, 1);
		// Insert the moved item at its new position
		localCopyOfList.splice(toIndex, 0, listSegment[0]);
		// Reset the display order property based on the new array order
		localCopyOfList.forEach((widget, index) => widget.settings.display_order = index);
		// Update the account to re-render the list
		await accountContext.actions.update('widgets', localCopyOfList);
	}

	//
	// D. Render components

	function renderItem({ isActive, item, onDragEnd, onDragStart }: DragListRenderItemInfo<Widget>) {
		return (
			<View key={item._id} style={styles.listItem}>
				<WidgetCard
					data={item}
					isDragging={isActive}
					onDragEnd={onDragEnd}
					onDragStart={onDragStart}
				/>
			</View>
		);
	}

	if (accountContext.flags.loading) {
		return (
			<View style={styles.loading}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	return (
		<DragList
			contentContainerStyle={styles.contentContainer}
			data={sortedWidgetsList}
			keyExtractor={item => item._id}
			ListEmptyComponent={<HomeScreenListEmpty />}
			ListFooterComponent={<HomeScreenListFooter />}
			ListHeaderComponent={<HomeScreenListHeader />}
			onReordered={onReordered}
			renderItem={renderItem}
			stickyHeaderIndices={[0]}
			style={styles.container}
		/>
	);

	//
}
