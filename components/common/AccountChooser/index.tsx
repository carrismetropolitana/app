/* * */

import { Account } from '@/types/account.types';
import { Button, Overlay, Text } from '@rn-vui/themed';
import { SafeAreaView, ScrollView, View } from 'react-native';

/* * */

interface Props {
	action1?: () => void
	action1Title: string
	action2?: () => void
	action2Title: string
	cloudProfile?: Account
	description: string
	isVisible: boolean
	localProfile?: Account
	onBackdropPress: () => void
	title: string
}

/* * */

function ProfileDetails({ bgColor, label, profile }: { bgColor: string, label: string, profile?: Account }) {
	//

	//
	// A. Render Components

	return (
		<ScrollView contentContainerStyle={{ alignItems: 'center', padding: 8 }} style={{ backgroundColor: bgColor, flex: 1, marginHorizontal: 4, maxHeight: 400, }}>
			<Text style={{ fontWeight: 'bold', marginBottom: 20 }}>{label}</Text>
			<Text>Nome: {profile?.profile?.first_name || 'N/A'}</Text>
			<Text>Apelido: {profile?.profile?.last_name || 'N/A'}</Text>
			<Text>Mail: {profile?.profile?.email || 'N/A'}</Text>
			<Text>Tel: {profile?.profile?.phone || 'N/A'}</Text>
			<Text>Genero: {profile?.profile?.gender || 'N/A'}</Text>
			<Text>Utilização: {profile?.profile?.utilization_type || 'N/A'}</Text>
			<Text>Trabalho: {profile?.profile?.work_setting || 'N/A'}</Text>
			<Text>Atividade: {profile?.profile?.activity || 'N/A'}</Text>
			<Text>Criado em: {profile?.created_at || 'N/A'}</Text>
		</ScrollView>
	);
}

export function AccountChooser({ action1, action1Title, action2, action2Title, cloudProfile, description, isVisible, localProfile, onBackdropPress, title }: Props) {
	return (
		<Overlay isVisible={isVisible} onBackdropPress={onBackdropPress}>
			<SafeAreaView>
				<View style={{ flex: 1, minWidth: '100%', padding: 10 }}>
					<Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 20 }}>{title}</Text>
					<Text style={{ fontSize: 12, fontWeight: '600', marginBottom: 20 }}>{description}</Text>
					<View style={{ flexDirection: 'row', height: '100%' }}>
						{localProfile && (
							<ProfileDetails bgColor="#f0f0f0" label="Conta Atual" profile={localProfile} />
						)}
						{cloudProfile && (
							<ProfileDetails bgColor="#e8f4ff" label="Dados da Cloud" profile={cloudProfile} />
						)}
					</View>
				</View>
				{action1 && <Button onPress={action1} style={{ marginBottom: 10 }} title={action1Title} />}
				{action2 && <Button onPress={action2} style={{ marginBottom: 10 }} title={action2Title} />}
				<Button onPress={onBackdropPress} style={{ marginBottom: 10 }} title="Cancelar" />
			</SafeAreaView>
		</Overlay>
	);

	//
}
