import { equals, last } from 'ramda'
import { EXPIRETTL, SUB_INFO_KEY, UAs } from './constants'
import { Err } from '../utils/exception'

// KV
const put = (store: KVNamespace, name: string, value: string) =>
    store.put(name, value, { expirationTtl: EXPIRETTL })
const get = (store: KVNamespace, name: string) => store.get(name)
const getSubInfo = (store: KVNamespace) => get(store, SUB_INFO_KEY)
const putSubInfo = (store: KVNamespace, a: number[]) =>
    put(store, SUB_INFO_KEY, `upload=${a[0]}; download=${a[1]}; total=${a[2]};`)

const fetchRaw = async (url: string, type: UAs = UAs.BROWSER) => {
    try {
        const resp = await fetch(url, { headers: { 'user-agent': type } })
        if (!resp.ok) throw new Error(resp.statusText)
        return Promise.resolve(resp)
    } catch (e) {
        return Promise.resolve(
            Err(`fetch error: ${(e as Error).message}: ${url}`),
        )
    }
}

// Cloud
const fetchSubInfo = async (url: string) =>
    (await fetchRaw(url, UAs.CLASH))?.headers.get(SUB_INFO_KEY) ?? null
// Backend
const fetchBackend = (env: Env, target: Target, urls: string[]) =>
    fetchRaw(
        `${env.BACKEND_ADDRESS}${equals(last(env.BACKEND_ADDRESS), '/') ? '' : '/'}sub?target=${target}&url=${encodeURIComponent(urls.join('|'))}&config=${env.CONFIG_ADDRESS}&emoji=false&add_emoji=false&list=false&xudp=false&udp=false&tfo=false&expand=true&sort=true&fdn=false&new_name=true`,
    )

export {
    put,
    get,
    getSubInfo,
    putSubInfo,
    fetchBackend,
    fetchRaw,
    fetchSubInfo,
}
