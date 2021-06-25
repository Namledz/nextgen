import { VariantListService } from './../../../_services/variant-list.service';
import { Variant } from './../../../_models/variant.model';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { CustomersService } from 'src/app/modules/e-commerce/_services';

interface CustomResponse {
  status: string,
  data: any
}

@Component({
  selector: 'app-variant-detail-modal',
  templateUrl: './variant-detail-modal.component.html',
  styleUrls: ['./variant-detail-modal.component.scss']
})
export class VariantDetailModalComponent implements OnInit {
  @Input() variant: Variant;
  gene: any
  isLoading: boolean = false
  showAllPubmed: boolean = false


  // Init tab Variant detail
  tab: string = "variant_detail"

  private subscriptions: Subscription[] = [];
  constructor(
    private fb: FormBuilder, public modal: NgbActiveModal, private variantService: VariantListService
  ) { }

  ngOnInit(): void {
    this.getGeneDetail()
  }

  getGeneDetail() {
    const sb = this.variantService.getGeneDetail(this.variant.gene).pipe(
      first(),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of('');
      })
    ).subscribe((res: CustomResponse) => {
      if (res.status === 'success') {
        this.gene = res.data
      }
    });
    this.subscriptions.push(sb);
  }

  checkExist(value: string) {
    if (value == '' || value == '.' || value == null) {
      return false
    } else {
      return true
    }
  }

  tabClick(value: string) {
    this.tab = value
  }

  showPubmed(pubmed: any, number: boolean) {
    if (isNaN(pubmed)) {
      var pubmedArray = pubmed.split(',')
      var result = ''

      for (let i = 0; i < pubmedArray.length; i++) {
        var item = pubmedArray[i]
        if (number) {
          result += `<a href='https://www.ncbi.nlm.nih.gov/pubmed/${item}' target="_blank">${item}</a> `
        } else {
          if (i < 4) {
            result += `<a href='https://www.ncbi.nlm.nih.gov/pubmed/${item}' target="_blank">${item}</a> `
          }
        }
      }

      return result
    }
    return `<a href='https://www.ncbi.nlm.nih.gov/pubmed/${pubmed}' target="_blank">${pubmed}</a> `
  }

  buildOMIM(gene_omim) {
    var html = ''

    if (gene_omim == '.') {
      html += gene_omim
    } else {
      html += `<a href="http://omim.org/entry/${gene_omim}" target="_blank">${gene_omim}</a> `
    }

    return html
  }

  buildCosmicId(cosmicIds) {
    var html = ''

    if (cosmicIds != undefined && cosmicIds != '') {
      var value = cosmicIds.split("|");

      cosmicIds = value[0];
    } else {
      cosmicIds = '';
    }

    if (cosmicIds == '.') {
      html += cosmicIds
    } else {
      html += '<a href="http://cancer.sanger.ac.uk/cosmic/mutation/overview?id=' + cosmicIds.replace('COSM', '') + '" target="_blank">' + cosmicIds + '</a>'
    }

    return html
  }

  showGeneSplicer(GeneSplicer) {
    var geneSplicerArray = GeneSplicer.split(",");
    var html = ""
    for (var i in geneSplicerArray) {
      var item = geneSplicerArray[i].split('/')
      html += item[0] + "/" + item[1] + "<br>" + item[3] + "/" + item[4] + "<br>"
    }
    return html;
  }

  getMaxAF() {
    var gnomAD_AF = {
      gnomAD_genome_AFR: this.variant.gnomAD_genome_AFR,
      gnomAD_genome_AMR: this.variant.gnomAD_genome_AMR,
      gnomAD_genome_ASJ: this.variant.gnomAD_genome_ASJ,
      gnomAD_genome_EAS: this.variant.gnomAD_genome_EAS,
      gnomAD_genome_FIN: this.variant.gnomAD_genome_FIN,
      gnomAD_genome_NFE: this.variant.gnomAD_genome_NFE,
      gnomAD_genome_OTH: this.variant.gnomAD_genome_OTH
    }
    let maxAF = 0;

    for (var i in gnomAD_AF) {
      if (gnomAD_AF[i] != '.' && isNaN(gnomAD_AF[i]) == false) {
        if (maxAF < parseFloat(gnomAD_AF[i])) {
          maxAF = gnomAD_AF[i];
        }
      }
    }

    return maxAF
  }

  getMaxAFe() {
    var gnomADe_AF = {
      gnomADe_AFR: this.variant.gnomADe_AFR,
      gnomADe_AMR: this.variant.gnomADe_AMR,
      gnomADe_ASJ: this.variant.gnomADe_ASJ,
      gnomADe_EAS: this.variant.gnomADe_EAS,
      gnomADe_FIN: this.variant.gnomADe_FIN,
      gnomADe_NFE: this.variant.gnomADe_NFE,
      gnomADe_SAS: this.variant.gnomADe_SAS,
      gnomADe_OTH: this.variant.gnomADe_OTH
    }
    let maxAFe = 0;

    for (var i in gnomADe_AF) {
      if (gnomADe_AF[i] != '.' && isNaN(gnomADe_AF[i]) == false) {
        if (maxAFe < parseFloat(gnomADe_AF[i])) {
          maxAFe = gnomADe_AF[i];
        }
      }
    }

    return maxAFe
  }
}
