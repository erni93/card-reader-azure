import { Component, Input } from '@angular/core';
import { AzureOcrService } from './azure-ocr.service';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/catch';
import { OcrResult } from './models/ocrResult';
import { Contact } from './models/contact';
import 'vcards-js';

declare var require: any;

@Component({
    selector: 'app-azure-ocr',
    templateUrl: './azure-ocr.component.html',
    styleUrls: ['./azure-ocr.component.css']
})
export class AzureOcrComponent {

    public loading = false;
    public error: string;
    public contact: Contact;

    constructor(
        private azureOcrService: AzureOcrService
    ) { }

    public upload() {
        if (!this.loading) {
            this.loading = true;
            this.error = null;
            this.azureOcrService.uploadImage()
                .finally( () => this.loading = false)
                .subscribe(result => this.contact = result, error =>  this.error = error.statusText);
        }
    }

    public fileSelected() {
        return this.azureOcrService.lastFile != null;
    }

    public downloadVcard() {
        const vCard =  require('vcards-js')();
        vCard.firstName = this.contact.fullName;
        vCard.url =  this.contact.website;
        vCard.workPhone = this.contact.telephone;
        vCard.email = this.contact.email;
        vCard.workAddress.label = 'Work Address';
        vCard.workAddress.street = this.contact.address;
        vCard.socialUrls['facebook'] = this.contact.facebook;
        vCard.socialUrls['twitter'] = this.contact.twitter;
        vCard.socialUrls['linkedin'] = this.contact.linkedin;

        const encodedUri = encodeURI(vCard.getFormattedString());
        const link = document.createElement('a');
        link.setAttribute('href', 'data:application/octet-stream,' + encodedUri);
        link.setAttribute('download', 'contact.vcf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }



}
