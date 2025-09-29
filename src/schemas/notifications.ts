/* * */

import { z } from 'zod';

/* * */

export const NotificationsSchema = z.object({
	agency: z.boolean().default(true),
	events: z.boolean().default(true),
	network: z.boolean().default(true),
});
