/* * */

import { getServiceUrl } from '@/settings/service-urls';
import { type GeneralStatusMessage } from '@/types/general-status';
import { Text, View } from 'react-native';
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
			{generalStatusData?.length && generalStatusData.map(status => (
				<View style={styles.message}>
					<Text key={status._id} style={styles.title}>{status.title}</Text>
				</View>
			))}
		</View>
	);

	//
}
