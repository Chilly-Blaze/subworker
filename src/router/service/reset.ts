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
} from 'ramda'
import { safeAtob } from '../../utils/exception'
import { shortHmac } from '../../utils/crypto'
import obfuscating from '../../utils/obfuscator'
import { SUB_INFO_KEY, UAs } from '../../api/constants'
import { assemblySubInfo, put, uaFetch } from '../../api/request'
import response from '../../api/response'
import { encodeLinks, raw2Links } from '../../utils/convert'

export default async function (env: Env): Promise<Response> {
    let subInfos = [0, 0, 0, 0]
    for (const address of env.SUB_ADDRESS) {
        let links: string[] | null = [address]
        // 原始节点信息存储
        if (address.startsWith('https://')) {
            // 流量信息
            const info = (await uaFetch(address, UAs.CLASH)).headers.get(
                SUB_INFO_KEY,
            )
            if (!isNil(info)) {
                const infoList = compose(
                    map(compose(Number, last, split('='))),
                    split(';'),
                )(info)
                if (length(infoList) === 4)
                    subInfos = map(sum, transpose([infoList, subInfos]))
            }
            // 订阅转换
            const resp = await uaFetch(address)
            const raw = safeAtob(await resp.text())
            if (isNil(raw)) continue
            await put(env.SUB_KV, address, raw)
            links = raw2Links(raw)
        }
        // 混淆+哈希存储
        const hash = shortHmac(env.TOKEN, address)
        const fakeProxies = obfuscating(links, hash, env.OBFUSCATOR).proxies
        const fakeValue = encodeLinks(fakeProxies.map(invoker(0, 'urlify')))
        await put(env.SUB_KV, hash, fakeValue)
    }
    await put(env.SUB_KV, SUB_INFO_KEY, assemblySubInfo(subInfos))
    return response.ok('Reset Complete!')
}
