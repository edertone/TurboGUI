/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { Component, ElementRef, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogBaseComponent } from '../dialog-base/dialog-base.component';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
    selector: 'tg-dialog-blob',
    imports: [CommonModule],
    providers: [],
    templateUrl: './dialog-blob.component.html',
    styleUrls: ['./dialog-blob.component.scss']
})


/**
 * A dialog component that shows a blob (pdf, image, etc) inside an iframe.
 * 
 * We must specify the blol in the data parameter when opening the dialog, and we can also specify the title 
 * by placing it at the first position of the texts array.
 */
export class DialogBlobComponent extends DialogBaseComponent implements OnInit, OnDestroy {


    static readonly DIALOG_CLASS_NAME = 'DialogBlobComponent';
    
    
    title = '';
    
    
    mimeType = '';
    
    
    objectUrl = '';
    
    
    blobUrl: SafeResourceUrl = '';
    
    
    constructor(public elementRef: ElementRef,
                private readonly sanitizer: DomSanitizer,
                public dialogRef: MatDialogRef<DialogBaseComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        
        super(elementRef, dialogRef);
        
        if(data.texts.length > 0) {
            
            this.title = data.texts[0];
        }
    }
    
    
    ngOnInit() {
        
        let blob:Blob|null = null;
        let blobInput = this.data?.data?.blob;
        
        this.mimeType = this.data?.data?.mimeType || 'application/octet-stream'; 

        if (typeof blobInput === 'string') {
            
            blob = new Blob([blobInput], { type: this.mimeType });
            
        } else if (blobInput instanceof Blob) {
            
            blob = blobInput;       
        }

        if (blob instanceof Blob) {
            
            this.objectUrl = URL.createObjectURL(blob);
            this.blobUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.objectUrl);
        }
    }

    
    ngOnDestroy() {
        
        if(this.blobUrl !== ''){
            
            URL.revokeObjectURL(this.objectUrl);
        }
    }
}
