import { _decorator, Component, Enum, Node, Sprite, SpriteFrame } from 'cc';
import { Nullable } from '../misc/types';
import { HERO_RANK, HERO_TYPE } from '../data/GameData';
import { Hero } from '../model/Hero';

const { ccclass, property } = _decorator;


@ccclass('HeroRank')
class HeroRank {
    @property({ type: Enum(HERO_RANK) })
    rankType: Nullable<HERO_RANK> = HERO_RANK.s;  // Allow selecting HERO_RANK values in the editor

    @property(SpriteFrame)
    rankFrame: Nullable<SpriteFrame> = null
}
@ccclass('HeroType')
class HeroType {
    @property({ type: Enum(HERO_TYPE) })
    heroType: Nullable<HERO_TYPE> = HERO_TYPE.wind;  // Allow selecting HERO_RANK values in the editor

    @property(SpriteFrame)
    typeFrame: Nullable<SpriteFrame> = null
}

@ccclass('HeroSummonUI')
export class HeroSummonUI extends Component {
    @property(HeroRank)
    rankList: HeroRank[] = []; 

    @property(HeroType)
    typeList: HeroType[] = []; 

    @property(Sprite)
    heroSprite: Nullable<Sprite> = null

    @property(Sprite)
    rankSprite: Nullable<Sprite> = null

    @property(Sprite)
    typeSprite: Nullable<Sprite> = null

    private myData: Nullable<Hero> = null;

    initialiseHero(heroData : Hero){
        this.myData = heroData

        this.node.name = `Hero${this.myData.id}`
    }

    setRank(){
        if(this.rankSprite !== null){
            this.rankSprite.spriteFrame = this.getRankFrame()
        }
    }
    getRankFrame(): SpriteFrame | null {
        if(this.myData){
            for (const data of this.rankList) {
                if (HERO_RANK[data.rankType!] === this.myData.rank) {
                    return data.rankFrame;
                }
            }
        }
        return null;
    }

    setType(){
        if(this.typeSprite !== null){
            this.typeSprite.spriteFrame = this.getTypeFrame()
        }
    }
    getTypeFrame(): SpriteFrame | null {
        if(this.myData){
            for (const data of this.typeList) {
                if (HERO_TYPE[data.heroType!] === this.myData.type) {
                    return data.typeFrame;
                }
            }
        }
        return null;
    }
}

