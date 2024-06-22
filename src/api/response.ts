import { isNil } from 'ramda'
import { SUB_INFO_KEY } from './constants'

const headerResp = (data: any, headers: Headers) =>
    new Response(data, { headers })
export default {
    ok: (data: any) => new Response(data),
    toRaw: (base64: string) =>
        headerResp(
            base64,
            new Headers({ 'content-type': 'text/html;charset=utf-8' }),
        ),
    toClash: (yaml: string, info: string | null, headers: Headers) => {
        const hds = new Headers(headers)
        hds.delete(SUB_INFO_KEY)
        if (!isNil(info)) hds.set(SUB_INFO_KEY, info)
        return headerResp(yaml, hds)
    },
    subEmpty: () => new Response('No Subscriptions!'),
    backendError: (p: Target) =>
        new Response(`Cannot connect to ${p} backend`, { status: 500 }),
    unAuthorized: () => new Response('Unauthorized', { status: 401 }),
}
