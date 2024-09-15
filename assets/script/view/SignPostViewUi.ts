import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { Nullable } from '../misc/types';
import { SignpostViewModel } from '../viewModel/SignPostViewModel';
import { Subscription } from 'rxjs';
import { gameManager } from '../manager/GameManager';
import { Hero } from '../model/Hero';
import { HeroDescriptionUI } from './HeroDescriptionUI';

const { ccclass, property } = _decorator;

@ccclass('SignPostViewUi')
export class SignPostViewUi extends Component {

    @property(Node)
    popup: Nullable<Node> = null;

    @property(Node)
    scrollContent: Nullable<Node> = null;

    @property(Prefab)
    descriptionUi: Nullable<Prefab> = null;

    private signPostViewModel!: SignpostViewModel;
    private subscriptions: Subscription[] = [];

    onLoad() {
        // Assuming GameManager has a reference to the SignpostViewModel
        this.signPostViewModel = gameManager.signpostViewModel;

        // Subscribe to summoned heroes list changes
        const summonedHeroSub = this.signPostViewModel.summonedHeroes$.subscribe((heroes) => {
            this.onUpdateScrollViewContent(heroes);
        });
        this.subscriptions.push(summonedHeroSub);

        // Subscribe to sign post clicked
        const signPostClickedSub = this.signPostViewModel.signPostclicked$.subscribe((isClicked) => {
            this.showHeroSummonedList(isClicked);
        });
        this.subscriptions.push(signPostClickedSub);
    }

    onUpdateScrollViewContent(heroes : Hero[]){
        if(this.scrollContent !== null && this.descriptionUi !== null){
            this.scrollContent.removeAllChildren()

            for (let i = heroes.length-1; i >= 0; i--) {
                const heroDec = instantiate(this.descriptionUi)
                heroDec.setParent(this.scrollContent)
                const heroSelComp = heroDec.getComponent(HeroDescriptionUI)
                if(heroSelComp !== null)
                  heroSelComp.setHero(heroes[i]) 
            }
        }
    }

    showHeroSummonedList(isClicked: boolean){
        const availabelHeroes = this.signPostViewModel.getAllAvailabelHeroes()
        if(isClicked && availabelHeroes.length > 0){
            this.onUpdateScrollViewContent(availabelHeroes)
        }
        if(this.popup !== null)
            this.popup.active = isClicked
    }

    onSignPostCloseClicked(){
        this.signPostViewModel.toggleSignPostButton()
    }
}

