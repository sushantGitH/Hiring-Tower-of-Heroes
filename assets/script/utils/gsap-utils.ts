import {game, Game, IVec3Like, Vec3} from 'cc'
import {gsap} from "gsap-cc3";
import {MotionPathPlugin} from 'gsap-cc3/MotionPathPlugin'
import { getXYZ, putVec3, putXYZ } from '../misc/temporary';
import { ObjectUtils } from './object-utils';

gsap.registerPlugin(MotionPathPlugin)

export interface ITweenExtras {
    releaseVec3?: boolean
}

export class GsapUtils {
    static ToVec3<T extends (vec3: Vec3) => void>(from: Vec3, to: Vec3, func: T, context: any, vars: gsap.TweenVars, extras?: ITweenExtras) {
        Object.assign<gsap.TweenVars, gsap.TweenVars>(vars, {
            x: to.x,
            y: to.y,
            z: to.z,
            overwrite: true,
            onUpdate: () => func.call(context, from)
        })
        const t = gsap.to(from, vars)
        if (extras) {
            if (extras.releaseVec3) {
                t.then(() => putVec3(from, to))
            }
        }
        return t
    }

    static ToVec3Motion<T extends (x: number, y: number, z: number) => void>(path: Vec3[], func: T, context: any, vars: gsap.TweenVars, extras?: ITweenExtras) {
        const temp = getXYZ()
        const pathMotion = this.arrayToPathMotion(path)

        vars = ObjectUtils.Extend(true, {
            motionPath: {
                path: pathMotion,
                fromCurrent: false
            },
            onUpdate: () => func.call(context, temp.x, temp.y, temp.z)
        }, vars)

        const t = gsap.to(temp, vars)
        t.then(() => putXYZ(temp, ...pathMotion))
        if (extras) {
            if (extras.releaseVec3) {
                t.then(() => putVec3(...path))
            }
        }
        return t
    }

    static Countdown<T extends (value: number) => void>(from: number, to: number, func: T, context: any) {
        const sign = Math.sign(to - from)

        return gsap.to(this, {
            duration: 1,
            repeat: Math.abs(to - from),
            onRepeat: () => {
                from += sign
                func.call(context, from)
            }
        })
    }

    private static arrayToPathMotion(array: IVec3Like[]) {
        const arr = []
        for (let i = 0; i < array.length; i++) {
            const temp = getXYZ()
            temp.x = array[i].x
            temp.y = array[i].y
            temp.z = array[i].z
            arr.push(temp)
        }
        return arr
    }
}

let intervalID = 0
export const registerGSAPHidden = () => {
    game.on(Game.EVENT_SHOW, GSAPOnShow)
    game.on(Game.EVENT_HIDE, GSAPOnHide)
}
export const unregisterGSAPHidden = () => {
    game.off(Game.EVENT_SHOW, GSAPOnShow)
    game.off(Game.EVENT_HIDE, GSAPOnHide)
}

const GSAPOnShow = () => {
    clearInterval(intervalID)
    gsap.ticker.lagSmoothing(500, 33); // restore lag smoothing
}

const GSAPOnHide = () => {
    clearInterval(intervalID);
    gsap.ticker.lagSmoothing(0); // keep the time moving forward (don't adjust for lag)
    intervalID = setInterval(gsap.ticker.tick, 500);
}