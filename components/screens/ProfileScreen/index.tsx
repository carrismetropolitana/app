/* * */
import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { Section } from '@/components/common/layout/Section';
import { Surface } from '@/components/common/layout/Surface';
import { ProfileImage } from '@/components/ProfileImage';
import { useProfileContext } from '@/contexts/Profile.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { AccountWidget } from '@/types/account.types';
import { ButtonGroup, ListItem } from '@rneui/themed';
import { IconArrowLoopRight, IconArrowNarrowLeft, IconArrowsShuffle, IconBellRinging, IconBusStop, IconCirclePlusFilled, IconUser } from '@tabler/icons-react-native';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { styles } from './styles';
import FavoriteItem from '@/components/common/FavoriteItem';

export default function ProfileScreen() {
	const navigation = useNavigation();
	const themeContext = useThemeContext();
	const profileStyles = styles();
	const profileContext = useProfileContext();
	const insets = useSafeAreaInsets();
	const { persona_image, profile } = profileContext.data;
	const saveTimer = useRef<NodeJS.Timeout | null>(null);
	const router = useRouter();
	const initialWidgets = (profile?.widgets ?? []).flatMap((widget) => {
		if (widget.data.type === 'lines') return [widget];
		if (widget.data.type === 'stops' && Array.isArray(widget.data.pattern_ids)) {
			return widget.data.pattern_ids.map(patternId => ({
				...widget,
				data: { ...widget.data, pattern_ids: [patternId] },
			}));
		}
		return [];
	});
	const [widgetList, setWidgetList] = useState(() => initialWidgets);

	function widgetKey(widget: AccountWidget) {
		if (widget.data.type === 'lines') {
			return `lines-${widget.data.pattern_id}`;
		}
		if (widget.data.type === 'stops') {
			return `stops-${widget.data.stop_id}-${widget.data.pattern_ids.join(',')}`;
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

	// const handleFirstNameBlur = () => {
	// 	if (profile) profileContext.actions.updateLocalProfile({
	// 		...profile,
	// 		profile: { ...profile.profile, first_name: firstName },
	// 	});
	// };

	const handleRefreshPersona = () => profileContext.actions.fetchPersona();
	const goBackInHistory = () => profileContext.actions.setPreviousPersona();

	const renderFavoriteItem = ({ drag, isActive, item }: any) => (
		<Text>HELLLO</Text>
		// <Pressable disabled={isActive} onLongPress={drag}>
		// 	<FavoriteItem data={item} />
		// </Pressable>
	);

	const buttons = [
		{
			element: () => (
				<Pressable onPress={goBackInHistory}>
					<IconArrowNarrowLeft color={theming.colorSystemText300} size={24} />
				</Pressable>
			)
		},
		{
			element: () => (
				<Pressable onPress={handleRefreshPersona}>
					<IconArrowsShuffle color={theming.colorSystemText300} size={24} />
				</Pressable>
			)
		},
	];

	useEffect(() => {
		navigation.setOptions({ headerStyle: { backgroundColor: themeContext.theme.lightColors?.background } });
		console.log('re rendered');
	}, [navigation, themeContext.theme.mode]);

	const ListHeader = () => (
		<>
			<View style={profileStyles.userSection}>
				{persona_image && <ProfileImage size={200} type="url" />}
				<ButtonGroup buttons={buttons} containerStyle={{ backgroundColor: themeContext.theme.lightColors?.background, borderRadius: 30, marginTop: -20, width: '25%' }} />
				<Text style={profileStyles.userFullNameText}> {profileContext.data.profile?.profile?.first_name} {profileContext.data.profile?.profile?.last_name}</Text>
			</View>

			<Section heading="Editar e ordenar favoritos" />
			{!widgetList.length && <NoDataLabel text="Sem favoritos" />}
		</>
	);

	const ListFooter = () => (
		<>
			<View style={profileStyles.addFavoritesSection}>
				<Section heading="Adicionar favoritos" />
				<ListItem onPress={() => router.push('/AddFavoriteStopModal')}>
					<IconBusStop color="#FF6900" size={24} />
					<ListItem.Content>
						<ListItem.Title style={profileStyles.listTitle}>Paragem Favorita</ListItem.Title>
					</ListItem.Content>
					<IconCirclePlusFilled size={24} fill="#3CB43C" color="#FFFFFF" />
				</ListItem>
				<ListItem onPress={() => router.push('/AddFavoriteLineModal')}>
					<IconArrowLoopRight color="#C61D23" size={24} />
					<ListItem.Content>
						<ListItem.Title style={profileStyles.listTitle}>Linha Favorita</ListItem.Title>
					</ListItem.Content>
					<IconCirclePlusFilled size={24} fill="#3CB43C" color="#FFFFFF" />
				</ListItem>
				<ListItem onPress={() => router.push('/ProfileEditModal')}>
					<IconUser color="#0C807E" size={24} />
					<ListItem.Content>
						<ListItem.Title style={profileStyles.listTitle}>Editar Perfil</ListItem.Title>
					</ListItem.Content>
					<IconCirclePlusFilled size={24} fill="#3CB43C" color="#FFFFFF" />
				</ListItem>
				<ListItem disabled>
					<IconBellRinging color="#0C807E" size={24} />
					<ListItem.Content>
						<ListItem.Title style={profileStyles.listTitle}>
							Notificações Inteligentes
						</ListItem.Title>
						<ListItem.Subtitle>Disponível em breve</ListItem.Subtitle>
					</ListItem.Content>
				</ListItem>
			</View>
		</>
	);


	const currentKeys = widgetList.map(widgetKey);
	const newKeys = initialWidgets.map(widgetKey);
	const isDifferent = currentKeys.join(',') !== newKeys.join(',');
	if (isDifferent) {
		setWidgetList(initialWidgets);
	}


	return (
		<Surface style={{ paddingBottom: 35 + insets.bottom }}>
			<DraggableFlatList                
				contentContainerStyle={{ paddingBottom: 35 + insets.bottom }}
				data={widgetList}
				ListFooterComponent={ListFooter}
				ListHeaderComponent={ListHeader}
				nestedScrollEnabled={true}
				renderItem={renderFavoriteItem}
				showsVerticalScrollIndicator={false}
				keyExtractor={item =>
					item.data.type === 'lines' ? `line-${item.data.pattern_id}`
						: item.data.type === 'stops' ? `stop-${item.data.stop_id}-${item.data.pattern_ids[0]}`
							: `item`}
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
		</Surface>
	);
}
