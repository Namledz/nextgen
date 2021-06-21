import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface Variant extends BaseModel {
	id: number;
	gene: string;
	transcript_id: string;
	position: number;
	chrom: string;
	rsid: string;
	REF: string;
	ALT: string;
	cnomen: string;
	pnomen: string;
	function: string;
	location: string;
	coverage: string;
	// zygosity: string; 
	gnomad: string;
	cosmicID: string;
	classification: string;
}
