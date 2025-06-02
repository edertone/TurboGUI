/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { Injectable } from '@angular/core';
import { DialogService } from './dialog.service';
import { ConversionUtils, HTTPManager, HTTPManagerPostRequest, StringUtils } from 'turbocommons-ts';
import { DialogErrorComponent } from '../view/components/dialog-error/dialog-error.component';
import { BrowserService } from './browser.service';


/**
 * Allows us to easily perform requests to a remote API that is developed with Turbo framework.
 */
@Injectable({
  providedIn: 'root',
})
export abstract class TurboApiService {
    

    /**
     * URI Path to the web service that performs the user login
     */
    loginServiceURI = 'users/login';
    
    
    /**
     * URI Path to the web service that allows us to create extra user tokens
     */
    tokenCreationServiceURI = 'users/user-token-create';
    
    
    /**
     * URI Path to the web service that performs the user log out
     */
    logOutServiceURI = 'users/logout';
    
    
    /**
     * URI Path to the web service that performs the verification for a user email
     */
    mailVerifyServiceURI = 'users/user-mail-verify';


    /**
     * The username that is currently defined and will be used by the login methods
     */
    private _userName = '';


    /**
     * The password for the user that is currently defined and will be used by the login methods
     */
    private _password = '';
    
    
    /**
     * Contains the last email account that has been verified (or tried to verify) by this service, if any
     */
    private _lastVerifiedMail = '';


    /**
     * Check public getter for docs
     */
    private _isLogged = false;


    /**
     * @see token() getter for more info
     */
    private _token = '';
    
    
    /**
     * List of operations that are allowed to the currently loged user. It gets filled just after login is performed
     */
    private _operations:string[] = [];
    
    
    /**
     * Private http manager instance that will be exclusive to this turbo api caller service.
     */
    private readonly httpManager: HTTPManager;
    
    
    constructor(private readonly dialogService: DialogService, 
                private readonly browserService: BrowserService) {
        
        // Create a fresh instance of the http service so we can use it independently
        this.httpManager = new HTTPManager();
        this._clearUserAndToken();
    }
    
    
    /** 
     * The username that is currently defined and will be used by the login methods
     */
    set userName(v:string){

        this._isLogged = false;
        this._token = '';
        this._userName = v;
    }
    
    
    /** 
     * The username that is currently defined and will be used by the login methods
     */
    get userName(){
        
        return this._userName;
    }
    
    
    /** 
     * The password for the user that is currently defined and will be used by the login methods
     */
    set password(v:string){

        this._isLogged = false;
        this._token = '';
        this._password = v;
    }
    
    
    /** 
     * The password for the user that is currently defined and will be used by the login methods
     */
    get password(){
        
        return this._password;
    }
    

