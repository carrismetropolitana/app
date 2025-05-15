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

export default function ProfileEditModal() {
	//

	//
	// A. Setup Variables
	const profileContext = useProfileContext();
	const themeContext = useThemeContext();
	const handleRefreshPersona = () => profileContext.actions.fetchPersona();
	const goBackInHistory = () => profileContext.actions.setPreviousPersona();

	const [username, setUsername] = useState('');
	const [surname, setSurname] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [birthDate, setBirthDate] = useState('');
	const [passengerProfile, setPassengerProfile] = useState('');
	const [usageType, setUsageType] = useState('');
	const [interestTopics, setInterestTopics] = useState('');
	const [accentColor, setAccentColor] = useState(theming.colorBrand);

	const passengerTypes = ActivitySchema;
	const utilizationTypes = UtilizationTypeSchema;
	const interests = ['Alterações de Rede', 'Eventos & Novidades', 'Carris Metropolitana'];
	const persona_image = profileContext.data.persona_image;
	const accentColors = ['#3D85C6', '#C61D23', '#FDB71A', '#BB3E96', '#0C807E', '#FF6900'];

	const buttons = [
		{ element: () => (
			<Pressable onPress={goBackInHistory}>
				<IconArrowNarrowLeft color={theming.colorSystemText300} size={24} />
			</Pressable>
		) },
		{ element: () => (
			<Pressable onPress={handleRefreshPersona}>
				<IconArrowsShuffle color={theming.colorSystemText300} size={24} />
			</Pressable>
		) },
	];
	//
	// B. Handle Actions

	const clearScreen = () => {
		//setOpen(false);
	};
	
	//
	// D. Render Components
	return (
		<View style={{ backgroundColor: '#fff', borderRadius: 24 }}>
			<SafeAreaView style={{ flex: 1 }}>
				<View style={styles.container} >
					<View style={styles.header}>
						<TouchableOpacity onPress={clearScreen} style={styles.backButton}>
							<Text style={styles.arrow}>←</Text>
							<Text style={styles.backText}>Editar Perfil</Text>
						</TouchableOpacity>
					</View>

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
						<Input label="Nome" onChangeText={setUsername} placeholder="Nome" value={username} />
						<Input label="Apelido" onChangeText={setSurname} placeholder="Apelido" value={surname} />
						<Input label="Data de Nascimento" onChangeText={setBirthDate} placeholder="13 dez. 2000" value={birthDate} />
					</Section>
					<Section heading="Dados de contacto">
						<Input label="Email" onChangeText={setEmail} placeholder="Email" value={email} />
						<Input label="Número de Telemóvel" onChangeText={setPhone} placeholder="Número de Telemóvel" value={phone} />
					</Section>
					<Section heading="Perfil de Passageiro">
						{passengerTypes.options.map((item, index) => (
							<CheckBox
								key={index}
								checked={passengerProfile === item}
								checkedIcon="dot-circle-o"
								// containerStyle={styles.item}
								onPress={() => setPassengerProfile(item)}
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
								// containerStyle={styles.item}
								onPress={() => setUsageType(item)}
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
								// containerStyle={styles.item}
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
