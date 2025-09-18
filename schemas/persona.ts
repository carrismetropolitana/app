/* * */

import { z } from 'zod';

/* * */

export const PersonaSchema = z.object({
	accent_color: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/).nullable().default(null),
	image_history: z.array(z.string()).default([]),
	image_id: z.string().url().nullable().default(null),
}).strict();

export type Persona = z.infer<typeof PersonaSchema>;
