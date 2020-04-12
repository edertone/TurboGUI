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
import { BrowserService } from '../../../controller/browser.service';
import { StringUtils } from 'turbocommons-ts';


/**
 * A dialog component with a single option button, to be used with dialog service
 */
@Component({
  selector: 'tg-dialog-single-selection-list',
  templateUrl: './dialog-single-selection-list.component.html',
  styleUrls: ['./dialog-single-selection-list.component.scss']
})


export class DialogSingleSelectionListComponent extends DialogOptionsBaseComponent {
    
    
    /**
     * Declare a reference to the string utils class so it can be used on the html part
     */
    stringUtils = StringUtils;
    
    
    /**
     * Stores the index for the element that's been selected by the user
     */
    selectedItemIndex = -1;
    

    constructor(public dialogRef: MatDialogRef<DialogOptionsBaseComponent>,
                public browserService: BrowserService,
                @Inject(MAT_DIALOG_DATA) public data: any) {

        super();

        if (data.texts.length < 2) {

            throw new Error('DialogSingleSelectionListComponent expects 3 texts: The title, description and optionally the submit button caption');
        }
        
        if (data.options.length < 1) {

            throw new Error('DialogSingleSelectionListComponent expects more than one options');
        }
    }
    
    
    /**
     * Method to calculate the max possible height that the list items container is allowed to have
     */
    getListItemsContainerMaxheight(){
        
        return (this.browserService.getWindowHeight() * 0.6) + 'px';
    }
}
