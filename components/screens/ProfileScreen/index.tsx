/* * */

import AddFavoriteLine from '@/app/(modal)/AddFavoriteLine';
import AddFavoriteStop from '@/app/(modal)/AddFavoriteStop';
import EditableText from '@/components/common/EditableText';
import FavoriteItem from '@/components/common/FavoriteItem';
import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { Section } from '@/components/common/layout/Section';
import { Surface } from '@/components/common/layout/Surface';
import { ProfileImage } from '@/components/ProfileImage';
import { useProfileContext } from '@/contexts/Profile.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { ButtonGroup, ListItem } from '@rneui/themed';
import {
	IconArrowLoopRight,
	IconArrowNarrowLeft,
	IconArrowsShuffle,
	IconBellRinging,
	IconBusStop,
	IconCirclePlusFilled,
} from '@tabler/icons-react-native';
import { useNavigation } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';

import { styles } from './styles';

export default function ProfileScreen() {
	const navigation = useNavigation();
	const themeContext = useThemeContext();
	const profileStyles = styles();
	const profileContext = useProfileContext();
	const { persona_image, profile } = profileContext.data;

	const [firstName, setFirstName] = useState(profile?.profile?.first_name ?? 'Sem');
	const [lastName, setLastName] = useState(profile?.profile?.last_name ?? 'Nome');

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

	const [widgetList, setWidgetList] = useState(initialWidgets);
	useEffect(() => setWidgetList(initialWidgets), [profile?.widgets]);

	const [modalFavoriteLineVisible, setModalFavoriteLineVisible] = useState(false);
	const [modalFavoriteStopVisible, setModalFavoriteStopVisible] = useState(false);

	const saveTimer = useRef<NodeJS.Timeout | null>(null);

	const handleFirstNameBlur = () => {
		if (profile) profileContext.actions.updateLocalProfile({
			...profile,
			profile: { ...profile.profile, first_name: firstName },
		});
	};
	const handleLastNameBlur = () => {
		if (profile) profileContext.actions.updateLocalProfile({
			...profile,
			profile: { ...profile.profile, last_name: lastName },
		});
	};
	const handleRefreshPersona = () => profileContext.actions.fetchPersona();
	const goBackInHistory = () => profileContext.actions.setPreviousPersona();

	const EditableNameField = ({ onBlur, onChangeText, value }: any) => (
		<EditableText
			onBlur={onBlur}
			onChangeText={onChangeText}
			style={profileStyles.userFullNameText}
			value={value}
		/>
	);

	const FavoriteOption = ({ disabled, icon, onPress, subtitle, title }: any) => (
		<Pressable disabled={disabled} onPress={onPress}>
			<ListItem disabled={disabled} disabledStyle={{ opacity: 0.5 }}>
				{icon}
				<ListItem.Content>
					<ListItem.Title style={profileStyles.listTitle}>{title}</ListItem.Title>
					{subtitle && <ListItem.Subtitle>{subtitle}</ListItem.Subtitle>}
				</ListItem.Content>
				<IconCirclePlusFilled
					color={theming.colorSystemText900}
					fill="#3CB43C"
					size={24}
				/>
			</ListItem>
		</Pressable>
	);

	const renderFavoriteItem = ({ drag, isActive, item }: any) => (
		<Pressable disabled={isActive} onLongPress={drag}>
			<FavoriteItem data={item} />
		</Pressable>
	);

	const buttons = [
		{ element: () => (
			<Pressable onPress={goBackInHistory}>
				<IconArrowNarrowLeft color={theming.colorSystemText300} size={24} />
			</Pressable>
		) },
		{ element: () => (
			<Pressable onPress={handleRefreshPersona}>
				<IconArrowsShuffle color={theming.colorSystemText300} size={24} />
			</Pressable>
		) },
	];

	useEffect(() => {
		navigation.setOptions({ headerStyle: { backgroundColor: themeContext.theme.lightColors?.background } });
	}, [navigation, themeContext.theme.mode]);

	const ListHeader = () => (
		<>
			<View style={profileStyles.userSection}>
				{persona_image && <ProfileImage size={200} type="url" />}
				<ButtonGroup buttons={buttons} containerStyle={{ backgroundColor: themeContext.theme.lightColors?.background, borderRadius: 30, marginTop: -20, width: '25%' }} />
				<View style={profileStyles.nameRow}>
					<EditableNameField onBlur={handleFirstNameBlur} onChangeText={setFirstName} value={firstName} />
					<EditableNameField onBlur={handleLastNameBlur} onChangeText={setLastName} value={lastName} />
				</View>
			</View>

			<Section heading="Editar e ordenar favoritos" />
			{!widgetList.length && <NoDataLabel text="Sem favoritos" />}
		</>
	);

	const ListFooter = () => (
		<>
			<View style={profileStyles.addFavoritesSection}>
				<Section heading="Adicionar favoritos" />
				<FavoriteOption icon={<IconBusStop color="#FF6900" size={24} />} onPress={() => setModalFavoriteStopVisible(true)} title="Paragem Favorita" />
				<FavoriteOption icon={<IconArrowLoopRight color="#C61D23" size={24} />} onPress={() => setModalFavoriteLineVisible(true)} title="Linha Favorita" />
				<FavoriteOption icon={<IconBellRinging color="#0C807E" size={24} />} subtitle="Disponivel em breve" title="Notificações Inteligentes" disabled />
			</View>
			<AddFavoriteLine isVisible={modalFavoriteLineVisible} onBackdropPress={() => setModalFavoriteLineVisible(false)} />
			<AddFavoriteStop isVisible={modalFavoriteStopVisible} onBackdropPress={() => setModalFavoriteStopVisible(false)} />
		</>
	);

	return (
		<Surface>
			<DraggableFlatList
				data={widgetList}
				ListFooterComponent={ListFooter}
				ListHeaderComponent={ListHeader}
				nestedScrollEnabled={false}
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
