/* * */

import { operationalDateSchema } from '@tmlmobilidade/types';
import { z } from 'zod';

/* * */

export const PROFILE_ACTIVITY_VALUES = ['student', 'university', 'working', 'retired', 'other'] as const;

export const ProfileActivitySchema = z.enum(PROFILE_ACTIVITY_VALUES);

export type ProfileActivity = z.infer<typeof ProfileActivitySchema>;

/* * */

export const PROFILE_GENDER_VALUES = ['female', 'male', 'other'] as const;

export const ProfileGenderSchema = z.enum(PROFILE_GENDER_VALUES);

export type ProfileGender = z.infer<typeof ProfileGenderSchema>;

/* * */

export const PROFILE_INTERESTS_VALUES = ['network changes', 'events and news', 'carris metropolitana'] as const;

export const ProfileInterestsSchema = z.enum(PROFILE_INTERESTS_VALUES);

export type ProfileInterests = z.infer<typeof ProfileInterestsSchema>;

/* * */

const PROFILE_UTILIZATION_TYPE_VALUES = ['frequent', 'occasional'] as const;

export const ProfileUtilizationTypeSchema = z.enum(PROFILE_UTILIZATION_TYPE_VALUES);

export type ProfileUtilizationType = z.infer<typeof ProfileUtilizationTypeSchema>;

/* * */

const PROFILE_WORK_SETTING_VALUES = ['hybrid', 'remote', 'office'] as const;

export const ProfileWorkSettingSchema = z.enum(PROFILE_WORK_SETTING_VALUES);

export type ProfileWorkSetting = z.infer<typeof ProfileWorkSettingSchema>;

/* * */

export const ProfileSchema = z.object({
	activity: ProfileActivitySchema.nullable().default(null),
	birthdate: operationalDateSchema.nullable().default(null),
	email: z.string().email().nullable().default(null),
	first_name: z.string().nullable().default(null),
	gender: ProfileGenderSchema.nullable().default(null),
	interests: z.array(ProfileInterestsSchema).default([]),
	last_name: z.string().nullable().default(null),
	phone: z.string().regex(/^\+[1-9]\d{1,14}$/).nullable().default(null),
	utilization_type: ProfileUtilizationTypeSchema.nullable().default(null),
	work_setting: ProfileWorkSettingSchema.nullable().default(null),
}).strict();

export type Profile = z.infer<typeof ProfileSchema>;
