/*
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { Injectable, ErrorHandler } from '@angular/core';


/**
 * Captures all the application exceptions and performs any required action.
 * It also contains multiple general error management features.
 *
 * To define this class as your application error handler, you must add the following to your
 * main app module providers:
 *      {
 *          provide: ErrorHandler,
 *          useClass: GlobalErrorService
 *      },
 *      GlobalErrorService
 *
 * You cannot access the error handler at runtime. If you need to modify any of the behaviours
 * or implement your custom ones, you must extend this class and set your new one as the error
 * handler provider.
 */
@Injectable()
export class GlobalErrorService implements ErrorHandler {


    /**
     * Enables or disables the error notification to user via an alert box
     * Extend this class and override this value on your custom error handle to change it
     */
    private readonly showExceptionsToUser = true;


    /**
     * Enables or disables the error notification to user via an alert box
     * Extend this class and override this value on your custom error handle to change it
     */
    private readonly showExceptionsOnConsole = true;


    /**
     * Defines the text that will be used for the alert that is shown to the user when an exception happens
     * and showExceptionsToUser is true
     * Extend this class and override this value on your custom error handle to change it
     */
    private readonly errorAlertMessage = 'Application exception:\n\n';


    /**
     * Show an alert with the received error detail and also log it to the js console
     *
     * @param error An error instance
     */
    handleError(error: any) {

        if (this.showExceptionsToUser) {

            alert(this.errorAlertMessage + (error as string));
        }

        if (this.showExceptionsOnConsole) {

            console.log(error);
        }

        throw error;
    }
}
