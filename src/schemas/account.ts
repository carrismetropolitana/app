/* * */

import { DeviceSchema } from '@/schemas/device';
import { FavoritesSchema } from '@/schemas/favorites';
import { NotificationsSchema } from '@/schemas/notifications';
import { PersonaSchema } from '@/schemas/persona';
import { PreferencesSchema } from '@/schemas/preferences';
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
	_version: z.literal('1.0').default('1.0'),
	devices: z.array(DeviceSchema).default([]),
	favorites: FavoritesSchema.default({}),
	notifications: NotificationsSchema.default({}),
	persona: PersonaSchema.default({}),
	preferences: PreferencesSchema.default({}),
	profile: ProfileSchema.default({}),
	role: AccountRoleSchema.default('user'),
	widgets: z.array(WidgetSchema).default([]),
});

export type Account = z.infer<typeof AccountSchema>;
