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
    selector: 'tg-dialog-multiple-option',
    imports: [CommonModule, MatButtonModule],
    providers: [],
    templateUrl: './dialog-multiple-option.component.html',
    styleUrls: ['./dialog-multiple-option.component.scss']
})


/**
 * A dialog component that is designed to show more than one option buttons (usually more than two), to be used with dialog service
 */
export class DialogMultipleOptionComponent extends DialogBaseComponent {


    static readonly DIALOG_CLASS_NAME = 'DialogMultipleOptionComponent';
    

    constructor(public elementRef: ElementRef, public dialogRef: MatDialogRef<DialogBaseComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {

        super(elementRef, dialogRef);
        
        if (data.texts.length < 1) {

            throw new Error('DialogMultipleOptionComponent expects 2 texts: The title and optionally a description');
        }
    }
}
