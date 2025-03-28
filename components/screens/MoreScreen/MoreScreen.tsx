import RemoteImageCarousel from '@/components/cmui/RemoteImageCarousel';
import { Section } from '@/components/common/layout/Section';
import { useDebugContext } from '@/contexts/Debug.context';
import { useLocaleContext } from '@/contexts/Locale.context';
import { useWebsiteNews } from '@/services/website/queries/useNews';
import { listItem } from '@/types/moreList.types';
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
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import styles from './styles';

const BUTTON_LABELS = ['English', 'Português', 'Toggle Debug'];

const ListSection = ({
	data,
	heading,
	renderItem,
	subheading,
}: {
	data: listItem[]
	heading: string
	renderItem: ({ item }: { item: listItem }) => JSX.Element
	subheading: string
}) => (
	<>
		<Section heading={heading} subheading={subheading} />
		<FlatList
			data={data}
			keyExtractor={item => item.id.toString()}
			renderItem={renderItem}
			style={styles().flatList}
			nestedScrollEnabled
		/>
	</>
);

export default function MoreScreen() {
	const localeContext = useLocaleContext();
	const debugContext = useDebugContext();

	const { t } = useTranslation('translation', { keyPrefix: 'more' });
	const { data: news } = useWebsiteNews();
	const [selectedIndex, setSelectedIndex] = useState(0);

	const moreStyles = styles();
	const router = useRouter();

	const openWebView = (url: string) => {
		router.push(`/OpenWebView?url=${encodeURIComponent(url)}&locale=${localeContext.locale}`);
	};

	const Supportlistdata = useMemo(
		() => [
			{
				icon: <IconHelpHexagon color={moreStyles.icon.color} size={32} />,
				id: 0,
				onPress: () => openWebView('https://www.carrismetropolitana.pt/faq'),
				title: t('SupportList.frequently_asked'),
			},
			{
				icon: <IconUmbrella color={moreStyles.icon.color} size={32} />,
				id: 1,
				onPress: () => openWebView('https://www.carrismetropolitana.pt/lost-and-found'),
				title: t('SupportList.lost_found'),
			},
			{
				icon: <IconBuildingStore color={moreStyles.icon.color} size={32} />,
				id: 2,
				onPress: () => openWebView('https://www.carrismetropolitana.pt/stores'),
				title: t('SupportList.stores'),
			},
			{
				icon: <IconMessages color={moreStyles.icon.color} size={32} />,
				id: 3,
				onPress: () => openWebView('https://www.carrismetropolitana.pt/app-ios/stores'),
				title: t('SupportList.contacts'),
			},
		],
		[moreStyles.icon.color, t],
	);

	const Tarifslistdata = useMemo(
		() => [
			{
				icon: <IconTicket color={moreStyles.icon.color} size={32} />,
				id: 0,
				onPress: () => openWebView('https://www.carrismetropolitana.pt/tickets'),
				title: t('TarifsList.ocasional_tickets'),
			},
			{
				icon: <IconCreditCardPay color={moreStyles.icon.color} size={32} />,
				id: 1,
				onPress: () => openWebView('https://www.carrismetropolitana.pt/cards'),
				title: t('TarifsList.monthly_tickets'),
			},
			{
				icon: <IconMapQuestion color={moreStyles.icon.color} size={32} />,
				id: 2,
				onPress: () => openWebView('https://www.carrismetropolitana.pt/helpdesks'),
				title: t('TarifsList.where_to_buy'),
			},
		],
		[moreStyles.icon.color, t],
	);

	const AboutCMlistdata = useMemo(
		() => [
			{
				icon: <IconHomeStar color={moreStyles.icon.color} size={32} />,
				id: 0,
				onPress: () => openWebView('https://carrismetropolitana.pt/about'),
				title: t('AboutCMList.about_carrismetropolitana'),
			},
			{
				icon: <IconChartBar color={moreStyles.icon.color} size={32} />,
				id: 1,
				onPress: () => openWebView('https://carrismetropolitana.pt/metrics'),
				title: t('AboutCMList.our_operation_live'),
			},
			{
				icon: <IconSpeakerphone color={moreStyles.icon.color} size={32} />,
				id: 2,
				onPress: () => openWebView('https://carrismetropolitana.pt/opendata'),
				title: t('AboutCMList.open_data'),
			},
			{
				icon: <IconUserHeart color={moreStyles.icon.color} size={32} />,
				id: 3,
				onPress: () => openWebView('https://carrismetropolitana.pt/motoristas'),
				title: t('AboutCMList.recruitment'),
			},
			{
				icon: <IconLockSquare color={moreStyles.icon.color} size={32} />,
				id: 4,
				onPress: () => openWebView('https://www.carrismetropolitana.pt/privacy'),
				title: t('AboutCMList.privacy'),
			},
			{
				icon: <IconGavel color={moreStyles.icon.color} size={32} />,
				id: 5,
				onPress: () => openWebView('https://www.carrismetropolitana.pt/legal'),
				title: t('AboutCMList.legal_notices'),
			},
		],
		[moreStyles.icon.color, t],
	);

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

	const renderListItem = ({ item }: { item: listItem }) => (
		<ListItem onPress={item.onPress} bottomDivider topDivider>
			<Avatar size={32} titleStyle={moreStyles.icon}>{item.icon}</Avatar>
			<ListItem.Content>
				<ListItem.Title>
					<Text style={moreStyles.listTitle}>{item.title}</Text>
				</ListItem.Title>
			</ListItem.Content>
			<ListItem.Chevron />
		</ListItem>
	);

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
								imageUrls={news?.map(n => n.cover_image_src) || []}
								onImagePress={async (index) => {
									await openWebView(`https://carrismetropolitana.pt/news/${news?.[index]?._id}`);
								}}
							/>
						</View>

						<ListSection
							data={Supportlistdata}
							heading={t('SupportList.heading')}
							renderItem={renderListItem}
							subheading={t('SupportList.subheading')}
						/>

						<ListSection
							data={Tarifslistdata}
							heading={t('TarifsList.heading')}
							renderItem={renderListItem}
							subheading={t('TarifsList.subheading')}
						/>

						<ListSection
							data={AboutCMlistdata}
							heading={t('AboutCMList.heading')}
							renderItem={renderListItem}
							subheading={t('AboutCMList.subheading')}
						/>

						<ButtonGroup
							buttons={BUTTON_LABELS}
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
}
