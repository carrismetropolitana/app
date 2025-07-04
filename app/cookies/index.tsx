/* * */

import { Section } from '@/components/common/layout/Section';
import { Surface } from '@/components/common/layout/Surface';
import { useConsentContext } from '@/contexts/Consent.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { Text } from '@rn-vui/themed';
import { Button, Dialog } from '@rn-vui/themed';
import { IconChevronLeft } from '@tabler/icons-react-native';
import { useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, TouchableOpacity, View } from 'react-native';

import styles from './styles';

/* * */

export default function Component() {
	//

	//
	// A. Setup variables
	const isLight = useThemeContext().theme.mode === 'light';
	const { t } = useTranslation('translation', { keyPrefix: 'CookiesPage' });
	const navigation = useNavigation();
	const consentContext = useConsentContext();
	const themeContext = useThemeContext();

	const backgroundColor = isLight ? theming.colorSystemBackgroundLight200 : theming.colorSystemBackgroundDark200;
	const fontColor = isLight ? theming.colorSystemText100 : theming.colorSystemText300;

	const [dialogVisible, setDialogVisible] = useState(false);
	const [onConfirmCallback, setOnConfirmCallback] = useState<() => void>(() => () => {});

	useEffect(() => {
		navigation.setOptions({
			headerLeft: () => (
				<TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 12 }}>
					<IconChevronLeft color={fontColor} size={24} />
				</TouchableOpacity>
			),
			headerStyle: { backgroundColor: backgroundColor },
			headerTintColor: backgroundColor,
			headerTitle: 'Politica de Privacidade e Cookies',
			headerTitleStyle: { color: fontColor },
		});
	}, [themeContext.theme.mode]);

	//
	// B. Handle actions

	const handleShowConfirmDialog = (callback: () => void) => {
		setOnConfirmCallback(() => callback);
		setDialogVisible(true);
	};

	//
	// C. Render components

	return (
		<ScrollView style={{ backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background, flex: 1 }}>
			<Surface>
				<Section heading={t('sections.intro.title')} withPadding>
					<Text style={styles.text}>{t('sections.intro.paragraphs.1')}</Text>
				</Section>
				<Section heading={t('title')} withPadding>
					<View style={styles.container}>
						<View style={styles.section}>
							<Text style={styles.title}>{t('sections.question_1.title')}</Text>
							<Text style={styles.text}>{t('sections.question_1.paragraphs.1')}</Text>
							<Text style={styles.text}>{t('sections.question_1.paragraphs.2')}</Text>
							<Text style={styles.text}>{t('sections.question_1.paragraphs.3')}</Text>
						</View>
						<View style={styles.section}>
							<Text style={styles.title}>{t('sections.question_2.title')}</Text>
							<Text style={styles.text}>{t('sections.question_2.paragraphs.1')}</Text>
							<Text style={styles.text}>{t('sections.question_2.paragraphs.2')}</Text>
							<Text style={styles.text}>{t('sections.question_2.paragraphs.3')}</Text>
							<Text style={styles.text}>{t('sections.question_2.paragraphs.4')}</Text>
							<Text style={styles.text}>{t('sections.question_2.paragraphs.5')}</Text>
						</View>
						<View style={styles.section}>
							<Text style={styles.title}>{t('sections.question_3.title')}</Text>
							<Text style={styles.text}>{t('sections.question_3.paragraphs.1')}</Text>
							<Text style={styles.text}>{t('sections.question_3.paragraphs.2')}</Text>
							<Text style={styles.text}>{t('sections.question_3.paragraphs.3')}</Text>
						</View>
						<View style={styles.section}>
							<Text style={styles.title}>{t('sections.question_4.title')}</Text>
							<Text style={styles.text}>{t('sections.question_4.paragraphs.1')}</Text>
							<Text style={styles.text}>{t('sections.question_4.paragraphs.2')}</Text>
							<Text style={styles.text}>{t('sections.question_4.paragraphs.3')}</Text>
						</View>
						<View style={styles.section}>
							<Text style={styles.title}>{t('sections.question_5.title')}</Text>
							<View style={{ borderColor: '#ccc', borderRadius: 4, borderWidth: 1, overflow: 'hidden' }}>
								<View style={{ backgroundColor: '#f0f0f0', flexDirection: 'row' }}>
									<Text style={{ flex: 1, fontWeight: 'bold', padding: 8 }}>{t('sections.question_5.table.header.col_1')}</Text>
									<Text style={{ flex: 1, fontWeight: 'bold', padding: 8 }}>{t('sections.question_5.table.header.col_2')}</Text>
									<Text style={{ flex: 1, fontWeight: 'bold', padding: 8 }}>{t('sections.question_5.table.header.col_3')}</Text>
									<Text style={{ flex: 1, fontWeight: 'bold', padding: 8 }}>{t('sections.question_5.table.header.col_4')}</Text>
								</View>
								<View style={{ borderColor: '#ccc', borderTopWidth: 1, flexDirection: 'row' }}>
									<Text style={{ flex: 1, padding: 8 }}>{t('sections.question_5.table.rows.2.col_1')}</Text>
									<Text style={{ flex: 1, padding: 8 }}>{t('sections.question_5.table.rows.2.col_2')}</Text>
									<Text style={{ flex: 1, padding: 8 }}>{t('sections.question_5.table.rows.2.col_3')}</Text>
									<Text style={{ flex: 1, padding: 8 }}>{t('sections.question_5.table.rows.2.col_4')}</Text>
								</View>
							</View>
						</View>
						<View style={styles.section}>
							<Text style={styles.title}>{t('sections.question_6.title')}</Text>
							<Text style={styles.text}>{t('sections.question_6.paragraphs.1')}</Text>
							<View style={styles.authorizationOptions}>

								{consentContext.data.enabled_functional ? (
									<Button color="green" onPress={() => handleShowConfirmDialog(() => consentContext.actions.disable(['functional']))} title={t('sections.question_6.options.functional.disable')} />
								) : (
									<Button onPress={() => consentContext.actions.enable(['functional'])}>
										{t('sections.question_6.options.functional.enable')}
									</Button>
								)}

								{consentContext.data.enabled_analytics ? (
									<Button color="green" onPress={() => handleShowConfirmDialog(() => consentContext.actions.disable(['analytics']))} title={t('sections.question_6.options.analytics.disable')} />
								) : (
									<Button onPress={() => consentContext.actions.enable(['analytics'])} title={t('sections.question_6.options.analytics.enable')} />
								)}

							</View>
						</View>
						<View style={styles.section}>
							<Text style={styles.title}>{t('sections.question_7.title')}</Text>
							<Text style={styles.text}>{t('sections.question_7.paragraphs.1')}</Text>
							<Text style={styles.text}>{t('sections.question_7.paragraphs.2')}</Text>
						</View>
						<View style={styles.section}>
							<Text style={styles.title}>{t('sections.question_8.title')}</Text>
							<Text style={styles.text}>{t('sections.question_8.paragraphs.1')}</Text>
						</View>
					</View>
				</Section>
			</Surface>
			<Dialog
				isVisible={dialogVisible}
				onBackdropPress={() => setDialogVisible(false)}
			>
				<Dialog.Title>{t('sections.question_6.refuse_modal.title')}</Dialog.Title>
				<Text>{t('sections.question_6.refuse_modal.description')}</Text>
				<Dialog.Button
					title={t('sections.question_6.refuse_modal.confirm')}
					onPress={() => {
						onConfirmCallback();
						setDialogVisible(false);
					}}
				/>
				<Dialog.Button onPress={() => setDialogVisible(false)} title={t('sections.question_6.refuse_modal.cancel')} />
			</Dialog>
		</ScrollView>
	);

	//
}
