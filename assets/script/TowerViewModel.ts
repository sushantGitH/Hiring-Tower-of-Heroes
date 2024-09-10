import { BehaviorSubject } from 'rxjs';
import { Hero } from './hero';
import { Tower } from './Tower';

export class TowerViewModel {
    public availableHeroes$: BehaviorSubject<Hero[]>;
    public currentCurrency$: BehaviorSubject<number>;
    public summonQueue$: BehaviorSubject<Hero[]>;
    public isSummoning$: BehaviorSubject<boolean>;
    public summonProgress$: BehaviorSubject<number>;

  constructor(private tower: Tower) {
        // Assign the subjects from the Tower model to the ViewModel
        this.currentCurrency$ = tower.currency$;
        this.summonQueue$ = tower.summonQueue$;
        this.isSummoning$ = tower.isSummoning$;
        this.summonProgress$ = tower.summonProgress$; // Progress stream for the progress bar

        this.availableHeroes$ = new BehaviorSubject<Hero[]>([]); // Load available heroes later    
  }

  // Method to set available heroes
  setAvailableHeroes(heroes: Hero[]) {
    this.availableHeroes$.next(heroes);
  }

  // Select a hero and attempt to hire
  selectHero(hero: Hero) {
    if (this.currentCurrency$.value >= hero.cost && this.summonQueue$.value.length < 5) {
        this.tower.deductCurrency(hero.cost);  // Deduct the hero's price from currency
        this.tower.addHeroToQueue(hero);
    }
  }
}
