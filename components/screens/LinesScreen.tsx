/* eslint-disable @typescript-eslint/no-explicit-any */
import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { Section } from '@/components/common/layout/Section';
import { MemoizedLineItem } from '@/components/common/LineItem';
import { useLinesListContext } from '@/contexts/LinesList.context';
import { useLocationsContext } from '@/contexts/Locations.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { SectionList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import LineSearchBar from '../common/LineSearchBar';

export default function LinesScreen() {
	const { data: { filtered: allLines } } = useLinesListContext();
	const { data: { linesAroundLocation: nearbyLines } } = useLinesListContext();
	const { data: { locationPermission } } = useLocationsContext();
	const { theme } = useThemeContext();
	const { t } = useTranslation('translation', { keyPrefix: 'lines.LinesScreen' });

	const sections = [
		{
			data: locationPermission === 'granted' ? nearbyLines : [],
			title: t('linesAroundMe'),
		},
		{
			data: allLines,
			title: t('allLines'),
		},
	];

	const renderSectionHeader = useCallback(({ section: { data, title } }) => data.length > 0 ? <Section heading={title} /> : null, []);

	const renderItem = useCallback(({ item }) => <MemoizedLineItem lineData={item} onPress={() => router.push(`/line/${item.id}`)} size="lg" />, []);

	const keyExtractor = useCallback((item: any) => item.id, []);

	const getItemLayout = useCallback((_: any, index: number) => ({ index, length: 100, offset: 100 * index }), []);

	const styles = StyleSheet.create({
		container: {
			backgroundColor: theme.mode === 'light' ? theme.lightColors?.background : theme.darkColors?.background,
			flex: 1,
		},
	});

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
