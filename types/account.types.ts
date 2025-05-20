/* * */

import { getUnixTimestamp } from '@tmlmobilidade/utils';
import { DateTime } from 'luxon';
import { z } from 'zod';

/* * */

/**
 * UnixTimestamp, in this context, is a number that represents
 * the number of milliseconds since the Unix epoch (1970-01-01T00:00:00Z).
 */
export type UnixTimestamp = number & {
	__brand: 'UnixTimestamp'
};

/**
 * This function validates if a number is a valid Unix Timestamp, in milliseconds.
 * It is assumed the number will always be greater than 10^10 (1e10) to ensure it is in milliseconds.
 * Throws an error if the date is invalid.
 * @param milliseconds - The number to be validated.
 * @returns The given number as a UnixTimestamp.
 */
export function validateUnixTimestamp(milliseconds: number): UnixTimestamp {
	if (milliseconds < 1e10) throw new Error(`Invalid value '${milliseconds}', expected a number in milliseconds but received a number smaller than 1e10`);
	const parsedDate = DateTime.fromMillis(milliseconds);
	if (!parsedDate.isValid) throw new Error(`Invalid date '${milliseconds}, explanation: ${parsedDate.invalidExplanation}`);
	return parsedDate.toMillis() as UnixTimestamp;
}

/* * */

export const DocumentSchema = z.object({
	_id: z.string(),
	created_at: z.number().transform(validateUnixTimestamp).brand('UnixTimestamp').nullish(),
	updated_at: z.number().transform(validateUnixTimestamp).brand('UnixTimestamp').nullish(),
});

/* * */

// ENUMS
const GENDER_VALUES = ['male', 'female'] as const;
const ROLE_VALUES = ['owner', 'admin', 'user'] as const;
const WORK_SETTING_VALUES = ['hybrid', 'remote', 'office'] as const;
const UTILIZATION_TYPE_VALUES = ['frequent', 'occasional'] as const;
const ACTIVITY_VALUES = ['student', 'university', 'working', 'retired', 'other'] as const;
const INTERESTS_VALUES = ['network changes', 'events and news', 'carris metropolitana'] as const;
const DEVICE_TYPE_VALUES = ['android', 'ios', 'web'] as const;
const WIDGET_TYPE_VALUES = ['lines', 'stops', 'smart_notifications'] as const;

// ENUM SCHEMAS
export const GenderSchema = z.enum(GENDER_VALUES);
export const RoleSchema = z.enum(ROLE_VALUES);
export const WorkSettingSchema = z.enum(WORK_SETTING_VALUES);
export const UtilizationTypeSchema = z.enum(UTILIZATION_TYPE_VALUES);
export const ActivitySchema = z.enum(ACTIVITY_VALUES);
export const InterestsSchema = z.enum(INTERESTS_VALUES);
export const DeviceTypeSchema = z.enum(DEVICE_TYPE_VALUES);
export const WidgetTypeSchema = z.enum(WIDGET_TYPE_VALUES);

// SCHEMA
export const PhoneSchema = z.string().regex(/^\+[1-9]\d{1,14}$/);

export const DeviceSchema = z.object({
	device_id: z.string(),
	name: z.string().nullish(),
	type: DeviceTypeSchema,
});

const WidgetLinesSchema = z.object({
	pattern_id: z.string(),
	type: WidgetTypeSchema.pipe(z.literal('lines')),
});

const WidgetStopsSchema = z.object({
	pattern_ids: z.array(z.string()),
	stop_id: z.string(),
	type: WidgetTypeSchema.pipe(z.literal('stops')),
});

// const WidgetSmartNotificationsSchema = z.object({
//     type: WidgetTypeSchema.pipe(z.literal('smart_notifications')),
//     notification_ids: z.array(z.string()),
// });

const WidgetSchema = z.object({
	data: z.union([WidgetLinesSchema, WidgetStopsSchema]),
	settings: z.object({
		display_order: z.number().nullish(),
		is_open: z.boolean().default(true),
		label: z.string().nullish(),
	}),
});

