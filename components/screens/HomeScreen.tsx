import { Section } from '@/components/common/layout/Section';
import { Surface } from '@/components/common/layout/Surface';
import { useProfileContext } from '@/contexts/Profile.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { Button, Text } from '@rneui/themed';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native';

import { AccountChooser } from '../common/AccountChooser';
import { CustomMapView } from '../map/MapView';

export default function HomeScreen() {
	const themeContext = useThemeContext();
	const profileContext = useProfileContext();
	const cloudProfile = profileContext.data.cloud_profile;
	const localProfile = profileContext.data.profile;

	return (
		<SafeAreaView
			style={{
				backgroundColor: themeContext.theme.mode === 'light'
					? themeContext.theme.lightColors?.background
					: themeContext.theme.darkColors?.background,
				flex: 1,
			}}
		>
			<Surface>
				<Section heading="Bem-Vindo" subheading="Hoje o tempo está limpo" withPadding>
					{/* <Button
						onPress={profileContext.actions.toogleAccountSync}
						title="SYNC ACCOUNTS"
						style={{
							borderColor: 'grey',
							borderRadius: 5,
							borderWidth: 3,
							marginBottom: 10,
							marginTop: 10,
						}}
					> </Button> */}

					<Link href="/profile">
						<Button style={{
							borderColor: 'grey',
							borderRadius: 5,
							borderWidth: 3,
							marginBottom: 10,
							marginTop: 10,
						}}
						>
							<Text>Open profile</Text>
						</Button>
					</Link>

					<Text>{JSON.stringify(profileContext.data.profile)}</Text>

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
				{/* <CustomMapView />  */}
			</Surface>
		</SafeAreaView>
	);
}
