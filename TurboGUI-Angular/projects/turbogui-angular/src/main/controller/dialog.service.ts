import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar, MatSnackBarConfig, MatDialogConfig } from '@angular/material';
import { ArrayUtils, ObjectUtils, StringUtils } from 'turbocommons-ts';


/**
 * Manages the application modal and non modal floating elements
 */
@Injectable()
export class DialogService {


    /**
     * Tells if the main application is currently showing a busy state that blocks all user interaction
     */
    private _isModalBusyState = false;


    /**
     * Check public getter for docs
     */
    private _isEnabled = true;


    /**
     * Contains a list of the dialogs that are currently visible to the user.
     * Each item in this list is a hash that is computed when dialog is created to uniquely identify it.
     *
     * Empty list means no dialogs are currently visible
     */
    private _activeDialogs: string[] = [];


    constructor(private readonly matDialog: MatDialog,
                private readonly matSnackBar: MatSnackBar) {

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
     * Show a non modal notification to the user
     */
    showSnackBar(message: string, action?: string | undefined, actionCallback: (() => void) | null = null, duration = 5000) {

        if (!this._isEnabled) {

            return;
        }

        const config = new MatSnackBarConfig();

        config.duration = action === undefined ? duration : duration * 2;
        config.verticalPosition = 'top';

        const snackBarRef = this.matSnackBar.open(message, action, config);

        if (action !== undefined && actionCallback !== null) {

            snackBarRef.onAction().subscribe(() => {

                actionCallback();
            });
        }
    }


    /**
     * Force the removal of any existing snack bar dialog.
     */
    closeSnackbar() {

        if (!this._isEnabled) {

            return;
        }

        this.matSnackBar.dismiss();
    }
}
