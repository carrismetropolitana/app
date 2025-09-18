/* * */

import { WidgetCardStopHeader } from '@/components/widgets/cards/WidgetCardStopHeader';
import { WidgetCardWrapper } from '@/components/widgets/cards/WidgetCardWrapper';
import { useAccountContext } from '@/contexts/Account.context';
import { type WidgetStop } from '@/schemas/widgets';

/* * */

interface StopWidgetCardProps {
	data: WidgetStop
}

/* * */

export function WidgetCardStop({ data }: StopWidgetCardProps) {
	//

	//
	// A. Setup variables

	const accountContext = useAccountContext();

	//
	// B. Handle actions

	const handleToggleOpen = async () => {
		const thisWidget = { ...data, settings: { ...data.settings, is_open: data.settings.is_open ? false : true } };
		const allWidgets = accountContext.data.account?.widgets.map(w => w._id === thisWidget._id ? thisWidget : w) || [];
		await accountContext.actions.update('widgets', allWidgets);
	};

	//
	// C. Render components

	return (
		<WidgetCardWrapper
			// body={<WidgetCardStopBody stopId={data.properties.stop_id} />}
			isOpen={data.settings.is_open}
			onToggleOpen={handleToggleOpen}
			header={(
				<WidgetCardStopHeader
					label={data.settings.label}
					stopId={data.properties.stop_id}
				/>
			)}
		/>
	);

	//
}
