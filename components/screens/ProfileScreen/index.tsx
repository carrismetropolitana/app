/* * */

import TabBarOnly from '@/components/common/layout/TabOnly';
import { AddWidgetList } from '@/components/screens/ProfileScreen/AddWidgetList';
import { RenderFavoriteItem } from '@/components/screens/ProfileScreen/RenderFavoriteItem';
import { UserDetails } from '@/components/screens/ProfileScreen/UserDetails';
import { useNotifications } from '@/contexts/Notifications.context';
import { useProfileContext } from '@/contexts/Profile.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { AccountWidget } from '@/types/account.types';
import { useNavigation } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { SwipeableItemImperativeRef } from 'react-native-swipeable-item';

import { styles } from './styles';

/* * */

export default function ProfileScreen() {
	//

	//
	// A. Setup Variables

	const flatListGestureRef = useRef(null);
	const itemRefs = useRef<Map<string, SwipeableItemImperativeRef>>(new Map());
	const saveTimer = useRef<NodeJS.Timeout | null>(null);

	const navigation = useNavigation();
	const themeContext = useThemeContext();
	const notificationsContext = useNotifications();
	const profileStyles = styles();
	const profileContext = useProfileContext();
	const { profile } = profileContext.data;

	const initialWidgets = useMemo(() => {
		return (profile?.widgets ?? []).flatMap((widget) => {
			if (widget.data.type === 'lines') return [widget];
			if (widget.data.type === 'stops') return [widget];
			if (widget.data.type === 'smart_notifications') return widget;
			return [];
		});
	}, [profile?.widgets]);

	const [widgetList, setWidgetList] = useState(() => initialWidgets);
	const [isDragging, setIsDragging] = useState(false);

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
		notificationsContext.actions.askForPermissions();
	}, []);

	useEffect(() => {
		if (!isDragging) {
			setWidgetList(initialWidgets);
		}
	}, [initialWidgets, isDragging]);

	const widgetKey = (widget: AccountWidget) => {
		if (widget.data.type === 'lines')
			return `lines-${widget.data.pattern_id}`;
		if (widget.data.type === 'stops')
			return `stops-${widget.data.stop_id}`;
		if (widget.data.type === 'smart_notifications')
			return `smart_notifications-${widget.data.id || ''}`;
		return JSON.stringify(widget);
	};

	//
	// C. Render Components
	return (
		<>
			<View style={{ ...profileStyles.container, backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background, flex: 1 }}>
				<DraggableFlatList
					activationDistance={20}
					contentContainerStyle={{ paddingBottom: 104 }}
					data={widgetList}
					keyExtractor={item => widgetKey(item)}
					ListFooterComponent={<AddWidgetList />}
					ListHeaderComponent={<UserDetails widgetList={widgetList} />}
					nestedScrollEnabled={false}
					onDragBegin={() => setIsDragging(true)}
					renderItem={({ drag, getIndex, isActive, item }) => (<RenderFavoriteItem drag={drag} index={getIndex() ?? 0} isActive={isActive} item={item} />)}
					showsVerticalScrollIndicator={false}
					simultaneousHandlers={flatListGestureRef}
					onDragEnd={({ data }) => {
						setIsDragging(false);
						setWidgetList(data);
						data.forEach((widget) => {
							const ref = itemRefs.current.get(widgetKey(widget));
							if (ref) return itemRefs.current.set(widgetKey(widget), ref);
						});
						if (saveTimer.current) clearTimeout(saveTimer.current);
						if (profile) {
							const orderedWidgets = data.map((widget, idx) => ({ ...widget, settings: { ...widget.settings, display_order: idx } }));
							profileContext.actions.updateLocalProfile({
								widgets: orderedWidgets,
							});
						}
					}}
				/>
			</View>
			<View style={{ bottom: 0, left: 0, position: 'absolute', right: 0 }}>
				<TabBarOnly />
			</View>
		</>
	);

	//
}
