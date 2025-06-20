/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { take } from 'rxjs/operators';
import { ArrayUtils, NumericUtils } from 'turbocommons-ts';
import { Type, Injectable, Injector, ApplicationRef, Renderer2, RendererFactory2, ViewContainerRef, EnvironmentInjector } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { BusyStateBaseComponent } from '../view/components/busy-state-base/busy-state-base.component';
import { ComponentPortal, DomPortalOutlet } from '@angular/cdk/portal';
import { DialogBaseComponent } from '../view/components/dialog-base/dialog-base.component';
import { DialogDateSelectionComponent } from '../view/components/dialog-date-selection/dialog-date-selection.component';
import { SingletoneStrictClass } from '../model/classes/SingletoneStrictClass';


/**
 * Manages the application modal and non modal floating elements
 */
@Injectable({
  providedIn: 'root',
})
export class DialogService extends SingletoneStrictClass {


    /**
     * Used to modify the busy state component that is shown by default by the addModalBusyState() method.
     *
     * @see this.addModalBusyState()
     */
    customBusyStateComponentClass: Type<BusyStateBaseComponent> = BusyStateBaseComponent;


    /**
     * Check public getter for docs
     */
    private _isEnabled = true;


    /**
     * Tells if the main application is currently showing a busy state that blocks all user interaction
     */
    private _isShowingBusyState = false;


    /**
     * A reference to the modal busy state component that is initialized only the first time it is called.
     *
     * (To append the busy state dynamically, we use the Portal concept from the angular material library)
     */
    private _componentPortal: ComponentPortal<BusyStateBaseComponent> | null = null;


    /**
     * A reference to the modal busy state container where the component will be added
     */
    private _modalBusyStateHost: DomPortalOutlet | null = null;


    /**
     * Tells if the manager is currently showing a snackbar element or not
     */
    private _isShowingSnackBar = false;


    /**
     * Contains a list of the dialogs (MODAL AND NON MODAL) that are currently visible to the user.
     * Each item in this list is a hash that is computed when dialog is created to uniquely identify it.
     *
     * Empty list means no dialogs are currently visible
     */
    private _activeDialogs: string[] = [];


    /**
     * Contains a list with all the MatDialog instances that are currently visible to the user.
     * The list uses the same order as the list of _activeDialogs hash values
     */
    private _activeDialogInstances: MatDialogRef<DialogBaseComponent>[] = [];


    /**
     * Counts the number of dialogs that are currently open and that can be closed by the user by navigating with the browser
     */
    private _activeCloseableDialogs = 0;


    /**
     * Used to store the initialized Renderer 2 instance that is used by this class
     */
    private readonly _renderer: Renderer2;


    /**
     * Method that is used to delete the window beforeunload event listener once not used anymore
     */
    private _windowBeforeUnloadUnListen: (() => void) | null = null;


    /**
     * Method that is used to delete the document keydown event listener once not used anymore
     */
    private _documentKeydownUnlisten: (() => void) | null = null;


    /**
     * Method that is used to delete the document mousedown event listener once not used anymore
     */
    private _documentMousedownUnlisten: (() => void) | null = null;


    /**
     * Method that is used to delete the document pointerdown event listener once not used anymore
     */
    private _documentPointerdownUnlisten: (() => void) | null = null;


    constructor(rendererFactory: RendererFactory2,
                private readonly matSnackBar: MatSnackBar,
                private readonly matDialog: MatDialog,
                private readonly injector: Injector,
                private readonly applicationRef: ApplicationRef,
                private readonly environmentInjector: EnvironmentInjector) {

		super(DialogService);

        this._renderer = rendererFactory.createRenderer(null, null);
    }


    /**
     * Tells if this dialog service is enabled or not. If dialog service is disabled, none of it's features will work
     * This is used to block all dialog features normally when shutting down the application
     *
     * Use with caution. When this is set to false, dialog service stops working.
     */
    set isEnabled(v: boolean) {

        if (v === this._isEnabled) {

            return;
        }

        this._isEnabled = v;
    }


