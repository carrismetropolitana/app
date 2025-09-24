/* * */

import { z } from 'zod';

/* * */

export const FavoritesSchema = z.object({
	line_ids: z.array(z.string()).default([]),
	stop_ids: z.array(z.string()).default([]),
});

export type Favorites = z.infer<typeof FavoritesSchema>;
