import { _decorator, Component, Label, Node } from 'cc';
import { combineLatest, Subscription } from 'rxjs';
import { Nullable } from '../../misc/types';
import { SignpostViewModel } from '../../viewModel/SignPostViewModel';
import { gameManager } from '../../manager/GameManager';

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

    onDestroy() {
      // Clean up subscriptions
      this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}

