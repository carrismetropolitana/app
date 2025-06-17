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
import { IconArrowLoopRight, IconBellRinging, IconBusStop, IconCirclePlus } from '@tabler/icons-react-native';
import { router, useNavigation } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';

import { styles } from './styles';

export default function ProfileScreen() {
	//

	//
	// A. Setup variables

	const navigation = useNavigation();
	const themeContext = useThemeContext();
	const profileStyles = styles();
	const profileContext = useProfileContext();
	const { persona_image, profile } = profileContext.data;
	const saveTimer = useRef<NodeJS.Timeout | null>(null);

	const initialWidgets = (profile?.widgets ?? []).flatMap((widget) => {
		if (widget.data.type === 'lines') return [widget];
		if (widget.data.type === 'stops' && Array.isArray(widget.data.pattern_ids)) {
			return widget.data.pattern_ids.map(patternId => ({
				...widget,
				data: { ...widget.data, pattern_ids: [patternId] },
			}));
		}
		if (widget.data.type === 'smart_notifications') {
			return widget;
		}
		return [];
	});
	const [widgetList, setWidgetList] = useState(() => initialWidgets);

	//
	// B. Transform data

	function widgetKey(widget: AccountWidget) {
		if (widget.data.type === 'lines') {
			return `lines-${widget.data.pattern_id}`;
		}
		if (widget.data.type === 'stops') {
			return `stops-${widget.data.stop_id}-${widget.data.pattern_ids.join(',')}`;
		}
		if (widget.data.type === 'smart_notifications') {
			return `smart_notifications-${widget.data.id || ''}`;
		}
		return JSON.stringify(widget);
	}

	useEffect(() => {
		const currentKeys = widgetList.map(widgetKey);
		const newKeys = initialWidgets.map(widgetKey);
		if (currentKeys.length !== newKeys.length || currentKeys.some((k, i) => k !== newKeys[i])) {
			setWidgetList(initialWidgets);
		}
	}, [profile?.widgets]);

	//
	// C. Render components

	const renderFavoriteItem = ({ drag, isActive, item }: any) => (
		<FavoriteItem data={item} drag={drag} isActive={isActive} />
	);

	useEffect(() => {
		navigation.setOptions({ headerStyle: { backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background } });
	}, [navigation, themeContext.theme.mode]);

	const ListHeader = () => (
		<>
			<View style={profileStyles.userSection}>
				{persona_image ? <ProfileImage backgroundColor={profileContext.data.accent_color ? dimAvatarBackground(profileContext.data.accent_color) : 'rgba(253,183,26,0.4))'} borderWidth={10} color={profileContext.data.accent_color || ''} size={200} type="url" />
					: <ProfileImage height={200} type="local" width={200} />}
				<Text style={profileStyles.userFullNameText}> {profileContext.data.profile?.profile?.first_name}{' '}{profileContext.data.profile?.profile?.last_name}
				</Text>
				<Button buttonStyle={profileStyles.button} containerStyle={profileStyles.buttonContainer} onPress={() => router.push('/profileEdit')} title="Editar Perfil" titleStyle={profileStyles.buttonTitle} />
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
			<ListItem onPress={() => router.push('/addFavoriteStop')}>
				<IconBusStop color="#FF6900" size={24} />
				<ListItem.Content>
					<ListItem.Title style={profileStyles.listTitle}><Text>Paragem Favorita</Text></ListItem.Title>
				</ListItem.Content>
				<IconCirclePlus
					color={themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight100 : theming.colorSystemBackgroundDark100}
					fill="#3CB43C"
					size={24}
				/>
			</ListItem>
			<ListItem onPress={() => router.push('/addFavoriteLine')}>
				<IconArrowLoopRight color="#C61D23" size={24} />
				<ListItem.Content>
					<ListItem.Title style={profileStyles.listTitle}><Text>Linha Favorita</Text></ListItem.Title>
				</ListItem.Content>
				<IconCirclePlus
					color={themeContext.theme.mode === 'light'	? theming.colorSystemBackgroundLight100	: theming.colorSystemBackgroundDark100}
					fill="#3CB43C"
					size={24}
				/>
			</ListItem>
			<ListItem onPress={() => router.push('/addSmartNotification')}>
				<IconBellRinging color="#0C807E" size={24} />
				<ListItem.Content>
					<ListItem.Title style={profileStyles.listTitle}>
						<Text>Notificações Inteligentes</Text>
					</ListItem.Title>
				</ListItem.Content>
				<IconCirclePlus
					color={themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight100 : theming.colorSystemBackgroundDark100}
					fill="#3CB43C"
					size={24}
				/>
			</ListItem>
		</View>
	);

	return (
		<View style={profileStyles.container}>
			<DraggableFlatList
				data={widgetList}
				ListFooterComponent={ListFooter}
				ListHeaderComponent={ListHeader}
				nestedScrollEnabled={false}
				renderItem={renderFavoriteItem}
				scrollEnabled={true}
				showsVerticalScrollIndicator={false}
				keyExtractor={(item) => {
					if (item.data.type === 'lines') return `line-${item.data.pattern_id}`;
					if (item.data.type === 'stops') return `stop-${item.data.stop_id}-${item.data.pattern_ids[0]}`;
					if (item.data.type === 'smart_notifications') return `smart_notifications-${item.data.id || ''}`;
					return JSON.stringify(item);
				}}
				onDragEnd={({ data }) => {
					setWidgetList(data);
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
		</View>
	);

	//
}
