/* * */

export interface News {
	_status: 'archived' | 'draft' | 'published'
	content: string
	cover_image_src: string
	featured_image: {
		file_name: string
		thumbnailURL: string
		url: string
	}
	id: string
	is_unlisted: boolean
	publishedAt: string
	title: string
}

export interface NewsResponse {
	docs: News[]
	hasNextPage: boolean
	hasPrevPage: boolean
	limit: number
	nextPage: null | number
	page: number
	pagingCounter: number
	prevPage: null | number
	totalDocs: number
	totalPages: number
}