    /** 
     * Define the root url that will be used for all the API calls
     */
    set baseUrl(url:string){
        
        this.httpManager.baseUrl = url;
    }
    
    
    /** 
     * Define the root url that will be used for all the API calls
     */
    get baseUrl(){
        
        return this.httpManager.baseUrl;
    }
    
    
    /**
     * If the current browser URL contains a hash fragment (The part after the # character) that contains encoded user or password
     * values, this method will parse and automatically set them as the credentials to use.
     * 
     * The URL hash is not altered in any way by this method.
     *
     * @returns True if any credentials were found and loaded, false if nothing happened
     */
    loadCredentialsFromURLHashFragment() {
    
        // If the hash fragment is empty, nothing to do
        if(!this.browserService.isCurrentUrlWithHashFragment()){
           
           return false;
        }
       
        let valuesFound = false;
       
        // Split the hash fragment to obtain the different values that contains
        let hashData = this.browserService.getCurrentUrlHashFragment().split('/');
       
        // User name is the first element of the hash fragment. If we found a value, 
        // we will fill it automatically
        if(hashData.length > 0){
           
            valuesFound = true;
            this.userName = ConversionUtils.base64ToString(hashData[0]);
        }
       
        // Auto fill the password if it is received
        if(hashData.length > 3){
        
            valuesFound = true;
            this.password = ConversionUtils.base64ToString(hashData[3]);
        }
       
        return valuesFound;
    }
    
    
    /**
     * If the current browser URL contains a hash fragment (The part after the # character) that contains encoded user, mail and
     * has verification code values, this method will perform the request to server to verify that email account for the user.
     * 
     * The URI path to the mail verification service must be correctly defined at this.mailVerifyServiceURI property.
     *
     * @returns A promise that resolves with the server response if the verification is successful,
     *          or rejects with an error if the verification fails. Response will have 4 possible values:
     *               undefined - meaning that the URL hash fragment didn't contain valid verification values
     *              -1 - meaning verification failed
     *               0 - meaning verification succeeded
     *               1 - meaning the email was already previouly verified
     */
    verifyUserMailFromURLHashFragment() {

        // If the hash fragment is empty, nothing to do
        if(this.browserService.isCurrentUrlWithHashFragment()){
                   
            let hashData = this.browserService.getCurrentUrlHashFragment().split('/');
                    
            if(hashData.length >= 3){
                        
                // Call for the user mail verification if user, mail and hash are received
                let user = ConversionUtils.base64ToString(hashData[0]);
                let mail = ConversionUtils.base64ToString(hashData[1]);
                let hash = ConversionUtils.base64ToString(hashData[2]);
                        
                if(!StringUtils.isEmpty(user) && !StringUtils.isEmpty(mail) && !StringUtils.isEmpty(hash)){
                    
                    this._lastVerifiedMail = mail;
                    
                    return this.call(this.mailVerifyServiceURI, {userName: user, mail: mail, hash: hash});
                }
            }
        }
        
        return Promise.resolve(undefined);
    }
    
    
    /**
     * Obtain the lat user mail account that has been verified (or attempted to verify) by this service.
     */
    getLastVerifiedMail(){

        return this._lastVerifiedMail;
    }
    
    
    /**
     * Authenticates the userName and password that are currently defined at the respective properties of this service.
     * Returns a promise that resolves with the server's response or rejects with an error if the login fails.
     * Path to the login service must be correctly defined at this.loginWebService
     * 
     * The authentication process is performed by sending an encoded credentials request to the login web service using the 
     * currently defined user name and psw.
     *
     * Here's an example of a call:
     * 
     *  login().then(response => {
     *     console.log('Login successful:', response);
     *  }).catch(() => {
     *     console.error('Login failed:');
     *  });
     * 
     * @returns A promise that resolves with the server response if the login is successful,
     *          or rejects with an error if the login fails.
     */
    login() {
        
        this.dialogService.addModalBusyState(); 
        
        return new Promise((resolve:(r:any) => any, reject) => {
        
            const request = new HTTPManagerPostRequest(this.loginServiceURI);
                    
            request.ignoreGlobalPostParams = true;
               
            const encodedCredentials = ConversionUtils.stringToBase64(
                ConversionUtils.stringToBase64(this._userName) + ',' + ConversionUtils.stringToBase64(this._password));
    
            request.parameters = { data: encodedCredentials };
            
            request.successCallback = (response) => {
            
                if (response !== '') {
        
                    response = JSON.parse(response);            
        
                    this._isLogged = true;
                    this._token = response.token;
                    this._operations = response.operations;
                    this.httpManager.setGlobalPostParam('token', response.token);
        
                    resolve(response);
                    
                } else {
        
                    this._clearUserAndToken();
        
                    reject(new Error());
                }
            };
            
            request.errorCallback = () => {

                this._clearUserAndToken();
                
                reject(new Error());               
            };
            
            request.finallyCallback = () => {
               
               this.dialogService.removeModalBusyState();
            };
        
            this.httpManager.execute(request);
        }); 
    }
    
    
    /**
     * Perform a request to the API service to create a new token for the user that is currently logged in.
     * 
     * @param options The parameters that will affect the token behaviour. To learn more about each option, please
     *        refer to the turbodepot UsersManager class createToken method documentation
     * 
     * @returns A promise that resolves with the created token string if the request is successful, or rejects 
     *          with an error (containing all the error response details) if the request fails.
     */
    createUserToken(options: {lifeTime?:number, useCount?:number, isLifeTimeRecycled?:boolean}) {
        
        return this.call(this.tokenCreationServiceURI, {options: options}, {resultFormat: 'STRING'});
    }
    

