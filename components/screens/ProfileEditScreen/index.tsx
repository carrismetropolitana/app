/* * */

import { Section } from '@/components/common/layout/Section';
import TabBarOnly from '@/components/common/layout/TabOnly';
import { ProfileImage } from '@/components/ProfileImage';
import { useAnalyticsContext } from '@/contexts/Analytics.context';
import { useLocaleContext } from '@/contexts/Locale.context';
import { useProfileContext } from '@/contexts/Profile.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { ActivitySchema, InterestsSchema, UtilizationTypeSchema } from '@/types/account.types';
import dimAvatarBackground from '@/utils/dimAvatarBackground';
import { ButtonGroup, CheckBox, Input, ListItem, Text } from '@rn-vui/themed';
import { IconArrowNarrowLeft, IconArrowsShuffle, IconCircle, IconCircleFilled, IconSquare, IconSquareCheckFilled } from '@tabler/icons-react-native';
import CountryPicker, { Country, CountryCode } from '@vricosti/react-native-country-picker-modal';
import { useNavigation } from 'expo-router';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Pressable, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import styles from './styles';

/* * */

export default function ProfileEditScreen() {
	//

	//
	// A. Setup Variables

	const profileContext = useProfileContext();
	const themeContext = useThemeContext();
	const localeContext = useLocaleContext();
	const analyticsContext = useAnalyticsContext();
	const profileEditModalStyles = styles();

	const activityTypes = ActivitySchema;
	const utilizationTypes = UtilizationTypeSchema;
	const interestsTypes = InterestsSchema;
	const accentColors = [
		{ code: 'rgba(61,133,198,1)', name: 'Azul' },
		{ code: 'rgba(198,29,35,1)', name: 'Vermelho' },
		{ code: 'rgba(253,183,26,1)', name: 'Amarelo' },
		{ code: 'rgba(187,62,150,1)', name: 'Roxo' },
		{ code: 'rgba(12,128,126,1)', name: 'Verde Esmeralda' },
		{ code: 'rgba(255,105,0,1)', name: 'Laranja' },
	];
	const backgroundColor = themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight100 : theming.colorSystemBackgroundDark100;
	const [phoneValid, setPhoneValid] = useState(true);
	const [countryCode, setCountryCode] = useState<CountryCode | undefined>('PT');
	const [country, setCountry] = useState<Country | null>(null);
	const [withFlag, setWithFlag] = useState(true);
	const [withCallingCode, setWithCallingCode] = useState(true);
	const [phone, setPhone] = useState(profileContext.data.profile?.profile?.phone || '');
	const [username, setUsername] = useState(profileContext.data.profile?.profile?.first_name || '');
	const [surname, setSurname] = useState(profileContext.data.profile?.profile?.last_name || '');
	const [email, setEmail] = useState(profileContext.data.profile?.profile?.email || '');
	const [emailValid, setEmailValid] = useState(true);
	const [birthDate, setBirthDate] = useState(profileContext.data.profile?.profile?.date_of_birth || '');
	const [activityProfile, setActivityProfile] = useState(profileContext.data.profile?.profile?.activity || '');
	const [usageType, setUsageType] = useState(profileContext.data.profile?.profile?.utilization_type || '');
	const [interestTopics, setInterestTopics] = useState<string[]>(profileContext.data.interests || []);
	const [accentColor, setAccentColor] = useState<null | string>(profileContext.data.accent_color || null);
	const screenHeight = Dimensions.get('window').height;
	const [showPicker, setShowPicker] = useState(false);
	const navigation = useNavigation();
	const { t } = useTranslation('translation', { keyPrefix: 'profileEdit' });
	//
	// B. Handle actions

	const handleRefreshPersona = () => profileContext.actions.fetchPersona();

	const goBackInHistory = () => profileContext.actions.setPreviousPersona();

	const handleProfileFieldBlur = async (field: string, value: number | string) => {
		if (profileContext.data.profile) {
			analyticsContext.actions.setUserProperties({ [field]: value });
			await profileContext.actions.updateLocalProfile({
				profile: {
					...profileContext.data.profile.profile,
					[field]: value,
				},
			});
		}
	};

	const handleBirthChange = (date: Date) => {
		const timeStamp = date.getTime();
		const now = DateTime.now();
		if (timeStamp > now.toMillis()) {
			alert('A data de nascimento não pode ser no futuro.');
			setBirthDate(now.toMillis().toString());
		}
		else {
			setBirthDate(timeStamp.toString());
			handleProfileFieldBlur('date_of_birth', timeStamp);
		}
	};

	const handlePhoneChange = (value: string) => {
		const callingCode = country?.callingCode?.[0] ? `+${country.callingCode[0]}` : '';
		if (value.startsWith(callingCode)) {
			const numberPart = value.substring(callingCode.length).replace(/[^0-9]/g, '');
			setPhone(callingCode + numberPart);
		}
		else {
			setPhone(callingCode);
		}
	};

	const verifyEmail = (email: string) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	useEffect(() => {
		navigation.setOptions({
			headerBackTitle: t('headerTitle'),
			headerStyle: {
				backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background,
			},
			headerTitle: '',
		});
	}, [navigation]);

	useEffect(() => {
		if (!country || !phone) {
			setPhoneValid(false);
			return;
		}
		let regex;
		const callingCode = country.callingCode && country.callingCode[0] ? country.callingCode[0] : '';

		if (callingCode && /^\d+$/.test(callingCode)) {
			regex = new RegExp(`^\\+${callingCode}[0-9]{6,15}$`);
		}
		else {
			regex = /^[0-9]{6,15}$/;
		}
		setPhoneValid(regex.test(phone));
	}, [phone, country]);

	useEffect(() => {
		if (!email) return;
		const handler = setTimeout(() => {
			const valid = verifyEmail(email);
			setEmailValid(valid);
			if (valid) {
				handleProfileFieldBlur('email', email);
			}
		}, 500);
		return () => clearTimeout(handler);
	}, [email]);

	useEffect(() => {
		profileContext.actions.setAccentColor(accentColor || '');
	}, [accentColor]);

	useEffect(() => {
		profileContext.actions.setInterests(interestTopics || []);
	}, [interestTopics]);

	//
	// D. Render Components

	const buttons = [
		{
			element: () => (
				<Pressable accessibilityHint={t('goBackInHistoryHint')} accessibilityLabel={t('goBackInHistoryLabel')} accessibilityLanguage={localeContext.locale} accessibilityRole="button" onPress={goBackInHistory}>
					<IconArrowNarrowLeft color={accentColor ? accentColor : ''} size={24} />
				</Pressable>
			),
		},
		{
			element: () => (
				<Pressable accessibilityHint={t('refreshPersonaHint')} accessibilityLabel={t('refreshPersonaLabel')} accessibilityLanguage={localeContext.locale} accessibilityRole="button" onPress={handleRefreshPersona}>
					<IconArrowsShuffle color={accentColor ? accentColor : ''} size={24} />
				</Pressable>
			),
		},
	];

	return (
		<View style={{ height: screenHeight - 100 }}>
			<ScrollView style={profileEditModalStyles.container}>
				<View style={profileEditModalStyles.userSection}>
					<ProfileImage backgroundColor={accentColor ? dimAvatarBackground(accentColor) : 'rgba(253,183,26,0.4))'} borderWidth={10} color={accentColor || ''} size={200} type="url" />
					<ButtonGroup buttons={buttons} containerStyle={{ backgroundColor: backgroundColor, borderRadius: 30, marginTop: -20, width: '25%' }} />
					<View style={{ alignItems: 'center', flexDirection: 'row', gap: 0, justifyContent: 'center', marginVertical: 20 }}>
						{accentColors.map((item, index) => (
							<CheckBox
								key={index}
								accessibilityHint={t('changeAccentColorHint')}
								accessibilityLabel={t('changeAccentColorLabel', { color: item.name, state: accentColor === item.code ? 'selecionado' : 'deselecionado' })}
								accessibilityLanguage={localeContext.locale}
								accessibilityRole="checkbox"
								accessibilityState={{ checked: accentColor === item.code }}
								checked={accentColor === item.code}
								checkedIcon={<IconCircle color={item.code} fill="#FFFFFF" size={32} />}
								containerStyle={{ backgroundColor: backgroundColor, padding: 0 }}
								onPress={() => setAccentColor(item.code)}
								uncheckedIcon={<IconCircleFilled color="#FFFFFF" fill={item.code} size={32} />}
							/>
						))}
					</View>
				</View>
				<View style={profileEditModalStyles.sectionWrapper}>
					<Section
						accessibilityHint={t('sectionPersonalInfoHint')}
						accessibilityLabel={t('sectionPersonalInfoLabel')}
						accessibilityLanguage={localeContext.locale}
						heading={t('personalInfoSectionTitle')}
					/>
					<ListItem>
						<ListItem.Content>
							<ListItem.Title style={profileEditModalStyles.inputLabel}>
								<Text
									accessibilityHint={t('nameInputHint')}
									accessibilityLabel={t('nameInputLabel')}
									accessibilityLanguage={localeContext.locale}
									accessibilityRole="text"
								>{t('firstNameInputLabel')}
								</Text>
							</ListItem.Title>
							<Input containerStyle={profileEditModalStyles.inputContainer} onBlur={() => handleProfileFieldBlur('first_name', username)} onChangeText={setUsername} value={username} />
						</ListItem.Content>
					</ListItem>
					<ListItem>
						<ListItem.Content>
							<ListItem.Title style={profileEditModalStyles.inputLabel}>
								<Text
									accessibilityHint={t('surnameInputHint')}
									accessibilityLabel={t('surnameInputLabel')}
									accessibilityLanguage={localeContext.locale}
									accessibilityRole="text"
								>{t('lastNameInputLabel')}
								</Text>
							</ListItem.Title>
							<Input containerStyle={profileEditModalStyles.inputContainer} onBlur={() => handleProfileFieldBlur('last_name', surname)} onChangeText={setSurname} value={surname} />
						</ListItem.Content>
					</ListItem>
					<ListItem>
						<ListItem.Content>
							<ListItem.Title style={profileEditModalStyles.inputLabel}>
								<Text>{t('dateOfBirthInputLabel')}</Text>
							</ListItem.Title>
							<Pressable onPress={() => setShowPicker(true)} style={{ width: '100%' }}>
								<Input
									accessibilityHint={t('birthdateInputHint')}
									accessibilityLabel={t('birthdateInputLabel')}
									accessibilityLanguage={localeContext.locale}
									accessibilityRole="text"
									containerStyle={profileEditModalStyles.inputContainer}
									editable={false}
									placeholder="Selecionar data"
									pointerEvents="none"
									value={birthDate ? DateTime.fromJSDate(new Date(Number(birthDate))).setLocale(localeContext.locale).toLocaleString(DateTime.DATE_MED).replace(/\bde\b/g, '') : ''}
								/>
							</Pressable>
							<DateTimePickerModal
								accessibilityHint={t('birthdateInputContentHint')}
								accessibilityLabel={t('birthdateInputContentLabel')}
								accessibilityLanguage={localeContext.locale}
								accessibilityRole="adjustable"
								date={birthDate ? new Date(Number(birthDate)) : new Date()}
								isVisible={showPicker}
								locale={localeContext.locale}
								mode="date"
								onCancel={() => setShowPicker(false)}
								onConfirm={(date) => {
									setShowPicker(false);
									handleBirthChange(date);
								}}
							/>
						</ListItem.Content>
					</ListItem>
				</View>
				<View style={profileEditModalStyles.sectionWrapper}>
					<Section
						accessibilityHint={t('sectionContactsInfoHint')}
						accessibilityLabel={t('sectionContactsInfoLabel')}
						accessibilityLanguage={localeContext.locale}
						heading={t('contactSectionTitle')}
					/>
					<ListItem>
						<ListItem.Content>
							<ListItem.Title style={profileEditModalStyles.inputLabel}><Text>{t('emailInputLabel')}</Text></ListItem.Title>
							<Input
								accessibilityHint={t('emailInputHint')}
								accessibilityLabel={t('emailInputContentLabel')}
								accessibilityLanguage={localeContext.locale}
								accessibilityRole="text"
								containerStyle={profileEditModalStyles.inputContainer}
								errorMessage={!emailValid && email ? t('invalidEmail') : undefined}
								onChangeText={setEmail}
								value={email}
							/>
						</ListItem.Content>
					</ListItem>
					<ListItem>
						<ListItem.Content>
							<ListItem.Title style={profileEditModalStyles.inputLabel}><Text>{t('phoneInputLabel')}</Text></ListItem.Title>
							<View
								accessibilityHint={t('phoneInputHint')}
								accessibilityLabel={t('phoneInputContentLabel')}
								accessibilityLanguage={localeContext.locale}
								accessibilityRole="text"
								style={{ alignItems: 'center', flexDirection: 'row' }}
							>
								<CountryPicker
									countryCode={countryCode ?? 'PT'}
									withCallingCode={withCallingCode}
									withFlag={withFlag}
									onSelect={(country) => {
										setCountryCode(country.cca2);
										setCountry(country);
										if (country.callingCode[0]) {
											setPhone(`+${country.callingCode[0]}`);
										}
									}}
									withFilter
								/>
								<Input
									containerStyle={profileEditModalStyles.phoneInputContainer}
									errorMessage={!phoneValid && phone ? t('invalidNumber') : undefined}
									keyboardType="phone-pad"
									onBlur={() => phoneValid && handleProfileFieldBlur('phone', phone)}
									onChangeText={handlePhoneChange}
									placeholder={country ? `+${country.callingCode[0]} 123456789` : 'Selecione o indicativo'}
									value={phone}
								/>
							</View>
						</ListItem.Content>
					</ListItem>
				</View>
				<View style={profileEditModalStyles.sectionWrapper}>
					<Section
						accessibilityHint={t('sectionActivityInfoHint')}
						accessibilityLabel={t('sectionActivityInfoLabel')}
						accessibilityLanguage={localeContext.locale}
						heading={t('activityProfileSectionTitle')}
					/>
					{activityTypes.options.map((item, index) => (
						<ListItem key={index}>
							<ListItem.Content>
								<CheckBox
									key={index}
									accessibilityHint={t('activityInfoHint')}
									accessibilityLabel={t('activityInfoLabel')}
									accessibilityLanguage={localeContext.locale}
									accessibilityRole="checkbox"
									accessibilityState={{ checked: activityProfile === item }}
									checked={activityProfile === item}
									checkedIcon="dot-circle-o"
									containerStyle={profileEditModalStyles.checkbox}
									textStyle={profileEditModalStyles.checkBoxText}
									title={t(item)}
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
					<Section
						accessibilityHint={t('sectionUtilizationTypeHint')}
						accessibilityLabel={t('sectionUtilizationTypeLabel')}
						accessibilityLanguage={localeContext.locale}
						heading={t('utilizationTypesSectionTitle')}
					/>
					{utilizationTypes.options.map((item, index) => (
						<ListItem key={index}>
							<ListItem.Content>
								<CheckBox
									key={index}
									accessibilityHint={t('utilizationTypeInfoHint')}
									accessibilityLabel={t('utilizationTypeInfoLabel')}
									accessibilityLanguage={localeContext.locale}
									accessibilityRole="checkbox"
									accessibilityState={{ checked: usageType === item }}
									checked={usageType === item}
									checkedIcon="dot-circle-o"
									containerStyle={profileEditModalStyles.checkbox}
									textStyle={profileEditModalStyles.checkBoxText}
									title={t(item)}
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
					<Section
						accessibilityHint={t('sectionTopicsOfInterestHint')}
						accessibilityLabel={t('sectionTopicsOfInterestLabel')}
						accessibilityLanguage={localeContext.locale}
						heading={t('topicsOfInterestSectionTitle')}
					/>
					{interestsTypes.options.map((item, index) => (
						<ListItem key={index}>
							<ListItem.Content>
								<CheckBox
									accessibilityHint={t('topicsOfInterestInfoHint')}
									accessibilityLabel={t('topicsOfInterestLabel')}
									accessibilityLanguage={localeContext.locale}
									accessibilityRole="checkbox"
									accessibilityState={{ checked: interestTopics.includes(item) }}
									checked={interestTopics.includes(item)}
									checkedIcon={<IconSquareCheckFilled color="#FFFFFF" fill={accentColor || '#3D85C6'} size={28} />}
									containerStyle={profileEditModalStyles.checkbox}
									textStyle={profileEditModalStyles.checkBoxText}
									title={t(item)}
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
			<TabBarOnly />
		</View>
	);

	//
}
