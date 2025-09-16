/* * */

import { unixTimeStampSchema } from '@/core-replica/unix-timestamp.js';
import { z } from 'zod';

/* * */

export const DocumentSchema = z.object({
	_id: z.string(),
	created_at: unixTimeStampSchema,
	created_by: z.string().optional(),
	updated_at: unixTimeStampSchema,
	updated_by: z.string().optional(),
});
