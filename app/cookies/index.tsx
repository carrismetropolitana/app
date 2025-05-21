/* * */

import { Section } from '@/components/common/layout/Section';
import { Surface } from '@/components/common/layout/Surface';
import { useConsentContext } from '@/contexts/Consent.context';
// import { Button, Group, Table } from '@mantine/core';
// import { openConfirmModal } from '@mantine/modals';
import { useThemeContext } from '@/contexts/Theme.context';
import { Text } from '@rn-vui/themed';
import { useTranslation } from 'react-i18next';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Row, Rows, Table } from 'react-native-table-component';
import { Dialog, Button } from '@rn-vui/themed';
import { useEffect, useState } from 'react';

import styles from './styles';
import { useNavigation } from 'expo-router';
import { theming } from '@/theme/Variables';
import { IconArrowBack, IconArrowLeft, IconChevronLeft } from '@tabler/icons-react-native';

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
			headerTitle: 'Politica de Privacidade e Cookies',
			headerTintColor: backgroundColor,
			headerStyle: { backgroundColor: backgroundColor },
			headerTitleStyle: { color: fontColor },
			headerLeft: () => (
				<TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 12 }}>
					<IconChevronLeft size={24} color={fontColor} />
				</TouchableOpacity>
			),
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
							{/* <Table borderStyle={{ borderColor: '#c8e1ff',
								borderWidth: 2 }}
							>
								<Row data={header} />
								<Rows data={data} />
							</Table>
							<Table withColumnBorders withTableBorder>
							<Table.head>
								<Table.Tr>
									<Table.Th>{t('sections.question_5.table.header.col_1')}</Table.Th>
									<Table.Th>{t('sections.question_5.table.header.col_2')}</Table.Th>
									<Table.Th>{t('sections.question_5.table.header.col_3')}</Table.Th>
									<Table.Th>{t('sections.question_5.table.header.col_4')}</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								<Table.Tr>
									<Table.Td>{t('sections.question_5.table.rows.1.col_1')}</Table.Td>
									<Table.Td>{t('sections.question_5.table.rows.1.col_2')}</Table.Td>
									<Table.Td>{t('sections.question_5.table.rows.1.col_3')}</Table.Td>
									<Table.Td>{t('sections.question_5.table.rows.1.col_4')}</Table.Td>
								</Table.Tr>
								<Table.Tr>
									<Table.Td>{t('sections.question_5.table.rows.2.col_1')}</Table.Td>
									<Table.Td>{t('sections.question_5.table.rows.2.col_2')}</Table.Td>
									<Table.Td>{t('sections.question_5.table.rows.2.col_3')}</Table.Td>
									<Table.Td>{t('sections.question_5.table.rows.2.col_4')}</Table.Td>
								</Table.Tr>
							</Table.Tbody>
						</Table> */}
						</View>
						<View style={styles.section}>
							<Text style={styles.title}>{t('sections.question_6.title')}</Text>
							<Text style={styles.text}>{t('sections.question_6.paragraphs.1')}</Text>
							<View style={styles.authorizationOptions}>

								{consentContext.data.enabled_functional ? (
									<Button color="green" onPress={() => handleShowConfirmDialog(() => consentContext.actions.disable(['functional']))}>
										{t('sections.question_6.options.functional.disable')}
									</Button>
								) : (
									<Button onPress={() => consentContext.actions.enable(['functional'])}>
										{t('sections.question_6.options.functional.enable')}
									</Button>
								)}

								{consentContext.data.enabled_analytics ? (
									<Button color="green" onPress={() => handleShowConfirmDialog(() => consentContext.actions.disable(['analytics']))}>
										{t('sections.question_6.options.analytics.disable')}
									</Button>
								) : (
									<Button onPress={() => consentContext.actions.enable(['analytics'])}>
										{t('sections.question_6.options.analytics.enable')}
									</Button>
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
				<Dialog.Button title={t('sections.question_6.refuse_modal.confirm')} onPress={() => {
					onConfirmCallback();
					setDialogVisible(false);
				}} />
				<Dialog.Button title={t('sections.question_6.refuse_modal.cancel')} onPress={() => setDialogVisible(false)} />
			</Dialog>
		</ScrollView>
	);

	//
}
