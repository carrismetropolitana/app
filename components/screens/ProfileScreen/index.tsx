/* * */

import { AddWidgetList } from '@/components/screens/ProfileScreen/AddWidgetList';
import { RenderFavoriteItem } from '@/components/screens/ProfileScreen/RenderFavoriteItem';
import { UserDetails } from '@/components/screens/ProfileScreen/UserDetails';
import { useProfileContext } from '@/contexts/Profile.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { AccountWidget } from '@/types/account.types';
import { useNavigation } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import { SwipeableItemImperativeRef } from 'react-native-swipeable-item';

import { styles } from './styles';

/* * */

export default function ProfileScreen() {
	//

	//
	// A. Setup Variables

	const flatListGestureRef = useRef<PanGestureHandler>(null);
	const itemRefs = useRef<Map<string, SwipeableItemImperativeRef>>(new Map());
	const saveTimer = useRef<NodeJS.Timeout | null>(null);

	const navigation = useNavigation();
	const themeContext = useThemeContext();
	const profileStyles = styles();
	const profileContext = useProfileContext();
	const { profile } = profileContext.data;

	const initialWidgets = (profile?.widgets ?? []).flatMap((widget) => {
		if (widget.data.type === 'lines') return [widget];
		if (widget.data.type === 'stops') return [widget];
		if (widget.data.type === 'smart_notifications') return widget;
		return [];
	});
	const [widgetList, setWidgetList] = useState(() => initialWidgets);

	//
	// B. Transform Data

	useEffect(() => {
		navigation.setOptions({
			headerStyle: {
				backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background,
			},
		});
	}, [navigation, themeContext.theme.mode]);

	useEffect(() => {
		const currentKeys = widgetList.map(widgetKey);
		const newKeys = initialWidgets.map(widgetKey);
		if (
			currentKeys.length !== newKeys.length
			|| currentKeys.some((k, i) => k !== newKeys[i])
		) {
			setWidgetList(initialWidgets);
		}
	}, [profile?.widgets]);

	const widgetKey = (widget: AccountWidget) => {
		if (widget.data.type === 'lines')
			return `lines-${widget.data.pattern_id}`;
		if (widget.data.type === 'stops')
			return `stops-${widget.data.stop_id}`;
		if (widget.data.type === 'smart_notifications')
			return `smart_notifications-${widget.data.id || ''}`;
		return JSON.stringify(widget);
	};

	// D. Render Components

	return (
		<GestureHandlerRootView style={{ flex: 1, ...profileStyles.container }}>
			<DraggableFlatList
				activationDistance={10}
				data={widgetList}
				keyExtractor={item => widgetKey(item)}
				ListFooterComponent={AddWidgetList}
				ListHeaderComponent={(<UserDetails widgetList={widgetList} />)}
				nestedScrollEnabled={false}
				renderItem={({ drag, getIndex, isActive, item }) => (<RenderFavoriteItem drag={drag} index={getIndex() ?? 0} isActive={isActive} item={item} />)}
				showsVerticalScrollIndicator={false}
				simultaneousHandlers={flatListGestureRef}
				onDragEnd={({ data }) => {
					setWidgetList(data);
					data.forEach((widget) => {
						const ref = itemRefs.current.get(widgetKey(widget));
						if (ref) return itemRefs.current.set(widgetKey(widget), ref);
					});
					if (saveTimer.current) clearTimeout(saveTimer.current);
					saveTimer.current = setTimeout(() => {
						if (!profile) return;
						const orderedWidgets = data.map((widget, idx) => ({
							...widget,
							settings: { ...widget.settings, display_order: idx },
						}));
						profileContext.actions.updateLocalProfile({ ...profile, widgets: orderedWidgets });
					}, 1000);
				}}
			/>
		</GestureHandlerRootView>
	);
}