const FavoritesSchema = z.object({
	lines: z.array(z.string()),
	stops: z.array(z.string()),
});

const ProfileSchema = z.object({
	activity: ActivitySchema.nullish(),
	date_of_birth: z.number().transform(validateUnixTimestamp).brand('UnixTimestamp').nullish(),
	email: z.string().email().nullish(),
	first_name: z.string().nullish(),
	gender: GenderSchema.nullish(),
	last_name: z.string().nullish(),
	phone: PhoneSchema.nullish(),
	profile_image: z.string().nullish(),
	utilization_type: UtilizationTypeSchema.nullish(),
	interests:  z.array(z.string(InterestsSchema)).nullish(),
	work_setting: WorkSettingSchema.nullish(),
}).strict();

export const AccountSchema = DocumentSchema.extend({
	devices: z.array(DeviceSchema).min(1),
	email: z.string().email().nullish(),
	email_verified: z.number().transform(validateUnixTimestamp).brand('UnixTimestamp').nullish(),
	favorites: FavoritesSchema.nullish(),
	notification_preferences: z.object({
		agency: z.boolean().default(true),
		events: z.boolean().default(true),
		network: z.boolean().default(true),
	}).nullish(),
	profile: ProfileSchema.nullish(),
	role: RoleSchema.default('user'),
	widgets: z.array(WidgetSchema).nullish(),
}).strict();

export const CreateAccountSchema = AccountSchema
	.omit({ _id: true, created_at: true, notification_preferences: true, role: true, updated_at: true });

export const UpdateAccountSchema = AccountSchema
	.omit({ _id: true, created_at: true, role: true, updated_at: true })
	.partial();

// TYPES
export type AccountGender = z.infer<typeof GenderSchema>;
export type AccountRole = z.infer<typeof RoleSchema>;
export type AccountInterests = z.infer<typeof InterestsSchema>;
export type AccountWorkSetting = z.infer<typeof WorkSettingSchema>;
export type AccountUtilizationType = z.infer<typeof UtilizationTypeSchema>;
export type AccountActivity = z.infer<typeof ActivitySchema>;
export type AccountDeviceType = z.infer<typeof DeviceTypeSchema>;
export type AccountWidgetType = z.infer<typeof WidgetTypeSchema>;
export type AccountFavorites = z.infer<typeof FavoritesSchema>;
export type AccountWidget = z.infer<typeof WidgetSchema>;
export type AccountDevice = Omit<z.infer<typeof DeviceSchema>, 'type'> & { type: AccountDeviceType };

export type AccountProfile = Omit<z.infer<typeof ProfileSchema>,
  | 'activity'
  | 'date_of_birth'
  | 'gender'
  | 'utilization_type'
  | 'work_setting'
  | 'interests'
> & {
	activity?: AccountActivity
	date_of_birth?: null | undefined | UnixTimestamp
	gender?: AccountGender
	utilization_type?: AccountUtilizationType
	work_setting?: AccountWorkSetting
	interests?: AccountInterests
};

export type Account = Omit<
	z.infer<typeof AccountSchema>,
	| 'created_at'
	| 'date_of_birth'
	| 'email'
	| 'email_verified'
	| 'favorites'
	| 'profile'
	| 'updated_at'
	| 'widgets'
> & {
	created_at?: UnixTimestamp
	devices: AccountDevice[]
	email?: null | string | undefined
	email_verified?: null | undefined | UnixTimestamp
	favorites?: AccountFavorites
	profile?: AccountProfile
	updated_at?: UnixTimestamp
	widgets?: AccountWidget[]
};

export type CreateAccountDto = Omit<
	z.infer<typeof CreateAccountSchema>,
	| 'date_of_birth'
	| 'email_verified'
	| 'favorites'
	| 'profile'
	| 'widgets'
> & {
	date_of_birth?: null | undefined | UnixTimestamp
	email_verified?: null | undefined | UnixTimestamp
	favorites?: AccountFavorites
	profile?: AccountProfile
	widgets?: AccountWidget[]
};

export type UpdateAccountDto = Partial<Omit<CreateAccountDto, 'created_by'>>;
