/* * */

import { Section } from '@/components//common/layout/Section';
import { Surface } from '@/components//common/layout/Surface';
import FullWidthList from '@/components/cmui/FullWidthList';
import IconCirclePlusFilled from '@/components/icons/IconCirclePlusFilled';
import { useProfileContext } from '@/contexts/Profile.context';
import { theming } from '@/theme/Variables';
import { Avatar, Text } from '@rneui/themed';
import {
	IconArrowLoopRight,
	IconArrowRight,
	IconBellRinging,
	IconBusStop,
	IconGripVertical,
} from '@tabler/icons-react-native';
import * as WebBrowser from 'expo-web-browser';
import { ScrollView, View } from 'react-native';

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
	//
	// B. Render components

	return (
		<ScrollView showsVerticalScrollIndicator={false} style={profileScreenStyles.container}>
			<Surface>
				<Section heading="Perfil" subheading="Informações do utilizador">

					<Text>{profileContext.data.favorite_lines || 'Nenhuma linha'}</Text>
					<Text>{profileContext.data.favorite_stops || 'Nehumna paragem'}</Text>

					<View style={profileScreenStyles.userSection}>
						<Avatar
							containerStyle={profileScreenStyles.avatarContainer}
							size={200}
							source={{ uri: '@/assets/avatars/base-1|crista|p_fazer_bigode|piercing_nariz|alargador_xl|tattoo_1|manga_cava.png' }}
							rounded
						/>

						<View style={profileScreenStyles.userDetails}>
							<Text style={profileScreenStyles.userFullNameText}>António Soares</Text>
							<Text style={[profileScreenStyles.userTypeText, { color: '#3D85C6' }]}>
								Entusiasta
							</Text>
						</View>
					</View>

					<FullWidthList>
						<FullWidthList.Section
							subtitle="Organize os cartões como quer que apareçam na página principal. Altere a ordem deslizando no ícone"
							title="Editar e ordenar favoritos"
						>
							<FullWidthList.Item
								leadingIcon={<IconGripVertical color="#9696A0" size={24} />}
								onPress={() => null}
								title="Hospital (Elvas)"
								topText="Paragem Favorita"
								trailingIcon={<IconArrowRight color="#FFF" size={24} />}
							/>
						</FullWidthList.Section>

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
					</FullWidthList>
				</Section>
			</Surface>
		</ScrollView>
	);

	//
}
