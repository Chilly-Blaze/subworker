import response from '../../api/response'
import { encodeLinks, getLinks } from '../../utils/convert'

export default async function (env: Env): Promise<Response> {
    const links = []
    for (const add of env.SUB_ADDRESSES)
        links.push(await getLinks(env.SUB_KV, add))
    return response.toRaw(encodeLinks(links))
}
