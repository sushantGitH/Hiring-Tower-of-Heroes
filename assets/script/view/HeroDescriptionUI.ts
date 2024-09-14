import { _decorator, Component, Label, Node } from 'cc';
import { HeroSummonUI } from './HeroSummonUI';
import { Nullable } from '../misc/types';
import { Hero } from '../model/Hero';

const { ccclass, property } = _decorator;

@ccclass('HeroDescriptionUI')
export class HeroDescriptionUI extends Component {

    @property(HeroSummonUI)
    heroUi: Nullable<HeroSummonUI> = null;


    @property(Label)
    heroNameLabel: Nullable<Label> = null;
    @property(Label)
    heroDescLabel: Nullable<Label> = null;
    @property(Label)
    heroRankLabel: Nullable<Label> = null;
    @property(Label)
    heroTypeLabel: Nullable<Label> = null;
    @property(Label)
    heroCostLabel: Nullable<Label> = null;
    @property(Label)
    heroSummoningTimeLabel: Nullable<Label> = null;

    setHero(heroData : Hero){

        if(this.heroUi != null){
            this.heroUi.initialiseHero(heroData)
        }

        if(this.heroNameLabel !== null && heroData.name)
            this.heroNameLabel.string = heroData.name

        if(this.heroDescLabel !== null && heroData.description)
            this.heroDescLabel.string = heroData.description

        if(this.heroRankLabel !== null && heroData.rank)
            this.heroRankLabel.string = 'Rank - '+heroData.rank+' '

        if(this.heroTypeLabel !== null && heroData.type)
            this.heroTypeLabel.string = 'Type - '+heroData.type+' '

        if(this.heroCostLabel !== null && heroData.cost)
            this.heroCostLabel.string = 'Cost - '+(heroData.cost).toString()+' '

        if(this.heroSummoningTimeLabel !== null && heroData.summonCooldown)
            this.heroSummoningTimeLabel.string = 'Summon Time - '+(heroData.summonCooldown).toString()+'s '
    }
}

