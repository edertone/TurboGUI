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

            if(StringUtils.isEmpty(control.value)){
                
                return { isEmpty: true };
            
            }else{
                
                return null;
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
    
    
    /**
     * Validator to check that a control value is a valid mobile phone number with country code.
     * 
     * The expected format is: +<country code><number>, where:
     *    - <country code> is 1 to 3 digits
     *    - <number> is 6 to 14 digits
     * 
     * The country code must be prefixed with a plus sign (+). Spaces, dots (.), and hyphens (-) are allowed as separators.
     * 
     * Examples of valid formats:
     * - +1 1234567890
     * - +44-1234-567890
     * - +91.9876543210
     * 
     * Examples of invalid formats:
     * - 1234567890 (missing country code)
     * - +123 (too short)
     * - +123456789012345671 (too long)
     * 
     * @param control The form control to validate.
     * 
     * @returns An object with the validation error if invalid, or null if valid.
     */
    static mobilePhoneWithCountryCode(control: FormControl) {
    
        const mobilePhoneRegex = /^\+\d{1,3}[\s.-]?\d{6,14}$/;
        
        const valid = mobilePhoneRegex.test(control.value);
        
        return valid ? null : { mobilePhoneWithCountryCode: true };
    }
}
