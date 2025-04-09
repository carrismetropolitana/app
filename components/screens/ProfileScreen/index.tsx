/* * */
import { Section } from '@/components/common/layout/Section';
import { Surface } from '@/components/common/layout/Surface';
import IconCirclePlusFilled from '@/components/icons/IconCirclePlusFilled';
import { useProfileContext } from '@/contexts/Profile.context';
import { Avatar, Button, ListItem, Text } from '@rneui/themed';
import {
	IconArrowLoopRight,
	IconArrowsRandom,
	IconBellRinging,
	IconBusStop,
	IconGripVertical,
} from '@tabler/icons-react-native';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
/* * */

import AddFavoriteLine from '@/app/(modal)/AddFavoriteLine';
import AddFavoriteStop from '@/app/(modal)/AddFavoriteStop';
import { useThemeContext } from '@/contexts/Theme.context';
import { Routes } from '@/utils/routes';
import { useNavigation } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';

import { styles as useStyles } from './styles';

/* * */
interface FavoriteDataLines {
	pattern_id: string
	type: 'lines'
}
/* * */
interface FavoriteDataStops {
	pattern_ids: string[]
	stop_id: string
	type: 'stops'
}
/* * */

type FavoriteData = FavoriteDataLines | FavoriteDataStops;
/* * */

interface FavoriteItemProps {
	data: FavoriteData
	drag: () => void
}
/* * */

export default function ProfileScreen() {
	//

	//
	// A. Setup variables
	const navigation = useNavigation();
	const themeContext = useThemeContext();
	const styles = useStyles();
	const profileContext = useProfileContext();
	const { favorite_lines, favorite_stops, profile } = profileContext.data;
	const fullName = `${profile?.profile?.first_name ?? 'Bruno'} ${profile?.profile?.last_name ?? 'Castelo'}`;
	const favorites = [...(favorite_lines || []), ...(favorite_stops || [])];
	const [modalFavoriteLineVisible, setModalFavoriteLineVisible] = useState(false);
	const [modalFavoriteStopVisible, setModalFavoriteStopVisible] = useState(false);

	//

	// B. Fetch data
	useEffect(() => {
		navigation.setOptions({
			headerStyle: {
				backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background,
			},
		});
	}, [navigation, themeContext.theme.mode]);

	// console.log(' =====>>>>> ', profileContext.data.persona_image);
	//

	// C. Render Components

	const renderFavoriteItem = ({ drag, isActive, item }: any) => (
		<TouchableOpacity disabled={isActive}>
			<FavoriteItem data={item.data} drag={drag} />
		</TouchableOpacity>
	);

	const FavoriteItem = ({ data, drag }: FavoriteItemProps) => (
		<ListItem>
			<TouchableOpacity onPressIn={drag}>
				<IconGripVertical color="#9696A0" size={28} />
			</TouchableOpacity>
			<ListItem.Content>
				<ListItem.Title>
					{data.type === 'lines' ? data.pattern_id : data.stop_id}
				</ListItem.Title>
				<ListItem.Subtitle>{data.type === 'lines' ? 'Linha Favorita' : 'Paragem Favorita'}</ListItem.Subtitle>
			</ListItem.Content>
			<ListItem.Chevron />
		</ListItem>
	);

	return (
		<Surface>
			<ScrollView style={styles.container}>
				<View style={styles.userSection}>
					<Avatar
						containerStyle={styles.avatarContainer}
						size={200}
						source={{ uri: `${Routes.DEV_API_ACCOUNTS}/persona/${encodeURIComponent(profileContext.data.persona_image ?? '')}` }}
						rounded
					/>
					<Button onPress={() => profileContext.actions.fetchPersona()}>
						<IconArrowsRandom size={24} />
					</Button>

					<View style={styles.userDetails}>
						<Text style={styles.userFullNameText}>{fullName}</Text>
						<Text style={styles.userTypeText}>
							{profile?.profile?.utilization_type ?? 'Utilizador'}
						</Text>
					</View>
				</View>

				<Section
					heading="Editar e ordenar favoritos"
					subheading="Organizar os cartões como quer que aparecçam na página inicial. Altere a ordem deslizando no ícone"
				/>

				{/* TODO: Implementar a função de drag and drop (it reorders but dosnt save the position) */}
				<DraggableFlatList
					data={favorites}
					renderItem={renderFavoriteItem}
					scrollEnabled={false}
					showsVerticalScrollIndicator={false}
					keyExtractor={(item, index) =>
						`${item.settings.display_order ?? 'no_order'}-${index}`}
					nestedScrollEnabled
				/>

				<View style={styles.addFavoritesSection}>
					<Section
						heading="Adicionar favoritos"
						subheading="Escolha um tipo de cartão para adicionar à página principal."
					/>

					<TouchableOpacity onPress={() => setModalFavoriteStopVisible(!modalFavoriteLineVisible)}>
						<ListItem>
							<IconBusStop color="#FF6900" size={24} />
							<ListItem.Content>
								<ListItem.Title style={styles.listTitle}>Paragem Favorita</ListItem.Title>
							</ListItem.Content>
							<IconCirclePlusFilled color="#3CB43C" />
						</ListItem>
					</TouchableOpacity>

					<TouchableOpacity onPress={() => setModalFavoriteLineVisible(!modalFavoriteStopVisible)}>
						<ListItem>
							<IconArrowLoopRight color="#C61D23" size={24} />
							<ListItem.Content>
								<ListItem.Title style={styles.listTitle}>Linha Favorita</ListItem.Title>
							</ListItem.Content>
							<IconCirclePlusFilled color="#3CB43C" />
						</ListItem>
					</TouchableOpacity>

					<TouchableOpacity>
						<ListItem disabledStyle={{ opacity: 0.5 }} disabled>
							<IconBellRinging color="#0C807E" size={24} />
							<ListItem.Content>
								<ListItem.Title style={styles.listTitle}>Notificações Inteligentes</ListItem.Title>
								<ListItem.Subtitle>Disponivel em breve</ListItem.Subtitle>
							</ListItem.Content>
							<IconCirclePlusFilled color="#3CB43C" />
						</ListItem>
					</TouchableOpacity>
				</View>
			</ScrollView>

			<AddFavoriteLine isVisible={modalFavoriteLineVisible} onBackdropPress={() => setModalFavoriteLineVisible(false)} />
			<AddFavoriteStop isVisible={modalFavoriteStopVisible} onBackdropPress={() => setModalFavoriteStopVisible(false)} />

		</Surface>
	);

	//
}
