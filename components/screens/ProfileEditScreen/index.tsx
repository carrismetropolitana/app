/* * */

import { Section } from '@/components/common/layout/Section';
import { ProfileImage } from '@/components/ProfileImage';
import { useProfileContext } from '@/contexts/Profile.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { ActivitySchema, InterestsSchema, UtilizationTypeSchema } from '@/types/account.types';
import dimAvatarBackground from '@/utils/dimAvatarBackground';
import { ButtonGroup, CheckBox, Input, ListItem, Text } from '@rn-vui/themed';
import { IconArrowNarrowLeft, IconArrowsShuffle, IconCircle, IconCircleFilled, IconSquare, IconSquareCheckFilled } from '@tabler/icons-react-native';
import { useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import styles from './styles';

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
	const [accentColor, setAccentColor] = useState<null | string>(profileContext.data.accent_color || null);
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

	useEffect(() => {
		navigation.setOptions({
			headerBackTitle: 'Editar Perfil',
			headerStyle: {
				backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background,
			},
			headerTitle: '',
		});
	}, [navigation]);

	//
	// D. Render Components

	const buttons = [
		{
			element: () => (
				<Pressable onPress={goBackInHistory}>
					<IconArrowNarrowLeft color={accentColor && accentColor || ''} size={24} />
				</Pressable>
			),
		},
		{
			element: () => (
				<Pressable onPress={handleRefreshPersona}>
					<IconArrowsShuffle color={accentColor && accentColor || ''} size={24} />
				</Pressable>
			),
		},
	];

	return (
		<ScrollView style={profileEditModalStyles.container}>
			<View style={profileEditModalStyles.userSection}>
				<ProfileImage backgroundColor={accentColor ? dimAvatarBackground(accentColor) : 'rgba(253,183,26,0.4))'} borderWidth={10} color={accentColor || ''} size={200} type="url" />
				<ButtonGroup buttons={buttons} containerStyle={{ backgroundColor: backgroundColor, borderRadius: 30, marginTop: -20, width: '25%' }} />
				<View style={{ flexDirection: 'row', marginBottom: 20, marginTop: 20 }}>
					{accentColors.map((item, index) => (
						<CheckBox key={index} checked={accentColor === item} checkedIcon={<IconCircle color={item} fill="#FFFFFF" size={32} />} containerStyle={{ backgroundColor: backgroundColor }} onPress={() => setAccentColor(item)} title="" uncheckedIcon={<IconCircleFilled color="#FFFFFF" fill={item} size={32} />} />))}
				</View>
			</View>
			<View style={profileEditModalStyles.sectionWrapper}>
				<Section heading="Informações pessoais" />
				<ListItem>
					<ListItem.Content>
						<ListItem.Title style={profileEditModalStyles.inputLabel}><Text>Nome</Text></ListItem.Title>
						<Input onBlur={() => handleProfileFieldBlur('first_name', username)} onChangeText={setUsername} value={username} />
					</ListItem.Content>
				</ListItem>
				<ListItem>
					<ListItem.Content>
						<ListItem.Title style={profileEditModalStyles.inputLabel}><Text>Apelido</Text></ListItem.Title>
						<Input onBlur={() => handleProfileFieldBlur('last_name', surname)} onChangeText={setSurname} value={surname} />
					</ListItem.Content>
				</ListItem>
				<ListItem>
					<ListItem.Content>
						<ListItem.Title style={profileEditModalStyles.inputLabel}><Text>Data de Nascimento</Text></ListItem.Title>
						<Input onBlur={() => handleProfileFieldBlur('date_of_birth', birthDate.toString())} onChangeText={setBirthDate} value={birthDate.toString()} />
					</ListItem.Content>
				</ListItem>
			</View>
			<View style={profileEditModalStyles.sectionWrapper}>
				<Section heading="Dados de contacto" />
				<ListItem>
					<ListItem.Content>
						<ListItem.Title style={profileEditModalStyles.inputLabel}><Text>Email</Text></ListItem.Title>
						<Input onBlur={() => handleProfileFieldBlur('email', email)} onChangeText={setEmail} value={email} />
					</ListItem.Content>
				</ListItem>
				<ListItem>
					<ListItem.Content>
						<ListItem.Title style={profileEditModalStyles.inputLabel}><Text>Número de Telemóvel</Text></ListItem.Title>
						<Input onBlur={() => handleProfileFieldBlur('phone', phone)} onChangeText={setPhone} value={phone} />
					</ListItem.Content>
				</ListItem>
			</View>
			<View style={profileEditModalStyles.sectionWrapper}>
				<Section heading="Perfil de Passageiro" />
				{passengerTypes.options.map((item, index) => (
					<ListItem key={index}>
						<ListItem.Content>
							<CheckBox key={index} checked={passengerProfile === item} checkedIcon="dot-circle-o" containerStyle={profileEditModalStyles.checkbox} onPress={() => { setPassengerProfile(item), handleProfileFieldBlur('work_setting', item); }} textStyle={profileEditModalStyles.checkBoxText} title={item} uncheckedIcon="circle-o" />
						</ListItem.Content>
					</ListItem>
				))}
			</View>
			<View style={profileEditModalStyles.sectionWrapper}>
				<Section heading="Tipo de utilização" />
				{utilizationTypes.options.map((item, index) => (
					<ListItem key={index}>
						<ListItem.Content>
							<CheckBox key={index} checked={usageType === item} checkedIcon="dot-circle-o" containerStyle={profileEditModalStyles.checkbox} onPress={() => { setUsageType(item), handleProfileFieldBlur('utilization_type', item); }} textStyle={profileEditModalStyles.checkBoxText} title={item} uncheckedIcon="circle-o" />
						</ListItem.Content>
					</ListItem>
				))}
			</View>
			<View style={profileEditModalStyles.sectionWrapper}>
				<Section heading="Temas de interesse" />
				{interestsTypes.options.map((item, index) => (
					<ListItem key={index}>
						<ListItem.Content>
							<CheckBox
								checked={interestTopics.includes(item)}
								checkedIcon={<IconSquareCheckFilled color="#FFFFFF" fill={accentColor || '#3D85C6'} size={28} />}
								containerStyle={profileEditModalStyles.checkbox}
								textStyle={profileEditModalStyles.checkBoxText}
								title={item}
								uncheckedIcon={<IconSquare color={accentColor || '#3D85C6'} fill="#FFFFFF" size={28} />}
								onPress={() => {
									if (interestTopics.includes(item)) {
										setInterestTopics(interestTopics.filter(i => i !== item));
									}
									else {
										setInterestTopics([...interestTopics, item]);
									}
								}}
							/>
						</ListItem.Content>
					</ListItem>
				))}
			</View>
		</ScrollView>
	);

	//
}
