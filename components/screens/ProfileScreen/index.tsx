/* * */

import AddFavoriteLine from '@/app/(modal)/AddFavoriteLine';
import AddFavoriteStop from '@/app/(modal)/AddFavoriteStop';
import EditableText from '@/components/common/EditableText';
import FavoriteItem from '@/components/common/FavoriteItem';
import { Section } from '@/components/common/layout/Section';
import { Surface } from '@/components/common/layout/Surface';
import { useProfileContext } from '@/contexts/Profile.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { Routes } from '@/utils/routes';
import { Avatar, Button, ListItem } from '@rneui/themed';
import { IconArrowLoopRight, IconArrowsRandom, IconBellRinging, IconBusStop, IconCirclePlusFilled } from '@tabler/icons-react-native';
import { useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { styles as useStyles } from './styles';

/* * */

export default function ProfileScreen() {
	//

	//
	// A. Setup variables

	const navigation = useNavigation();
	const themeContext = useThemeContext();
	const styles = useStyles();
	const profileContext = useProfileContext();
	const { profile } = profileContext.data;
	const [firstName, setFirstName] = useState(
		profileContext.data.profile?.profile?.first_name ?? 'Sem',
	);
	const [lastName, setLastName] = useState(
		profileContext.data.profile?.profile?.last_name ?? 'Nome',
	);

	const widgets = (profile?.widgets ?? []).flatMap((widget) => {
		if (widget.data.type === 'lines') {
			return [widget];
		}
		if (widget.data.type === 'stops' && Array.isArray(widget.data.pattern_ids)) {
			return widget.data.pattern_ids.map(patternId => ({
				...widget,
				data: {
					...widget.data,
					pattern_ids: [patternId],
				},
			}));
		}
		return [];
	});

	const [modalFavoriteLineVisible, setModalFavoriteLineVisible] = useState(false);
	const [modalFavoriteStopVisible, setModalFavoriteStopVisible] = useState(false);

	//
	// B. Fetch data

	useEffect(() => {
		navigation.setOptions({
			headerStyle: {
				backgroundColor:
					themeContext.theme.mode === 'light'
						? themeContext.theme.lightColors?.background
						: themeContext.theme.darkColors?.background,
			},
		});
	}, [navigation, themeContext.theme.mode]);

	//
	// C. Handle Actions

	const handleFirstNameBlur = () => {
		if (profileContext.data.profile) {
			const updatedProfile = {
				...profileContext.data.profile,
				profile: {
					...profileContext.data.profile.profile,
					first_name: firstName,
				},
			};
			profileContext.actions.updateLocalProfile(updatedProfile);
		}
	};

	const handleLastNameBlur = () => {
		if (profileContext.data.profile) {
			const updatedProfile = {
				...profileContext.data.profile,
				profile: {
					...profileContext.data.profile.profile,
					last_name: lastName,
				},
			};
			profileContext.actions.updateLocalProfile(updatedProfile);
		}
	};

	//
	// D. Render Components

	const renderFavoriteItem = ({ drag, isActive, item }: any) => {
		return (
			<TouchableOpacity disabled={isActive}>
				<FavoriteItem data={item} drag={drag} />
			</TouchableOpacity>
		);
	};

	return (
		<Surface>
			<ScrollView style={styles.container}>
				<View style={styles.userSection}>
					<Avatar
						containerStyle={styles.avatarContainer}
						size={200}
						source={{
							uri: `${Routes.DEV_API_ACCOUNTS}/persona/${encodeURIComponent(
								profileContext.data.persona_image ?? '',
							)}`,
						}}
						rounded
					/>
					<Button onPress={() => profileContext.actions.fetchPersona()}>
						<IconArrowsRandom size={24} />
					</Button>

					<View style={styles.nameRow}>
						<EditableText
							onBlur={handleFirstNameBlur}
							onChangeText={setFirstName}
							style={styles.userFullNameText}
							value={firstName}
						/>
						<EditableText
							onBlur={handleLastNameBlur}
							onChangeText={setLastName}
							style={styles.userFullNameText}
							value={lastName}
						/>
					</View>
				</View>

				<Section
					heading="Editar e ordenar favoritos"
					subheading="Organizar os cartões como quer que aparecçam na página inicial. Altere a ordem deslizando no ícone"
				/>

				<DraggableFlatList
					data={widgets}
					nestedScrollEnabled={false}
					renderItem={renderFavoriteItem}
					scrollEnabled={false} // <-- disables internal scroll
					showsVerticalScrollIndicator={false}
					keyExtractor={(item, index) =>
						`${item.settings.display_order ?? 'no_order'}-${index}`}
				/>

				<View style={styles.addFavoritesSection}>
					<Section
						heading="Adicionar favoritos"
						subheading="Escolha um tipo de cartão para adicionar à página principal."
					/>

					<TouchableOpacity
						onPress={() =>
							setModalFavoriteStopVisible(!modalFavoriteStopVisible)}
					>
						<ListItem>
							<IconBusStop color="#FF6900" size={24} />
							<ListItem.Content>
								<ListItem.Title style={styles.listTitle}>
									Paragem Favorita
								</ListItem.Title>
							</ListItem.Content>
							<IconCirclePlusFilled
								fill="#3CB43C"
								size={24}
								color={
									themeContext.theme.mode === 'light'
										? theming.colorSystemBackgroundLight100
										: theming.colorSystemBackgroundDark100
								}
							/>
						</ListItem>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={() =>
							setModalFavoriteLineVisible(!modalFavoriteLineVisible)}
					>
						<ListItem>
							<IconArrowLoopRight color="#C61D23" size={24} />
							<ListItem.Content>
								<ListItem.Title style={styles.listTitle}>
									Linha Favorita
								</ListItem.Title>
							</ListItem.Content>
							<IconCirclePlusFilled
								fill="#3CB43C"
								size={24}
								color={
									themeContext.theme.mode === 'light'
										? theming.colorSystemBackgroundLight100
										: theming.colorSystemBackgroundDark100
								}
							/>
						</ListItem>
					</TouchableOpacity>

					<TouchableOpacity>
						<ListItem disabledStyle={{ opacity: 0.5 }} disabled>
							<IconBellRinging color="#0C807E" size={24} />
							<ListItem.Content>
								<ListItem.Title style={styles.listTitle}>
									Notificações Inteligentes
								</ListItem.Title>
								<ListItem.Subtitle>
									Disponivel em breve
								</ListItem.Subtitle>
							</ListItem.Content>
							<IconCirclePlusFilled
								fill="#3CB43C"
								size={24}
								color={
									themeContext.theme.mode === 'light'
										? theming.colorSystemBackgroundLight100
										: theming.colorSystemBackgroundDark100
								}
							/>
						</ListItem>
					</TouchableOpacity>
				</View>
			</ScrollView>

			<AddFavoriteLine
				isVisible={modalFavoriteLineVisible}
				onBackdropPress={() => setModalFavoriteLineVisible(false)}
			/>
			<AddFavoriteStop
				isVisible={modalFavoriteStopVisible}
				onBackdropPress={() => setModalFavoriteStopVisible(false)}
			/>
		</Surface>
	);

	//
}
