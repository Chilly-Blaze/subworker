import { isNil } from 'ramda'
import { SUB_INFO_KEY } from './constants'

export default {
    ok: (data: any) => new Response(data),
    toRaw: (data: any) =>
        new Response(data, {
            headers: { 'content-type': 'text/html;charset=utf-8' },
        }),
    toClash: (yaml: string, subInfo: string | null) =>
        new Response(
            yaml,
            isNil(subInfo) ? {} : { headers: { [SUB_INFO_KEY]: subInfo } },
        ),
    unAuthorized: () => new Response('Unauthorized', { status: 401 }),
}