    /**
     * Checks if the user and password credentials are filled and not empty.
     * If any of the two values is empty, false will be returned
     */
    get isUserAndPswDefined(): boolean  {

        return !StringUtils.isEmpty(this._userName) && !StringUtils.isEmpty(this._password);
    }


    /**
     * Tells if the user name and psw that are specified on this service are currently logged or not. This means
     * also a token is active.
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
     * Checks if the currently logged user is allowed to perform the specified operation.
     * This will check the user permisions as defined on server side and return true if the operation is allowed
     * or false if not. We can then decide what to do (hide an app section, block a button, etc)
     * 
     * @param operation The name of the operation to check 
     * 
     * @returns True if the operation is allowed, false otherwise 
     */
    isUserAllowedTo(operation:string): boolean {
    
        return this._operations.includes(operation);
    }
        
    
    /**
     * Performs a standard request to an API service and returns a promise that resolves with the response data.
     * 
     * Following is an example of a call:
     * 
     *     this.apiService.call('users/user-create', this.userData, {handleErrors: false}).then(response => {
     *          
     *          console.log('Success:', response);
     *          
     *      }).catch(error => {
     *          
     *          console.error('Error:', error.message);
     *      });
     *
     * @param apiPath - A relative URL (based on the defined base root url) that defines the path to the service to call.
     *        For example: 'users/login'
     * @param parameters - An object containing key-value pairs that are sent as the request body.
     *        token parameter is not necessary, it is automatically appended
     * @param options An object defining several options for the request:
     *        resultFormat: 'JSON' by default. The expected format of the response. 
     *        busyState: Enabled by default. Enables or disables the busy state to lock user interaction while performing the http calls.
     *        handleErrors: Enabled by default. If set to true, an error dialog will be automatically shown when the call fails.
     *        If set to false, the promise will generate a reject error that must be handled by our code.
     *       
     * @returns A promise that resolves with the response data correctly parsed if the request is successful, or rejects 
     *          with an error (containing all the error response details) if the request fails.
     */
    call(apiPath:string, parameters = {}, options: {resultFormat?:'STRING'|'JSON', busyState?:boolean, handleErrors?:boolean} = {}){
    
        // Set the default values for non specified properties
        options.resultFormat = options.resultFormat ?? 'JSON';
        options.busyState = options.busyState ?? true;
        options.handleErrors = options.handleErrors ?? true;
        
        if(options.busyState){
           
           this.dialogService.addModalBusyState(); 
        }
        
        return new Promise((resolve:(r:any) => any, reject) => {
            
            // Create the request object
            const request = new HTTPManagerPostRequest(
                apiPath, 
                options.resultFormat === 'STRING' ? HTTPManagerPostRequest.STRING : HTTPManagerPostRequest.JSON
            );

            request.parameters = parameters;

            request.successCallback = (response: any) => {
                
                resolve(response);
            };

            request.errorCallback = (errorMsg, errorCode, response) => {

                if(options.handleErrors){
                
                    this.showErrorDialog(errorMsg, errorCode, response);
                
                }else{
                    
                    reject(new Error(errorMsg + ' ' + errorCode + ' ' + response));
                }                
            };
            
            request.finallyCallback = () => {
                
                if(options.busyState){
                                
                    this.dialogService.removeModalBusyState();
                }
            };
            
            this.httpManager.execute(request);
        });
    }
    
    
    /**
     * Performs a request to chain several api calls into a single http request, via the chain services mechanism of the turboframework API.
     * Returns a promise that resolves with an array of response objects. One for each of the request calls.
     *
     * @param apiPath - A relative URL (based on the defined base root url) that defines the path to the root of the chain services call.
     *        For example: 'turbosite/chain/chain-services'
     * @param services - An array of objects, were each object contains a valid structure for the chain services call. 
     *        Token parameter is not necessary, it is automatically appended
     * @param options An object defining several options for the request:
     *        busyState: Enables or disables the busy state to lock user interaction while performing the http calls. Enabled by default
     *        handleErrors: Enabled by default. If set to true, an error dialog will be automatically shown when the call fails.
     *        If set to false, the promise will generate a reject error that must be handled by our code.
     * 
     * @returns A promise that resolves with the response data correctly parsed if the request is successful, or rejects 
     *          with an error (containing all the error response details) if the request fails.
     */
    callChain(apiPath:string, services:{}[], options: {busyState?:boolean, handleErrors?:boolean} = {}){
    
        // Set the default values for non specified properties
        options.busyState = options.busyState ?? true;
        options.handleErrors = options.handleErrors ?? true;
        
        if(options.busyState){
           
           this.dialogService.addModalBusyState(); 
        }
                
        return new Promise((resolve:(r:any) => any, reject) => {
            
            const request = new HTTPManagerPostRequest(apiPath, HTTPManagerPostRequest.JSON);
                        
            request.ignoreGlobalPostParams = true;      

            request.parameters = { services: services };
            
            request.successCallback = (response:any[]) => {
            
                resolve(response);
            };      

            request.errorCallback = (errorMsg, errorCode, response) => {

                if(options.handleErrors){
                
                    this.showErrorDialog(errorMsg, errorCode, response);    
                
                }else{
                    
                    reject(new Error(errorMsg + ' ' + errorCode + ' ' + response));
                }                
            };
                        
            request.finallyCallback = () => {
                
                if(options.busyState){
                                
                    this.dialogService.removeModalBusyState();
                }
            };
            
            this.httpManager.execute(request);
        });
    }
    
    
    /**
     * Aux method to show an error dialog when a request fails and error handling is enabled
     */
    private showErrorDialog(errorMsg:string, errorCode:number, response:any){
        
        errorMsg = errorMsg + '\n\n' + response;
                                                    
        if(StringUtils.isEmpty(errorMsg)){
        
            errorMsg = 'Unknown error. Make sure Internet connection is available';    
        }

        this.dialogService.addDialog(DialogErrorComponent,
            {
                width:'50vw',
                texts: ['Error: ' + errorCode, errorMsg],
                options: ['Ok']
            }); 
    }
    
    
    /**
     * Perform the logout for the currently logged user
     *
     * @param options An object defining several options for the request:
     *        handleErrors: Enabled by default. If set to true, an error dialog will be automatically shown when the call fails.
     *        If set to false, the promise will generate a reject error that must be handled by our code.
     * 
     * @returns A promise that resolves correctly if the logout is correct, or rejects with an error (containing all the error 
     *          response details) if the request fails.
     */
    logout(options: {handleErrors?:boolean} = {}) {
        
        // Set the default values for non specified properties
        options.handleErrors = options.handleErrors ?? true;
                
        this.dialogService.addModalBusyState(); 
        
        return new Promise((resolve, reject) => {
                
            const request = new HTTPManagerPostRequest(this.logOutServiceURI);
                    
            request.parameters = { token: this._token };
            
            request.successCallback = () => {
            
                this._clearUserAndToken();
                
                resolve(undefined);
            };
            
            request.errorCallback = (errorMsg, errorCode, response) => {
                
                if(options.handleErrors){
                                
                    this.showErrorDialog(errorMsg, errorCode, response);    
                
                }else{
                    
                    reject(new Error(errorMsg + ' ' + errorCode + ' ' + response));
                }               
            };
            
            request.finallyCallback = () => {
               
               this.dialogService.removeModalBusyState();
            };
        
            this.httpManager.execute(request);
        }); 
    }
    
    
    /**
     * Aux methot to clear all the currently logged user data
     */
    private _clearUserAndToken(){
        
        this._userName = '';
        this._password = '';
        this._isLogged = false;
        this._token = '';
        this.httpManager.setGlobalPostParam('token', '-'); 
    }
}
