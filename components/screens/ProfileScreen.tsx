import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import {
	IconArrowLoopRight,
	IconArrowRight,
	IconBellRinging,
	IconBusStop,
	IconGripVertical,
} from "@tabler/icons-react-native";
import RemoteImageCarousel from "../cmui/RemoteImageCarousel";
import { SafeAreaView } from "react-native-safe-area-context";
import useThemedCMColor from "@/hooks/useThemedCMColor";

import { useWebsiteNews } from "@/services/website/queries/useNews";
import * as WebBrowser from "expo-web-browser";
import FullWidthList from "../cmui/FullWidthList";
import { CMColors } from "@/constants/Colors";
import Svg, { Path } from "react-native-svg";
import IconCirclePlusFilled from "../icons/IconCirclePlusFilled";

async function openInAppBrowser(url: string) {
	await WebBrowser.openBrowserAsync(url, {
		presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
		controlsColor: CMColors.light.brandYellowForText,
	});
}

export default function ProfileScreen() {
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
		<ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
			{/* top banner */}
			{/* <View style={styles.banner}>

			</View> */}
			<FullWidthList>
				<FullWidthList.Section
					title="Editar e ordenar favoritos"
					subtitle="Organize os cartões como quer que apareçam na página principal. Altere a ordem deslizando no ícone"
				>
					<FullWidthList.Item
						topText="Paragem Favorita"
						title="Hospital (Elvas)"
						leadingIcon={<IconGripVertical size={24} color="#9696A0" />}
						trailingIcon={<IconArrowRight size={24} color="#FFF" />}
						onPress={() => {}}
					/>
				</FullWidthList.Section>

				<FullWidthList.Section
					title="Adicionar novo favorito"
					subtitle="Escolha um tipo de cartão para adicionar à página principal."
				>
					<FullWidthList.Item
						title="Paragem Favorita"
						leadingIcon={<IconBusStop size={32} color="#FF6900" />}
						trailingIcon={<IconCirclePlusFilled color="#3CB43C" />}
						onPress={() =>
							openInAppBrowser("https://www.carrismetropolitana.pt/tickets")
						}
					/>
					<FullWidthList.Item
						title="Linha Favorita"
						leadingIcon={<IconArrowLoopRight size={32} color="#C61D23" />}
						trailingIcon={<IconCirclePlusFilled color="#3CB43C" />}
						onPress={() =>
							openInAppBrowser("https://www.carrismetropolitana.pt/cards")
						}
					/>

					<FullWidthList.Item
						title="Notificações Inteligentes"
						bottomText="Disponível em breve"
						leadingIcon={<IconBellRinging size={32} color={systemText100} />}
						trailingIcon={<IconCirclePlusFilled color="#3CB43C" />}
						onPress={() =>
							openInAppBrowser("https://www.carrismetropolitana.pt/helpdesks")
						}
						disabled
					/>
				</FullWidthList.Section>
			</FullWidthList>
		</ScrollView>
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
