/* * */
import { Section } from '@/components/common/layout/Section';
import { Surface } from '@/components/common/layout/Surface';
import { useProfileContext } from '@/contexts/Profile.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { UtilizationTypeSchema } from '@/types/account.types';
import { Picker } from '@react-native-picker/picker';
import { Button, Dialog, Text } from '@rneui/themed';
import { IconArrowsRandom, IconReload } from '@tabler/icons-react-native';
import { Link } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AccountChooser } from '../common/AccountChooser';
import { CustomMapView } from '../map/MapView';

/* * */

export default function HomeScreen() {
	const themeContext = useThemeContext();
	const profileContext = useProfileContext();
	const [selectedUserType, setselectedUserType] = useState();
	const cloudProfile = profileContext.data?.cloud_profile;
	const localProfile = profileContext.data?.profile;

	//
	// A. Render componennts

	return (
		<SafeAreaView style={{ backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background, flex: 1 }}>
			<Surface>
				<Section heading="Bem-Vindo" subheading="Hoje o tempo está limpo" withPadding>
					{/* <CustomMapView /> */}
					<Link href="/profile"><Text>Open profile</Text></Link>

					<Button onPress={profileContext.actions.toogleAccountSync} style={{ borderColor: 'grey', borderRadius: 5, borderWidth: 3, marginBottom: 10, marginTop: 10 }} title="SYNC ACCOUNTS" />
					{/* <Link href="/cookies"><Text>Open Cooks</Text></Link> */}
					{/* <Picker
						selectedValue={selectedUserType}
						style={{ height: 350, width: 350 }}
						onValueChange={itemValue =>
							setselectedUserType(itemValue)}
					>

						{UtilizationTypeSchema.options.map(option => (
							<Picker.Item key={option} label={option} value={option} />
						))}
					</Picker> */}
					<Text> {JSON.stringify(profileContext.data.profile)}</Text>
					<AccountChooser
						action1={() => alert('Substituir conta por dados da Cloud')}
						action1Title="Substituir conta por dados da Cloud"
						action2={profileContext.actions.toogleAccountSync}
						action2Title="Manter dados atuais"
						cloudProfile={cloudProfile ?? undefined}
						description="Atenção: A conta local pode ser substituida pelos dados da Cloud ou vice-versa"
						isVisible={profileContext.flags.is_syncing}
						localProfile={localProfile ?? undefined}
						onBackdropPress={profileContext.actions.toogleAccountSync}
						title="Sincronizar contas"
					/>
				</Section>

			</Surface>
		</SafeAreaView>
	);

	//
}
