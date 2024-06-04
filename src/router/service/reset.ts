import {
    compose,
    isNil,
    split,
    invoker,
    last,
    length,
    map,
    sum,
    transpose,
    equals,
    append,
    flatten,
} from 'ramda'
import { maybe, safeAtob } from '../../utils/exception'
import { shortHmac } from '../../utils/crypto'
import obfuscating from '../../utils/obfuscator'
import { fetchRaw, fetchSubInfo, put, putSubInfo } from '../../api/request'
import response from '../../api/response'
import { encodeLinks, raw2Links } from '../../utils/convert'

export default async function (env: Env): Promise<Response> {
    let subInfos = [0, 0, 0, 0]
    for (const add of env.SUB_ADDRESSES) {
        let links: string[] | null = [add]
        // 原始节点信息存储
        if (add.startsWith('https://')) {
            // 流量信息
            const infoList = maybe(
                compose(map(compose(Number, last, split('='))), split(';')),
            )(await fetchSubInfo(add))
            const pred = maybe(compose(equals(4), length, flatten))(infoList)
            const sumInfos = compose(map(sum), transpose, append(infoList!))
            // 订阅转换
            const resp = await fetchRaw(add)
            const raw = safeAtob((await resp?.text()) ?? null)
            if (isNil(raw)) continue

            await put(env.SUB_KV, add, raw)
            subInfos = pred ? sumInfos([subInfos]) : subInfos
            links = raw2Links(raw)
        }
        // 混淆+哈希存储
        const hash = shortHmac(env.TOKEN, add)
        const fakeProxies = obfuscating(links, hash, env.OBFUSCATOR).proxies
        const fakeValue = compose(
            encodeLinks,
            map(invoker(0, 'urlify')),
        )(fakeProxies)
        await put(env.SUB_KV, hash, fakeValue)
    }
    await putSubInfo(env.SUB_KV, subInfos)
    return response.ok('Reset Complete!')
}
