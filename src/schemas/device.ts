/* * */

import { unixTimeStampSchema } from '@tmlmobilidade/types';
import { z } from 'zod';

/* * */

export const DeviceSchema = z.object({
	app_version: z.string().nullable().default(null),
	brand: z.string().nullable().default(null),
	device_id: z.string(),
	name: z.string().nullable().default(null),
	push_token: z.string().nullable().default(null),
	seen_last_at: unixTimeStampSchema.nullable().default(null),
});

export type Device = z.infer<typeof DeviceSchema>;
