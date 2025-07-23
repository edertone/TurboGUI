/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { StringUtils } from 'turbocommons-ts';


/**
 * Validation class that extends the base angular Form Validators class and adds extra useful validators 
 */
export class ValidatorsPlus extends Validators {
    
    
    /**
     * Verify that the data of a form value is required and also Not semantically empty, just like the
     * TurboCommons StringUtils.isEmpty method does
     */
    static nonEmpty(control: FormControl) {

        // Apply first the required validation
        let validateRequired = Validators.required(control);
        
        if(validateRequired !== null){

            return validateRequired;
        }
                
        // first check if the control has a value
        if (control.value && control.value.length > 0) {

            if(!StringUtils.isEmpty(control.value)){
                
                return null;
            
            }else{
                
                return { isEmpty: true };
            }
            
        } else {
            
          return null;
        }
    }
    
    
    /**
     * Validator to check that at least one of the specified form controls has a non empty value.
     * Non empty criteria is the same as the nonEmpty validator on this same class, which verifies that the value is not semantically empty.
     * 
     * To use this validator, you need to pass an array of control names that you want to check. And set it to the validators property
     * of the form builder group. 
     * 
     * @param controlNames An array of control names to check. For example, ['name', 'surname'].
     * 
     * @returns A validator function.
     */
    static atLeastOneIsNotEmpty(controlNames: string[]): ValidatorFn {
        
        return (control: AbstractControl): ValidationErrors | null => {
            
            const formGroup = control as FormGroup;
            
            const hasValue = controlNames.some(name => {
                
                const formControl = formGroup.get(name);
                
                // Check if it's a FormControl and if it's not empty
                return formControl instanceof FormControl && ValidatorsPlus.nonEmpty(formControl) === null;
            });

            return hasValue ? null : { atLeastOneRequired: true };
        };
    }
}
