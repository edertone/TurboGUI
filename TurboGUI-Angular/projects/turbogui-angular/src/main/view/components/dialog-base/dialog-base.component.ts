/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */


import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';


/**
 * This is the base class for all the dialog components that can be loaded by the dialog service class
 */
@Component({ template: '' })
export abstract class DialogBaseComponent implements AfterViewInit {


    /*
     * The name of the superclass must be set into this constant as it is required by the dialog service to identify dialogs as different.
     * 
     * When you extend the dialog base class, simply declare this static constant with the exact same name as your class and you're done.
     * If this value is not set on the extended dialog component, a runtime exception will happen when trying to show the dialog.
     * 
     * The root cause of this requirement is that when apps are compiled for production, class names are minified and this causes problems 
     * when creating a dialog hash to uniquely identify a dialog instance. Therefore, a hardcoded class name is necesary.
     */        
    static readonly DIALOG_CLASS_NAME:string = '';


	constructor(public elementRef: ElementRef,
				public dialogRef: MatDialogRef<DialogBaseComponent>,) {
  
    }


    ngAfterViewInit() {
	    
	    // Assign the component HTML identifier if it is specifically assigned to the dialogref instance
	    if(this.dialogRef.id !== undefined && this.dialogRef.id !== ''){
   
			this.elementRef.nativeElement.id = this.dialogRef.id;
		}
	}

    
    /**
     * Method to be called by the dialogs that extend this base component when they want to close themselves.
     * It will perform the close of that dialog and also send an object to the addDialog() callback with the index and value
     * that the user may have selected.
     *
     * @param index The numeric index of the user option selection. It will be specific for each dialog and it's different available options
     * @param value Any value that may be provided to the callback regarding the user selected option.
     *
     * @return void
     */
    closeDialog(index:number, value:any = null){
        
        this.dialogRef.close({index: index, value: value});
    }
}
