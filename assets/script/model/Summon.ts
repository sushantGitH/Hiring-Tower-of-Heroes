import { BehaviorSubject, interval, map, takeWhile, timer } from 'rxjs';

export class Summon {
    public popupVisibility$: BehaviorSubject<boolean>;

    constructor() {
        // Initialize the observables properly
        this.popupVisibility$ = new BehaviorSubject<boolean>(false);
    }

    togglePopup(){
        const shown = !this.popupVisibility$.getValue();  // Use getValue() to retrieve the current value
        this.popupVisibility$.next(shown);
    }
}

