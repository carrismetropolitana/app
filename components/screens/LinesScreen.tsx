/* eslint-disable @typescript-eslint/no-explicit-any */

/* * */
import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { Section } from '@/components/common/layout/Section';
import { MemoizedLineItem } from '@/components/common/LineItem';
import { useLinesListContext } from '@/contexts/LinesList.context';
import { useLocationsContext } from '@/contexts/Locations.context';
import { useProfileContext } from '@/contexts/Profile.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { Line } from '@carrismetropolitana/api-types/network';
import { router } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AccessibilityInfo, SectionList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import LineSearchBar from '../common/LineSearchBar';

/* * */

export default function LinesScreen() {
	//

	//
	// A. Setup variables

	const profileContext = useProfileContext();
	const linesListContext = useLinesListContext();
	const { data: { filtered: allLines } } = linesListContext;
	const { data: { linesAroundLocation: nearbyLines } } = linesListContext;
	const { data: { locationPermission } } = useLocationsContext();
	const recentLines = profileContext.data.recent_lines;
	const { theme } = useThemeContext();
	const { t } = useTranslation('translation', { keyPrefix: 'lines.LinesScreen' });

	const sections = [
		{
			data: locationPermission === 'granted' && linesListContext.filters.by_search ? nearbyLines : [],
			title: t('linesAroundMe'),
		},
		{
			data: linesListContext.filters.by_search ? [] : recentLines,
			title: t('recentLines'),
		},
		{
			data: allLines,
			title: t('allLines'),
		},
	];

	const styles = StyleSheet.create({
		container: {
			backgroundColor: theme.mode === 'light' ? theme.lightColors?.background : theme.darkColors?.background,
			flex: 1,
		},
	});

	//
	// B. Handle Actions

	const handlePress = (item: Line) => {
		profileContext.actions.addRecentLines(item);
		router.push(`/line/${item.id}`);
	};
	useEffect(() => {
		AccessibilityInfo.announceForAccessibility('LINHAS');
	}, []);

	//
	// C. Transform Data

	const keyExtractor = useCallback((item: any) => item.id, []);

	const getItemLayout = useCallback((_: any, index: number) => ({ index, length: 100, offset: 100 * index }), []);

	//
	// D. Render components

	const renderSectionHeader = useCallback(({ section: { data, title } }) => data.length > 0 ? <Section heading={title} /> : null, []);

	const renderItem = useCallback(({ item }) => <MemoizedLineItem lineData={item} onPress={() => handlePress(item)} size="lg" />, []);

	return (
		<SafeAreaView style={styles.container}>
			<LineSearchBar />
			<SectionList
				getItemLayout={getItemLayout}
				initialNumToRender={5}
				keyExtractor={keyExtractor}
				ListEmptyComponent={<NoDataLabel />}
				maxToRenderPerBatch={5}
				renderItem={renderItem}
				renderSectionHeader={renderSectionHeader}
				sections={sections}
				showsVerticalScrollIndicator={false}
				stickySectionHeadersEnabled={false}
				windowSize={5}
				removeClippedSubviews
			/>
		</SafeAreaView>
	);
}
