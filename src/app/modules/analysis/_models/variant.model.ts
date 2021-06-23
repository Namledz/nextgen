import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface Variant extends BaseModel {
	id: string;
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
	clinvar: string;
	gnomad_ALL: string;
	gnomad_AMR: string;
	gnomad_AFR: string;
	cosmicID: string;
	classification: string;
}
