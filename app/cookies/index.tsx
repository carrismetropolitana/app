/* * */

import { Section } from '@/components/common/layout/Section';
import { Surface } from '@/components/common/layout/Surface';
import { useConsentContext } from '@/contexts/Consent.context';
// import { Button, Group, Table } from '@mantine/core';
// import { openConfirmModal } from '@mantine/modals';
import { useThemeContext } from '@/contexts/Theme.context';
import { Text } from '@rn-vui/themed';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { Row, Rows, Table } from 'react-native-table-component';

import styles from './styles';

/* * */

export default function Component() {
	//

	//
	// A. Setup variables

	const { t } = useTranslation('translation', { keyPrefix: 'CookiesPage' });
	const consentContext = useConsentContext();
	const themeContext = useThemeContext();

	const header = ['heading 1', 'heading 2', 'heading 3'];
	const data = [
		['gfg1', 'gfg2', 'gfg3'],
		['gfg4', 'gfg5', 'gfg6'],
		['gfg7', 'gfg8', 'gfg9'],
	];

	//
	// B. Handle actions

	// const handleShowConfirmModal = (callback: () => void) => {
	// 	openConfirmModal({
	// 		centered: true,
	// 		children: <p>{t('sections.question_6.refuse_modal.description')}</p>,
	// 		closeOnClickOutside: true,
	// 		confirmProps: { color: 'red' },
	// 		labels: { cancel: t('sections.question_6.refuse_modal.cancel'), confirm: t('sections.question_6.refuse_modal.confirm') },
	// 		onConfirm: () => callback(),
	// 		title: t('sections.question_6.refuse_modal.title'),
	// 	});
	// };

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
							<Table borderStyle={{ borderColor: '#c8e1ff',
								borderWidth: 2 }}
							>
								<Row data={header} />
								<Rows data={data} />
							</Table>
							{/* <Table withColumnBorders withTableBorder>
							<Table.Thead>
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

								{/* {consentContext.data.enabled_functional ? (
								<Button color="green" onPress={() => handleShowConfirmModal(() => consentContext.actions.disable(['functional']))}>
									{t('sections.question_6.options.functional.disable')}
								</Button>
							) : (
								<Button onPress={() => consentContext.actions.enable(['functional'])}>
									{t('sections.question_6.options.functional.enable')}
								</Button>
							)} */}

								{/* {consentContext.data.enabled_analytics ? (
								<Button color="green" onPress={() => handleShowConfirmModal(() => consentContext.actions.disable(['analytics']))}>
									{t('sections.question_6.options.analytics.disable')}
								</Button>
							) : (
								<Button onPress={() => consentContext.actions.enable(['analytics'])}>
									{t('sections.question_6.options.analytics.enable')}
								</Button>
							)} */}

							</View>
						</View>
						<View style={styles.section}>
							<Text style={styles.title}>{t('sections.question_7.title')}</Text>
							<Text style={styles.text}>{t('sections.question_7.paragraphs.1')}</Text>
							<Text style={styles.text}>{t('sections.question_7.paragraphs.2')}</Text>
							{/* <Group>
							<a href="https://support.google.com/chrome/answer/95647?hl=pt" target="_blank">
								Google Chrome
							</a>
							<a href="https://support.apple.com/pt-pt/guide/safari/sfri11471/mac" target="_blank">
								Safari
							</a>
							<a href="https://support.mozilla.org/pt-PT/kb/cookies-informacao-que-websites-guardam-no-seu-computador" target="_blank">
								Mozilla Firefox
							</a>
							<a href="https://support.microsoft.com/pt-br/microsoft-edge/excluir-cookies-no-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank">
								Microsoft Edge
							</a>
							<a href="https://support.microsoft.com/pt-pt/windows/eliminar-e-gerir-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank">
								Internet Explorer
							</a>
						</Group> */}
						</View>
						<View style={styles.section}>
							<Text style={styles.title}>{t('sections.question_8.title')}</Text>
							<Text style={styles.text}>{t('sections.question_8.paragraphs.1')}</Text>
						</View>
					</View>
				</Section>
			</Surface>
		</ScrollView>
	);

	//
}
