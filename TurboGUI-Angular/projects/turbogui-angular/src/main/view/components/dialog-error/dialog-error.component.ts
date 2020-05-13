/*
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogOptionsBaseComponent } from '../dialog-options-base/dialog-options-base.component';


/**
 * A dialog component with a single option button, to be used for error notifications
 */
@Component({
  selector: 'tg-dialog-error',
  templateUrl: './dialog-error.component.html',
  styleUrls: ['./dialog-error.component.scss']
})


export class DialogErrorComponent extends DialogOptionsBaseComponent {

    constructor(public dialogRef: MatDialogRef<DialogOptionsBaseComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {

        super();
        
        if (data.texts.length < 1) {

            throw new Error('DialogErrorComponent expects 2 texts: The title and optionally a description');
        }

        if (data.options.length !== 1) {

            throw new Error('DialogErrorComponent expects only one option');
        }
    }
}
