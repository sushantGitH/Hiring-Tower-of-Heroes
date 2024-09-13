import {IVec3Like, Vec3} from 'cc'

const listVec3: Vec3[] = []
const listXYZ: IVec3Like[] = []

export const getVec3 = () => {
    let v = listVec3.pop()
    if (v === undefined)
        v = new Vec3()
    return v
}

export const putVec3 = (...v: Vec3[]) => {
    listVec3.push(...v)
}

export const getXYZ = () => {
    let v = listXYZ.pop()
    if (v === undefined)
        v = {x: 0, y: 0, z: 0}
    return v
}

export const putXYZ = (...v: IVec3Like[]) => {
    listXYZ.push(...v)
}