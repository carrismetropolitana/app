/* * */

import { LiveIcon } from '@/components/common/LiveIcon';
import { NoVehicleIcon } from '@/components/common/NoVehicleIcon';
import { Text } from '@rn-vui/themed';
import { View } from 'react-native';

import { styles } from './styles';

/* * */

interface VehicleCounterProps {
	count?: number
}

/* * */
export default function VehicleCounter({ count }: VehicleCounterProps) {
	//

	//
	// A. Setup variables
	const counterStyles = styles();

	return (
		<View>
			{
				count === 0 && (
					<View style={counterStyles.zeroCount}>
						<NoVehicleIcon />
						<Text style={counterStyles.textMuted}>Sem veiculos em circulação</Text>
					</View>
				)
			}

			{ (count ?? 0) > 0 && (
				<View style={counterStyles.vehiclesCounter}>
					<LiveIcon />
					<Text style={counterStyles.text}>{count} veículos em circulação</Text>
				</View>
			)}
		</View>
	);
}
