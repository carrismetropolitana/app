/* * */

import { AccountViewError } from '@/components/account/view/AccountViewError';
import { HomeScreenListEmpty } from '@/components/home/HomeScreenListEmpty';
import { HomeScreenListFooter } from '@/components/home/HomeScreenListFooter';
import { HomeScreenListHeader } from '@/components/home/HomeScreenListHeader';
import { WidgetCard } from '@/components/widgets/cards/WidgetCard';
import { useAccountContext } from '@/contexts/Account.context';
import { type Widget } from '@/schemas/widgets';
import * as Haptics from 'expo-haptics';
import { useMemo } from 'react';
import { ActivityIndicator, View } from 'react-native';
import DraggableFlatList, { type DragEndParams, type RenderItemParams } from 'react-native-draggable-flatlist';

import { HomeScreenTopBar } from '../HomeScreenTopBar';
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
		return [...accountContext.data.account.widgets].sort((a, b) => (a.settings.display_order ?? 0) - (b.settings.display_order ?? 0));
	}, [accountContext.data.account?.widgets]);

	//
	// C. Handle actions

	function handlePlaceholderIndexChange() {
		// Provide haptic feedback on reorder event
		void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
	}

	function handleDragEnd({ data }: DragEndParams<Widget>) {
		// Provide haptic feedback on ending reorder
		void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		// Create a copy of the current widgets list
		const updatedList = data.map((widget, index) => ({
			...widget,
			settings: {
				...widget.settings,
				display_order: index,
			},
		}));
		// Update the account to re-render the list
		accountContext.actions.update('widgets', updatedList);
	}

	//
	// D. Render components

	function renderItem({ drag, isActive, item }: RenderItemParams<Widget>) {
		return (
			<View key={item._id} style={styles.listItem}>
				<WidgetCard
					data={item}
					isDragging={isActive}
					onDragStart={drag}
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

	if (accountContext.flags.error) {
		return (
			<View style={styles.loading}>
				<AccountViewError />
			</View>
		);
	}

	return (
		<View style={styles.screen}>
			<HomeScreenTopBar />

			<View style={styles.listWrapper}>
				<DraggableFlatList
					data={sortedWidgetsList}
					keyExtractor={item => item._id}
					ListEmptyComponent={<HomeScreenListEmpty />}
					ListFooterComponent={<HomeScreenListFooter />}
					ListHeaderComponent={<HomeScreenListHeader />}
					onDragEnd={handleDragEnd}
					onPlaceholderIndexChange={handlePlaceholderIndexChange}
					renderItem={renderItem}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={[
						styles.contentContainer,
						sortedWidgetsList.length === 0 && styles.contentContainerEmpty,
					]}
				/>
			</View>
		</View>

	);

	//
}
