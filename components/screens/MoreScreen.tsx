/* * */
import { useDebugContext } from '@/contexts/Debug.context';
import { useLocaleContext } from '@/contexts/Locale.context';
import { useWebsiteNews } from '@/services/website/queries/useNews';
import { theming } from '@/theme/Variables';
import {
	IconBuildingStore,
	IconChartBar,
	IconCreditCardPay,
	IconGavel,
	IconHelpHexagon,
	IconHomeStar,
	IconLockSquare,
	IconMapQuestion,
	IconMessages,
	IconSpeakerphone,
	IconTicket,
	IconUmbrella,
	IconUserHeart,
} from '@tabler/icons-react-native';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FullWidthList from '../cmui/FullWidthList';
import RemoteImageCarousel from '../cmui/RemoteImageCarousel';

/* * */
/* * */
async function openInAppBrowser(url: string) {
	await WebBrowser.openBrowserAsync(url, {
		controlsColor: theming.colorBrand,
		presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
	});
}
/* * */

export default function MoreScreen() {
	//

	//
	// A. Setup varibles
	const { data: news } = useWebsiteNews();

	const localeContext = useLocaleContext();
	const debugContext = useDebugContext();
	//

	const styles = StyleSheet.create({
		banner: {
			borderRadius: 8,
		},
		container: {
			flex: 1,
			fontFamily: 'Inter',
		},
		safeArea: {
			backgroundColor: theming.colorSystemBackground200,
			flex: 1,
		},
		version: {
			color: '#aaa',
			fontSize: 12,
			marginBottom: 32 + 60,
			marginLeft: 16,
			marginTop: 8,
			textAlign: 'left',
		},
	});
	// B. Render components
	return (
		<SafeAreaView style={styles.safeArea}>
			<ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
				<View style={styles.banner}>
					<RemoteImageCarousel
						imageUrls={news?.map((n: NewsData) => n.cover_image_src) || []}
						onImagePress={async (index) => {
							await openInAppBrowser(
								`https://carrismetropolitana.pt/news/${news?.[index]?._id}`,
							);
						}}
					/>
				</View>

				<FullWidthList>
					<FullWidthList.Section
						subtitle="Tire as suas dúvidas sobre a Carris Metropolitana ou entre em contacto connosco."
						title="Apoio ao cliente"
					>
						<FullWidthList.Item
							leadingIcon={<IconHelpHexagon color={theming.colorSystemText100} size={32} />}
							title="Perguntas Frequentes"
							onPress={() =>
								openInAppBrowser('https://www.carrismetropolitana.pt/faq')}
						/>
						<FullWidthList.Item
							leadingIcon={<IconUmbrella color={theming.colorSystemText100} size={32} />}
							title="Perdidos e Achados"
							onPress={
								() =>
									openInAppBrowser(
										'https://www.carrismetropolitana.pt/lost-and-found',
									)
							}
						/>
						<FullWidthList.Item
							title="Lojas e Rede de Agentes"
							leadingIcon={
								<IconBuildingStore color={theming.colorSystemText100} size={32} />
							}
						/>
						<FullWidthList.Item
							leadingIcon={<IconMessages color={theming.colorSystemText100} size={32} />}
							title="Contactos"
							onPress={() =>
								openInAppBrowser('https://www.carrismetropolitana.pt/contacts')}
						/>
					</FullWidthList.Section>

					<FullWidthList.Section
						subtitle="Descubra quanto custa viajar na CMetropolitana regularmente ou de vez em quando."
						title="Tarifas"
					>
						<FullWidthList.Item
							leadingIcon={<IconTicket color={theming.colorSystemText100} size={32} />}
							title="Bilhetes Ocasionais"
							onPress={() =>
								openInAppBrowser('https://www.carrismetropolitana.pt/tickets')}
						/>
						<FullWidthList.Item
							title="Passe Mensal"
							leadingIcon={
								<IconCreditCardPay color={theming.colorSystemText100} size={32} />
							}
							onPress={() =>
								openInAppBrowser('https://www.carrismetropolitana.pt/cards')}
						/>
						<FullWidthList.Item
							leadingIcon={<IconMapQuestion color={theming.colorSystemText100} size={32} />}
							title="Onde comprar"
							onPress={() =>
								openInAppBrowser('https://www.carrismetropolitana.pt/helpdesks')}
						/>
					</FullWidthList.Section>

					<FullWidthList.Section
						subtitle="Conheça melhor a Carris Metropolitana e explore diferentes ângulos da operação rodoviária dos 18 municípios da área metropolitana de Lisboa."
						title="Carris Metropolitana"
					>
						<FullWidthList.Item
							leadingIcon={<IconHomeStar color={theming.colorSystemText100} size={32} />}
							title="Sobre a CMetropolitana"
							onPress={() =>
								openInAppBrowser('https://carrismetropolitana.pt/about')}
							externalAction
						/>
						<FullWidthList.Item
							leadingIcon={<IconChartBar color={theming.colorSystemText100} size={32} />}
							title="A nossa operação ao vivo"
							onPress={() =>
								openInAppBrowser('https://carrismetropolitana.pt/metrics')}
						/>
						<FullWidthList.Item
							leadingIcon={<IconSpeakerphone color={theming.colorSystemText100} size={32} />}
							title="Dados Abertos"
							onPress={() =>
								openInAppBrowser('https://carrismetropolitana.pt/opendata')}
						/>
						<FullWidthList.Item
							leadingIcon={<IconUserHeart color={theming.colorSystemText100} size={32} />}
							title="Recrutamento"
							onPress={() =>
								openInAppBrowser('https://carrismetropolitana.pt/motoristas')}
						/>
						<FullWidthList.Item
							leadingIcon={<IconLockSquare color={theming.colorSystemText100} size={32} />}
							title="Privacidade"
							onPress={() =>
								openInAppBrowser('https://www.carrismetropolitana.pt/privacy')}
						/>
						<FullWidthList.Item
							leadingIcon={<IconGavel color={theming.colorSystemText100} size={32} />}
							title="Aviso legal"
							onPress={() =>
								openInAppBrowser('https://www.carrismetropolitana.pt/legal')}
						/>
					</FullWidthList.Section>
				</FullWidthList>
				<Button onPress={localeContext.actions.changeToEnglish} title="Switch to English" />
				<Button onPress={localeContext.actions.changeToPortuguese} title="Switch to Portuguese" />
				<Button onPress={debugContext.actions.toggleDebugMode} title="Toggle Debug" />
				<Text style={styles.version}>Versão 2024.09.12-015</Text>
			</ScrollView>
		</SafeAreaView>
	);

	//
}
