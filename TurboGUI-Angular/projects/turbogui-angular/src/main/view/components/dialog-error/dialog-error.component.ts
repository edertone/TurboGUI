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
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';


@Component({
  	selector: 'tg-dialog-error',
  	standalone: true,
	imports: [CommonModule, MatButtonModule],
	providers: [],
  	templateUrl: './dialog-error.component.html',
  	styleUrls: ['./dialog-error.component.scss']
})


/**
 * A dialog component with a single option button, to be used for error notifications
 */
export class DialogErrorComponent extends DialogBaseComponent {


    static readonly DIALOG_CLASS_NAME = 'DialogErrorComponent';
    

    constructor(public elementRef: ElementRef, public dialogRef: MatDialogRef<DialogBaseComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {

        super(elementRef, dialogRef);
        
        if (data.texts.length < 1) {

            throw new Error('DialogErrorComponent expects 2 texts: The title and optionally a description');
        }

        if (data.options.length !== 1) {

            throw new Error('DialogErrorComponent expects only one option');
        }
        
        if(data.texts.length > 1){
			
			data.texts[1] = data.texts[1].replace(/\n/g, "<br/>");
		}
    }
}
