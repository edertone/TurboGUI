/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogBaseComponent } from '../dialog-base/dialog-base.component';


/**
 * A dialog component with two option buttons, to be used with dialog service.
 * The first of the options is considered to be the primary one and will therefore have more visual accent
 */
@Component({
  selector: 'tg-dialog-two-option',
  templateUrl: './dialog-two-option.component.html',
  styleUrls: ['./dialog-two-option.component.scss']
})


export class DialogTwoOptionComponent extends DialogBaseComponent {


    static readonly DIALOG_CLASS_NAME = 'DialogTwoOptionComponent';
    

    constructor(public dialogRef: MatDialogRef<DialogBaseComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {

        super();
        
        if (data.texts.length < 1) {

            throw new Error('DialogTwoOptionComponent expects 2 texts: The title and optionally a description');
        }

        if (data.options.length !== 2) {

            throw new Error('DialogTwoOptionComponent expects only two options');
        }
    }
}
