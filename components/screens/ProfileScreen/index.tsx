import FavoriteItem from '@/components/common/FavoriteItem';
import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { Section } from '@/components/common/layout/Section';
import { ProfileImage } from '@/components/ProfileImage';
import { useProfileContext } from '@/contexts/Profile.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { AccountWidget } from '@/types/account.types';
import dimAvatarBackground from '@/utils/dimAvatarBackground';
import { Button, ListItem } from '@rn-vui/themed';
import {
	IconArrowLoopRight,
	IconBellRinging,
	IconBusStop,
	IconCirclePlus,
	IconTrash,
} from '@tabler/icons-react-native';
import { router, useNavigation } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import {
	GestureHandlerRootView,
	PanGestureHandler,
} from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import SwipeableItem, {
	OpenDirection,
	SwipeableItemImperativeRef,
} from 'react-native-swipeable-item';

import { styles } from './styles';

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
	const { persona_image, profile } = profileContext.data;

	const initialWidgets = (profile?.widgets ?? []).flatMap((widget) => {
		if (widget.data.type === 'lines') return [widget];
		if (widget.data.type === 'stops') return [widget];
		if (widget.data.type === 'smart_notifications') return widget;
		return [];
	});
	const [widgetList, setWidgetList] = useState(() => initialWidgets);

	//
	// B. Transform Data

	function AddWidgetListItem({ icon, label, route }: { icon: React.ReactNode, label: string, route: string }) {
		return (
			<ListItem onPress={() => router.push(route)}>
				{icon}
				<ListItem.Content>
					<ListItem.Title style={profileStyles.listTitle}>
						<Text>{label}</Text>
					</ListItem.Title>
				</ListItem.Content>
				<IconCirclePlus
					color={themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight100 : theming.colorSystemBackgroundDark100}
					fill="#3CB43C"
					size={24}
				/>
			</ListItem>
		);
	}

	function widgetKey(widget: AccountWidget) {
		if (widget.data.type === 'lines')
			return `lines-${widget.data.pattern_id}`;
		if (widget.data.type === 'stops')
			return `stops-${widget.data.stop_id}`;
		if (widget.data.type === 'smart_notifications')
			return `smart_notifications-${widget.data.id || ''}`;
		return JSON.stringify(widget);
	}

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

	useEffect(() => {
		navigation.setOptions({
			headerStyle: {
				backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background,
			},
		});
	}, [navigation, themeContext.theme.mode]);

	// D. Render Components
	const MyUnderlay = ({ direction, index, open, percentOpen }: { direction: OpenDirection, index: number, open: () => void, percentOpen: { value: number } }) => {
		const animatedStyle = useAnimatedStyle(() => ({
			opacity: percentOpen.value,
		}));

		return (
			<Animated.View style={[{ flex: 1 }, animatedStyle]}>
				<TouchableOpacity
					onPress={() => {
						open();
						if (direction === OpenDirection.LEFT) {
							profileContext.actions.deleteWidgetByDisplayOrder(index);
						}
					}}
					style={{
						alignItems: 'flex-end',
						backgroundColor: 'red',
						flex: 1,
						justifyContent: 'center',
						paddingHorizontal: 20,
					}}
				>
					<IconTrash color={themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background} size={24} />
				</TouchableOpacity>
			</Animated.View>
		);
	};

	const renderFavoriteItem = ({ drag, index, isActive, item }: any) => {
		const key = widgetKey(item);
		return (
			<ScaleDecorator>
				<SwipeableItem
					key={key}
					ref={(ref) => {
						if (ref) itemRefs.current.set(key, ref);
					}}
					activationThreshold={20}
					item={item}
					snapPointsLeft={[100]}
					swipeEnabled={!isActive}
					onChange={({ openDirection }) => {
						if (openDirection !== OpenDirection.NONE) {
							itemRefs.current.forEach((r, k) => {
								if (k !== key) r.close();
							});
						}
					}}
					renderUnderlayLeft={({ open, percentOpen }) => (
						<MyUnderlay
							direction={OpenDirection.LEFT}
							index={item.settings?.display_order ?? index}
							open={open}
							percentOpen={percentOpen}
						/>
					)}
				>
					<TouchableOpacity
						delayLongPress={200}
						disabled={isActive}
						onLongPress={drag}
					>
						<FavoriteItem data={item} drag={drag} isActive={isActive} />
					</TouchableOpacity>
				</SwipeableItem>
			</ScaleDecorator>
		);
	};

	const ListHeader = () => (
		<>
			<View style={profileStyles.userSection}>
				{persona_image ? (
					<ProfileImage
						backgroundColor={profileContext.data.accent_color ? dimAvatarBackground(profileContext.data.accent_color) : 'rgba(253,183,26,0.4)'}
						borderWidth={10}
						color={profileContext.data.accent_color || ''}
						size={200}
						type="url"
					/>
				) : (
					<ProfileImage height={200} type="local" width={200} />
				)}
				<Text style={profileStyles.userFullNameText}>
					{profileContext.data.profile?.profile?.first_name}{' '}
					{profileContext.data.profile?.profile?.last_name}
				</Text>
				<Button
					buttonStyle={profileStyles.button}
					containerStyle={profileStyles.buttonContainer}
					onPress={() => router.push('/profileEdit')}
					title="Editar Perfil"
					titleStyle={profileStyles.buttonTitle}
				/>
			</View>
			<View style={profileStyles.favoritesListSection}>
				<Section heading="Personalizar widgets" />
				{!widgetList.length && <NoDataLabel text="Sem widgets" fill />}
			</View>
		</>
	);

	const ListFooter = () => (
		<View style={profileStyles.addFavoritesSection}>
			<Section heading="Adicionar novo widget" />
			<AddWidgetListItem icon={<IconBusStop color="#FF6900" size={24} />} label="Paragem Favorita" route="/addFavoriteStop" />
			<AddWidgetListItem icon={<IconArrowLoopRight color="#C61D23" size={24} />} label="Linha Favorita" route="/addFavoriteLine" />
			<AddWidgetListItem icon={<IconBellRinging color="#0C807E" size={24} />} label="Notificações Inteligentes" route="/addSmartNotification" />
		</View>
	);

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<DraggableFlatList
				activationDistance={10}
				data={widgetList}
				keyExtractor={item => widgetKey(item)}
				ListFooterComponent={ListFooter}
				ListHeaderComponent={ListHeader}
				nestedScrollEnabled={false}
				renderItem={renderFavoriteItem}
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
