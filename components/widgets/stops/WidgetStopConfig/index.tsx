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
import { useWidgetStopConfigContext } from '@/contexts/WidgetStopConfig.context';
import { theming } from '@/theme/Variables';
import { AccountWidget } from '@/types/account.types';
import { Routes } from '@/utils/routes';
import { Pattern, Stop } from '@carrismetropolitana/api-types/network';
import { ListItem, Text } from '@rn-vui/themed';
import { IconArrowRight, IconBusStop, IconCircle, IconCircleCheckFilled, IconSearch, IconX } from '@tabler/icons-react-native';
import { useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import styles from './styles';

/* * */

interface WidgetStopConfigProps {
	widgetId?: string
}

/* * */

export function WidgetStopConfig({ widgetId }: WidgetStopConfigProps) {
	//

	//
	// A. Setup variables

	const widgetStopConfigContext = useWidgetStopConfigContext();

	const { t } = useTranslation('translation', { keyPrefix: 'widgets.WidgetStopConfig' });

	//
	// B. Handle Actions

	//
	// C. Fetch Data

	//
	// D. Render Components

	return (
		<Container>

			<WidgetConfigHeader
				description={t('description')}
				title={t('title')}
				videoUrl="https://carrismetropolitana.pt/app-view/widgets/videos/stops"
			/>

		</Container>
	);

	//
}
