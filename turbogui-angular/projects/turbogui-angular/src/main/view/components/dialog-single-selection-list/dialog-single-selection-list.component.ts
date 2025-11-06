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
import { BrowserService } from '../../../controller/browser.service';
import { StringUtils } from 'turbocommons-ts';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TurboGuiAngularModule } from '../../../model/modules/turbogui-angular.module';


/**
 * A dialog component which allows us to select one single item from a list. The elements on that list are displayed on a table
 * which may show a scroll if necessary when there are many elements on the list.
 * 
 * It also allows us to filter inside the list with a custom text that we can type into a search input, which is optional.
 *
 * texts parameter must contain the title, the description (optional), the filter input title (optional), and the submit button caption.
 * If that caption is not provided, the selection will be automatically performed once user clicks on an element on the list. Otherwise, 
 * the element will be selected on the list and the selection will be performed once the user clicks on the submit button.
 *
 * options parameter must contain the list of elements that will be displayed to the user  
 */
@Component({
    selector: 'tg-dialog-single-selection-list',
    imports: [CommonModule, MatInputModule, MatFormFieldModule, TurboGuiAngularModule],
    providers: [],
    templateUrl: './dialog-single-selection-list.component.html',
    styleUrls: ['./dialog-single-selection-list.component.scss']
})


export class DialogSingleSelectionListComponent extends DialogBaseComponent {
    
    
    static readonly DIALOG_CLASS_NAME = 'DialogSingleSelectionListComponent';
    
    
    /**
     * Declare a reference to the string utils class so it can be used on the html part
     */
    stringUtils = StringUtils;
    
    /** 
     * Contains the list of elements that will be directly shown to the user at the component list.
     * It may be filtered or not depending on this component setup and the user input
     */
    filteredOptions:string[] = [];
    
    
    /**
     * Stores the number of options that are currently visible to the user
     */
    filteredOptionsCount = 0;
    
    
    /**
     * Contains the original list of elements that are provided to be listed on this component before
     * being possibly filtered. It is only used as a backup, not shown to the user
     */
    private originalOptions:string[] = [];
    
    
    /**
     * The same list as the originally provided but processed for a better text search.
     * It will be used to perform the search, but not shown to the user.
     */
    private originalOptionsFullTextSearch:string[] = [];
       
    
    /**
     * Stores the index for the element that's been selected by the user
     */
    selectedItemIndex = -1;
    
    
    constructor(public elementRef: ElementRef,
    			public dialogRef: MatDialogRef<DialogBaseComponent>,
                public browserService: BrowserService,
                @Inject(MAT_DIALOG_DATA) public data: any) {

        super(elementRef, dialogRef);

        if (data.texts.length < 1) {

            throw new Error('DialogSingleSelectionListComponent expects 4 texts: The title, the description (optional), the filter input title (optional), and the submit button caption');
        }
        
        if (data.options.length < 1) {

            throw new Error('DialogSingleSelectionListComponent expects one or more options');
        }
        
        this.originalOptions = data.options;
        this.filteredOptionsCount = this.originalOptions.length;
        
        for(let option of this.originalOptions){
            
            this.filteredOptions.push(option);
            this.originalOptionsFullTextSearch.push(StringUtils.formatForFullTextSearch(option));
        }
    }
    
    
    /**
     * Method to calculate the max possible height that the list items container is allowed to have
     */
    getListItemsContainerMaxheight(){
        
        return (this.browserService.getWindowHeight() * 0.6) + 'px';
    }
    
    
    /**
     * If the user presses enter key and there's only one element filtered in the list, we will close this dialog
     * setting that element as the selected.
     */
    onIntroKeyPress(){

        if(this.filteredOptionsCount === 1){
            
            for (let i = 0; i < this.originalOptionsFullTextSearch.length; i++){
                
                if(this.filteredOptions[i] !== ''){
                    
                    this.closeDialog(i);
                    
                    return;
                }
            }
        }
    }


    /**
     * When the user types a value on the input element to filter the list, this method will perform
     * that filtering and refresh the list
     */
    onSearchChange(input:HTMLInputElement){

        this.selectedItemIndex = -1;
        this.filteredOptionsCount = 0;
       
        let inputValue = StringUtils.formatForFullTextSearch(input.value);

        for (let i = 0; i < this.originalOptionsFullTextSearch.length; i++){

            if(inputValue === '' ||
               this.originalOptionsFullTextSearch[i].indexOf(inputValue) >= 0){

                this.filteredOptions[i] = this.originalOptions[i];
                this.filteredOptionsCount ++;

            }else{

                this.filteredOptions[i] = '';
            }
        }
    }
    
    /**
     * This method is used to greatly improve ngFor performance with arrays of primitive values. It tells the refresh
     * function to work by index instead of by value. The change in performance when refreshing the list is massive. 
     */
    trackByFn = (index: number, _value: string) => index;
}