    /**
     * Enables a warning that will be shown to the user when he/she tries to close the application.
     * This warning will prompt the user to continue with the exit process or cancel it.
     * The specific texts of this message are a generic ones and cannot be changed.
     *
     * IMPORTANT: This method must be called after the main application has been initialized in order to work,
     * otherwise it will do nothing.
     */
    addCloseApplicationWarning() {

        this._windowBeforeUnloadUnListen ??= this._renderer.listen('window', 'beforeunload', (event) => event.returnValue = true);
    }


    /**
     * Remove the close application warning message if previously assigned
     */
    removeCloseApplicationWarning() {

        if (this._windowBeforeUnloadUnListen !== null) {

            this._windowBeforeUnloadUnListen();
            this._windowBeforeUnloadUnListen = null;
        }
    }


    /**
     * Change the application visual appearance so the user perceives that the application is
     * currently busy. While modal busy state is enabled, no user input is possible neither via
     * keyboard, mouse or touch. Use this state when performing server requests or operations that
     * must block the user interaction with the application. To allow user interaction again, you must
     * call removeModalBusyState()
     *
     * Notice: We can modify the busy state visual component that is shown by this method. To do it, we must
     * set this.customBusyStateComponentClass property with our own custom busy state component class. (We can do it at
     * our main application component constructor for example). Our custom component must extend the
     * BusyStateBaseComponent one to add its own visual appearance.
     *
     * @see this.customBusyStateComponentClass
     */
    addModalBusyState() {

        if (!this._isEnabled || this._isShowingBusyState) {

            return;
        }

        this._disableUserInteraction();

        // Dynamically create the busy state component reference if this is the first time
        if (this._componentPortal === null) {

            this._componentPortal = new ComponentPortal(this.customBusyStateComponentClass);

            // Create a PortalHost with document.body as its anchor element
            this._modalBusyStateHost = new DomPortalOutlet(
                    document.body,
                    this.environmentInjector,
                    this.applicationRef,
                    this.injector);
        }

        (this._modalBusyStateHost as DomPortalOutlet).attach(this._componentPortal);

        this._isShowingBusyState = true;
    }


    /**
     * Tells if the application is currently locked in a modal busy state (caused by an addModalBusyState() call)
     */
    get isShowingBusyState() {

        return this._isShowingBusyState;
    }


    /**
     * Cancel the application busy state and restore it back to normal so user interaction is allowed again
     */
    removeModalBusyState() {

        if (!this._isEnabled || !this._isShowingBusyState) {

            return;
        }

        if (this._componentPortal !== null) {

            (this._modalBusyStateHost as DomPortalOutlet).detach();
        }

        this._enableUserInteraction();

        this._isShowingBusyState = false;
    }
    
    
    /**
     * TODO - adapt from TS version
     */
    addToolTip() {

        // TODO - adapt from TS version
    }


    /**
     * Show a non modal snackbar notification to the user (Only one snack-bar can ever be opened at the same time).
     *
     * Snackbars inform users of a process that an app has performed or will perform. They appear temporarily, towards the bottom or top of the screen.
     * They shouldn’t interrupt the user experience, and they don’t require user input to disappear.
     *
     * @param config A MatSnackBarConfig instance with the customizations we want for this snackbar
     * @param message The message to show on the snackbar
     * @param action If not empty, the text to place on the snackbar confirmation button
     * @param actionCallback A method to execute once the user clicks into the action button.
     *
     * @return A promise that will be resolved once the snackbar is closed.
     */
    addSnackBar(config: MatSnackBarConfig, message: string, action = '') {

        if (!this._isEnabled) {
            
            return Promise.reject(new Error('Dialog service is disabled'));
        }

        if (this._isShowingSnackBar) {
            
            throw new Error('Trying to show a snackbar while another one is still visible');
        }

        this._isShowingSnackBar = true;

        return new Promise((resolve) => {
            
            const snackBarRef = this.matSnackBar.open(message, action === '' ? undefined : action, config);

            // Handle action button click
            snackBarRef.onAction().pipe(take(1)).subscribe(() => {
                this._isShowingSnackBar = false;
                resolve(true);
            });

            // Handle dismiss
            snackBarRef.afterDismissed().pipe(take(1)).subscribe(() => {
                this._isShowingSnackBar = false;
                resolve(false);
            });
        });
    }


