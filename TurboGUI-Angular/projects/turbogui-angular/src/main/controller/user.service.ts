/*
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { Injectable } from '@angular/core';
import { ConversionUtils, StringUtils } from 'turbocommons-ts';
import { HTTPService } from '../controller/http.service';
import { LocalizationService } from '../controller/localization.service';
import { DialogService } from '../controller/dialog.service';
import { HTTPServicePostRequest } from '../controller/httpservice/HTTPServicePostRequest';


/**
 * Manages the users model and commands
 */
@Injectable()
export class UserService {


    /**
     * The username that is currently defined
     */
    userName = '';


    /**
     * The password for the user that is currently defined
     */
    password = '';


    /**
     * Check public getter for docs
     */
    private _isLogged = false;


    constructor(public httpService: HTTPService,
                public dialogService: DialogService,
                public ls: LocalizationService) {
    }


    /**
     * Tells if the services contains a non empty username and password specified
     */
    get isUserAndPswDefined(): boolean  {

        return !StringUtils.isEmpty(this.userName) && !StringUtils.isEmpty(this.password);
    }


    /**
     * Tells if exists a user that is currently logged or not
     */
    get isLogged(): boolean {

        return this._isLogged;
    }


    /**
     * Perform a user login
     */
    login(loginOkCallback: null | (() => void), loginFailCallback: null | (() => void)) {

        this.dialogService.addModalBusyState();

        const request = new HTTPServicePostRequest('users/login');

        const encodedCredentials = ConversionUtils.stringToBase64(
                ConversionUtils.stringToBase64(this.userName) + ',' + ConversionUtils.stringToBase64(this.password));

        request.parameters = {
            data: encodedCredentials
        };

        this.httpService.execute(request, (results: any) => {

            this.dialogService.removeModalBusyState();

            if (results[0].response === 'ok') {

                this._isLogged = true;

                if (loginOkCallback !== null) {

                    loginOkCallback();
                }

            } else {

                this.userName = '';
                this.password = '';
                this._isLogged = false;

                if (loginFailCallback !== null) {

                    loginFailCallback();
                }
            }
        });
    }


    /**
     * Perform the logout for the currently logged user
     */
    logout() {

        this.userName = '';
        this.password = '';
        this._isLogged = false;
    }
}
