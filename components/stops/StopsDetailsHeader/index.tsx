/* * */

import { CopyBadge } from '@/components/common/CopyBadge';
import { FavoriteToggle } from '@/components/common/FavoriteToggle';
import { IconDisplay } from '@/components/common/IconDisplay';
import { Section } from '@/components/common/layout/Section';
import { Surface } from '@/components/common/layout/Surface';
import { LineBadge } from '@/components/lines/LineBadge';
import { StopDisplayLocation } from '@/components/stops/StopDisplayLocation';
import { StopDisplayName } from '@/components/stops/StopDisplayName';
import { useProfileContext } from '@/contexts/Profile.context';
import { useStopsDetailContext } from '@/contexts/StopsDetail.context';
import { theming } from '@/theme/Variables';
import { ListItem, Text } from '@rneui/themed';
import { IconHomePlus, IconVolume } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { styles } from './styles';

/* * */

export function StopsDetailHeader() {
	//

	//
	// A. Setup variables

	const { t } = useTranslation('translation', { keyPrefix: 'stops.StopDetails' });
	const profileContext = useProfileContext();
	const stopsDetailContext = useStopsDetailContext();

	const stopDetailsHeader = styles();

	//
	// B. Handle actions

	const handleToggleFavorite = () => {
		if (!stopsDetailContext.data.stop) return;
		try {
			profileContext.actions.toggleFavoriteStop(stopsDetailContext.data.stop.id);
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
		<ScrollView>
			<Surface>
				<View style={stopDetailsHeader.headingWrapper}>
					<Section withBottomDivider>
						<View style={stopDetailsHeader.nameWrapper}>
							<StopDisplayName longName={stopsDetailContext.data.stop.long_name} size="lg" />
							<FavoriteToggle color={theming.colorBrand} isActive={stopsDetailContext.flags.is_favorite} onToggle={handleToggleFavorite} />
							<IconHomePlus color="#9696A0" size={24} />
							<IconVolume color="#9696A0" size={24} />
							{/* <StopDisplayTts stopId={stopsDetailContext.data.stop.id} /> */}
						</View>
						<StopDisplayLocation localityId={stopsDetailContext.data.stop.locality_id} municipalityId={stopsDetailContext.data.stop.municipality_id} size="lg" />
						<View style={stopDetailsHeader.badgesWrapper}>
							<CopyBadge hasBorder={false} label={'#' + stopsDetailContext.data.stop.id} value={stopsDetailContext.data.stop.id} />
							<CopyBadge hasBorder={false} label={`${stopsDetailContext.data.stop.lat}, ${stopsDetailContext.data.stop.lon}`} value={stopsDetailContext.data.stop.lat + '\t' + stopsDetailContext.data.stop.lon} />
						</View>
						{stopsDetailContext.data.stop.facilities.length > 0 && (
							<>
								{stopsDetailContext.data.stop.facilities.map((facility, index) => (
									<View key={index}>
										<IconDisplay key={facility} category="facilities" name={facility} />
									</View>
								))}
								<View />
							</>
						)}
					</Section>
				</View>

				<View style={stopDetailsHeader.upcomingCirculationsWrapper}>
					<Text style={stopDetailsHeader.sectionHeading}>{t('heading')}</Text>

					<ListItem>
						<ListItem.Content>
							<ListItem.Title>THIS IS JUST A DEMO</ListItem.Title>
							<ListItem.Subtitle>a functionalilty demo</ListItem.Subtitle>
						</ListItem.Content>
						<ListItem.Chevron />
					</ListItem>

					<Text style={stopDetailsHeader.upcomingCirculationsDescription}>{t('description')}</Text>
				</View>

				<View style={stopDetailsHeader.upcomingCirculationsWrapper}>
					<Text style={stopDetailsHeader.sectionHeading}>{t('second_heading')}</Text>
					<View style={stopDetailsHeader.iconsWrapper}>

						{stopsDetailContext.data.lines && stopsDetailContext.data.lines.map(line => (
							<View key={line.id}>
								<LineBadge key={line.id} lineData={line} size="lg" />
								<Text>{line.long_name}</Text>
							</View>
						))}
					</View>
				</View>

				<View style={stopDetailsHeader.upcomingCirculationsWrapper}>
					<Text style={stopDetailsHeader.sectionHeading}>{t('third_heading')}</Text>

				</View>

			</Surface>
		</ScrollView>
	);

	//
}
