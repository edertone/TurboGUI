/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { ArrayUtils, NumericUtils } from 'turbocommons-ts';
import { Type, Injectable, ComponentFactoryResolver, Injector, ApplicationRef, Renderer2, RendererFactory2 } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { MatLegacySnackBar as MatSnackBar, MatLegacySnackBarConfig as MatSnackBarConfig } from '@angular/material/legacy-snack-bar';
import { BusyStateBaseComponent } from '../view/components/busy-state-base/busy-state-base.component';
import { ComponentPortal, DomPortalOutlet } from '@angular/cdk/portal';
import { DialogOptionsBaseComponent } from '../view/components/dialog-options-base/dialog-options-base.component';
import { DialogBaseComponent } from '../view/components/dialog-base/dialog-base.component';


/**
 * Manages the application modal and non modal floating elements
 */
@Injectable()
export class DialogService {


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
     * Contains a list of the dialogs that are currently visible to the user.
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
                private readonly componentFactoryResolver: ComponentFactoryResolver) {

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

        if (this._windowBeforeUnloadUnListen === null) {

            this._windowBeforeUnloadUnListen = this._renderer.listen('window', 'beforeunload',
                (event) => event.returnValue = true);
        }
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
     * must block the user interaction with the application.
     *
     * Note: We can modify the busy state component that is shown by this method. To do it, we must
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
                    this.componentFactoryResolver,
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
     * Remove the application busy state and restore it back to normal user interaction
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
     * @return void
     */
    addSnackBar(config: MatSnackBarConfig, message: string, action = '', actionCallback: (() => void) | null = null) {

        if (!this._isEnabled) {

            return;
        }

        if (this._isShowingSnackBar) {

            throw new Error('Trying to show a snackbar while another one is still visible');
        }

        this._isShowingSnackBar = true;

        const snackBarRef = this.matSnackBar.open(message, action === '' ? undefined : action, config);

        if (actionCallback !== null) {

            snackBarRef.onAction().subscribe(() => {

                actionCallback();
            });
        }
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
     * this library or extend DialogOptionsBaseComponent to create our own custom ones.
     *
     * @param width Specify the css value for the maximum width the dialog will have. As the dialog is responsive, the value will be automatically
              reduced if the available screen is not enough, and will reach the desired value otherwise. Note that height will be adapted to the contents
              of the dialog and cannot be specified here. We can set a pixels, % or any other css accepted value. For example: '400px', '50%', etc.
     * @param texts A list with strings containing the dialog texts, sorted by importance. When dialog has a title, this should
     *        be placed first, subtitle second and so (Each dialog may accept different kind of texts).
     * @param options A list of strings that will be used as button captions for each one of the accepted dialog options
     * @param dialogComponentClass A class for a component that extends DialogOptionsBaseComponent, which will be the
     *        dialog visual element that is shown to the user.
     * @param callback A function that will be called after the dialog is closed and will receive an object with the numeric index and value for
     *        the option that's been selected by the user.
     * @param modal True (default) if selecting an option is mandatory to close the dialog, false if the dialog can be closed
     *        by the user by clicking outside it 
     */
    addDialog(width: string,
              texts: string[],
              options: string[],
              dialogComponentClass: Type<DialogOptionsBaseComponent>,
              callback: null | ((selectedOption: {index:number, value: string}) => void) = null,
              modal = true) {

        if (!this._isEnabled) {

            return;
        }

        // Generate a string to uniquely identify this dialog on the list of active dialogs
        const dialogHash = texts.join('') + options.join('') + dialogComponentClass.name;

        // identical dialogs won't be allowed at the same time
        if (this._activeDialogs.includes(dialogHash)) {

            return;
        }

        const dialogRef = this.matDialog.open(dialogComponentClass, {
            width: width,
            disableClose: modal,
            autoFocus: false,
            closeOnNavigation: !modal,
            data: { texts: texts, options: options }
          });

        this._activeDialogs.push(dialogHash);
        this._activeDialogInstances.push(dialogRef);

        dialogRef.beforeClosed().subscribe((selectedOptionIndex: any) => {

            this._activeDialogs = ArrayUtils.removeElement(this._activeDialogs, dialogHash);
            this._activeDialogInstances = ArrayUtils.removeElement(this._activeDialogInstances, dialogRef);

            if (!NumericUtils.isInteger(selectedOptionIndex)) {

                if(modal){
                    
                    throw new Error(`dialogRef.close() expects int value`);

                }else{
                    
                    selectedOptionIndex = -1;
                }                
            }

            if (callback !== null) {

                let selectedOption = {index: selectedOptionIndex, value: ''};
                
                if(selectedOptionIndex >= 0){
                    
                    selectedOption.value = options[selectedOptionIndex];
                }

                (callback as ((selectedOption: {index:number, value: string}) => void))(selectedOption);
            }
        });
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

        for (const dialogRef of this._activeDialogInstances) {

            dialogRef.close(-1);
        }
        
        this._activeDialogs = [];
        this._activeDialogInstances = [];
    }


    /**
     * Block all the user interactions with the application (keyboard, touch, mouse, ...)
     */
    private _disableUserInteraction() {

        if (this._documentKeydownUnlisten === null) {

            this._documentKeydownUnlisten = this._renderer.listen('document', 'keydown', (event) => event.preventDefault());
        }

        if (this._documentMousedownUnlisten === null) {

            this._documentMousedownUnlisten = this._renderer.listen('document', 'mousedown', (event) => event.preventDefault());
        }

        if (this._documentPointerdownUnlisten === null) {

            this._documentPointerdownUnlisten = this._renderer.listen('document', 'pointerdown', (event) => event.preventDefault());
        }
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
            this._documentMousedownUnlisten = null;
        }
    }
}
