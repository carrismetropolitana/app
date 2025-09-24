/* * */

import { z } from 'zod';

/* * */

export const PreferencesSchema = z.object({
	recent_line_ids: z.array(z.string()).default([]),
	recent_stop_ids: z.array(z.string()).default([]),
});

export type Preferences = z.infer<typeof PreferencesSchema>;
