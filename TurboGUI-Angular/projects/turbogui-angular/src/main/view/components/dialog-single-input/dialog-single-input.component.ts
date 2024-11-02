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
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TurboGuiAngularModule } from '../../../model/modules/turbogui-angular.module';
import { StringUtils } from 'turbocommons-ts';


@Component({
  	selector: 'tg-dialog-single-input',
  	standalone: true,
	imports: [CommonModule, MatButtonModule, MatInputModule, FormsModule,
              TurboGuiAngularModule],
	providers: [],
  	templateUrl: './dialog-single-input.component.html',
  	styleUrls: ['./dialog-single-input.component.scss']
})


/**
 * A dialog component with a single input element and an accept button, to be used with dialog service
 * It lets us easily ask the user for any arbitrary text we may need.
 * 
 * 1st text is the dialog title
 * 2nd text is the dialog subtitle (leave it empty to hide the subtitle)
 * 3rd text is the input prompt caption
 * 4rd text is the default value of the input contents
 * 
 * 1st option will be the text on the unique save button that exists on the dialog
 */
export class DialogSingleInputComponent extends DialogBaseComponent {

    
    static readonly DIALOG_CLASS_NAME = 'DialogSingleInputComponent';
    
    
    /**
     * Contains the text that the user types on the dialog input
     */
    inputText = '';
    
    
    /**
    * Contains the default text that's been specified for the input
    */
    defaultTextValue = '';
    

    constructor(public elementRef: ElementRef, public dialogRef: MatDialogRef<DialogBaseComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {

        super(elementRef, dialogRef);
        
        if (data.texts.length < 1) {

            throw new Error('DialogSingleInputComponent expects 1 text: The dialog title');
        }

        if (data.options.length !== 1) {

            throw new Error('DialogSingleInputComponent expects only one option');
        }
        
        if (data.texts.length > 3) {

            this.inputText = data.texts[3]; 
            this.defaultTextValue = data.texts[3]; 
        }
    }
    
    
    isButtonDisabled(){
        
        if (this.defaultTextValue !== '' && this.inputText === this.defaultTextValue) {

            return true;
        }
        
        return StringUtils.isEmpty(this.inputText);
    }
    
    
    closeDialog(){
    
        super.closeDialog(0, this.inputText);       
    }
}