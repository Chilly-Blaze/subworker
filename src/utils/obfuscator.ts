import {
    compose,
    concat,
    equals,
    filter,
    flatten,
    invertObj,
    keys,
    map,
    mergeLeft,
    props,
    uniq,
    zipObj,
} from 'ramda'
import { proxyFactory } from '../parse'
import { maybe, removeNull } from './exception'
import { hash2uuid, shortHashArr } from './crypto'

type Obfuscator = {
    proxies: Proxy[]
    map: Record<string, string>
}

function obfuscating(
    links: string[],
    baseHash: string,
    OBFUS: Env['OBFUSCATOR'],
): Obfuscator {
    const proxies = removeNull(map(proxyFactory, links))
    const includeKeys = compose(keys, filter(equals(true)))(OBFUS)
    // 随机化映射表
    const valueFilter = maybe(props(includeKeys))
    const requireValues = map(valueFilter, proxies)
    const singletonArr = compose(uniq<string>, flatten)(requireValues)
    const randomMap = zipObj(
        singletonArr,
        map(compose(hash2uuid, concat(baseHash)), shortHashArr(singletonArr)),
    )
    // 混淆对象
    const getFakeObj = (x: Proxy) => {
        const random = map((a) => randomMap[x[a]], includeKeys)
        return mergeLeft(zipObj(includeKeys, random), x)
    }
    return { proxies: map(getFakeObj, proxies), map: invertObj(randomMap) }
}

export default obfuscating
