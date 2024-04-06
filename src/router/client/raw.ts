import response from '../../api/response'
import { encodeLinks, getLinks } from '../../utils/convert'

export default async function (env: Env): Promise<Response> {
    const links = []
    for (const add of env.SUB_ADDRESS)
        links.push(await getLinks(add, env.SUB_KV))
    return response.toRaw(encodeLinks(links))
}
