/* * */

import RemoteImageCarousel from '@/components/cmui/RemoteImageCarousel';
import { Section } from '@/components/common/layout/Section';
import { useDebugContext } from '@/contexts/Debug.context';
import { useLocaleContext } from '@/contexts/Locale.context';
import { useWebsiteNews } from '@/services/website/queries/useNews';
import { listItem } from '@/types/moreList.types';
import { openWebView } from '@/utils/openWebView';
import { Avatar, ButtonGroup, ListItem, Text } from '@rn-vui/themed';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/* * */

import { AboutCMlistdata } from './_data/aboutCMListData';
import { Supportlistdata } from './_data/supportListData';
import { Tarifslistdata } from './_data/tarifsListData';

/* * */

import { AlertListData } from './_data/alertListData';
import styles from './styles';

/* * */

interface ListSection {
	data: listItem[]
	heading: string
	renderItem: ({ item }: { item: listItem }) => JSX.Element
	subheading?: string
}

/* * */

export default function MoreScreen() {
	//

	//
	// A. Setup Variables
	const localeContext = useLocaleContext();
	const debugContext = useDebugContext();

	const { data: news } = useWebsiteNews();
	const moreStyles = styles();

	const { t } = useTranslation('translation', { keyPrefix: 'more' });

	const [selectedIndex, setSelectedIndex] = useState(0);

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
	// C. Render Components

	const ListSection = ({ data, heading, renderItem, subheading }: ListSection) => (
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
									await openWebView({ locale: localeContext.locale, url: `https://carrismetropolitana.pt/news/${news?.[index]?._id}` });
								}}
							/>
						</View>
						<ListSection data={AlertListData()} heading={t('AlertList.heading')} renderItem={renderListItem} />
						<ListSection data={Supportlistdata()} heading={t('SupportList.heading')} renderItem={renderListItem} />
						<ListSection data={Tarifslistdata()} heading={t('TarifsList.heading')} renderItem={renderListItem} />
						<ListSection data={AboutCMlistdata()} heading={t('AboutCMList.heading')} renderItem={renderListItem} />
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
