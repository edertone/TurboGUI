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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';


@Component({
  	selector: 'tg-dialog-date-selection',
  	standalone: true,
	imports: [CommonModule, MatDatepickerModule, MatNativeDateModule],
	providers: [],
  	templateUrl: './dialog-date-selection.component.html',
  	styleUrls: ['./dialog-date-selection.component.scss']
})


/**
 * A dialog component with a calendar that allows us to select a single date value
 */
export class DialogDateSelectionComponent extends DialogBaseComponent {


    static readonly DIALOG_CLASS_NAME = 'DialogDateSelectionComponent';
    
    
    selectedDate:Date;


    constructor(public elementRef: ElementRef, public dialogRef: MatDialogRef<DialogBaseComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        
        super(elementRef, dialogRef);
    }
}
