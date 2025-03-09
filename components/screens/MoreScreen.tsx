import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import {
	IconBuildingStore,
	IconChartBar,
	IconChevronRight,
	IconCreditCardPay,
	IconExternalLink,
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
} from "@tabler/icons-react-native";
import RemoteImageCarousel from "../cmui/RemoteImageCarousel";
import { SafeAreaView } from "react-native-safe-area-context";
import useThemedCMColor from "@/hooks/useThemedCMColor";

import { useWebsiteNews } from "@/services/website/queries/useNews";
import * as WebBrowser from "expo-web-browser";
import FullWidthList from "../cmui/FullWidthList";
import { CMColors } from "@/constants/Colors";

async function openInAppBrowser(url: string) {
	await WebBrowser.openBrowserAsync(url, {
		presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
		controlsColor: CMColors.light.brandYellowForText,
	});
}

export default function MoreScreen() {
	const { isPending, error, data: news } = useWebsiteNews();
	const systemText100 = useThemedCMColor("systemText100");
	const systemText400 = useThemedCMColor("systemText400");
	const systemBackground200 = useThemedCMColor("systemBackground200");
	const systemBackground100 = useThemedCMColor("systemBackground100");
	const systemText200 = useThemedCMColor("systemText200");
	const systemText300 = useThemedCMColor("systemText300");
	const systemBorder100 = useThemedCMColor("systemBorder100");

	const styles = makeStyles({
		systemBackground100,
		systemBackground200,
		systemText100,
		systemText200,
		systemText300,
		systemBorder100,
	});

	return (
		<SafeAreaView style={styles.safeArea}>
			<ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
				{/* top banner */}
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
						title="Apoio ao cliente"
						subtitle="Tire as suas dúvidas sobre a Carris Metropolitana ou entre em contacto connosco."
					>
						<FullWidthList.Item
							title="Perguntas Frequentes"
							leadingIcon={<IconHelpHexagon size={32} color={systemText100} />}
							onPress={() =>
								openInAppBrowser("https://www.carrismetropolitana.pt/faq")
							}
						/>
						<FullWidthList.Item
							title="Perdidos e Achados"
							leadingIcon={<IconUmbrella size={32} color={systemText100} />}
							onPress={() =>
								openInAppBrowser(
									"https://www.carrismetropolitana.pt/lost-and-found",
								)
							}
						/>
						<FullWidthList.Item
							title="Lojas e Rede de Agentes"
							leadingIcon={
								<IconBuildingStore size={32} color={systemText100} />
							}
							onPress={() => {
								/* navigation logic */
							}}
						/>
						<FullWidthList.Item
							title="Contactos"
							leadingIcon={<IconMessages size={32} color={systemText100} />}
							onPress={() =>
								openInAppBrowser("https://www.carrismetropolitana.pt/contacts")
							}
						/>
					</FullWidthList.Section>

					<FullWidthList.Section
						title="Tarifas"
						subtitle="Descubra quanto custa viajar na CMetropolitana regularmente ou de vez em quando."
					>
						<FullWidthList.Item
							title="Bilhetes Ocasionais"
							leadingIcon={<IconTicket size={32} color={systemText100} />}
							onPress={() =>
								openInAppBrowser("https://www.carrismetropolitana.pt/tickets")
							}
						/>
						<FullWidthList.Item
							title="Passe Mensal"
							leadingIcon={
								<IconCreditCardPay size={32} color={systemText100} />
							}
							onPress={() =>
								openInAppBrowser("https://www.carrismetropolitana.pt/cards")
							}
						/>
						<FullWidthList.Item
							title="Onde comprar"
							leadingIcon={<IconMapQuestion size={32} color={systemText100} />}
							onPress={() =>
								openInAppBrowser("https://www.carrismetropolitana.pt/helpdesks")
							}
						/>
					</FullWidthList.Section>

					<FullWidthList.Section
						title="Carris Metropolitana"
						subtitle="Conheça melhor a Carris Metropolitana e explore diferentes ângulos da operação rodoviária dos 18 municípios da área metropolitana de Lisboa."
					>
						<FullWidthList.Item
							title="Sobre a CMetropolitana"
							leadingIcon={<IconHomeStar size={32} color={systemText100} />}
							externalAction
							onPress={() =>
								openInAppBrowser("https://carrismetropolitana.pt/about")
							}
						/>
						<FullWidthList.Item
							title="A nossa operação ao vivo"
							leadingIcon={<IconChartBar size={32} color={systemText100} />}
							onPress={() =>
								openInAppBrowser("https://carrismetropolitana.pt/metrics")
							}
						/>
						<FullWidthList.Item
							title="Dados Abertos"
							leadingIcon={<IconSpeakerphone size={32} color={systemText100} />}
							onPress={() =>
								openInAppBrowser("https://carrismetropolitana.pt/opendata")
							}
						/>
						<FullWidthList.Item
							title="Recrutamento"
							leadingIcon={<IconUserHeart size={32} color={systemText100} />}
							onPress={() =>
								openInAppBrowser("https://carrismetropolitana.pt/motoristas")
							}
						/>
						<FullWidthList.Item
							title="Privacidade"
							leadingIcon={<IconLockSquare size={32} color={systemText100} />}
							onPress={() =>
								openInAppBrowser("https://www.carrismetropolitana.pt/privacy")
							}
						/>
						<FullWidthList.Item
							title="Aviso legal"
							leadingIcon={<IconGavel size={32} color={systemText100} />}
							onPress={() =>
								openInAppBrowser("https://www.carrismetropolitana.pt/legal")
							}
						/>
					</FullWidthList.Section>
				</FullWidthList>

				{/* version */}
				<Text style={styles.version}>Versão 2024.09.12-015</Text>
			</ScrollView>
		</SafeAreaView>
	);
}

const makeStyles = ({
	systemBackground100,
	systemBackground200,
	systemText100,
	systemText200,
	systemText300,
	systemBorder100,
}: {
	systemBackground100: string;
	systemBackground200: string;
	systemText100: string;
	systemText200: string;
	systemText300: string;
	systemBorder100: string;
}) =>
	StyleSheet.create({
		safeArea: {
			flex: 1,
			backgroundColor: systemBackground200,
		},
		container: {
			flex: 1,
			fontFamily: "Inter",
		},
		banner: {
			borderRadius: 8,
		},
		version: {
			marginTop: 8,
			marginLeft: 16,
			marginBottom: 32 + 60, // to account for the bottom bar
			fontSize: 12,
			color: "#aaa",
			textAlign: "left",
		},
	});
