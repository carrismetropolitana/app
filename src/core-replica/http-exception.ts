/* * */

import { HttpStatus } from '@/core-replica/http-status';

/* * */

export class HttpException extends Error {
	readonly statusCode: number;

	constructor(statusCode: number, message: string, cause?: unknown) {
		super(message);
		this.statusCode = statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
		this.message = message;
		this.cause = cause;
	}
}
