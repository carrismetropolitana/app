/* * */

import { useProfileContext } from '@/contexts/Profile.context';
import { AccountWidget } from '@/types/account.types';
import { Button } from '@rn-vui/themed';
import { View } from 'react-native';

import styles from './styles';

/* * */

interface Props {
	dataToSubmit?: AccountWidget
	length?: number
	onClear?: () => void
	type?: 'lines' | 'smart-notifications' | 'stops'

}

export const WidgetActionsButtonGroup = ({ dataToSubmit, length, onClear, type }: Props) => {
	//

	//
	// A. Setup Variables

	const profileContext = useProfileContext();
	const headerExplainerStyles = styles();

	//
	// B. Handle Actions

	const handleSave = async () => {
		if (dataToSubmit) {
			switch (type) {
				case 'lines':
					if ('pattern_id' in dataToSubmit.data) {
						await profileContext.actions.createWidget({ pattern_ids: [dataToSubmit.data.pattern_id], type: 'lines' });
					}
					break;
				case 'smart-notifications':
					if ('pattern_id' in dataToSubmit.data && 'week_days' in dataToSubmit.data) {
						await profileContext.actions.createWidget({
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
						await profileContext.actions.createWidget({ pattern_ids: dataToSubmit.data.pattern_ids, stopId: dataToSubmit.data.stop_id, type: 'stops' });
					}
					break;
				default:
					alert('Unknown widget type: ' + type);
					break;
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
		<View>
			<Button buttonStyle={headerExplainerStyles.saveButton} disabled={length === 0} onPress={() => handleSave()} title="Guardar" titleStyle={headerExplainerStyles.saveButtonText} />
			<Button buttonStyle={headerExplainerStyles.saveButton} onPress={() => handleCancel()} title="Fechar" titleStyle={headerExplainerStyles.saveButtonText} />
		</View>
	);

	//
};
