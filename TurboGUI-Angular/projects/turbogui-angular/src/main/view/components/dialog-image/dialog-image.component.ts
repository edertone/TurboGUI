/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { Component, ElementRef, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogBaseComponent } from '../dialog-base/dialog-base.component';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
    selector: 'tg-dialog-image',
    imports: [CommonModule],
    providers: [],
    templateUrl: './dialog-image.component.html',
    styleUrls: ['./dialog-image.component.scss']
})


/**
 * A dialog component with an image that can be used to display any picture url
 * 
 * We must specify the url in the data parameter when opening the dialog, and we can also specify the title 
 * by placing it at the first position of the texts array.
 */
export class DialogImageComponent extends DialogBaseComponent {


    static readonly DIALOG_CLASS_NAME = 'DialogImageComponent';
    
    
    title = '';
    
    
    safeUrl: SafeResourceUrl;
    
    
    constructor(public elementRef: ElementRef,
                public dialogRef: MatDialogRef<DialogBaseComponent>,
                private readonly sanitizer: DomSanitizer,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        
        super(elementRef, dialogRef);
        
        if(data.texts.length > 0) {
            
            this.title = data.texts[0];
        }
        
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data.data);
    }
}
