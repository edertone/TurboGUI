/**
 * Defines the data that is contained inside a GUI notification
 */
export class GUINotification {


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
     * An optional type to categorize this notification in case the name is not enough
     * to uniquely identify it
     */
    type = '';


    /**
     * Additional data to send with the notification
     */
    data: any = null;
}
