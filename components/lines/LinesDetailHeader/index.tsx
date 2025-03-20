'use client';

/* * */

import { FavoriteToggle } from '@/components/common/FavoriteToggle';
// import toast from '@/utils/toast';
import { Section } from '@/components/common/layout/Section';
import { Surface } from '@/components/common/layout/Surface';
import { SelectOperationalDay } from '@/components/common/SelectOperationalDay';
import { LineBadge } from '@/components/lines/LineBadge';
import { LineDebugDetail } from '@/components/lines/LineDebugDetail';
import { useDebugContext } from '@/contexts/Debug.context';
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { useProfileContext } from '@/contexts/Profile.context';
import { useTranslation } from 'react-i18next';
import { Button, Text, View } from 'react-native';

import { SelectActivePatternGroup } from '../SelectActivePatternGroup';
import { lineDetailsHeaderStyles } from './styles';

/* * */

export function LinesDetailHeader() {
	//

	//
	// A. Setup variables

	const t = useTranslation('tranaslations', { keyPrefix: 'lines.LinesDetail' });
	const profileContext = useProfileContext();
	const linesDetailContext = useLinesDetailContext();
	const debugContext = useDebugContext();

	//
	// B. Handle actions

	const handleToggleFavorite = async () => {
		if (!linesDetailContext.data.line) return;
		try {
			await profileContext.actions.toggleFavoriteLine(linesDetailContext.data.line.id);
		}
		catch (error) {
			// toast.error({ message: t('toggle_favorite_error', { error: error.message }) });
			console.error('Failed to toggle favorite line:', error);
		}
	};

	//
	// C. Render components

	if (!linesDetailContext.data.line) {
		return null;
	}

	return (
		<>
			<Surface>
				<Button onPress={debugContext.actions.toggleDebugMode} title="Toggle Debug" />
				<Section withBottomDivider withPadding>
					<View style={lineDetailsHeaderStyles.headingSection}>
						<View style={lineDetailsHeaderStyles.headingSectionRow}>
							<LineBadge lineData={linesDetailContext.data.line} size="lg" />
							<FavoriteToggle color={linesDetailContext.data.line.color} isActive={linesDetailContext.flags.is_favorite} onToggle={handleToggleFavorite} />
						</View>
						{/*  */}
						<View style={lineDetailsHeaderStyles.lineName}>
							<Text>{linesDetailContext.data.line.long_name}</Text>
						</View>
					</View>
				</Section>

				{/* <Section withPadding>
					<View style={lineDetailsHeaderStyles.container}>
						<View>
							<SelectOperationalDay />
						</View>
						<View>
							<SelectActivePatternGroup />
						</View>

					</View>
				</Section> */}
			</Surface>

			{debugContext.flags.is_debug_mode && (
				<Surface variant="debug">
					<Section withPadding>
						<LineDebugDetail
							activePattern={linesDetailContext.data.active_pattern}
							lineColor={linesDetailContext.data.line.color}
							totalStops={linesDetailContext.data.active_pattern?.path.length}
						/>
					</Section>
				</Surface>
			)}

		</>
	);

	//
}
