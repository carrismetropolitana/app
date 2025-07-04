/* * */

import { Section } from '@/components/common/layout/Section';
import { ProfileImage } from '@/components/ProfileImage';
import { useLocaleContext } from '@/contexts/Locale.context';
import { useProfileContext } from '@/contexts/Profile.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { ActivitySchema, InterestsSchema, UtilizationTypeSchema } from '@/types/account.types';
import dimAvatarBackground from '@/utils/dimAvatarBackground';
import { ButtonGroup, CheckBox, Input, ListItem, Text } from '@rn-vui/themed';
import { IconArrowNarrowLeft, IconArrowsShuffle, IconCircle, IconCircleFilled, IconSquare, IconSquareCheckFilled } from '@tabler/icons-react-native';
import { useNavigation } from 'expo-router';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import styles from './styles';

/* * */

const ActivityLabels = {
	[ActivitySchema.enum.other]: 'Outro',
	[ActivitySchema.enum.retired]: 'Reformado',
	[ActivitySchema.enum.student]: 'Estudante',
	[ActivitySchema.enum.university]: 'Universitário',
	[ActivitySchema.enum.working]: 'Trabalhador',
};

const UtilizationTypeLabels = {
	[UtilizationTypeSchema.enum.frequent]: 'Frequente',
	[UtilizationTypeSchema.enum.occasional]: 'Ocasional',
};

const InterestsLabels = {
	[InterestsSchema.enum['carris metropolitana']]: 'Carris Metropolitana',
	[InterestsSchema.enum['events and news']]: 'Eventos e Notícias',
	[InterestsSchema.enum['network changes']]: 'Alterações de Rede',
};

