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
@Injectable()
export class HTTPService extends HTTPManager {
    
    
    /**
     * execute() method option that tells the service to avoid blocking the user interface with a modal busy state while the requests that are
     * launched by the execute method are running.
     */
    static readonly NO_MODAL_BUSY_STATE = 'NO_MODAL_BUSY_STATE';


    /**
     * execute() method option that tells the service to skip showing an error dialog when a request fails. We normally use this to handle the
     * errors by ourselves or if we want to hide the error dialog for a specific request.
     */
    static readonly DISABLE_ERROR_HANDLING = 'DISABLE_ERROR_HANDLING';


    constructor(public dialogService: DialogService) {

        super(true);
    }
    
    
    /**
     * The same method as HTTPManager.execute but with the ability to enable several options which are specific to this service:
     *
     * - HTTPService.NO_MODAL_BUSY_STATE To prevent the default behaviour of locking the UI while the request is running
     * - HTTPService.DISABLE_ERROR_HANDLING To prevent the default behaviour of showing a detailed error dialog when a request fails
     *
     * @see HTTPManager.execute()
     */
    execute(requests: string|string[]|HTTPManagerBaseRequest|HTTPManagerBaseRequest[],
            finishedCallback: ((results: {url:string, response:any, isError:boolean, errorMsg:string, code:number}[], anyError:boolean) => void) | null = null,
            progressCallback: null | ((completedUrl: string, totalRequests: number) => void) = null,
            options: (typeof HTTPService.NO_MODAL_BUSY_STATE|typeof HTTPService.DISABLE_ERROR_HANDLING)[] = []){
    
        if(options.indexOf(HTTPService.NO_MODAL_BUSY_STATE) < 0){
           
           this.dialogService.addModalBusyState(); 
        }
    
        super.execute(requests, (results, anyError) => { 
            
            if(options.indexOf(HTTPService.NO_MODAL_BUSY_STATE) < 0){
                
                this.dialogService.removeModalBusyState();
            }
            
            if((options.indexOf(HTTPService.DISABLE_ERROR_HANDLING) < 0) && anyError){
                
                for(let result of results){
                    
                    if(result.isError){
                        
                        let errorMsg = result.errorMsg + '\n\n' + result.response;
                        
                        if(StringUtils.isEmpty(errorMsg)){
                        
                            errorMsg = 'Unknown error. Make sure Internet connection is available';    
                        }
                
                        this.dialogService.addDialog(DialogErrorComponent,
                            {
                                width:'600px',
                                texts: ['Error: ' + result.code, errorMsg],
                                captions: ['Ok']
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
