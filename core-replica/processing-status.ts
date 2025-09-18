/* * */

import { z } from 'zod';

/* * */

export const PROCESSING_STATUS_OPTIONS = ['waiting', 'processing', 'complete', 'error'] as const;

export const ProcessingStatusSchema = z.enum(PROCESSING_STATUS_OPTIONS);

/**
 * This type should be used to represent the processing status
 * of various operations. It can be used in APIs, database operations,
 * or any other context where a processing status needs to be communicated.
*/
export type ProcessingStatus = z.infer<typeof ProcessingStatusSchema>;
