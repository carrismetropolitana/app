/* * */

import RemoteImageCarousel from '@/components/cmui/RemoteImageCarousel';
import { Section } from '@/components/common/layout/Section';
import { useDebugContext } from '@/contexts/Debug.context';
import { useLocaleContext } from '@/contexts/Locale.context';
import { useWebsiteNews } from '@/services/website/queries/useNews';
import { listItem } from '@/types/moreList.types';
import { openInAppBrowser } from '@/utils/openInAppBrowser';
import { Avatar, ButtonGroup, ListItem, Text } from '@rneui/themed';
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
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import styles from './styles';

/* * */

export default function MoreScreen() {
	//

	//
	// A. Setup varibles

	const localeContext = useLocaleContext();
	const debugContext = useDebugContext();

	const { t } = useTranslation('translation', { keyPrefix: 'more' });
	const { data: news } = useWebsiteNews();

	const [selectedIndex, setSelectedIndex] = useState(0);

	const moreStyles = styles();

	const Supportlistdata: listItem[] = [
		{
			icon: <IconHelpHexagon color={moreStyles.icon.color} size={32} />,
			id: 0,
			onPress: () => openInAppBrowser('https://www.carrismetropolitana.pt/faq'),
			title: t('SupportList.frequently_asked'),
		},
		{
			icon: <IconUmbrella color={moreStyles.icon.color} size={32} />,
			id: 1,
			onPress: () => openInAppBrowser('https://www.carrismetropolitana.pt/lost-and-found'),
			title: t('SupportList.lost_found'),
		},
		{
			icon: <IconBuildingStore color={moreStyles.icon.color} size={32} />,
			id: 2,
			onPress: () => openInAppBrowser('https://www.carrismetropolitana.pt/stores'),
			title: t('SupportList.stores'),
		},
		{
			icon: <IconMessages color={moreStyles.icon.color} size={32} />,
			id: 3,
			onPress: () => openInAppBrowser('https://www.carrismetropolitana.pt/contacts'),
			title: t('SupportList.contacts'),
		},
	];

	const Tarifslistdata: listItem[] = [
		{
			icon: <IconTicket color={moreStyles.icon.color} size={32} />,
			id: 0,
			onPress: () => openInAppBrowser('https://www.carrismetropolitana.pt/tickets'),
			title: t('TarifsList.ocasional_tickets'),
		},
		{
			icon: <IconCreditCardPay color={moreStyles.icon.color} size={32} />,
			id: 1,
			onPress: () => openInAppBrowser('https://www.carrismetropolitana.pt/cards'),
			title: t('TarifsList.monthly_tickets'),
		},
		{
			icon: <IconMapQuestion color={moreStyles.icon.color} size={32} />,
			id: 2,
			onPress: () => openInAppBrowser('https://www.carrismetropolitana.pt/helpdesks'),
			title: t('TarifsList.where_to_buy'),
		},
	];

	const AboutCMlistdata: listItem[] = [
		{
			icon: <IconHomeStar color={moreStyles.icon.color} size={32} />,
			id: 0,
			onPress: () => openInAppBrowser('https://carrismetropolitana.pt/about'),
			title: t('AboutCMList.about_carrismetropolitana'),
		},
		{
			icon: <IconChartBar color={moreStyles.icon.color} size={32} />,
			id: 1,
			onPress: () => openInAppBrowser('https://carrismetropolitana.pt/metrics'),
			title: t('AboutCMList.our_operation_live'),
		},
		{
			icon: <IconSpeakerphone color={moreStyles.icon.color} size={32} />,
			id: 2,
			onPress: () => openInAppBrowser('https://carrismetropolitana.pt/opendata'),
			title: t('AboutCMList.open_data'),
		},
		{
			icon: <IconUserHeart color={moreStyles.icon.color} size={32} />,
			id: 3,
			onPress: () => openInAppBrowser('https://carrismetropolitana.pt/motoristas'),
			title: t('AboutCMList.recruitment'),
		},
		{
			icon: <IconLockSquare color={moreStyles.icon.color} size={32} />,
			id: 4,
			onPress: () => openInAppBrowser('https://www.carrismetropolitana.pt/privacy'),
			title: t('AboutCMList.privacy'),
		},
		{
			icon: <IconGavel color={moreStyles.icon.color} size={32} />,
			id: 5,
			onPress: () => openInAppBrowser('https://www.carrismetropolitana.pt/legal'),
			title: t('AboutCMList.legal_notices'),
		},
	];

	// B. Handle Actions

	const handlePress = (index: number) => {
		setSelectedIndex(index);
		switch (index) {
			case 0:
				localeContext.actions.changeToEnglish();
				break;
			case 1:
				localeContext.actions.changeToPortuguese();
				break;
			case 2:
				debugContext.actions.toggleDebugMode();
				break;
			default:
				break;
		}
	};

	//
	// C. Render components

	const renderListItem = ({ item }: { item: listItem }) => {
		return (
			<ListItem onPress={item.onPress} style={moreStyles.menuItem} bottomDivider topDivider>
				<Avatar titleStyle={moreStyles.icon}>{item.icon}</Avatar>
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
		<SafeAreaView style={moreStyles.safeArea}>
			<FlatList
				data={[]}
				keyExtractor={() => ''}
				renderItem={() => null}
				showsVerticalScrollIndicator={false}
				style={moreStyles.container}
				ListHeaderComponent={(
					<>
						<View style={moreStyles.banner}>
							<RemoteImageCarousel
								imageUrls={news?.map((n: NewsData) => n.cover_image_src) || []}
								onImagePress={async (index) => {
									await openInAppBrowser(
										`https://carrismetropolitana.pt/news/${news?.[index]?._id}`,
									);
								}}
							/>
						</View>

						<Section heading={t('SupportList.heading')} subheading={t('SupportList.subheading')} />
						<FlatList
							data={Supportlistdata}
							keyExtractor={item => item.id.toString()}
							nestedScrollEnabled={true}
							renderItem={({ item }: { item: listItem }) => renderListItem({ item })}
							style={moreStyles.flatList}
						/>

						<Section heading={t('TarifsList.heading')} subheading={t('TarifsList.subheading')} />
						<FlatList
							data={Tarifslistdata}
							keyExtractor={item => item.id.toString()}
							nestedScrollEnabled={true}
							renderItem={({ item }: { item: listItem }) => renderListItem({ item })}
							style={moreStyles.flatList}
						/>

						<Section heading={t('AboutCMList.heading')} subheading={t('AboutCMList.subheading')} />
						<FlatList
							data={AboutCMlistdata}
							keyExtractor={item => item.id.toString()}
							nestedScrollEnabled={true}
							renderItem={({ item }: { item: listItem }) => renderListItem({ item })}
							style={moreStyles.flatList}
						/>

						<ButtonGroup
							buttons={['English', 'Português', 'Toggle Debug']}
							buttonStyle={{ padding: 10 }}
							onPress={handlePress}
							selectedButtonStyle={{ backgroundColor: '#e2e2e2' }}
							selectedIndex={selectedIndex}
						/>

						<Text style={moreStyles.version}>Versão 2025.03.27-01</Text>
					</>
				)}
			/>
		</SafeAreaView>
	);

	//
}
