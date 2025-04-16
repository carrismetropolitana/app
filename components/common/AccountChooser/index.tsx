import { Account } from '@/types/account.types';
import { Button, Overlay, Text } from '@rneui/themed';
import { SafeAreaView, ScrollView, View } from 'react-native';

interface Props {
	action1?: () => void
	action1Title: string
	action2?: () => void
	action2Title: string
	cloudProfile?: Account | undefined
	description: string
	isVisible: boolean
	localProfile?: Account | undefined
	onBackdropPress: () => void
	title: string
}

export function AccountChooser({ action1, action1Title, action2, action2Title, cloudProfile, description, isVisible, localProfile, onBackdropPress, title }: Props) {
	return (

		<Overlay
			isVisible={isVisible}
			onBackdropPress={onBackdropPress}
		>
			<SafeAreaView>
				<View style={{ flex: 1, height: '70%', maxWidth: '100%', minWidth: '100%', padding: 10 }}>
					<Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 20 }}> {title} </Text>
					<Text style={{ fontSize: 12, fontWeight: '600', marginBottom: 20 }}>{description}</Text>
					<View style={{ flexDirection: 'row', height: '100%' }}>
						{localProfile && (
							<ScrollView
								contentContainerStyle={{
									alignItems: 'center',
									padding: 8,
								}}
								style={{
									backgroundColor: '#f0f0f0',
									flex: 1,
									marginHorizontal: 4,
									maxHeight: 400,
								}}
							>
								<Text style={{ fontWeight: 'bold', marginBottom: 20 }}>Conta Atual</Text>
								<Text>Nome: {localProfile?.profile?.first_name || 'N/A'}</Text>
								<Text>Apelido: {localProfile?.profile?.last_name || 'N/A'}</Text>
								<Text>mail: {localProfile?.profile?.email || 'N/A'}</Text>
								<Text>Tel: {localProfile?.profile?.phone || 'N/A'}</Text>
								<Text>Genero: {localProfile?.profile?.gender || 'N/A'}</Text>
								<Text>Utilização: {localProfile?.profile?.utilization_type || 'N/A'}</Text>
								<Text>Trabalho: {localProfile?.profile?.work_setting || 'N/A'}</Text>
								<Text>Atividade: {localProfile?.profile?.activity || 'N/A'}</Text>
								<Text>Paragens Favoritas: {localProfile?.profile?.activity || 'N/A'}</Text>
								<Text>Linhas Favoritas: {localProfile?.profile?.activity || 'N/A'}</Text>
								<Text>Criado em: {localProfile?.created_at || 'N/A'}</Text>
							</ScrollView>

						)}
						{cloudProfile && (
							<ScrollView
								contentContainerStyle={{
									alignItems: 'center',
									padding: 8,
								}}
								style={{
									backgroundColor: '#e8f4ff',
									flex: 1,
									marginHorizontal: 4,
									maxHeight: 400,
								}}
							>
								<Text style={{ fontWeight: 'bold', marginBottom: 20 }}>Dados da Cloud</Text>
								<Text>Nome: {cloudProfile?.profile?.first_name || 'N/A'}</Text>
								<Text>Apelido:{cloudProfile?.profile?.last_name || 'N/A'}</Text>
								<Text>mail:{cloudProfile?.profile?.email || 'N/A'}</Text>
								<Text>Tel:{cloudProfile?.profile?.phone || 'N/A'}</Text>
								<Text>Genero:{cloudProfile?.profile?.gender || 'N/A'}</Text>
								<Text>Utilização:{cloudProfile?.profile?.utilization_type || 'N/A'}</Text>
								<Text>Trabalho:{cloudProfile?.profile?.work_setting || 'N/A'}</Text>
								<Text>Atividade:{cloudProfile?.profile?.activity || 'N/A'}</Text>
								<Text>Paragens Favoritas:{cloudProfile?.profile?.activity || 'N/A'}</Text>
								<Text>Linhas Favoritas:{cloudProfile?.profile?.activity || 'N/A'}</Text>
								<Text>Criado em: {cloudProfile?.created_at || 'N/A'}</Text>
							</ScrollView>

						)}
					</View>
				</View>
				{action1 && <Button onPress={action1} style={{ marginBottom: 10 }} title={action1Title} />}
				{action2 && <Button onPress={action2}style={{ marginBottom: 10 }} title={action2Title} />}
				<Button onPress={onBackdropPress} style={{ marginBottom: 10 }} title="Cancelar" />
			</SafeAreaView>
		</Overlay>

	);
}
