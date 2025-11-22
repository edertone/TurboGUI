/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

/**
 * Manages the execution of a function with a debounce time.
 *
 * This class allows queuing multiple method calls, but ensures that only the last one
 * is executed after a specific window of time has passed without new calls.
 *
 * <strong style="color:red">IMPORTANT:</strong> You must call the <code>cancel()</code> method 
 * when your component or context is destroyed. Failure to do so may result in the 
 * callback executing after the object is gone, causing memory leaks or errors.
 * 
 * @example
 * // 1. Instantiate the manager (e.g. inside a Component)
 * const debouncer = new DebounceTimeManager(500);
 * 
 * // 2. Queue a function
 * debouncer.queue(() => console.log("Searching..."));
 * 
 * // 3. Check status
 * if (debouncer.isActive) {
 *    console.log("Waiting for user to stop typing...");
 * }
 * 
 * // Clean up when component is destroyed to prevent memory leaks
 * onDestroy() {
 * debouncer.cancel();
 * }
 */
export class DebounceTimeManager {
   
    /**
     * Stores the latest function provided by the caller.
     */
    private _callbackToExecute: (() => void) | null = null;
    
    /**
     * The numeric ID of the active timeout, or null if no timer is running.
     * We use 'any' or 'ReturnType<typeof setTimeout>' to support both Browser and Node environments.
     */
    private _setTimeoutHandler: any = null;
    
    /**
     * @param delay The amount of time (in milliseconds) to wait before executing the queued operation. 
     *              Defaults to 1000ms.
     */
    constructor(private readonly delay = 1000) {}

    /**
     * Returns true if a timer is currently running (meaning a method is queued and waiting to execute), 
     * false otherwise.
     */
    public get isActive(): boolean {
        return this._setTimeoutHandler !== null;
    }

    /**
     * Queues a method to be executed after the delay time passes.
     * 
     * Every time this method is called, the previous timer is cancelled and restarted. 
     * When the delay finishes, only the most recent method passed to this function will be executed.
     *
     * @param method The function that will be executed after the delay.
     */
    queue(method: () => void) {
        this._callbackToExecute = method;

        if (this._setTimeoutHandler !== null) {
            clearTimeout(this._setTimeoutHandler);
        }

        this._setTimeoutHandler = setTimeout(() => {
            this.run();
        }, this.delay);
    }

    /**
     * Cancels any pending execution. 
     * The queued method will be discarded and the timer stopped immediately.
     * 
     * You should call this method at your component disposal to avoid any pending method calls 
     * being executed after your component is destroyed.
     */
    cancel() {
        if (this._setTimeoutHandler !== null) {
            clearTimeout(this._setTimeoutHandler);
            this._setTimeoutHandler = null;
        }
        this._callbackToExecute = null;
    }

    /**
     * Internal function that executes the queued method and cleans up.
     */
    private run() {
        
        // We clear the handler reference first so isActive returns false immediately
        // while the callback is running.
        this._setTimeoutHandler = null;

        if (this._callbackToExecute) {
            const callback = this._callbackToExecute;
            this._callbackToExecute = null;
            callback();
        }
    }
}