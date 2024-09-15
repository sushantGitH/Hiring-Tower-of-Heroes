import { BehaviorSubject } from 'rxjs';
import { Hero } from './Hero';

export class Signpost {
    public summonCount$ = new BehaviorSubject<number>(0);
    public summonedHeroes$ = new BehaviorSubject<Array<Hero>>([]);  // Store hero names or IDs
    public signPostclicked$ = new BehaviorSubject<boolean>(false);

    // Add a summoned hero to the list
    addSummonedHero(hero: Hero) {
        const currentHeroes = this.summonedHeroes$.value;
        currentHeroes.push(hero);
        this.summonedHeroes$.next([...currentHeroes]); // Notify the ViewModel

        this.summonCount$.next(currentHeroes.length);  // Update the summon count
    }

    toggleSignPostClicked(){
        const isClickd = this.signPostclicked$.value;
        this.signPostclicked$.next(!isClickd);
    }

    getAllAvailabelHeroes(){
        return this.summonedHeroes$.value;
    }
}
