import { _decorator, Component, Label, Node } from 'cc';
import { Nullable } from '../misc/types';
import { SignpostViewModel } from '../viewModel/SignPostViewModel';
import { gameManager } from '../manager/GameManager';
import { Hero } from '../model/Hero';
import { combineLatest, Subscription } from 'rxjs';

const { ccclass, property } = _decorator;

@ccclass('SignpostUI')
export class SignpostUI extends Component {

    @property(Node)
    counterPanel: Nullable<Node> = null;

    @property(Label)
    counterLabel: Nullable<Label> = null;

    private signPostViewModel!: SignpostViewModel;
    private subscriptions: Subscription[] = [];

    onLoad() {
        // Assuming GameManager has a reference to the SignpostViewModel
        this.signPostViewModel = gameManager.signpostViewModel;

        // Subscribe to summoned heroes list changes
        this.signPostViewModel.summonedHeroes$.subscribe((heroes) => {
            this.updateHeroesList(heroes);
        });


        // Spread the observables as individual arguments
        const combinedSubscription = combineLatest(
            this.signPostViewModel.summonCount$,
            this.signPostViewModel.signPostclicked$
        ).subscribe(([summonCount, isClicked]) => {
            this.updateSummonCount(summonCount, isClicked);
        });
        // Add the combined subscription to the list of subscriptions
        this.subscriptions.push(combinedSubscription);

    }

    // Update the summon count label
    updateSummonCount(count: number, isClicked: boolean) {
        if(this.counterPanel !== null){
            this.counterPanel.active = (count > 0 && !isClicked) ? true : false
        }
        if (this.counterLabel) {
            this.counterLabel.string = `${count}`;
        }
    }

    onSignPostClicked(){
        this.signPostViewModel.toggleSignPostButton()
    }

    // Update the heroes list in the scroll view
    updateHeroesList(heroes: Array<Hero>) {
        // // Clear the current content
        // this.heroesScrollView.content.removeAllChildren();

        // // Add each hero as a new item in the scroll view
        // heroes.forEach((heroName) => {
        //     const heroItem = instantiate(this.heroItemPrefab);
        //     const heroLabel = heroItem.getComponent(Label);
        //     if (heroLabel) {
        //         heroLabel.string = heroName;
        //     }
        //     this.heroesScrollView.content.addChild(heroItem);
        // });
    }
    onDestroy() {
      // Clean up subscriptions
      this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}

