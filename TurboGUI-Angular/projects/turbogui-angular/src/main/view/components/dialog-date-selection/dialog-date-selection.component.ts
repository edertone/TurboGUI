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
 * A dialog component with a calendar that allows us to select a single date value
 */
@Component({
  selector: 'tg-dialog-date-selection',
  templateUrl: './dialog-date-selection.component.html',
  styleUrls: ['./dialog-date-selection.component.scss']
})


export class DialogDateSelectionComponent extends DialogBaseComponent {

    
    selectedDate:Date;


    constructor(public dialogRef: MatDialogRef<DialogBaseComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        
        super();
    }
}
