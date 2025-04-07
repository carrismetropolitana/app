/* * */

import { Section } from '@/components//common/layout/Section';
import { Surface } from '@/components//common/layout/Surface';
import FullWidthList from '@/components/cmui/FullWidthList';
import IconCirclePlusFilled from '@/components/icons/IconCirclePlusFilled';
import { useProfileContext } from '@/contexts/Profile.context';
import { theming } from '@/theme/Variables';
import { AccountWidget } from '@/types/account.types';
import { Avatar, ListItem, Text } from '@rneui/themed';
import {
	IconArrowLoopRight,
	IconArrowRight,
	IconBellRinging,
	IconBusStop,
	IconGripVertical,
} from '@tabler/icons-react-native';
import * as WebBrowser from 'expo-web-browser';
import { FlatList, ScrollView, View } from 'react-native';

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
			<ScrollView showsVerticalScrollIndicator={false} style={profileScreenStyles.container}>
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

				<FlatList
					data={favorites}
					keyExtractor={() => ''}
					renderItem={({ item }) => <Item data={item.data} />}
					showsVerticalScrollIndicator={false}
				/>

				{/* <FullWidthList>
					keyExtractor={(item, index) => index.toString()}
					renderItem={({ item }: { item: ItemProps }) => (
						<Item
							title={item.settings.label || 'Unknown'}
							data={item.data}
							settings={item.settings}
						/>
					)}
						onPress={() => null}
						title="Hospital (Elvas)"
						topText="Paragem Favorita"
						trailingIcon={<IconArrowRight color="#FFF" size={24} />}
					/>

					<FullWidthList.Section
						subtitle="Escolha um tipo de cartão para adicionar à página principal."
						title="Adicionar novo favorito"
					>
						<FullWidthList.Item
							leadingIcon={<IconBusStop color="#FF6900" size={32} />}
							title="Paragem Favorita"
							trailingIcon={<IconCirclePlusFilled color="#3CB43C" />}
							onPress={() =>
								openInAppBrowser('https://www.carrismetropolitana.pt/tickets')}
						/>
						<FullWidthList.Item
							leadingIcon={<IconArrowLoopRight color="#C61D23" size={32} />}
							title="Linha Favorita"
							trailingIcon={<IconCirclePlusFilled color="#3CB43C" />}
							onPress={() =>
								openInAppBrowser('https://www.carrismetropolitana.pt/cards')}
						/>

						<FullWidthList.Item
							bottomText="Disponível em breve"
							leadingIcon={<IconBellRinging color="#0C807E" size={32} />}
							title="Notificações Inteligentes"
							trailingIcon={<IconCirclePlusFilled color="#3CB43C" />}
							onPress={() =>
								openInAppBrowser('https://www.carrismetropolitana.pt/helpdesks')}
							disabled
						/>
					</FullWidthList.Section>
				</FullWidthList> */}

			</ScrollView>
		</Surface>
	);

	//
}
