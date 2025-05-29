/* * */

import { Section } from '@/components/common/layout/Section';
import { ProfileImage } from '@/components/ProfileImage';
import { useProfileContext } from '@/contexts/Profile.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { ActivitySchema, InterestsSchema, UtilizationTypeSchema } from '@/types/account.types';
import { ButtonGroup, CheckBox, Input, ListItem, Text } from '@rn-vui/themed';
import { IconArrowNarrowLeft, IconArrowsShuffle, IconCircle, IconCircleFilled, IconSquare, IconSquareCheckFilled, IconSquareFilled } from '@tabler/icons-react-native';
import React, { useEffect, useState } from 'react';
import { Platform, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import styles from './styles';
import dimAvatarBackground from '@/utils/dimAvatarBackground';
import { useNavigation } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';

/* * */

export default function ProfileEditScreen() {
	//

	//
	// A. Setup Variables

	const profileContext = useProfileContext();
	const themeContext = useThemeContext();
	const profileEditModalStyles = styles();

	const passengerTypes = ActivitySchema;
	const utilizationTypes = UtilizationTypeSchema;
	const interestsTypes = InterestsSchema;
	const accentColors = ['rgba(61,133,198,1)', 'rgba(198,29,35,1)', 'rgba(253,183,26,1)', 'rgba(187,62,150,1)', 'rgba(12,128,126,1)', 'rgba(255,105,0,1)'];
	const backgroundColor = themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight100 : theming.colorSystemBackgroundDark100;

	const [username, setUsername] = useState(profileContext.data.profile?.profile?.first_name || '');
	const [surname, setSurname] = useState(profileContext.data.profile?.profile?.last_name || '');
	const [email, setEmail] = useState(profileContext.data.profile?.profile?.email || '');
	const [phone, setPhone] = useState(profileContext.data.profile?.profile?.phone || '');
	const [birthDate, setBirthDate] = useState(profileContext.data.profile?.profile?.date_of_birth || '');
	const [passengerProfile, setPassengerProfile] = useState(profileContext.data.profile?.profile?.work_setting || '');
	const [usageType, setUsageType] = useState(profileContext.data.profile?.profile?.utilization_type || '');
	const [interestTopics, setInterestTopics] = useState<string[]>(Array.isArray(profileContext.data.profile?.profile?.interests) ? profileContext.data.profile?.profile?.interests : []);
	const [accentColor, setAccentColor] = useState<string | null>(profileContext.data.accent_color || null);
	const navigation = useNavigation();
	//
	// B. Handle actions

	const handleRefreshPersona = () => profileContext.actions.fetchPersona();
	const goBackInHistory = () => profileContext.actions.setPreviousPersona();

	const handleProfileFieldBlur = (field: string, value: string) => {
		if (profileContext.data.profile) {
			const updatedProfile = { ...profileContext.data.profile, profile: { ...profileContext.data.profile.profile, [field]: value } };
			profileContext.actions.updateLocalProfile(updatedProfile);
		}
	};

	useEffect(() => {
		profileContext.actions.setAccentColor(accentColor || '');
	}, [accentColor]);

	//
	// D. Render Components

	const buttons = [
		{
			element: () => (
				<Pressable onPress={goBackInHistory}>
					<IconArrowNarrowLeft color={accentColor && accentColor || ''} size={24} />
				</Pressable>
			)
		},
		{
			element: () => (
				<Pressable onPress={handleRefreshPersona}>
					<IconArrowsShuffle color={accentColor && accentColor || ''} size={24} />
				</Pressable>
			)
		},
	];

	return (
		<ScrollView style={profileEditModalStyles.container}>
			<View style={profileEditModalStyles.userSection}>
				<ProfileImage borderWidth={10} color={accentColor || ''} size={200} type="url" backgroundColor={accentColor ? dimAvatarBackground(accentColor) : 'rgba(253,183,26,0.4))'} />
				<ButtonGroup buttons={buttons} containerStyle={{ backgroundColor: backgroundColor, borderRadius: 30, marginTop: -20, width: '25%' }} />
				<View style={{ flexDirection: 'row', marginBottom: 20, marginTop: 20 }}>
					{accentColors.map((item, index) => (
						<CheckBox containerStyle={{ backgroundColor: backgroundColor }} key={index} checked={accentColor === item} checkedIcon={<IconCircle color={item} fill="#FFFFFF" size={32} />} onPress={() => setAccentColor(item)} title="" uncheckedIcon={<IconCircleFilled color="#FFFFFF" fill={item} size={32} />} />))}
				</View>
			</View>
			<View style={profileEditModalStyles.sectionWrapper}>
				<Section heading="Informações pessoais"></Section>
				<ListItem>
					<ListItem.Content>
						<ListItem.Title style={profileEditModalStyles.inputLabel}><Text>Nome</Text></ListItem.Title>
						<Input onChangeText={setUsername} onBlur={() => handleProfileFieldBlur('first_name', username)} value={username} />
					</ListItem.Content>
				</ListItem>
				<ListItem>
					<ListItem.Content>
						<ListItem.Title style={profileEditModalStyles.inputLabel}><Text>Apelido</Text></ListItem.Title>
						<Input onChangeText={setSurname} onBlur={() => handleProfileFieldBlur('last_name', surname)} value={surname} />
					</ListItem.Content>
				</ListItem>
				<ListItem>
					<ListItem.Content>
						<ListItem.Title style={profileEditModalStyles.inputLabel}><Text>Data de Nascimento</Text></ListItem.Title>
						<Input onChangeText={setBirthDate} onBlur={() => handleProfileFieldBlur('date_of_birth', birthDate.toString())} value={birthDate.toString()} />
					</ListItem.Content>
				</ListItem>
			</View>
			<View style={profileEditModalStyles.sectionWrapper}>
				<Section heading="Dados de contacto"></Section>
				<ListItem>
					<ListItem.Content>
						<ListItem.Title style={profileEditModalStyles.inputLabel}><Text>Email</Text></ListItem.Title>
						<Input onChangeText={setEmail} onBlur={() => handleProfileFieldBlur('email', email)} value={email} />
					</ListItem.Content>
				</ListItem>
				<ListItem>
					<ListItem.Content>
						<ListItem.Title style={profileEditModalStyles.inputLabel}><Text>Número de Telemóvel</Text></ListItem.Title>
						<Input onChangeText={setPhone} onBlur={() => handleProfileFieldBlur('phone', phone)} value={phone} />
					</ListItem.Content>
				</ListItem>
			</View>
			<View style={profileEditModalStyles.sectionWrapper}>
				<Section heading="Perfil de Passageiro"></Section>
				{passengerTypes.options.map((item, index) => (
					<ListItem key={index}>
						<ListItem.Content>
							<CheckBox key={index} containerStyle={profileEditModalStyles.checkbox} textStyle={profileEditModalStyles.checkBoxText} checked={passengerProfile === item} checkedIcon="dot-circle-o" onPress={() => { setPassengerProfile(item), handleProfileFieldBlur('work_setting', item) }} title={item} uncheckedIcon="circle-o" />
						</ListItem.Content>
					</ListItem>
				))}
			</View>
			<View style={profileEditModalStyles.sectionWrapper}>
				<Section heading="Tipo de utilização"></Section>
				{utilizationTypes.options.map((item, index) => (
					<ListItem key={index}>
						<ListItem.Content>
							<CheckBox key={index} checked={usageType === item} checkedIcon="dot-circle-o" onPress={() => { setUsageType(item), handleProfileFieldBlur('utilization_type', item) }} title={item} uncheckedIcon="circle-o" containerStyle={profileEditModalStyles.checkbox} textStyle={profileEditModalStyles.checkBoxText} />
						</ListItem.Content>
					</ListItem>
				))}
			</View>
			<View style={profileEditModalStyles.sectionWrapper}>
				<Section heading="Temas de interesse"></Section>
				{interestsTypes.options.map((item, index) => (
					<ListItem key={index}>
						<ListItem.Content>
							<CheckBox
								containerStyle={profileEditModalStyles.checkbox}
								textStyle={profileEditModalStyles.checkBoxText}
								checked={interestTopics.includes(item)}
								checkedIcon={<IconSquareCheckFilled fill={accentColor || "#3D85C6"} color={"#FFFFFF"} size={28} />}
								uncheckedIcon={<IconSquare color={accentColor || "#3D85C6"} fill={"#FFFFFF"} size={28} />}
								onPress={() => {
									if (interestTopics.includes(item)) {
										setInterestTopics(interestTopics.filter(i => i !== item));
									} else {
										setInterestTopics([...interestTopics, item]);
									}
								}}
								title={item}
							/>
						</ListItem.Content>
					</ListItem>
				))}
			</View>
		</ScrollView>
	);

	//
}