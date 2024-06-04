import obfuscating from '../../utils/obfuscator'
import response from '../../api/response'
import { isNil } from 'ramda'
import { shortHmac } from '../../utils/crypto'
import { fetchBackend, getSubInfo } from '../../api/request'
import { getLinks } from '../../utils/convert'

export default async function (req: Request, env: Env): Promise<Response> {
    const domain = new URL(req.url).origin + '/sub/'
    const urls: string[] = []
    const replaceMap: Record<string, string> = {}

    // 获取混淆映射
    for (const add of env.SUB_ADDRESSES) {
        const links = await getLinks(env.SUB_KV, add)
        if (isNil(links)) continue
        const hash = shortHmac(env.TOKEN, add)

        Object.assign(replaceMap, obfuscating(links, hash, env.OBFUSCATOR).map)
        urls.push(domain + hash)
    }

    // 请求模板配置并替换
    if (urls.length === 0) return response.subEmpty()
    let yaml = (await (await fetchBackend(env, 'clash', urls))?.text()) ?? null
    if (isNil(yaml)) return response.backendError('clash')
    for (const k in replaceMap) yaml = yaml.replaceAll(k, replaceMap[k])
    return response.toClash(yaml, await getSubInfo(env.SUB_KV))
}
