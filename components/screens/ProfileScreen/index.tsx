/* * */
import { Section } from '@/components/common/layout/Section';
import { Surface } from '@/components/common/layout/Surface';
import IconCirclePlusFilled from '@/components/icons/IconCirclePlusFilled';
import { useProfileContext } from '@/contexts/Profile.context';
import { theming } from '@/theme/Variables';
import { Avatar, ListItem, Text } from '@rneui/themed';
import {
	IconArrowLoopRight,
	IconBellRinging,
	IconBusStop,
	IconGripVertical,
} from '@tabler/icons-react-native';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
/* * */

import { styles as useStyles } from './styles';

/* * */

/* * */
async function openInAppBrowser(url: string) {
	await WebBrowser.openBrowserAsync(url, {
		controlsColor: theming.colorBrand,
		presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
	});
}
/* * */

/* * */
interface FavoriteDataLines {
	pattern_id: string
	type: 'lines'
}
/* * */

/* * */
interface FavoriteDataStops {
	pattern_ids: string[]
	stop_id: string
	type: 'stops'
}
/* * */

/* * */
type FavoriteData = FavoriteDataLines | FavoriteDataStops;
/* * */

/* * */
interface FavoriteItemProps {
	data: FavoriteData
}
/* * */

export default function ProfileScreen() {
	//

	//
	// A. Setup variables

	const styles = useStyles();
	const profileContext = useProfileContext();
	const { favorite_lines, favorite_stops, profile } = profileContext.data;
	const fullName = `${profile?.profile?.first_name ?? 'Bruno'} ${profile?.profile?.last_name ?? 'Castelo'}`;
	const favorites = [
		...(favorite_lines || []),
		...(favorite_stops || []),
	];

	//
	// B. Render Components

	const renderFavoriteItem = ({ drag, isActive, item }: any) => (
		<TouchableOpacity disabled={isActive} onLongPress={drag}>
			<FavoriteItem data={item.data} />
		</TouchableOpacity>
	);

	const FavoriteItem = ({ data }: FavoriteItemProps) => (
		<ListItem>
			<IconGripVertical color="#9696A0" size={24} />
			<ListItem.Content>
				<ListItem.Title>
					{data.type === 'lines' ? data.pattern_id : data.stop_id}
				</ListItem.Title>
				<ListItem.Subtitle>Paragem Favorita</ListItem.Subtitle>
			</ListItem.Content>
			<ListItem.Chevron />
		</ListItem>
	);

	return (
		<Surface>
			<View>
				<View style={styles.userSection}>
					<Avatar
						containerStyle={styles.avatarContainer}
						size={200}
						// eslint-disable-next-line @typescript-eslint/no-require-imports
						source={require('@/assets/avatars/base-1|crista|p_fazer_bigode|piercing_nariz|alargador_xl|tattoo_1|manga_cava.png')}
						rounded
					/>
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

				<DraggableFlatList
					data={favorites}
					renderItem={renderFavoriteItem}
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

					<TouchableOpacity onPress={() => openInAppBrowser('https://www.carrismetropolitana.pt/tickets')}>
						<ListItem>
							<IconBusStop color="#FF6900" size={24} />
							<ListItem.Content>
								<ListItem.Title style={styles.listTitle}>Paragem Favorita</ListItem.Title>
							</ListItem.Content>
							<IconCirclePlusFilled color="#3CB43C" />
						</ListItem>
					</TouchableOpacity>

					<TouchableOpacity onPress={() => openInAppBrowser('https://www.carrismetropolitana.pt/tickets')}>
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
			</View>
		</Surface>
	);

	//
}
