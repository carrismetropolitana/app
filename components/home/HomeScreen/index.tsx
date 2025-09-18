/* * */

import { HomeScreenListFooter } from '@/components/home/HomeScreenListFooter';
import { HomeScreenListHeader } from '@/components/home/HomeScreenListHeader';
import { useAccountContext } from '@/contexts/Account.context';
import { type Widget } from '@/schemas/widgets';
import { useMemo } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import DragList, { DragListRenderItemInfo } from 'react-native-draglist';

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
	// C. Render components

	function renderItem({ isActive, item, onDragEnd, onDragStart }: DragListRenderItemInfo<Widget>) {
		return (
			<TouchableOpacity
				key={item._id}
				onLongPress={onDragStart}
				onPressOut={onDragEnd}
			>
				<Text style={[styles.container2, isActive && styles.activeContainer]}>{item._id}</Text>
			</TouchableOpacity>
		);
	}

	return (
		<DragList
			contentContainerStyle={styles.list}
			data={sortedWidgetsList}
			keyExtractor={item => item._id}
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
