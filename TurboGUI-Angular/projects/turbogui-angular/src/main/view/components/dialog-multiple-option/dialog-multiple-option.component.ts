/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { Component, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { DialogOptionsBaseComponent } from '../dialog-options-base/dialog-options-base.component';


/**
 * A dialog component that is designed to show more than one option buttons (usually more than two), to be used with dialog service
 */
@Component({
  selector: 'tg-dialog-multiple-option',
  templateUrl: './dialog-multiple-option.component.html',
  styleUrls: ['./dialog-multiple-option.component.scss']
})


export class DialogMultipleOptionComponent extends DialogOptionsBaseComponent {

    constructor(public dialogRef: MatDialogRef<DialogOptionsBaseComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {

        super();
        
        if (data.texts.length < 1) {

            throw new Error('DialogMultipleOptionComponent expects 2 texts: The title and optionally a description');
        }
    }
}
