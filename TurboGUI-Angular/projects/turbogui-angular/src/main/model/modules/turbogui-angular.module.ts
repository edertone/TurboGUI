/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { NgModule } from '@angular/core';
import { ElementCreatedDirective } from '../../view/directives/ElementCreatedDirective';
import { ElementDestroyedDirective } from '../../view/directives/ElementDestroyedDirective';
import { AutoFocusOnDisplayDirective } from '../../view/directives/AutoFocusOnDisplayDirective';
import { AutoSelectTextOnFocusDirective } from '../../view/directives/AutoSelectTextOnFocusDirective';


/**
 * This file contains the root module that contains all the library declarations and exports.
 */
@NgModule({

    imports: [
    ],

    declarations: [
        ElementCreatedDirective,
        ElementDestroyedDirective,
        AutoFocusOnDisplayDirective,
        AutoSelectTextOnFocusDirective
    ],

    providers: [
    ],

    exports: [
        ElementCreatedDirective,
        ElementDestroyedDirective,
        AutoFocusOnDisplayDirective,
        AutoSelectTextOnFocusDirective
    ]
})

export class TurboGuiAngularModule { }
