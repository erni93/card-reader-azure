import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { OcrResult } from './models/ocrResult';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Contact } from './models/contact';

@Injectable()
export class AzureOcrService {

    public lastFile: File;

    private URL = 'https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/ocr';

    constructor(
        private http: HttpClient
    ) { }

    public uploadImage(): Observable<Contact> {
        const data = new FormData();
        data.append(this.lastFile.name, this.lastFile, this.lastFile.name);
        const headers: HttpHeaders = new HttpHeaders()
            .set('Ocp-Apim-Subscription-Key', 'bbf1aead6d9844a4850165930d67fce6');
        return this.http.post(this.URL, data, { headers: headers })
            .map((res: OcrResult) => this.getContact(res));
    }

    private getContact(ocrResult: OcrResult): Contact {
        const contact: Contact = {
            unknown: [],
            fullName: '',
            address: '',
            telephone: '',
            email: '',
            website: '',
            twitter: '',
            facebook: '',
            linkedin: '',
        };
        ocrResult.regions
            .forEach(regions => regions.lines
                .forEach(lines => lines.words
                    .forEach(words => contact.unknown.push(words.text))));
        this.setAdditional(contact);
        return contact;
    }

    private setAdditional(contact: Contact) {
         // tslint:disable-next-line:max-line-length
        const emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const websitePattern = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&\'\(\)\*\+,;=.]+$/;
         // tslint:disable-next-line:max-line-length
        const telPatter = /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;
        const twitterPattern = /^[A-Za-z0-9_]{1,15}$/;
        const facebookPattern = /(?:https?:\/\/)?(?:www\.)?facebook\.com\/.(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-\.]*)/;
         // tslint:disable-next-line:max-line-length
        const linkedinPattern = /(ftp|http|https):\/\/?((www|\w\w)\.)?linkedin.com(\w+:{0,1}\w*@)?(\S+)(:([0-9])+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

        const emailRegExp       = new RegExp(emailPattern);
        const websiteRegExp     = new RegExp(websitePattern);
        const telRegExp         = new RegExp(telPatter);
        const twitterRegExp     = new RegExp(twitterPattern);
        const facebookRegExp    = new RegExp(facebookPattern);
        const linkedinRegExp    = new RegExp(linkedinPattern);

        for (let i = 0; i < contact.unknown.length; i++) {
            const text = contact.unknown[i];

            // EMAIL
            if (emailRegExp.exec(text)) {
                contact.email = text;
            }

            // WEBSITE
            if (websiteRegExp.exec(text)) {
                contact.website = text;
            }

            // TELEPHONE
            if (telRegExp.exec(text)) {
                contact.telephone = text;
            }

            // TWITTER
            if (twitterRegExp.exec(text)) {
                contact.twitter = text;
            }

            // FACEBOOK
            if (facebookRegExp.exec(text)) {
                contact.facebook = text;
            }

            // LINKEDIN
            if (linkedinRegExp.exec(text)) {
                contact.linkedin = text;
            }
        }
    }

}
