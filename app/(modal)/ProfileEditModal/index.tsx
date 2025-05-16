/* * */

import { Section } from '@/components/common/layout/Section';
import { ProfileImage } from '@/components/ProfileImage';
import { useProfileContext } from '@/contexts/Profile.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { ActivitySchema, UtilizationTypeSchema } from '@/types/account.types';
import { ButtonGroup, CheckBox, Input, Text } from '@rneui/themed';
import { IconArrowNarrowLeft, IconArrowsShuffle, IconCircle, IconCircleFilled } from '@tabler/icons-react-native';
import React, { useState } from 'react';
import { Pressable, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import styles from './styles';

/* * */

interface Props {
	onClose: () => void;
}


export default function ProfileEditModal({ onClose }: Props) {
	//

	//
	// A. Setup Variables
	const profileContext = useProfileContext();
	const themeContext = useThemeContext();
	const handleRefreshPersona = () => profileContext.actions.fetchPersona();
	const goBackInHistory = () => profileContext.actions.setPreviousPersona();

	const [username, setUsername] = useState(profileContext.data.profile?.profile?.first_name || '');
	const [surname, setSurname] = useState(profileContext.data.profile?.profile?.last_name || '');
	const [email, setEmail] = useState(profileContext.data.profile?.profile?.email || '');
	const [phone, setPhone] = useState(profileContext.data.profile?.profile?.phone || '');
	const [birthDate, setBirthDate] = useState(profileContext.data.profile?.profile?.date_of_birth || '');
	const [passengerProfile, setPassengerProfile] = useState(profileContext.data.profile?.profile?.work_setting || '');
	const [usageType, setUsageType] = useState(profileContext.data.profile?.profile?.utilization_type || '');
	const [interestTopics, setInterestTopics] = useState(profileContext.data.profile?.profile?.activity || '');
	const [accentColor, setAccentColor] = useState(theming.colorBrand);

	const passengerTypes = ActivitySchema;
	const utilizationTypes = UtilizationTypeSchema;
	const interests = ['Alterações de Rede', 'Eventos & Novidades', 'Carris Metropolitana'];
	const persona_image = profileContext.data.persona_image;
	const accentColors = ['#3D85C6', '#C61D23', '#FDB71A', '#BB3E96', '#0C807E', '#FF6900'];

	const buttons = [
		{
			element: () => (
				<Pressable onPress={goBackInHistory}>
					<IconArrowNarrowLeft color={theming.colorSystemText300} size={24} />
				</Pressable>
			)
		},
		{
			element: () => (
				<Pressable onPress={handleRefreshPersona}>
					<IconArrowsShuffle color={theming.colorSystemText300} size={24} />
				</Pressable>
			)
		},
	];

	//
	// B. Handle actions

	const handleProfileFieldBlur = (field: string, value: string) => {
		if (profileContext.data.profile) {
			const updatedProfile = {
				...profileContext.data.profile,
				profile: {
					...profileContext.data.profile.profile,
					[field]: value,
				},
			};

			console.log("=====>", field, value);
			profileContext.actions.updateLocalProfile(updatedProfile);
		}
	};

	//
	// D. Render Components
	return (
		<View>
			<SafeAreaView style={{ flex: 1 }}>
				<View style={styles.container} >

					<View style={styles.userSection}>
						{persona_image && <ProfileImage borderWidth={10} color={accentColor} size={200} type="url" />}
						<ButtonGroup buttons={buttons} containerStyle={{ backgroundColor: themeContext.theme.lightColors?.background, borderRadius: 30, marginTop: -20, width: '25%' }} />

					</View>
					<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', paddingTop: 10, width: '100%' }}>
						{accentColors.map((item, index) => (
							<CheckBox
								key={index}
								checked={accentColor === item}
								checkedIcon={<IconCircle color={item} fill="#FFFFFF" size={32} />}
								onPress={() => setAccentColor(item)}
								title=""
								uncheckedIcon={<IconCircleFilled color="#FFFFFF" fill={item} size={32} />}
							/>
						))}
					</View>
					<Section heading="Informações pessoais">
						<Input
							label="Nome"
							onChangeText={setUsername}
							onBlur={() => handleProfileFieldBlur('first_name', username)}
							value={username}
						/>
						<Input
							label="Apelido"
							onChangeText={setSurname}
							onBlur={() => handleProfileFieldBlur('last_name', surname)}
					
							value={surname}
						/>
						<Input
							label="Data de Nascimento"
							onChangeText={setBirthDate}
							onBlur={() => handleProfileFieldBlur('date_of_birth', birthDate.toString())}	
							value={birthDate.toString()}
						/>
					</Section>
					<Section heading="Dados de contacto">
						<Input
							label="Email"
							onChangeText={setEmail}
							onBlur={() => handleProfileFieldBlur('email', email)}
							value={email}
						/>
						<Input
							label="Número de Telemóvel"
							onChangeText={setPhone}
							onBlur={() => handleProfileFieldBlur('phone', phone)}
							value={phone}
						/>
					</Section>
<Section heading="Perfil de Passageiro">
	{passengerTypes.options.map((item, index) => (
		<CheckBox
			key={index}
			checked={passengerProfile === item}
			checkedIcon="dot-circle-o"
			onPress={() => {
				setPassengerProfile(item);
				handleProfileFieldBlur('work_setting', item);
			}}
			title={item}
			uncheckedIcon="circle-o"
		/>
	))}
</Section>
<Section heading="Tipo de utilização">
	{utilizationTypes.options.map((item, index) => (
		<CheckBox
			key={index}
			checked={usageType === item}
			checkedIcon="dot-circle-o"
			onPress={() => {
				setUsageType(item);
				handleProfileFieldBlur('utilization_type', item);
			}}
			title={item}
			uncheckedIcon="circle-o"
		/>
	))}
</Section>
					<Section heading="Temas de interesse">
						{interests.map((item, index) => (
							<CheckBox
								key={index}
								checked={interestTopics === item}
								checkedIcon="dot-circle-o"
								onPress={() => setInterestTopics(item)}
								title={item}
								uncheckedIcon="circle-o"
							/>
						))}
					</Section>
				</View>
			</SafeAreaView>
		</View>
	);

	//
}
