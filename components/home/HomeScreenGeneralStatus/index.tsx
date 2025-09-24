/* * */

import { HomeScreenGeneralStatusItem } from '@/components/home/HomeScreenGeneralStatusItem';
import { getServiceUrl } from '@/settings/service-urls';
import { type GeneralStatusMessage } from '@/types/general-status';
import { View } from 'react-native';
import useSWR from 'swr';

import { useStyles } from './styles';

/* * */

export function HomeScreenGeneralStatus() {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	//
	// B. Fetch data

	const { data: generalStatusData } = useSWR<GeneralStatusMessage[]>(`${getServiceUrl('backoffice')}/public-api/general-status`, { refreshInterval: 20_000 });

	//
	// C. Render components

	return (
		<View style={styles.container}>
			{generalStatusData?.length && generalStatusData.map(item => (
				<HomeScreenGeneralStatusItem key={item._id} data={item} />
			))}
		</View>
	);

	//
}
