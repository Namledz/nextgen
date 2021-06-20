import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface Analysis extends BaseModel {
	id: number;
	name: string;
	owner: string;
	permission: string;
	created: string;
	update: string;
	type: string;
	sample: string;
}
