/* * */
import { Section } from '@/components/common/layout/Section';
import { Surface } from '@/components/common/layout/Surface';
import { useProfileContext } from '@/contexts/Profile.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { UtilizationTypeSchema } from '@/types/account.types';
import { Picker } from '@react-native-picker/picker';
import { Text } from '@rneui/themed';
import { Link } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CustomMapView } from '../map/MapView';

/* * */

export default function HomeScreen() {
	const themeContext = useThemeContext();
	const profileContext = useProfileContext();
	const [selectedUserType, setselectedUserType] = useState();

	//
	// A. Render componennts

	return (
		<SafeAreaView style={{ backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background, flex: 1 }}>
			<Surface>
				<Section heading="Bem-Vindo" subheading="Hoje o tempo está limpo" withPadding>
					{/* <CustomMapView /> */}
					<Text>{JSON.stringify(profileContext.data.profile)}</Text>
					<Link href="/profile"><Text>Open profile</Text></Link>
					<Link href="/cookies"><Text>Open Cooks</Text></Link>
					<Picker
						selectedValue={selectedUserType}
						style={{ height: 350, width: 350 }}
						onValueChange={itemValue =>
							setselectedUserType(itemValue)}
					>

						{UtilizationTypeSchema.options.map(option => (
							<Picker.Item key={option} label={option} value={option} />
						))}
					</Picker>
				</Section>
			</Surface>
		</SafeAreaView>
	);

	//
}
