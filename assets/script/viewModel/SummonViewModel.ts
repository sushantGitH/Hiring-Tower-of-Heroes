import { BehaviorSubject } from 'rxjs';
import { Summon } from '../model/Summon';

export class SummonViewModel {
    public popupVisibility$: BehaviorSubject<boolean>;

    private isPopupAnimating: boolean = false

    constructor(private summon: Summon) {
        // Assign the subjects from the Summon model to the ViewModel
        this.popupVisibility$ = summon.popupVisibility$;
    }

    showPopup(){
        if(this.isPopupAnimating) return
        this.isPopupAnimating = true
        this.summon.togglePopup()
    }

    resetPopupAnimating(){
        this.isPopupAnimating = false
    }

}
