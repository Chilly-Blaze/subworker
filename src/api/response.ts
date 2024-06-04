import { isNil } from 'ramda'
import { SUB_INFO_KEY } from './constants'

const headerResp = (data: any, headers: Record<string, string>) =>
    new Response(data, { headers: { ...headers } })
export default {
    ok: (data: any) => new Response(data),
    toRaw: (base64: string) =>
        headerResp(base64, { 'content-type': 'text/html;charset=utf-8' }),
    toClash: (yaml: string, info: string | null) =>
        headerResp(yaml, isNil(info) ? {} : { [SUB_INFO_KEY]: info }),

    subEmpty: () => new Response('No Subscriptions!'),
    backendError: (p: Target) =>
        new Response(`Cannot connect to ${p} backend`, { status: 500 }),
    unAuthorized: () => new Response('Unauthorized', { status: 401 }),
}
