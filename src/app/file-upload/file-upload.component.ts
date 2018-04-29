import { Component, ElementRef, ViewChild, EventEmitter } from '@angular/core';
import { AzureOcrService } from '../azure-ocr/azure-ocr.service';

@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {

    @ViewChild('inputFile') inputFile: ElementRef;

    /* Image data */
    public imageBase64: string;
    public fileName: string;

    /* Drag event */
    public dragenter = false;

    constructor(
        private azureOcrService: AzureOcrService
    ) { }

    public onInputChange(event: any) {
        const file = event.target.files[0] as File;
        if (file != null) {
            if (file.type.match('image.*')) {
                const reader = new FileReader();
                reader.onload = (e => {
                    this.fileName = file.name;
                    this.imageBase64 = reader.result;
                    this.azureOcrService.lastFile = file;
                });
                reader.readAsDataURL(file);
            } else {
                this.inputFile.nativeElement.value = '';
                alert('Select a image');
            }
        }
        this.dragenter = false;
    }

}
