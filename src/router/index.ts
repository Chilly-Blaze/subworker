import { equals, or, startsWith } from 'ramda'
import browser from './service/browser'
import unknown from './service/unknown'
import reset from './service/reset'
import subserver from './service/subserver'
import clash from './client/clash'
import raw from './client/raw'

async function router(req: Request, env: Env): Promise<Response> {
    const UA = req.headers.get('user-agent')
    const url = new URL(req.url)
    const pathname = url.pathname
    const isToken = equals(url.searchParams.get('token'), env.TOKEN)

    if (isToken)
        if (equals('/reset', pathname)) return reset(env)
        else if (or(UA?.includes('clash'), equals('/clash', pathname)))
            return clash(req, env)
        else return raw(env)

    if (startsWith('/sub', pathname))
        return subserver(new URL(req.url).pathname, env.SUB_KV)
    if (UA?.includes('Mozilla')) return browser()
    return unknown()
}

export default router