export default function ProfileEditScreen() {
	//

	//
	// A. Setup Variables

	const profileContext = useProfileContext();
	const themeContext = useThemeContext();
	const profileEditModalStyles = styles();

	const activityTypes = ActivitySchema;
	const utilizationTypes = UtilizationTypeSchema;
	const interestsTypes = InterestsSchema;
	const accentColors = ['rgba(61,133,198,1)', 'rgba(198,29,35,1)', 'rgba(253,183,26,1)', 'rgba(187,62,150,1)', 'rgba(12,128,126,1)', 'rgba(255,105,0,1)'];
	const backgroundColor = themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight100 : theming.colorSystemBackgroundDark100;

	const [username, setUsername] = useState(profileContext.data.profile?.profile?.first_name || '');
	const [surname, setSurname] = useState(profileContext.data.profile?.profile?.last_name || '');
	const [email, setEmail] = useState(profileContext.data.profile?.profile?.email || '');
	const [phone, setPhone] = useState(profileContext.data.profile?.profile?.phone || '');
	const [birthDate, setBirthDate] = useState(profileContext.data.profile?.profile?.date_of_birth || '');
	const [activityProfile, setActivityProfile] = useState(profileContext.data.profile?.profile?.activity || '');
	const [usageType, setUsageType] = useState(profileContext.data.profile?.profile?.utilization_type || '');
	const [interestTopics, setInterestTopics] = useState<string[]>(profileContext.data.interests || []);
	const [accentColor, setAccentColor] = useState<null | string>(profileContext.data.accent_color || null);
	const [showPicker, setShowPicker] = useState(false);
	const navigation = useNavigation();

	const localeContext = useLocaleContext();
	//
	// B. Handle actions

	const handleRefreshPersona = () => profileContext.actions.fetchPersona();
	const goBackInHistory = () => profileContext.actions.setPreviousPersona();

	const handleProfileFieldBlur = async (field: string, value: number | string) => {
		if (profileContext.data.profile) {
			const updatedProfile = {
				...profileContext.data.profile,
				profile: {
					...profileContext.data.profile.profile,
					[field]: value,
				},
			};
			await profileContext.actions.updateLocalProfile(updatedProfile);
		}
	};

	const handleBirthChange = (date: Date) => {
		const timeStamp = date.getTime();
		setBirthDate(timeStamp.toString());
		handleProfileFieldBlur('date_of_birth', timeStamp);
	};

	useEffect(() => {
		profileContext.actions.setAccentColor(accentColor || '');
	}, [accentColor]);

	useEffect(() => {
		profileContext.actions.setInterests(interestTopics || []);
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
					<IconArrowNarrowLeft color={accentColor ? accentColor : ''} size={24} />
				</Pressable>
			),
		},
		{
			element: () => (
				<Pressable onPress={handleRefreshPersona}>
					<IconArrowsShuffle color={accentColor ? accentColor : ''} size={24} />
				</Pressable>
			),
		},
	];

	return (
		<ScrollView style={profileEditModalStyles.container}>
			<View style={profileEditModalStyles.userSection}>
				<ProfileImage backgroundColor={accentColor ? dimAvatarBackground(accentColor) : 'rgba(253,183,26,0.4))'} borderWidth={10} color={accentColor || ''} size={200} type="url" />
				<ButtonGroup buttons={buttons} containerStyle={{ backgroundColor: backgroundColor, borderRadius: 30, marginTop: -20, width: '25%' }} />
				<View style={{ alignItems: 'center', flexDirection: 'row', gap: 0, justifyContent: 'center', marginVertical: 20 }}>
					{accentColors.map((item, index) => (
						<CheckBox
							key={index}
							checked={accentColor === item}
							checkedIcon={<IconCircle color={item} fill="#FFFFFF" size={32} />}
							containerStyle={{ backgroundColor: backgroundColor, padding: 0 }}
							onPress={() => setAccentColor(item)}
							title=""
							uncheckedIcon={<IconCircleFilled color="#FFFFFF" fill={item} size={32} />}
						/>
					))}
				</View>
			</View>
			<View style={profileEditModalStyles.sectionWrapper}>
				<Section heading="Informações pessoais" />
				<ListItem>
					<ListItem.Content>
						<ListItem.Title style={profileEditModalStyles.inputLabel}><Text>Nome</Text></ListItem.Title>
						<Input containerStyle={profileEditModalStyles.inputContainer} onBlur={() => handleProfileFieldBlur('first_name', username)} onChangeText={setUsername} value={username} />
					</ListItem.Content>
				</ListItem>
				<ListItem>
					<ListItem.Content>
						<ListItem.Title style={profileEditModalStyles.inputLabel}><Text>Apelido</Text></ListItem.Title>
						<Input containerStyle={profileEditModalStyles.inputContainer} onBlur={() => handleProfileFieldBlur('last_name', surname)} onChangeText={setSurname} value={surname} />
					</ListItem.Content>
				</ListItem>
				<ListItem>
					<ListItem.Content>
						<ListItem.Title style={profileEditModalStyles.inputLabel}>
							<Text>Data de Nascimento</Text>
						</ListItem.Title>
						<DateTimePickerModal
							date={birthDate ? new Date(Number(birthDate)) : new Date()}
							isVisible={showPicker}
							locale={localeContext.locale}
							mode="date"
							onCancel={() => setShowPicker(false)}
							onChange={date => handleBirthChange(date)}
							onConfirm={() => setShowPicker(false)}
							pickerStyleIOS={{ alignItems: 'center' }}
						/>
						<Input
							containerStyle={profileEditModalStyles.inputContainer}
							editable={false}
							onPressIn={() => setShowPicker(true)}
							placeholder="Selecionar data"
							value={birthDate ? DateTime.fromJSDate(new Date(Number(birthDate))).setLocale(localeContext.locale).toLocaleString(DateTime.DATE_MED).replaceAll('de', '') : ''}
						/>
					</ListItem.Content>
				</ListItem>
			</View>
			<View style={profileEditModalStyles.sectionWrapper}>
				<Section heading="Dados de contacto" />
				<ListItem>
					<ListItem.Content>
						<ListItem.Title style={profileEditModalStyles.inputLabel}><Text>Email</Text></ListItem.Title>
						<Input containerStyle={profileEditModalStyles.inputContainer} onBlur={() => handleProfileFieldBlur('email', email)} onChangeText={setEmail} value={email} />
					</ListItem.Content>
				</ListItem>
				<ListItem>
					<ListItem.Content>
						<ListItem.Title style={profileEditModalStyles.inputLabel}><Text>Número de Telemóvel</Text></ListItem.Title>
						<Input containerStyle={profileEditModalStyles.inputContainer}onBlur={() => handleProfileFieldBlur('phone', phone)} onChangeText={setPhone} value={phone} />
					</ListItem.Content>
				</ListItem>
			</View>
			<View style={profileEditModalStyles.sectionWrapper}>
				<Section heading="Perfil de Passageiro" />
				{activityTypes.options.map((item, index) => (
					<ListItem key={index}>
						<ListItem.Content>
							<CheckBox
								key={index}
								checked={activityProfile === item}
								checkedIcon="dot-circle-o"
								containerStyle={profileEditModalStyles.checkbox}
								textStyle={profileEditModalStyles.checkBoxText}
								title={ActivityLabels[item]}
								uncheckedIcon="circle-o"
								onPress={() => {
									setActivityProfile(item);
									handleProfileFieldBlur('activity', item);
								}}
							/>
						</ListItem.Content>
					</ListItem>
				))}
			</View>
			<View style={profileEditModalStyles.sectionWrapper}>
				<Section heading="Tipo de utilização" />
				{utilizationTypes.options.map((item, index) => (
					<ListItem key={index}>
						<ListItem.Content>
							<CheckBox
								key={index}
								checked={usageType === item}
								checkedIcon="dot-circle-o"
								containerStyle={profileEditModalStyles.checkbox}
								textStyle={profileEditModalStyles.checkBoxText}
								title={UtilizationTypeLabels[item]}
								uncheckedIcon="circle-o"
								onPress={() => {
									setUsageType(item);
									handleProfileFieldBlur('utilization_type', item);
								}}
							/>
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
								title={InterestsLabels[item]}
								uncheckedIcon={<IconSquare color={accentColor || '#3D85C6'} fill="#FFFFFF" size={28} />}
								onPress={() => {
									let newTopics;
									if (interestTopics.includes(item)) {
										newTopics = interestTopics.filter(i => i !== item);
									}
									else {
										newTopics = [...interestTopics, item];
									}
									setInterestTopics(newTopics);
									profileContext.actions.setInterests(newTopics);
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