    /**
     * Tells if the application is currently showing a snackbar or not
     */
    get isShowingSnackBar() {

        return this._isShowingSnackBar;
    }


    /**
     * Force the removal of the snack bar dialog if it exists.
     *
     * If no snackbar is currently visible, this method will do nothing
     */
    removeSnackBar() {

        if (!this._isEnabled || !this._isShowingSnackBar) {

            return;
        }

        this.matSnackBar.dismiss();

        this._isShowingSnackBar = false;
    }


    /**
     * Show a dialog with one or more options that can be used to close it. We can use any of the predefined dialog types that are bundled with
     * this library or extend DialogBaseComponent to create our own custom ones.
     *
     * @param dialogComponentClass A class for a component that extends DialogBaseComponent, which will be the dialog that is shown to the user.
     * @param properties An object containing the different visual and textual options that this dialog allows.
     *                   IMPORTANT: texts, options and data values need to be read at the dialog component by declaring "@Inject(MAT_DIALOG_DATA) public data: any"
     *                   at the dialog component constructor. This data object will contain the texts, options and data properties
     *  
     *            - id: The html unique identifier that the dialog will have once created. If not specified, no id will be explicitly set
     *            - width: 50% by default. Specify the css value for the default dialog width. As the dialog is responsive, the value will be automatically
     *              reduced if the available screen is not enough, and will reach the desired value otherwise. We can set any css unit like pixels, 
     *              %, vh, vw, or any other. For example: '400px', '50%', etc.
     *            - maxWidth: Defines the maximum width that the dialog will have. We can specify it in % or vw, just like is done in
     *              css. By default it is defined as 96vw, which will fit 96% of the viewport on small devices
     *            - height: Unset by default. Specify the css value for the dialog height.
     *            - maxHeight: Defines the maximum height that the dialog will have. We can specify it in % or vh, just like is done in
         *          css. By default it is defined as 96vh, which will fit 96% of the viewport
     *            - modal: True (default) if selecting an option is mandatory to close the dialog, false if the dialog can be closed
     *              by the user clicking outside it 
     *            - closeOnNavigation: Tells if the dialog should be closed when the user navigates with the browser. By default is true for non modal and false for modal dialogs. 
     *            - texts: A list with strings containing the dialog texts, sorted by importance. When dialog has a title, this should
     *              be placed first, subtitle second and so (Each dialog may accept a different custom number of texts).
     *              (add "@Inject(MAT_DIALOG_DATA) public data: any" to dialog constructor and read it with data.texts)
     *            - options: A list of strings that will be used as button captions for each one of the accepted dialog options 
     *              (add "@Inject(MAT_DIALOG_DATA) public data: any" to dialog constructor and read it with data.options)
     *            - data: An object to pass any extra data we want to the dialog.
     *              (add "@Inject(MAT_DIALOG_DATA) public data: any" to dialog constructor and read it with data.data)
     *            - viewContainerRef: This is important if we want to propagate providers from a parent component to this dialog. We must specify 
	 *              this reference to make sure the same services injected on the parent are available too at the child dialog 
     * 
     * @return A promise that will be resolved once the dialog is closed.
     *         The promise will receive a selection object with two properties which will correspond to the index and value from the options 
     *         array that's selected by the user. If no option selected, index will be -1 and value null
     */
    addDialog(dialogComponentClass: Type<DialogBaseComponent>,
              properties: {id?: string,
                           width?: string,
                           maxWidth?: string,
                           height?: string,
                           maxHeight?: string,
                           modal?: boolean,
                           closeOnNavigation?: boolean,
                           texts?: string[],
                           options?: string[],
                           data?: any,
                           viewContainerRef?: ViewContainerRef}): Promise<{index: number, value?: any}> {

        if (!this._isEnabled) {
            
            return Promise.reject(new Error('Dialog service is disabled'));
        }
        
        return new Promise((resolve) => {
            
            // Set the default values for non specified properties
            properties.modal = properties.modal ?? true;
            properties.closeOnNavigation = properties.closeOnNavigation ?? !properties.modal;
            properties.texts = properties.texts ?? [];
            properties.options = properties.options ?? [];
            properties.data = properties.data ?? {};

            // Generate a string to uniquely identify this dialog on the list of active dialogs
            // A dialog is considered as unique if the dialog id and texts are exactly the same. We do not take options into consideration
            // as there may be dialogs with a big amount of options available.
            let className = (dialogComponentClass as any).DIALOG_CLASS_NAME;
            
            if(className === '') {
                
                throw new Error(`The static property DIALOG_CLASS_NAME is not defined or is empty for this dialog component (${dialogComponentClass})`);     
            }
            
            const dialogHash = className + properties.texts.join('');

        	// identical dialogs won't be allowed at the same time
            if (this._activeDialogs.includes(dialogHash)) {
                
                return resolve({index: -1});
            }

            let dialogRefConfig:any = {
                width: properties.width ?? "50%",
                maxWidth: properties.maxWidth ?? "96vw",
                maxHeight: properties.maxHeight ?? "96vh",
                disableClose: properties.modal,
                autoFocus: false,
                closeOnNavigation: properties.closeOnNavigation,
                viewContainerRef: properties.viewContainerRef,
                data: { texts: properties.texts, options: properties.options, data: properties.data }
            };                      
            
            // Dialog height will only be set if it is specified on properties
            if(properties.height && properties.height !== undefined) {
               
                dialogRefConfig['height'] = properties.height; 
            }
            
            const dialogRef = this.matDialog.open(dialogComponentClass, dialogRefConfig);   

            // Push a new state to handle browser navigation to close the dialog
            if(properties.closeOnNavigation && this._activeCloseableDialogs === 0){
                
                history.pushState({ dialogOpen: true }, '');
            }
            
			// Assign the dialog ID only if specifically set on properties
            if(properties.id && properties.id !== undefined) {
                
                dialogRef.id = properties.id;
            }
            
            this._activeDialogs.push(dialogHash);
            this._activeDialogInstances.push(dialogRef);
            
            if(properties.closeOnNavigation) {
                
                this._activeCloseableDialogs += 1;
            }

            dialogRef.beforeClosed().pipe(take(1)).subscribe((selection: {index: number, value?: any}) => {
                
                this._activeDialogs = ArrayUtils.removeElement(this._activeDialogs, dialogHash);
                this._activeDialogInstances = ArrayUtils.removeElement(this._activeDialogInstances, dialogRef);

                if(properties.closeOnNavigation) {
                    
                    // Remove dialog state from browser history
                    if (this._activeCloseableDialogs === 1 && window.history.state?.dialogOpen) {
                        
                        history.back();
                    }
                    
                    this._activeCloseableDialogs -= 1;
                }
                
                if(!properties.modal && selection === undefined) {
                    
                    selection = { index: -1 };
                    
                } else if (!NumericUtils.isInteger(selection.index)) {
                    
                    throw new Error(`closeDialog() expects index to be an integer`);               
                }

                if(selection.index >= 0 && selection.value === null) {
                    
                    selection.value = properties.options![selection.index];
                }

                resolve(selection);
            });
        });
    }
    
    
    /**
     * Show a dialog with a calendar to let the user pick a date.
     *
     * @param properties An object containing the different visual and textual options that this dialog allows:
     *            - id: The html unique identifier that the dialog will have once created. If not specified, no id will be explicitly set
     *            - width: Specify the css value for the default dialog width. As the dialog is responsive, the value will be automatically
     *              reduced if the available screen is not enough, and will reach the desired value otherwise. We can set any css unit like pixels, 
     *              %, vh, vw, or any other. For example: '400px', '50%', etc.
     *            - maxWidth: Defines the maximum width that the dialog will have regarding the viewport. We can specify it in % or vw, just like is done in
     *              css. By default it is defined as 96vw, which will fit 96% of the viewport on small devices
     *            - height: TODO docs
     *            - maxHeight: TODO docs
     *            - modal: True (default) if selecting an option is mandatory to close the dialog, false if the dialog can be closed
     *              by the user clicking outside it 
     *            - title: An optional dialog title
     *            - viewContainerRef: This is important to propagate providers from a parent component to this dialog. We must specify 
	 *              this reference to make sure the same services injected on the parent are available too at the child dialog
     * 
     * @returns A Promise that resolves to a Date() object selected by the user or null if no selection was made 
     */
    async addDateSelectionDialog(properties: {id?: string,
                                              width?: string,
                                              maxWidth?: string,
                                              height?: string,
                                              maxHeight?: string,
                                              modal?: boolean,
                                              title?: string,
                           			          viewContainerRef: ViewContainerRef}): Promise<Date|null> {

        if (!this._isEnabled) {
            
            return null;
        }

        const selection = await this.addDialog(DialogDateSelectionComponent, {
            id: properties.id ?? undefined,
            width: properties.width ?? "50%",
            maxWidth: properties.maxWidth ?? "96vw",
            height: properties.height ?? "auto",
            maxHeight: properties.maxHeight ?? "92vw",
            modal: properties.modal ?? false,
            texts: [properties.title ?? ''],
            viewContainerRef: properties.viewContainerRef
        });

        return selection.index === -1 ? null : (selection.value as Date);
    }
    
    
    /**
     * Force the removal of all the dialogs that are currently visible.
     *
     * If no dialogs are currently visible, this method will do nothing
     */
    removeAllDialogs() {

        if (!this._isEnabled) {

            return;
        }
        
        // If there are dialogs that should close on navigation and a history state was pushed, pop it
        if (this._activeCloseableDialogs > 0 && window.history.state?.dialogOpen) {
            
            history.back();
        }

        for (const dialogRef of this._activeDialogInstances) {

            dialogRef.close({index:-1});
        }
        
        this._activeDialogs = [];
        this._activeDialogInstances = [];
        this._activeCloseableDialogs = 0;
    }


