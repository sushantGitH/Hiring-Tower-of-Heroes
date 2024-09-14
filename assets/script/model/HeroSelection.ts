import { BehaviorSubject, interval, map, takeWhile, timer } from 'rxjs';
import { Hero } from './Hero';

export class HeroSelection {
    public popupData$: BehaviorSubject<Hero | null>;

    constructor() {
        // Initialize the observables properly
        this.popupData$ = new BehaviorSubject<Hero | null>(null);
    }

    showPopup(heroData: Hero) {
        this.popupData$.next(heroData);  // Send the hero data
    }

    hidePopup() {
        this.popupData$.next(null); // Hide the popup and clear data
    }
}

