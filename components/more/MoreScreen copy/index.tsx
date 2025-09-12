/* * */

import RemoteImageCarousel from '@/components/cmui/RemoteImageCarousel';
import { Section } from '@/components/common/layout/Section';
import { useDebugContext } from '@/contexts/Debug.context';
import { useLocaleContext } from '@/contexts/Locale.context';
import { useWebsiteNews } from '@/services/website/queries/useNews';
import { listItem } from '@/types/moreList.types';
import { openWebView } from '@/utils/openWebView';
import { Avatar, Button, ButtonGroup, ListItem, Text } from '@rn-vui/themed';
import Constants from 'expo-constants';
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

export function MoreScreen() {
	//

	//
	// A. Setup variables

	const localeContext = useLocaleContext();
	const debugContext = useDebugContext();

	const { data: news } = useWebsiteNews();
	const moreStyles = styles();

	const { t } = useTranslation('translation', { keyPrefix: 'more' });
	const appVersion = Constants.expoConfig?.version || 0.00;

	const [selectedLangIndex, setSelectedLangIndex] = useState(localeContext.locale === 'en' ? 0 : 1);

	// B. Handle Actions

	const handleLangPress = (index: number) => {
		setSelectedLangIndex(index);
		if (index === 0) {
			localeContext.actions.changeToEnglish();
		}
		else if (index === 1) {
			localeContext.actions.changeToPortuguese();
		}
	};

	const handleDebugPress = () => {
		debugContext.actions.toggleDebugMode();
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
					<Text
						accessibilityHint={t('usefullLinksHint', { title: item.title })}
						accessibilityLabel={t('usefullLinksLabel', { title: item.title })}
						accessibilityLanguage={localeContext.locale}
						accessibilityRole="link"
						style={moreStyles.listTitle}
					>{item.title}
					</Text>
				</ListItem.Title>
			</ListItem.Content>
			<ListItem.Chevron iconStyle={{ fontSize: 24 }} />
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
						<View accessibilityHint={t('alert_list_hint')} accessibilityLabel={t('alert_list_label')} accessibilityLanguage={localeContext.locale} accessibilityRole="text">
							<ListSection data={AlertListData()} heading={t('AlertList.heading')} renderItem={renderListItem} />
						</View>
						<View accessibilityHint={t('support_list_hint')} accessibilityLabel={t('support_list_label')} accessibilityLanguage={localeContext.locale} accessibilityRole="text">
							<ListSection data={Supportlistdata()} heading={t('SupportList.heading')} renderItem={renderListItem} />
						</View>
						<View accessibilityHint={t('tarifs_list_hint')} accessibilityLabel={t('tarifs_list_label')} accessibilityLanguage={localeContext.locale} accessibilityRole="text">
							<ListSection data={Tarifslistdata()} heading={t('TarifsList.heading')} renderItem={renderListItem} />
						</View>
						<View accessibilityHint={t('about_cm_list_hint')} accessibilityLabel={t('about_cm_list_label')} accessibilityLanguage={localeContext.locale} accessibilityRole="text">
							<ListSection data={AboutCMlistdata()} heading={t('AboutCMList.heading')} renderItem={renderListItem} />
						</View>
						<View
							accessibilityHint={t('language_buttons_hint')}
							accessibilityLabel={t('language_buttons_label', { language: t(selectedLangIndex === 0 ? 'languages.en' : 'languages.pt') })}
							accessibilityLanguage={localeContext.locale}
							accessibilityRole="button"
							accessibilityState={{ selected: selectedLangIndex === 0 }}
						>
							<ButtonGroup
								buttons={[t('languages.en'), t('languages.pt')]}
								buttonStyle={{ padding: 10 }}
								onPress={handleLangPress}
								selectedButtonStyle={{ backgroundColor: '#e2e2e2' }}
								selectedIndex={selectedLangIndex}
							/>
						</View>
						<View style={{ alignItems: 'center', marginTop: 12 }}>
							<Button
								accessibilityHint={t('toggle_debug_hint')}
								accessibilityLabel={t('toggle_debug_label', { version: appVersion })}
								accessibilityLanguage={localeContext.locale}
								accessibilityRole="button"
								accessibilityState={{ checked: debugContext.flags.is_debug_mode }}
								onPress={handleDebugPress}
								style={{ backgroundColor: debugContext.flags.is_debug_mode ? '#27ae60' : '#e2e2e2' }}
							>
								{debugContext.flags.is_debug_mode ? `${t('untoggle_debug')}` : `${t('toggle_debug')}`}
							</Button>
						</View>

						<Text
							accessibilityHint={t('version_hint')}
							accessibilityLabel={t('version_label')}
							accessibilityLanguage={localeContext.locale}
							accessibilityRole="text"
							style={moreStyles.version}
						>{appVersion}
						</Text>
					</>
				)}
			/>
		</SafeAreaView>
	);

	//
}
