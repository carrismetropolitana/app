/* * */

import { CMColors } from '@/constants/Colors';
import useThemedCMColor from '@/hooks/useThemedCMColor';
import {
	IconArrowLoopRight,
	IconArrowRight,
	IconBellRinging,
	IconBusStop,
	IconGripVertical,
} from '@tabler/icons-react-native';
import Avatar from '@zamplyy/react-native-nice-avatar';
import * as WebBrowser from 'expo-web-browser';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import FullWidthList from '../cmui/FullWidthList';
import IconCirclePlusFilled from '../icons/IconCirclePlusFilled';

/* * */

/* * */

async function openInAppBrowser(url: string) {
	await WebBrowser.openBrowserAsync(url, {
		controlsColor: CMColors.light.brandYellowForText,
		presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
	});
}

/* * */

export default function ProfileScreen() {
	//

	//
	// A. Setup variables

	const systemText100 = useThemedCMColor('systemText100');
	const systemText400 = useThemedCMColor('systemText400');
	const systemBackground200 = useThemedCMColor('systemBackground200');
	const systemBackground100 = useThemedCMColor('systemBackground100');
	const systemText200 = useThemedCMColor('systemText200');
	const systemText300 = useThemedCMColor('systemText300');
	const systemBorder100 = useThemedCMColor('systemBorder100');

	const makeStyles = ({
		systemBackground100,
		systemBackground200,
		systemBorder100,
		systemText100,
		systemText200,
		systemText300,
	}: {
		systemBackground100: string
		systemBackground200: string
		systemBorder100: string
		systemText100: string
		systemText200: string
		systemText300: string
	}) =>
		StyleSheet.create({
			container: {
				flex: 1,
				fontFamily: 'Inter',
			},
			safeArea: {
				backgroundColor: systemBackground200,
				flex: 1,
			},
			userDetails: {
				alignItems: 'center',
				gap: 6,
				justifyContent: 'center',
				paddingVertical: 24,
			},
			userFullNameText: {
				color: systemText100,
				fontSize: 26,
				fontWeight: 700,
			},
			userSection: {
				alignItems: 'center',
				backgroundColor: systemBackground100,
				justifyContent: 'center',
				paddingTop: 36,
			},
			userTypeText: {
				fontSize: 14,
				fontWeight: 700,
			},
			version: {
				color: '#aaa',
				fontSize: 12,
				marginBottom: 32 + 60, // to account for the bottom bar
				marginLeft: 16,
				marginTop: 8,
				textAlign: 'left',
			},
		});

	const styles = makeStyles({
		systemBackground100,
		systemBackground200,
		systemBorder100,
		systemText100,
		systemText200,
		systemText300,
	});

	//
	// B. Render components

	return (
		<ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
			<View style={styles.userSection}>
				<Avatar
					bgColor="#ECF3F8"
					earSize="small"
					eyeStyle="smile"
					faceColor="#FFDD00"
					glassesStyle="none"
					hairColor="black"
					hairStyle="thick"
					hatStyle="none"
					mouthStyle="peace"
					sex="man"
					shape="circle"
					shirtColor="white"
					shirtStyle="polo"
					size={200}
					style={{
						borderColor: '#3D85C6',
						borderWidth: 10,
					}}
				/>

				<View style={styles.userDetails}>
					<Text style={styles.userFullNameText}>António Soares</Text>
					<Text style={[styles.userTypeText, { color: '#3D85C6' }]}>
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
		</ScrollView>
	);

	//
}
