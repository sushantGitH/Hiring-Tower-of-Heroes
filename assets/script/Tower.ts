import { BehaviorSubject, interval, map, takeWhile, timer } from 'rxjs';
import { Hero } from './hero';

export class Tower {
    public currency$: BehaviorSubject<number>;
    public summonQueue$: BehaviorSubject<Hero[]>;
    public isSummoning$: BehaviorSubject<boolean>;
    public summonProgress$: BehaviorSubject<number>;

  private currentSummon$ = new BehaviorSubject<Hero | null>(null);

  constructor() {
    // Initialize the observables properly
    this.currency$ = new BehaviorSubject<number>(1000); // Set default currency value
    this.summonQueue$ = new BehaviorSubject<Hero[]>([]); // Start with an empty summon queue
    this.isSummoning$ = new BehaviorSubject<boolean>(false); // Not summoning initially
    this.summonProgress$ = new BehaviorSubject<number>(0); // Progress from 0 to 1 (0% to 100%)

        
    // Automatically process the queue when a summon is completed
    this.currentSummon$.subscribe(hero => {
      if (hero) {
        this.startSummon(hero);
      }
    });
  }

  // Add hero to the queue
  addHeroToQueue(hero: Hero) {
    const currentQueue = this.summonQueue$.value;
    if (currentQueue.length < 5) {
      this.summonQueue$.next([...currentQueue, hero]);
      if (!this.isSummoning$.value) {
        this.processQueue();
      }
    }
  }

  // Decrease currency after hiring
  deductCurrency(amount: number) {
    const currentCurrency = this.currency$.value;
    if (currentCurrency >= amount) {
      this.currency$.next(currentCurrency - amount);
    }
  }

  // Process the queue
  private processQueue() {
    const queue = this.summonQueue$.value;
    if (queue.length > 0) {
      this.currentSummon$.next(queue[0]);
    }
  }

  // Start summoning the hero
  private startSummon(hero: Hero) {
    this.isSummoning$.next(true);
    // timer(hero.summonCooldown * 1000).subscribe(() => {
    //   this.completeSummon(hero);
    // });




    const cooldown = hero.summonCooldown;
    const updateInterval = 100; // Update progress every 100ms

    // Using interval to update the progress bar
    interval(updateInterval).pipe(
      map(tick => (tick * updateInterval) / (cooldown * 1000)), // Calculate progress
      takeWhile(progress => progress <= 1) // Stop when progress reaches 1
    ).subscribe(progress => {
      this.summonProgress$.next(progress); // Update progress
      if (progress >= 1) {
        this.completeSummon(hero);
      }
    });


  }

  // Complete the summon
  private completeSummon(hero: Hero) {
    this.isSummoning$.next(false);
    const updatedQueue = this.summonQueue$.value.slice(1);
    this.summonQueue$.next(updatedQueue);
    this.currentSummon$.next(null);
    if (updatedQueue.length > 0) {
      this.processQueue();
    }
  }
}
