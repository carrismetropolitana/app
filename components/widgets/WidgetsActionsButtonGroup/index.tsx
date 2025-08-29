/* * */

import { useLocaleContext } from '@/contexts/Locale.context';
import { useWidgetContext } from '@/contexts/Widget.context';
import { AccountWidget } from '@/types/account.types';
import { Button } from '@rn-vui/themed';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { styles } from './styles';

/* * */

interface Props {
	dataToSubmit?: AccountWidget
	isUpdate?: string
	length?: number
	onClear?: () => void
	type?: 'lines' | 'smart-notifications' | 'stops'

}

export const WidgetActionsButtonGroup = ({ dataToSubmit, isUpdate, length, onClear, type }: Props) => {
	//

	//
	// A. Setup Variables

	const widgetContext = useWidgetContext();
	const localeContext = useLocaleContext();
	const widgetActionButtonsStyles = styles();

	const { t } = useTranslation('translation', { keyPrefix: 'common' });

	//
	// B. Handle Actions

	const handleSave = async () => {
		if (dataToSubmit) {
			if (isUpdate) {
				await widgetContext.actions.updateWidget(isUpdate, dataToSubmit);
			}
			else {
				switch (type) {
					case 'lines':
						if ('pattern_id' in dataToSubmit.data) {
							await widgetContext.actions.createWidget({ pattern_ids: [dataToSubmit.data.pattern_id], type: 'lines' });
						}
						break;
					case 'smart-notifications':
						if ('pattern_id' in dataToSubmit.data && 'week_days' in dataToSubmit.data) {
							await widgetContext.actions.createWidget({
								end_time: dataToSubmit.data.end_time || 0,
								pattern_id: dataToSubmit.data.pattern_id,
								radius: dataToSubmit.data.distance || 0,
								start_time: dataToSubmit.data.start_time || 0,
								stop_id: dataToSubmit.data.stop_id || '',
								type: 'smart_notifications',
								week_days: dataToSubmit.data.week_days || [],
							});
						}
						break;
					case 'stops':
						if ('data' in dataToSubmit && 'pattern_ids' in dataToSubmit.data && 'stop_id' in dataToSubmit.data) {
							await widgetContext.actions.createWidget({ pattern_ids: dataToSubmit.data.pattern_ids, stopId: dataToSubmit.data.stop_id, type: 'stops' });
						}
						break;
					default:
						alert('Unknown widget type: ' + type);
						break;
				}
			}
		}
		if (onClear) onClear();
	};

	const handleCancel = () => {
		alert('No changes made ');
		if (onClear) onClear();
	};

	//
	// C. Render Components

	return (
		<View style={widgetActionButtonsStyles.container}>
			<Button
				accessibilityHint={t('saveButtonAccessibilityHint')}
				accessibilityLabel={t('saveButtonAccessibilityLabel')}
				accessibilityLanguage={localeContext.locale}
				accessibilityRole="button"
				buttonStyle={widgetActionButtonsStyles.saveButton}
				disabled={length === 0}
				onPress={() => handleSave()}
				title={t('saveButton')}
				titleStyle={widgetActionButtonsStyles.saveButtonText}
			/>
			<Button
				accessibilityHint={t('cancelButtonAccessibilityHint')}
				accessibilityLabel={t('cancelButtonAccessibilityLabel')}
				accessibilityLanguage={localeContext.locale}
				accessibilityRole="button"
				buttonStyle={widgetActionButtonsStyles.saveButton}
				onPress={() => handleCancel()}
				title={t('closeButton')}
				titleStyle={widgetActionButtonsStyles.saveButtonText}
			/>
		</View>
	);

	//
};
