/* * */
import RemoteImageCarousel from '@/components/cmui/RemoteImageCarousel';
import { Section } from '@/components/common/layout/Section';
import { useDebugContext } from '@/contexts/Debug.context';
import { useLocaleContext } from '@/contexts/Locale.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { useWebsiteNews } from '@/services/website/queries/useNews';
import { theming } from '@/theme/Variables';
import { Avatar, ListItem } from '@rneui/themed';
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
import { FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/* * */
/* * */
async function openInAppBrowser(url: string) {
	await WebBrowser.openBrowserAsync(url, {
		controlsColor: theming.colorBrand,
		presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
	});
}
/* * */

interface listItem {
	icon: React.ReactNode
	id: number
	onPress?: () => void
	title: string
}

/* * */
export default function MoreScreen() {
	//

	//
	// A. Setup varibles
	const localeContext = useLocaleContext();
	const debugContext = useDebugContext();
	const themeContext = useThemeContext();

	const styles = StyleSheet.create({
		banner: {
			borderRadius: 8,
		},
		container: {
			flex: 1,
			fontFamily: 'Inter',
		},
		flatList: {
			width: '100%',
		},
		icon: {
			color: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.primary : themeContext.theme.darkColors?.primary,
		},
		menuItem: {
			backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background,
			color: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.primary : themeContext.theme.darkColors?.primary,
		},
		safeArea: {
			backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background,
			flex: 1,
			width: '100%',
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

	const { data: news } = useWebsiteNews();

	const Supportlistdata: listItem[] = [
		{
			icon: <IconHelpHexagon color={styles.icon.color} size={32} />,
			id: 0,
			onPress: () => openInAppBrowser('https://www.carrismetropolitana.pt/faq'),
			title: 'Perguntas Frequentes',
		},
		{
			icon: <IconUmbrella color={styles.icon.color} size={32} />,
			id: 1,
			onPress: () => openInAppBrowser('https://www.carrismetropolitana.pt/lost-and-found'),
			title: 'Perdidos e Achados',
		},
		{
			icon: <IconBuildingStore color={styles.icon.color} size={32} />,
			id: 2,
			onPress: () => openInAppBrowser('https://www.carrismetropolitana.pt/stores'),
			title: 'Lojas e Rede de Agentes',
		},
		{
			icon: <IconMessages color={styles.icon.color} size={32} />,
			id: 3,
			onPress: () => openInAppBrowser('https://www.carrismetropolitana.pt/contacts'),
			title: 'Contactos',
		},
	];

	const Tarifslistdata: listItem[] = [
		{
			icon: <IconTicket color={styles.icon.color} size={32} />,
			id: 0,
			onPress: () => openInAppBrowser('https://www.carrismetropolitana.pt/tickets'),
			title: 'Bilhetes Ocasionais',
		},
		{
			icon: <IconCreditCardPay color={styles.icon.color} size={32} />,
			id: 1,
			onPress: () => openInAppBrowser('https://www.carrismetropolitana.pt/cards'),
			title: 'Passe Mensal',
		},
		{
			icon: <IconMapQuestion color={styles.icon.color} size={32} />,
			id: 2,
			onPress: () => openInAppBrowser('https://www.carrismetropolitana.pt/helpdesks'),
			title: 'Onde Comprar',
		},
	];

	const AboutCMlistdata: listItem[] = [
		{
			icon: <IconHomeStar color={styles.icon.color} size={32} />,
			id: 0,
			onPress: () => openInAppBrowser('https://carrismetropolitana.pt/about'),
			title: 'Sobre a CMetropolitana',
		},
		{
			icon: <IconChartBar color={styles.icon.color} size={32} />,
			id: 1,
			onPress: () => openInAppBrowser('https://carrismetropolitana.pt/metrics'),
			title: 'A nossa operação ao vivo',
		},
		{
			icon: <IconSpeakerphone color={styles.icon.color} size={32} />,
			id: 2,
			onPress: () => openInAppBrowser('https://carrismetropolitana.pt/opendata'),
			title: 'Dados Abertos',
		},
		{
			icon: <IconUserHeart color={styles.icon.color} size={32} />,
			id: 3,
			onPress: () => openInAppBrowser('https://carrismetropolitana.pt/motoristas'),
			title: 'Recrutamento',
		},
		{
			icon: <IconLockSquare color={styles.icon.color} size={32} />,
			id: 4,
			onPress: () => openInAppBrowser('https://www.carrismetropolitana.pt/privacy'),
			title: 'Privacidade',
		},
		{
			icon: <IconGavel color={styles.icon.color} size={32} />,
			id: 5,
			onPress: () => openInAppBrowser('https://www.carrismetropolitana.pt/legal'),
			title: 'Aviso legal',
		},
	];

	//
	// B. Render components

	const renderListItem = ({ item }: { item: listItem }) => {
		return (
			<ListItem onPress={item.onPress} style={styles.menuItem} bottomDivider topDivider>
				<Avatar titleStyle={styles.icon}>{item.icon}</Avatar>
				<ListItem.Content>
					<ListItem.Content>
						<ListItem.Title><Text>{item.title}</Text></ListItem.Title>
					</ListItem.Content>
				</ListItem.Content>
				<ListItem.Chevron />
			</ListItem>
		);
	};
	return (
		<SafeAreaView style={styles.safeArea}>
			<FlatList
				data={[]}
				keyExtractor={() => ''}
				renderItem={() => null}
				showsVerticalScrollIndicator={false}
				style={styles.container}
				ListHeaderComponent={(
					<>
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

						<Section heading="Apoio ao cliente" subheading="Tire as suas dúvidas sobre a Carris Metropolitana ou entre em contacto connosco.">
							<FlatList
								data={Supportlistdata}
								disableVirtualization={true}
								keyExtractor={item => item.id.toString()}
								nestedScrollEnabled={true}
								renderItem={({ item }: { item: listItem }) => renderListItem({ item })}
								style={styles.flatList}
							/>
						</Section>

						<Section heading="Tarifas" subheading="Descubra quanto custa viajar na CMetropolitana regularmente ou de vez em quando.">
							<FlatList
								data={Tarifslistdata}
								disableVirtualization={true}
								keyExtractor={item => item.id.toString()}
								nestedScrollEnabled={true}
								renderItem={({ item }: { item: listItem }) => renderListItem({ item })}
								style={styles.flatList}
							/>
						</Section>

						<Section
							heading="Carris Metropolitana"
							subheading="Conheça melhor a Carris Metropolitana e explore diferentes ângulos da operação rodoviária dos 18 municípios da área metropolitana de Lisboa."
						>
							<FlatList
								data={AboutCMlistdata}
								disableVirtualization={true}
								keyExtractor={item => item.id.toString()}
								nestedScrollEnabled={true}
								renderItem={({ item }: { item: listItem }) => renderListItem({ item })}
								style={styles.flatList}
							/>
						</Section>

						<Button onPress={localeContext.actions.changeToEnglish} title="Switch to English" />
						<Button onPress={localeContext.actions.changeToPortuguese} title="Switch to Portuguese" />
						<Button onPress={debugContext.actions.toggleDebugMode} title="Toggle Debug" />

						<Text style={styles.version}>Versão 2025.03.27-01</Text>
					</>
				)}
			/>
		</SafeAreaView>
	);

	//
}
