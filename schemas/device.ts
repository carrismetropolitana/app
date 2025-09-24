/* * */

import { z } from 'zod';

/* * */

const DEVICE_TYPE_VALUES = ['android', 'ios', 'web'] as const;

export const DeviceTypeSchema = z.enum(DEVICE_TYPE_VALUES);

export type DeviceType = z.infer<typeof DeviceTypeSchema>;

/* * */

export const DeviceSchema = z.object({
	app_version: z.string(),
	name: z.string().nullable(),
	push_token: z.string().nullable().default(null),
	type: DeviceTypeSchema,
});

export type Device = z.infer<typeof DeviceSchema>;
