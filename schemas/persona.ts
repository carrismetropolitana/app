/* * */

import { z } from 'zod';

/* * */

export const PersonaSchema = z.object({
	accent_color: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/).default('#FFDD00'),
	image_history: z.array(z.string()).default([]),
	image_id: z.string(),
}).strict();

export type Persona = z.infer<typeof PersonaSchema>;
