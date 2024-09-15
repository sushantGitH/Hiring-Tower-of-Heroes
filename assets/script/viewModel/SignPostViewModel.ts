import { Observable } from 'rxjs';
import { Signpost } from '../model/SignPost';
import { Hero } from '../model/Hero';

export class SignpostViewModel {
    private signpost: Signpost;

    // Observables that the view can subscribe to
    public summonCount$: Observable<number>;
    public summonedHeroes$: Observable<Array<Hero>>;
    public signPostclicked$: Observable<boolean>;

    constructor(signpost: Signpost) {
        this.signpost = signpost;

        // Subscribe to the model's observables
        this.summonCount$ = this.signpost.summonCount$.asObservable();
        this.summonedHeroes$ = this.signpost.summonedHeroes$.asObservable();
        this.signPostclicked$ = this.signpost.signPostclicked$.asObservable();
    }

    // Method to add summoned hero (from the view or other parts of the system)
    addHeroToSignpost(hero: Hero) {
        this.signpost.addSummonedHero(hero);
    }

    toggleSignPostButton(){
        this.signpost.toggleSignPostClicked()
    }

    getAllAvailabelHeroes(){
        return this.signpost.getAllAvailabelHeroes();
    }
}
