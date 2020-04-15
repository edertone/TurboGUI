/*
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

/**
 * Sometimes it is necessary to apply some kind of buffer to the user input for certain operations that may be executed
 * several times but we need to capture only the latest of them into a certain period of time.
 */
export class DelayedMethodCallManager{


    private _functionsToExecute: Function[] = [];


    private _timerIsRunning = false;
    
    
    private _setTimeoutHandler: any = null;
    

    /**
     * Sometimes it is necessary to apply some kind of buffer to the user input for certain operations that may be executed
     * several times but we need to capture only the latest of them into a certain period of time.
     */
    constructor(private delay = 1000) {
       
    }
    
    
    /**
     * Add a method to be called once the delay time is finished.
     * Every time a new call is pushed, the delay timer is restarted. When the delay time finishes, only the
     * last of the methods that have been pushed by call() will be executed.
     *
     * Use it to queue several user input operations that should be called only once in a period of time, while waiting
     * for the user to finish his input.
     *
     * @param method The function that will be queued for execution after the delay time has passed
     */
    queue(method: () => void){
        
        this._functionsToExecute.push(method);
        
        if(this._timerIsRunning){
            
            clearTimeout(this._setTimeoutHandler);
        }
            
        this._timerIsRunning = true;
            
        this._setTimeoutHandler = setTimeout(() => {this.run() }, this.delay);
    }
    
    
    /**
     * Abort all methods that may have been pushed to this class and are waiting to be executed, so none of them
     * is executed when the delay time finishes. Basically everything is cleared and stoped when this method is called.
     */
    cancel(){
        
        if(this._setTimeoutHandler !== null){
            
            clearTimeout(this._setTimeoutHandler);
        }
        
        this._functionsToExecute = [];
        
        this._timerIsRunning = false;
    }
    
    
    /**
     * Abort all methods that may have been pushed to this class and are waiting to be executed, so none of them
     * is executed when the delay time finishes. Basically everything is cleared and stoped when this method is called.
     */
    private run(){
        
        (this._functionsToExecute.pop() as () => void)();
        
        this._functionsToExecute = [];
        
        this._timerIsRunning = false;
    }
}
