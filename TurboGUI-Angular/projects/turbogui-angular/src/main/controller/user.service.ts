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
import { HTTPServicePostRequest } from '../controller/httpservice/HTTPServicePostRequest';


/**
 * Manages the users model and commands
 */
@Injectable()
export class UserService {


    /**
     * Path to the web service that performs the user login
     */
    loginWebService = 'users/login';
    

    /**
     * The username that is currently defined and will be used by the login methods
     */
    userName = '';


    /**
     * The password for the user that is currently defined and will be used by the login methods
     */
    password = '';


    /**
     * Check public getter for docs
     */
    private _isLogged = false;
    
    
    /**
     * @see token() getter for more info
     */
    private _token = '';


    constructor(public httpService: HTTPService,
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
     * Gives the value for the currently active user authentication token or an empty string if no user logged
     */
    get token() {

        return this._token;
    }


    /**
     * Perform a user login against the configured login webservice
     * 
     * @param loginOkCallback Method to be executed once the login finishes chorrectly. An object with all the service response data will be passed to this method
     * @param loginFailCallback Method to be executed once the login finishes incorrectly.
     */
    login(loginOkCallback: null | ((response: any) => void) = null, loginFailCallback: null | (() => void) = null) {

        const request = new HTTPServicePostRequest(this.loginWebService);
        
        request.ignoreGlobalPostParams = true;

        const encodedCredentials = ConversionUtils.stringToBase64(
                ConversionUtils.stringToBase64(this.userName) + ',' + ConversionUtils.stringToBase64(this.password));

        request.parameters = {
            data: encodedCredentials
        };

        this.httpService.execute(request, (results: any) => {

            if (results[0].response !== '') {

                let response = JSON.parse(results[0].response);            

                this._isLogged = true;
                this._token = response.token;
                this.httpService.setGlobalPostParam('token', response.token);

                if (loginOkCallback !== null) {

                    loginOkCallback(response);
                }

            } else {

                this._clearUserAndToken();

                if (loginFailCallback !== null) {

                    loginFailCallback();
                }
            }
        });
    }


    /**
     * Perform the logout for the currently logged user
     */
    logout(logoutOkCallback: null | (() => void) = null) {
        
        const request = new HTTPServicePostRequest('users/logout');
        
        request.parameters = {
            token: this._token
        };

        this.httpService.execute(request, () => {

            this._clearUserAndToken();
            
            if (logoutOkCallback !== null) {

                logoutOkCallback();
            }
        });
    }
    
    
    private _clearUserAndToken(){
    
        this.userName = '';
        this.password = '';
        this._isLogged = false;
        this._token = '';
        
        if(this.httpService.isGlobalPostParam('token')){
            
            this.httpService.deleteGlobalPostParam('token');
        }    
    }
}
