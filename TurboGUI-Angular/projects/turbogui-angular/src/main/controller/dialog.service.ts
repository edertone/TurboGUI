import { Injectable, ComponentFactoryResolver, Injector, ApplicationRef } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { BusyStateComponent } from '../view/components/busy-state/busy-state.component';
import { ComponentPortal, DomPortalHost } from '@angular/cdk/portal';


/**
 * Manages the application modal and non modal floating elements
 */
@Injectable()
export class DialogService {


    /**
     * Check public getter for docs
     */
    private _isEnabled = true;


    /**
     * Tells if the main application is currently showing a busy state that blocks all user interaction
     */
    private _isShowingBusyState = false;


    /**
     * A reference to the modal busy state component that is initialized only the first time it is called
     */
    private _modalBusyStateComponent: ComponentPortal<BusyStateComponent> | null = null;


    /**
     * A reference to the modal busy state container where the component will be added
     */
    private _modalBusyStateHost: DomPortalHost | null = null;


    /**
     * Tells if the manager is currently showing a snackbar element or not
     */
    private _isShowingSnackBar = false;


    constructor(private readonly matSnackBar: MatSnackBar,
                private readonly injector: Injector,
                private readonly applicationRef: ApplicationRef,
                private readonly componentFactoryResolver: ComponentFactoryResolver) {

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
     * Change the application visual appearance so the user perceives that the application is
     * currently busy. While modal busy state is enabled, no user input is possible neither via
     * keyboard, mouse or touch. Use this state when performing server requests or operations that
     * must block the user interaction with the application.
     */
    addModalBusyState() {

        if (!this._isEnabled) {

            return;
        }

        // Dynamically create the busy state component reference if this is the first time
        if (this._modalBusyStateComponent === null) {

            // Create a Portal based on the LoadingSpinnerComponent
            this._modalBusyStateComponent = new ComponentPortal(BusyStateComponent);

            // Create a PortalHost with document.body as its anchor element
            this._modalBusyStateHost = new DomPortalHost(
                    document.body,
                    this.componentFactoryResolver,
                    this.applicationRef,
                    this.injector);
        }

        (this._modalBusyStateHost as DomPortalHost).attach(this._modalBusyStateComponent);

        this._isShowingBusyState = true;
    }


    /**
     * Tells if the application is currently locked in a busy state
     */
    get isShowingBusyState() {

        return this._isShowingBusyState;
    }


    /**
     * Remove the application busy state and restore it back to normal user interaction
     */
    removeModalBusyState() {

        if (!this._isEnabled) {

            return;
        }

        if (this._modalBusyStateComponent !== null) {

            (this._modalBusyStateHost as DomPortalHost).detach();
        }

        this._isShowingBusyState = false;
    }


    /**
     * Show a non modal snackbar notification to the user (Only one snack-bar can ever be opened at the same time).
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
}
