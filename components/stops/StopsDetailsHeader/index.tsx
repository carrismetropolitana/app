/* * */

import { CopyBadge } from '@/components/common/CopyBadge';
import { FavoriteToggle } from '@/components/common/FavoriteToggle';
// import { IconDisplay } from '@/components/common/IconDisplay';
import { Section } from '@/components/common/layout/Section';
import { Surface } from '@/components/common/layout/Surface';
import { LineBadge } from '@/components/lines/LineBadge';
import { StopDisplayLocation } from '@/components/stops/StopDisplayLocation';
import { StopDisplayName } from '@/components/stops/StopDisplayName';
// import { StopDisplayTts } from '@/components/stops/StopDisplayTts';
import { IconDisplay } from '@/components/common/IconDisplay';
import { useProfileContext } from '@/contexts/Profile.context';
import { useStopsDetailContext } from '@/contexts/StopsDetail.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from './styles';

/* * */

export function StopsDetailHeader() {
	//

	//
	// A. Setup variables

	const profileContext = useProfileContext();
	const themeContext = useThemeContext();
	const stopsDetailContext = useStopsDetailContext();

	//
	// B. Handle actions

	const handleToggleFavorite = () => {
		if (!stopsDetailContext.data.stop) return;
		try {
			profileContext.actions.toggleFavoriteStop(stopsDetailContext.data.stop.id);
		}
		catch (error) {
			console.error({ message: 'Error: ' + error.message });
		}
	};

	//
	// C. Render components

	if (!stopsDetailContext.data.stop) {
		return null;
	}

	return (
		<SafeAreaView style={{ backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background, flex: 1 }}>
			<Surface>
				<Section>
					{/* className={styles.badgesWrapper} */}
					<View>
						<CopyBadge
							label={'#' + stopsDetailContext.data.stop.id}
							value={stopsDetailContext.data.stop.id}
						/>
						<CopyBadge
							hasBorder={false}
							label={`${stopsDetailContext.data.stop.lat}, ${stopsDetailContext.data.stop.lon}`}
							value={stopsDetailContext.data.stop.lat + '\t' + stopsDetailContext.data.stop.lon}
						/>
					</View>

					{/* <View className={styles.headingWrapper}>
					<View className={styles.nameWrapper}> */}
					<StopDisplayName longName={stopsDetailContext.data.stop.long_name} size="lg" />
					{/* <StopDisplayTts stopId={stopsDetailContext.data.stop.id} /> */}
					<View>
						<FavoriteToggle color="var(--color-brand)" isActive={stopsDetailContext.flags.is_favorite} onToggle={handleToggleFavorite} />
						{/* </View> */}
						<StopDisplayLocation localityId={stopsDetailContext.data.stop.locality_id} municipalityId={stopsDetailContext.data.stop.municipality_id} size="lg" />
					</View>
					{/* </View> */}

				</Section>

				{/* <Section>
				<View className={styles.iconsWrapper}>
					{stopsDetailContext.data.stop.facilities.length > 0 && (
						<>
							{stopsDetailContext.data.stop.facilities.map((facility, index) => (
								<View key={index} className={styles.iconFacilityWrapper}>
									<IconDisplay key={facility} category="facilities" name={facility} />
								</View>
							))}
							<View className={styles.iconsViewider} />
						</>
					)}
					{stopsDetailContext.data.lines && stopsDetailContext.data.lines.map(line => (
						<View key={line.id} className={styles.iconLineBadgeWrapper}>
							<LineBadge key={line.id} lineData={line} />
						</View>
					))}
				</View>
			</Section> */}

			</Surface>
		</SafeAreaView>
	);

	//
}
