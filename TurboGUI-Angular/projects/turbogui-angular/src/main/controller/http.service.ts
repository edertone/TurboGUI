/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { Injectable } from '@angular/core';
import { HTTPManager, HTTPManagerBaseRequest, StringUtils } from 'turbocommons-ts';
import { DialogService } from './dialog.service';
import { DialogErrorComponent } from '../view/components/dialog-error/dialog-error.component';


/**
 * Manages application http communications
 */
@Injectable({
  providedIn: 'root',
})
export class HTTPService extends HTTPManager {
    
    
    constructor(public dialogService: DialogService) {

        super(true);
    }
    
    
    /**
     * The same method as HTTPManager.execute but with the ability to enable several options which are specific to this service:
     *
     * - options:
     *     busyState: Set it to false to prevent the default behaviour of locking the UI while the request is running
     *     handleErrors: Set it to false to prevent the default behaviour of showing a detailed error dialog when a request fails
     *
     * @see HTTPManager.execute()
     */
    execute(requests: string|string[]|HTTPManagerBaseRequest|HTTPManagerBaseRequest[],
            finishedCallback: ((results: {url:string, response:any, isError:boolean, errorMsg:string, code:number}[], anyError:boolean) => void) | null = null,
            progressCallback: null | ((completedUrl: string, totalRequests: number) => void) = null,
            options: {busyState?:boolean, handleErrors?:boolean} = {}){
    
        // Set the default values for non specified properties
        options.busyState = options.busyState ?? true;
        options.handleErrors = options.handleErrors ?? true;
        
        if(options.busyState){
           
           this.dialogService.addModalBusyState(); 
        }
    
        super.execute(requests, (results, anyError) => { 
            
            if(options.busyState){
                
                this.dialogService.removeModalBusyState();
            }
            
            if(options.handleErrors && anyError){
                
                for(let result of results){
                    
                    if(result.isError){
                        
                        let errorMsg = result.errorMsg + '\n\n' + result.response;
                        
                        if(StringUtils.isEmpty(errorMsg)){
                        
                            errorMsg = 'Unknown error. Make sure Internet connection is available';    
                        }
                
                        this.dialogService.addDialog(DialogErrorComponent,
                            {
                                width:'50vw',
                                texts: ['Error: ' + result.code, errorMsg],
                                options: ['Ok']
                            });        
                    }
                }
            }
            
            if(finishedCallback !== null){
                
                finishedCallback(results, anyError);
            }
            
         }, progressCallback);
    }
}
