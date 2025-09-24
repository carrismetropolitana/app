/* * */

import { Section } from '@/components/common/layout/Section';
import { useAnalyticsContext } from '@/contexts/Analytics.context';
import { useLocaleContext } from '@/contexts/Locale.context';
import { useProfileContext } from '@/contexts/Profile.context';
import { ActivitySchema, InterestsSchema, UtilizationTypeSchema } from '@/types/account.types';
import { CheckBox, Input, ListItem, Text } from '@rn-vui/themed';
import { IconSquare, IconSquareCheckFilled } from '@tabler/icons-react-native';
import CountryPicker, { Country, CountryCode } from '@vricosti/react-native-country-picker-modal';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import styles from './styles';

/* * */

export function AccountEditForm() {
	//

	//
	// A. Setup variables

	const profileContext = useProfileContext();
	const localeContext = useLocaleContext();
	const analyticsContext = useAnalyticsContext();
	const profileEditModalStyles = styles();

	const activityTypes = ActivitySchema;
	const utilizationTypes = UtilizationTypeSchema;
	const interestsTypes = InterestsSchema;
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
	const [showPicker, setShowPicker] = useState(false);
	const { t } = useTranslation('translation', { keyPrefix: 'profileEdit' });
	//
	// B. Handle actions

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
		profileContext.actions.setInterests(interestTopics || []);
	}, [interestTopics]);

	//
	// D. Render Components

	return (
		<>
			<View style={profileEditModalStyles.sectionWrapper}>
				<Section
					accessibilityHint={t('sectionPersonalInfoHint')}
					accessibilityLabel={t('sectionPersonalInfoLabel')}
					accessibilityLanguage={localeContext.data.locale}
					heading={t('personalInfoSectionTitle')}
				/>
				<ListItem>
					<ListItem.Content>
						<ListItem.Title style={profileEditModalStyles.inputLabel}>
							<Text
								accessibilityHint={t('nameInputHint')}
								accessibilityLabel={t('nameInputLabel')}
								accessibilityLanguage={localeContext.data.locale}
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
								accessibilityLanguage={localeContext.data.locale}
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
								accessibilityLanguage={localeContext.data.locale}
								accessibilityRole="text"
								containerStyle={profileEditModalStyles.inputContainer}
								editable={false}
								placeholder="Selecionar data"
								pointerEvents="none"
								value={birthDate ? DateTime.fromJSDate(new Date(Number(birthDate))).setLocale(localeContext.data.locale).toLocaleString(DateTime.DATE_MED).replace(/\bde\b/g, '') : ''}
							/>
						</Pressable>
						<DateTimePickerModal
							accessibilityHint={t('birthdateInputContentHint')}
							accessibilityLabel={t('birthdateInputContentLabel')}
							accessibilityLanguage={localeContext.data.locale}
							accessibilityRole="adjustable"
							date={birthDate ? new Date(Number(birthDate)) : new Date()}
							isVisible={showPicker}
							locale={localeContext.data.locale}
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
					accessibilityLanguage={localeContext.data.locale}
					heading={t('contactSectionTitle')}
				/>
				<ListItem>
					<ListItem.Content>
						<ListItem.Title style={profileEditModalStyles.inputLabel}><Text>{t('emailInputLabel')}</Text></ListItem.Title>
						<Input
							accessibilityHint={t('emailInputHint')}
							accessibilityLabel={t('emailInputContentLabel')}
							accessibilityLanguage={localeContext.data.locale}
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
							accessibilityLanguage={localeContext.data.locale}
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
					accessibilityLanguage={localeContext.data.locale}
					heading={t('activityProfileSectionTitle')}
				/>
				{activityTypes.options.map((item, index) => (
					<ListItem key={index}>
						<ListItem.Content>
							<CheckBox
								key={index}
								accessibilityHint={t('activityInfoHint')}
								accessibilityLabel={t('activityInfoLabel')}
								accessibilityLanguage={localeContext.data.locale}
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
					accessibilityLanguage={localeContext.data.locale}
					heading={t('utilizationTypesSectionTitle')}
				/>
				{utilizationTypes.options.map((item, index) => (
					<ListItem key={index}>
						<ListItem.Content>
							<CheckBox
								key={index}
								accessibilityHint={t('utilizationTypeInfoHint')}
								accessibilityLabel={t('utilizationTypeInfoLabel')}
								accessibilityLanguage={localeContext.data.locale}
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
					accessibilityLanguage={localeContext.data.locale}
					heading={t('topicsOfInterestSectionTitle')}
				/>
				{interestsTypes.options.map((item, index) => (
					<ListItem key={index}>
						<ListItem.Content>
							<CheckBox
								accessibilityHint={t('topicsOfInterestInfoHint')}
								accessibilityLabel={t('topicsOfInterestLabel')}
								accessibilityLanguage={localeContext.data.locale}
								accessibilityRole="checkbox"
								accessibilityState={{ checked: interestTopics.includes(item) }}
								checked={interestTopics.includes(item)}
								checkedIcon={<IconSquareCheckFilled color="#FFFFFF" size={28} />}
								containerStyle={profileEditModalStyles.checkbox}
								textStyle={profileEditModalStyles.checkBoxText}
								title={t(item)}
								uncheckedIcon={<IconSquare fill="#FFFFFF" size={28} />}
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
		</>
	);

	//
}
