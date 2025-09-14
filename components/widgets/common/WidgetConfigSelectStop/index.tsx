/* * */

import StopsListChooserModal from '@/app/(modal)/StopsListChooserModal';
import { Section } from '@/components/common/layout/Section';
import { Container } from '@/components/layout/Container';
import { LineBadge } from '@/components/lines/LineBadge';
import { WidgetConfigHeader } from '@/components/widgets/common/WidgetConfigHeader';
import { WidgetActionsButtonGroup } from '@/components/widgets/WidgetsActionsButtonGroup';
import { useLinesContext } from '@/contexts/Lines.context';
import { useLocaleContext } from '@/contexts/Locale.context';
import { useProfileContext } from '@/contexts/Profile.context';
import { useStopsContext } from '@/contexts/Stops.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { useWidgetContext } from '@/contexts/Widget.context';
import { theming } from '@/theme/Variables';
import { AccountWidget } from '@/types/account.types';
import { Routes } from '@/utils/routes';
import { Pattern, Stop } from '@carrismetropolitana/api-types/network';
import { ListItem, Text } from '@rn-vui/themed';
import { IconArrowRight, IconBusStop, IconCircle, IconCircleCheckFilled, IconSearch, IconX } from '@tabler/icons-react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import styles from './styles';

/* * */

interface WidgetConfigSelectStopProps {
	onSelectStop: (stopId: string) => void
	selectedStopId?: string
}

/* * */

export function WidgetConfigSelectStop({ onSelectStop, selectedStopId }: WidgetConfigSelectStopProps) {
	//

	//
	// A. Setup variables

	//
	// B. Handle Actions

	//
	// C. Fetch Data

	//
	// D. Render Components

	return (
		<>

			<View>
				<Section
					heading="title"
					subheading="subtitle"
				/>
			</View>
			<View>
				{selectedStopId && (
					<ListItem>
						<IconBusStop color="#FF6900" size={24} />
						<ListItem.Content>
							<ListItem.Title style={addFavoriteStopStyles.listTitle}>
								<Text accessibilityHint={t('addFavoriteStopAccessibilityHint')} accessibilityLabel={t('addFavoriteStopAccessibilityLabel', { line: selectedStop.long_name })} accessibilityLanguage={localeContext.locale} accessibilityRole="button">{selectedStop.long_name}</Text>
							</ListItem.Title>
						</ListItem.Content>
						<IconX color="#9696A0" onPress={clearSelection} size={24} />
					</ListItem>
				)}
				<ListItem onPress={() => setStopChooserVisibility(true)}>
					<IconSearch color="#9696A0" size={24} />
					<ListItem.Content>
						<ListItem.Title style={addFavoriteStopStyles.listTitle}>
							<Text accessibilityHint={t('changeStopAccessibilityHint')} accessibilityLabel={t('changeStopAccessibilityLabel')} accessibilityLanguage={localeContext.locale} accessibilityRole="button">{t('changeStopLabel')}</Text>
						</ListItem.Title>
					</ListItem.Content>
					<ListItem.Chevron iconStyle={{ fontSize: 24 }} />
				</ListItem>
			</View>

		</>
	);

	//
}
