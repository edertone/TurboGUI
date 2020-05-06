/*
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { Injectable } from '@angular/core';
import { HTTPManager, HTTPManagerBaseRequest } from 'turbocommons-ts';
import { DialogService } from './dialog.service';


/**
 * Manages application http communications
 */
@Injectable()
export class HTTPService extends HTTPManager {


    constructor(public dialogService: DialogService) {

        super(true);
    }
    
    
    /**
     * The same method as HTTPManager.execute but with the ability to enable or disable the dialogService modal busy state while the requests are running
     *
     * @see HTTPManager.execute()
     */
    execute(requests: string|string[]|HTTPManagerBaseRequest|HTTPManagerBaseRequest[],
            finishedCallback: ((results: {url:string, response:any, isError:boolean, errorMsg:string, code:number}[], anyError:boolean) => void) | null = null,
            progressCallback: null | ((completedUrl: string, totalRequests: number) => void) = null,
            showModalBusyState = true){
    
        if(showModalBusyState){
           
           this.dialogService.addModalBusyState(); 
        }
    
        super.execute(requests, (results, anyError) => { 
            
            if(showModalBusyState){
                
                this.dialogService.removeModalBusyState();
            }
            
            if(finishedCallback !== null){
                
                finishedCallback(results, anyError);
            }
            
         }, progressCallback);
    }
}
