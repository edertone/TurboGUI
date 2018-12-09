import { Injectable } from '@angular/core';
import { HTTPManager } from 'turbocommons-ts';


/**
 * Manages application http communications
 */
@Injectable()
export class HTTPService extends HTTPManager {


    constructor() {

        super(true);
    }
}
