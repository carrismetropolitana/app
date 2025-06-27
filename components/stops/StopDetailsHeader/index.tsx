/* * */

import { CopyBadge } from '@/components/common/CopyBadge';
import { FavoriteToggle } from '@/components/common/FavoriteToggle';
import { IconDisplay } from '@/components/common/IconDisplay';
import { Section } from '@/components/common/layout/Section';
import { Surface } from '@/components/common/layout/Surface';
import { StopDisplayLocation } from '@/components/stops/StopDisplayLocation';
import { StopDisplayName } from '@/components/stops/StopDisplayName';
import { StopDisplayTts } from '@/components/stops/StopDisplayTts';
import { useProfileContext } from '@/contexts/Profile.context';
import { useStopsDetailContext } from '@/contexts/StopsDetail.context';
import { theming } from '@/theme/Variables';
import { IconHomePlus } from '@tabler/icons-react-native';
import { View } from 'react-native';

import { styles } from './styles';

/* * */

export function StopDetailHeader() {
	//

	//
	// A. Setup variables
	const profileContext = useProfileContext();
	const stopsDetailContext = useStopsDetailContext();
	const stopDetailsHeader = styles();
	const isInWidgets = profileContext.data.widget_stops?.some(
		w => w.data && w.data.type === 'stops' && w.data.stop_id === stopsDetailContext.data.stop?.id,
	);

	//
	// B. Handle actions

	const handleToggleFavorite = () => {
		if (!stopsDetailContext.data.stop) return;
		try {
			profileContext.actions.toggleFavoriteItem('stops', stopsDetailContext.data.stop.id);
		}
		catch (error) {
			console.error({ message: 'Error: ' + error });
		}
	};

	const handleCreateWidgetStop = () => {
		if (!stopsDetailContext.data.stop) return;
		try {
			const patternGroup = stopsDetailContext.data.active_pattern_group;
			const patternIds = patternGroup ? [patternGroup.id] : [];
			profileContext.actions.createWidget({ pattern_ids: patternIds, stopId: stopsDetailContext.data.stop.id, type: 'stops' });
		}
		catch (error) {
			console.error({ message: 'Error: ' + error });
		}
	};

	//
	// C. Render components

	if (!stopsDetailContext.data.stop) {
		return null;
	}

	return (
		<Surface>
			<View style={stopDetailsHeader.headingWrapper}>
				<Section withBottomDivider>
					<View style={stopDetailsHeader.headerDetailsContainer}>
						<View style={stopDetailsHeader.nameWrapper}>
							<StopDisplayName longName={stopsDetailContext.data.stop.long_name} size="lg" />
						</View>
						<View style={stopDetailsHeader.actionsWrapper}>
							<FavoriteToggle color={theming.colorBrand} isActive={stopsDetailContext.flags.is_favorite} onToggle={handleToggleFavorite} />
							<IconHomePlus
								color={isInWidgets ? theming.colorBrand : '#9696A0'}
								disabled={!stopsDetailContext.data.stop}
								onPress={handleCreateWidgetStop}
								size={24}
							/>
							<StopDisplayTts stopId={stopsDetailContext.data.stop.id} />
						</View>
					</View>
					<StopDisplayLocation localityId={stopsDetailContext.data.stop.locality_id} municipalityId={stopsDetailContext.data.stop.municipality_id} size="lg" />
					<View style={stopDetailsHeader.badgesWrapper}>
						<CopyBadge hasBorder={false} label={'#' + stopsDetailContext.data.stop.id} value={stopsDetailContext.data.stop.id} />
						<CopyBadge hasBorder={false} label={`${stopsDetailContext.data.stop.lat}, ${stopsDetailContext.data.stop.lon}`} value={stopsDetailContext.data.stop.lat + '\t' + stopsDetailContext.data.stop.lon} />
					</View>
					{stopsDetailContext.data.stop.facilities.length > 0 && (
						<View style={stopDetailsHeader.facilitiesWrapper}>
							{stopsDetailContext.data.stop.facilities.map((facility, index) => (
								<View key={index}>
									<IconDisplay key={facility} category="facilities" name={facility} />
								</View>
							))}
							<View />
						</View>
					)}
				</Section>
			</View>
		</Surface>
	);

	//
}
