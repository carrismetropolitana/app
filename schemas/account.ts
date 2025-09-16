/* * */

import { DeviceSchema } from '@/schemas/device';
import { FavoritesSchema } from '@/schemas/favorites';
import { NotificationsSchema } from '@/schemas/notifications';
import { ProfileSchema } from '@/schemas/profile';
import { WidgetSchema } from '@/schemas/widgets';
import { DocumentSchema } from '@tmlmobilidade/types';
import { z } from 'zod';

/* * */

export const ACCOUNT_ROLE_VALUES = ['owner', 'admin', 'user'] as const;

export const AccountRoleSchema = z.enum(ACCOUNT_ROLE_VALUES);

export type AccountRole = z.infer<typeof AccountRoleSchema>;

/* * */

export const AccountSchema = DocumentSchema.extend({
	devices: z.array(DeviceSchema).min(1),
	favorites: FavoritesSchema,
	notifications: NotificationsSchema,
	profile: ProfileSchema,
	role: AccountRoleSchema.default('user'),
	widgets: z.array(WidgetSchema).default([]),
}).strict();

export type Account = z.infer<typeof AccountSchema>;
