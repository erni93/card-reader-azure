import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { AzureOcrComponent } from './azure-ocr/azure-ocr.component';
import { AzureOcrService } from './azure-ocr/azure-ocr.service';


@NgModule({
  declarations: [
    AppComponent,
    FileUploadComponent,
    AzureOcrComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    AzureOcrService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
