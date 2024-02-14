/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */


import { MatDialogRef } from '@angular/material/dialog';


/**
 * This is the base class for all the dialog components that can be loaded by the dialog service class
 */
export abstract class DialogBaseComponent {

    
    /**
     * Method to be called by the dialogs that extend this base component when they want to close themselves.
     * It will perform the close of that dialog and also send an object to the addDialog() callback with the index and value
     * that the user may have selected.
     *
     * @param dialogRef The reference to the dialogRef object that is available at the extended dialog component. It is 
     *        required to perform the closing operation
     * @param index The numeric index of the user option selection. It will be specific for each dialog and it's different available options
     * @param value Any value that may be provided to the callback regarding the user selected option.
     *
     * @return void
     */
    closeDialog(dialogRef: MatDialogRef<DialogBaseComponent>, index:number, value:any = null){
        
        dialogRef.close({index: index, value: value});
    }
}
