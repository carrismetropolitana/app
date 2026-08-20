/* * */

import { FavoriteToggle } from '@/components/common/FavoriteToggle';
import { IconDisplay } from '@/components/common/IconDisplay';
import { StopDisplayTts } from '@/components/stops/StopDisplayTts';
import { useAccountContext } from '@/contexts/Account.context';
import { useStopDetailContext } from '@/contexts/StopDetail.context';
import { useStopsContext } from '@/contexts/Stops.context';
import { useMemo } from 'react';
import { Text, View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function StopDetailHeader() {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const stopsContext = useStopsContext();
	const accountContext = useAccountContext();
	const stopDetailContext = useStopDetailContext();

	//
	// B. Transform data

	const isFavoriteStop = useMemo(() => {
		if (!stopDetailContext.data.selected_stop) return;
		return accountContext.data.ref.current?.favorites.stop_ids.includes(stopDetailContext.data.selected_stop._id.toString());
	}, [accountContext.data.ref.current?.favorites.stop_ids, stopDetailContext.data.selected_stop]);

	const stopLocation = useMemo(() => {
		if (!stopDetailContext.data.selected_stop_id) return;
		return stopsContext.actions.getStopLocationById(stopDetailContext.data.selected_stop_id);
	}, [stopDetailContext.data.selected_stop_id, stopsContext.data.stops]);

	//
	// C. Handle actions

	const handleToggleFavorite = (value: boolean) => {
		if (!stopDetailContext.data.selected_stop) return;
		accountContext.actions.favoriteStopId(value ? 'add' : 'remove', stopDetailContext.data.selected_stop._id.toString());
	};

	//
	// D. Render components

	if (!stopDetailContext.data.selected_stop) {
		return null;
	}

	return (
		<View style={styles.container}>

			<View style={styles.row}>
				<View style={styles.detailsWrapper}>
					<Text style={styles.name}>{stopDetailContext.data.selected_stop.name}</Text>
					{stopLocation && <Text style={styles.location}>{stopLocation}</Text>}
				</View>
				<View style={styles.actionsWrapper}>
					<StopDisplayTts stopId={stopDetailContext.data.selected_stop._id.toString()} />
					<FavoriteToggle
						isActive={isFavoriteStop}
						onToggle={handleToggleFavorite}
					/>
				</View>
			</View>

			<View style={styles.row}>
				<Text style={styles.metadata}>#{stopDetailContext.data.selected_stop_id}</Text>
				<Text style={styles.metadata}>{stopDetailContext.data.selected_stop.latitude}, {stopDetailContext.data.selected_stop.longitude}</Text>
			</View>

			{stopDetailContext.data.selected_stop.flags.length > 0 && (
				<View style={styles.facilitiesWrapper}>
					{stopDetailContext.data.selected_stop.flags.map(flag => (
						<IconDisplay
							key={flag.stop_id}
							category="facilities"
							name={flag.short_name}
						/>
					))}
					<View />
				</View>
			)}

		</View>
	);

	//
}
