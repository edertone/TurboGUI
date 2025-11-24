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
 * // 1. Instantiate the manager
 * const debouncer = new DebounceTimeManager(500);
 * 
 * // 2. Queue a function (Sync or Async - it handles both!)
 * debouncer.queue(async () => {
 *     await myApiService.getData();
 * });
 * 
 * // 3. Check status
 * // isActive is TRUE during the 500ms wait AND during the async call.
 * if (debouncer.isActive) {
 *    showLoadingSpinner();
 * }
 * 
 * // 4. Clean up
 * onDestroy() {
 *    debouncer.cancel();
 * }
 */
export class DebounceTimeManager {
   
    /**
     * Stores the latest function provided by the caller.
     * Can return void (sync) or a Promise (async).
     */
    private _callbackToExecute: (() => void | Promise<void>) | null = null;
    
    /**
     * The numeric ID of the active timeout, or null if no timer is running.
     * We use 'any' to support both Browser (number) and Node (object) environments.
     */
    private _setTimeoutHandler: any = null;    
    
    /**
     * The single source of truth for the busy state.
     */
    private _isActive = false;
    
    /**
     * @param delay The amount of time (in milliseconds) to wait before executing the queued operation. 
     *              Defaults to 1000ms.
     */
    constructor(private readonly delay = 1000) {}

    /**
     * Returns true if the manager is currently busy. 
     * This includes both the "waiting for delay" phase and the "executing async operation" phase.
     * It will only be false after the operation has fully completed or if cancelled.
     */
    public get isActive(): boolean {
        return this._isActive;
    }

    /**
     * Queues a method (Sync or Async) to be executed after the delay time passes.
     * 
     * If the method returns a Promise (async), the `isActive` state will remain true 
     * until that Promise resolves or rejects.
     * 
     * @param method The function to execute.
     */
    queue(method: () => void | Promise<void>) {
        this._isActive = true;
        this._callbackToExecute = method;

        if (this._setTimeoutHandler !== null) {
            clearTimeout(this._setTimeoutHandler);
        }

        this._setTimeoutHandler = setTimeout(() => {
            this._run();
        }, this.delay);
    }

    /**
     * Internal function that executes the queued method and cleans up.
     * It intelligently detects if the callback is a Promise to keep the isActive flag true.
     */
    private _run() {
        this._setTimeoutHandler = null;

        if (this._callbackToExecute) {
            const callback = this._callbackToExecute;
            this._callbackToExecute = null;

            try {
                // Execute the callback
                const result = callback();

                // Check if the result is a Promise (Async)
                if (result instanceof Promise) {
                    result.finally(() => {
                        this._isActive = false;
                    });
                } else {
                    // It was a synchronous function, we are done immediately
                    this._isActive = false;
                }
            } catch (error) {
                // If a sync function crashes, we must ensure the flag is reset
                this._isActive = false;
                throw error;
            }
        } else {
            // Should not happen, but safe fallback
            this._isActive = false;
        }
    }

    /**
     * Cancels any pending execution. 
     * The queued method will be discarded, the timer stopped, and the active state reset to false.
     * 
     * <strong style="color:orange">WARNING:</strong> If an async request is already in progress, 
     * this will NOT stop the browser network request (Promises cannot be cancelled externally), 
     * but it will reset the `isActive` state to false immediately.
     * 
     * You should call this method at your component disposal.
     */
    cancel() {
        if (this._setTimeoutHandler !== null) {
            clearTimeout(this._setTimeoutHandler);
            this._setTimeoutHandler = null;
        }
        this._callbackToExecute = null;
        this._isActive = false;
    }
}