/**
 * Defines the data that is contained inside a GUI notification
 */
export class GUINotification {


    /**
     * Create a notification instance
     */
    constructor(name: string, type = '', data: any = null) {

        this.name = name;
        this.type = type;
        this.data = data;
    }


    /**
     * The name for this notification
     */
    name = '';


    /**
     * We can optionally define a type of notification in case the name is not enough
     * to uniquely identify it
     */
    type = '';


    /**
     * Additional data to send with the notification
     */
    data: any = null;
}