    /**
     * TODO - translate from TS version
     */
//    addSideNav(){
//
//    }


    /**
     * TODO - translate from TS version
     */
//    get isShowingSideNav(){
//
//    }


    /**
     * TODO - translate from TS version
     */
//    removeSideNav(){
//
//    }

    /**
     * Block all the user interactions with the application (keyboard, touch, mouse, ...)
     */
    private _disableUserInteraction() {

        this._documentKeydownUnlisten ??= this._renderer.listen('document', 'keydown', (event) => event.preventDefault());

        this._documentMousedownUnlisten ??= this._renderer.listen('document', 'mousedown', (event) => event.preventDefault());

        this._documentPointerdownUnlisten ??= this._renderer.listen('document', 'pointerdown', (event) => event.preventDefault());
    }


    /**
     * Restore the user interactions that were previously disabled with _disableUserInteraction method
     */
    private _enableUserInteraction() {

        if (this._documentKeydownUnlisten !== null) {

            this._documentKeydownUnlisten();
            this._documentKeydownUnlisten = null;
        }

        if (this._documentMousedownUnlisten !== null) {

            this._documentMousedownUnlisten();
            this._documentMousedownUnlisten = null;
        }

        if (this._documentPointerdownUnlisten !== null) {

            this._documentPointerdownUnlisten();
            this._documentPointerdownUnlisten = null;
        }
    }
}
