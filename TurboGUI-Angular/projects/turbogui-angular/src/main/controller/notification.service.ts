/**
 * TurboGUI is A library that helps with the most common and generic UI elements and functionalities
 *
 * Website : -> http://www.turbogui.org
 * License : -> Licensed under the Apache License, Version 2.0. You may not use this file except in compliance with the License.
 * License Url : -> http://www.apache.org/licenses/LICENSE-2.0
 * CopyRight : -> Copyright 2018 Edertone Advanded Solutions. https://www.edertone.com
 */

import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { GUINotification } from '../model/classes/GUINotification';
import { SingletoneStrictClass } from '../model/classes/SingletoneStrictClass';


/**
 * This is the main application event bus.
 * All global events that happen on the application are broadcasted by this service, and
 * can be listened by any application element who previously subscribed
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationService extends SingletoneStrictClass {


    /**
     * The Observable instance that handles subscriptions and notifications
     */
    private readonly _notifications = new Subject<GUINotification>();


	constructor(){
		
		super(NotificationService);
	}
	

    /**
     * used by other services or components to subscribe to all notifications that are generated by this service
     *
     * @param notificationHandler A method that will be used to receive each notification as a GUINotification instance
     *
     * @returns The new subscription object. Make sure to unsubscribe when not required anymore
     */
    subscribe(notificationHandler: (notification: GUINotification) => any) {

        return this._notifications.subscribe(notificationHandler);
    }


    /**
     * Launch a notification to anyone who may be listening
     *
     * @param notification A notification instance to launch
     */
    send(notification: GUINotification) {

        this._notifications.next(notification);
    }


    /**
     * End a previously initiated subscription
     *
     * @param subscription A previously created subscription instance from which we want to unsubscribe
     */
    unsubscribe(subscription: Subscription) {

        return subscription.unsubscribe();
    }
}
