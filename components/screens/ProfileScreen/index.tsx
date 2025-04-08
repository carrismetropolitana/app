/* * */

import { Section } from '@/components//common/layout/Section';
import { Surface } from '@/components//common/layout/Surface';
import IconCirclePlusFilled from '@/components/icons/IconCirclePlusFilled';
import { useProfileContext } from '@/contexts/Profile.context';
import { theming } from '@/theme/Variables';
import { AccountWidget } from '@/types/account.types';
import { Avatar, Button, ListItem, Text } from '@rneui/themed';
import {
	IconArrowLoopRight,
	IconArrowRight,
	IconBellRinging,
	IconBusStop,
	IconGripVertical,
} from '@tabler/icons-react-native';
import * as WebBrowser from 'expo-web-browser';
import { FlatList, ScrollView, Touchable, TouchableOpacity, View } from 'react-native';
import { DragableFlatList } from 'react-native-draggable-flatlist';

import { styles } from './styles';

/* * */

async function openInAppBrowser(url: string) {
	await WebBrowser.openBrowserAsync(url, {
		controlsColor: theming.colorBrand,
		presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
	});
}

/* * */

export default function ProfileScreen() {
	//

	//
	// A. Setup variables
	const profileScreenStyles = styles();
	const profileContext = useProfileContext();

	const fullName = `${profileContext.data.profile?.profile?.first_name || 'Bruno'} ${profileContext.data.profile?.profile?.last_name || 'Castelo'}`;
	const favorites = [
		...(profileContext.data.favorite_lines || []),
		...(profileContext.data.favorite_stops || []),
	];

	//
	// B. Render components

	const Item = ({ data }: { data: { pattern_id: string, type: 'lines' } | { pattern_ids: string[], stop_id: string, type: 'stops' } }) => (
		<ListItem>
			<IconGripVertical color="#9696A0" size={24} />
			<ListItem.Content>
				<ListItem.Title>
					{data.type === 'lines' ? data.pattern_id : data.stop_id}
				</ListItem.Title>
				<ListItem.Subtitle>
					{data.type === 'lines' ? 'Paragem Favorita' : 'Paragem Favorita'}
				</ListItem.Subtitle>
			</ListItem.Content>
			<ListItem.Chevron />
		</ListItem>
	);

	return (
		<Surface>
			<View style={profileScreenStyles.userSection}>
				<Avatar
					containerStyle={profileScreenStyles.avatarContainer}
					size={200}
					source={{ uri: 'https://www.carrismetropolitana.pt/assets/featured/night-lines.png' }}
					rounded
				/>

				<View style={profileScreenStyles.userDetails}>
					<Text style={profileScreenStyles.userFullNameText}>{fullName}</Text>
					<Text style={profileScreenStyles.userTypeText}>
						{profileContext.data.profile?.profile?.utilization_type ? profileContext.data.profile?.profile?.utilization_type : 'Utilizador'}
					</Text>
				</View>
			</View>

			<Section heading="Editar e ordenar favoritos" subheading="Organizar os cartões como quer que aparecçam na página inicial. Altere a ordem deslizando no ícone" />

			<DragableFlatList
				data={favorites}
				keyExtractor={() => ''}
				renderItem={({ item }) => <Item data={item.data} />}
				showsVerticalScrollIndicator={false}
			/>

			<View style={profileScreenStyles.addFavoritesSection}>
				<Section heading="Adicionar favoritos" subheading="Escolha um tipo de cartão para adicionar à página principal." />
				<TouchableOpacity onPress={() => openInAppBrowser('https://www.carrismetropolitana.pt/tickets')}>
					<ListItem>
						<IconBusStop color="#FF6900" size={24} />
						<ListItem.Content>
							<ListItem.Title style={profileScreenStyles.listTitle}>Paragem Favorita</ListItem.Title>
						</ListItem.Content>
						<IconCirclePlusFilled color="#3CB43C" />
					</ListItem>
				</TouchableOpacity>

				<TouchableOpacity onPress={() => openInAppBrowser('https://www.carrismetropolitana.pt/tickets')}>
					<ListItem>
						<IconArrowLoopRight color="#C61D23" size={24} />
						<ListItem.Content>
							<ListItem.Title style={profileScreenStyles.listTitle}>Linha Favorita</ListItem.Title>
						</ListItem.Content>
						<IconCirclePlusFilled color="#3CB43C" />
					</ListItem>
				</TouchableOpacity>

				<TouchableOpacity onPress={() => openInAppBrowser('https://www.carrismetropolitana.pt/tickets')}>
					<ListItem disabledStyle={{ opacity: 0.5 }} disabled>
						<IconBellRinging color="#0C807E" size={24} />
						<ListItem.Content>
							<ListItem.Title style={profileScreenStyles.listTitle}>Notificações Inteligentes</ListItem.Title>
							<ListItem.Subtitle>Disponivel em breve</ListItem.Subtitle>
						</ListItem.Content>
						<IconCirclePlusFilled color="#3CB43C" />
					</ListItem>
				</TouchableOpacity>
			</View>
		</Surface>
	);

	//
}
