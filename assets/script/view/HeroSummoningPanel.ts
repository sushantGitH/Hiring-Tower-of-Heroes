import { _decorator, Component, Node } from 'cc';
import { Nullable } from '../misc/types';
import { HeroSummonUI } from './HeroSummonUI';
import { Hero } from '../model/Hero';
const { ccclass, property } = _decorator;

@ccclass('HeroSummoningPanel')
export class HeroSummoningPanel extends Component {

    @property(Node)
    progressNode: Nullable<Node> = null;

    @property(HeroSummonUI)
    heroUi: Nullable<HeroSummonUI> = null;

    onLoad() {
        this.resetPanel(false)
    }

    setHero(heroData : Hero){
        this.resetPanel(true)

        if(this.heroUi != null){
            this.heroUi.initialiseHero(heroData)
        }
    }

    resetPanel(active : boolean = true){
        if(this.progressNode !== null)
            this.progressNode.active = active

        if(this.heroUi !== null)
            this.heroUi.node.active = active
    }
}

