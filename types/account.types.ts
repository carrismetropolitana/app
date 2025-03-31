/* * */

export interface IAccount {
	// activity?: 'other' | 'retired' | 'student' | 'university' | 'working'
	// avatar?: string
	// date_of_birth?: Date
	// devices: IDevice[]
	// email: string
	favorites: {
		patterns: string[]
		stops: {
			pattern_ids: string[]
			stop_id: string
		}[]
	}
	first_name?: string
	// gender?: 'female' | 'male'
	// home_municipality?: string
	last_name?: string
	// notification_preferences?: {
	// 	company: boolean
	// 	events: boolean
	// 	network: boolean
	// }
	// phone?: string
	// role?: 'admin' | 'owner' | 'user'
	// utilization_type: 'frequent' | 'occasional'
	// work_municipality?: string
	// work_setting: 'hybrid' | 'office' | 'remote'
}
