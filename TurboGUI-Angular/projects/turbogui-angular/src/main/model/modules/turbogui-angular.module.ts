import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BusyStateComponent } from '../../view/components/busy-state/busy-state.component';
import { DialogService } from '../../controller/dialog.service';
import { LocalizationService } from '../../controller/localization.service';
import { HTTPService } from '../../controller/http.service';
import { NotificationService } from '../../controller/notification.service';


/**
 * This file contains the root module that contains all the library declarations and exports.
 */
@NgModule({

    imports: [
        MatDialogModule,
        MatSnackBarModule,
        BrowserAnimationsModule
    ],

    declarations: [
        BusyStateComponent
    ],

    // Add here components that must be dynamically created at runtime
    entryComponents: [
        BusyStateComponent
    ],

    // Globally available singleton services are added here
    providers: [
        DialogService,
        LocalizationService,
        HTTPService,
        NotificationService
    ],

    exports: [
        BusyStateComponent
    ]
})

export class TurboGuiAngularModule { }
