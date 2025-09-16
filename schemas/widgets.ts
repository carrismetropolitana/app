/* * */

import { DocumentSchema } from '@tmlmobilidade/types';
import { z } from 'zod';

/* * */

const WIDGET_TYPE_VALUES = ['line', 'stop', 'smart_notification'] as const;

export const WidgetTypeSchema = z.enum(WIDGET_TYPE_VALUES);

export type WidgetType = z.infer<typeof WidgetTypeSchema>;

/* * */

const WidgetBaseSchema = DocumentSchema.extend({
	settings: z.object({
		display_order: z.number().default(0),
		is_open: z.boolean().default(true),
		label: z.string(),
		send_notifications: z.boolean().default(true),
	}),
	status: z.object({
		error_code: z.string().nullable(),
		error_message: z.string().nullable(),
	}),
});

/* * */

export const WidgetLineSchema = WidgetBaseSchema.extend({
	properties: z.object({
		pattern_id: z.string(),
	}),
	type: WidgetTypeSchema.pipe(z.literal('line')),
});

export type WidgetLine = z.infer<typeof WidgetLineSchema>;

/* * */

export const WidgetStopSchema = WidgetBaseSchema.extend({
	properties: z.object({
		pattern_ids: z.array(z.string()).nonempty(),
		stop_id: z.string(),
	}),
	type: WidgetTypeSchema.pipe(z.literal('stop')),
});

export type WidgetStop = z.infer<typeof WidgetStopSchema>;

/* * */

export const WidgetSmartNotificationSchema = WidgetBaseSchema.extend({
	properties: z.object({
		distance: z.number().gt(500),
		end_time: z.number().gt(0).lte(86400),
		geojson: z.any().nullish(),
		pattern_id: z.string(),
		start_time: z.number().gte(0).lt(86400),
		stop_id: z.string(),
		stop_sequence: z.number(),
		weekdays: z.array(z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])).nonempty(),
	}),
	type: WidgetTypeSchema.pipe(z.literal('smart_notification')),
});

export type WidgetSmartNotification = z.infer<typeof WidgetSmartNotificationSchema>;

/* * */

export const WidgetSchema = z
	.discriminatedUnion('type', [
		WidgetLineSchema,
		WidgetStopSchema,
		WidgetSmartNotificationSchema,
	]);

export type Widget = z.infer<typeof WidgetSchema>;
