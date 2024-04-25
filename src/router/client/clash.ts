import { forEachObjIndexed, isNil } from 'ramda'
import { shortHmac } from '../../utils/crypto'
import obfuscating from '../../utils/obfuscator'
import { assemblySubRequest, get, uaFetch } from '../../api/request'
import response from '../../api/response'
import { SUB_INFO_KEY, UAs } from '../../api/constants'
import { getLinks } from '../../utils/convert'

export default async function (req: Request, env: Env): Promise<Response> {
    const domain = new URL(req.url).origin + '/sub/'
    const urls = []
    const replaceMap: Record<string, string> = {}
    // 获取混淆映射
    for (const add of env.SUB_ADDRESS) {
        const links = await getLinks(add, env.SUB_KV)
        if (isNil(links)) continue
        const hash = shortHmac(env.TOKEN, add)
        forEachObjIndexed(
            (v, k) => (replaceMap[k] = v),
            obfuscating(links, hash, env.OBFUSCATOR).map,
        )
        urls.push(domain + hash)
    }
    // 请求模板配置并替换
    if (urls.length === 0) return response.ok('No Subscriptions!')
    const subResp = await uaFetch(
        assemblySubRequest(env, 'clash', encodeURIComponent(urls.join('|'))),
        UAs.CLASH,
    )
    let yaml = await subResp.text()
    for (const k in replaceMap) yaml = yaml.replaceAll(k, replaceMap[k])
    const subInfo = await get(env.SUB_KV, SUB_INFO_KEY)
    return response.toClash(yaml, subInfo)
}
