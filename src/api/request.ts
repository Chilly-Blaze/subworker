import { equals, last } from 'ramda'
import { EXPIRETTL, UAs } from './constants'

const put = async (store: KVNamespace, name: string, value: string) =>
    await store.put(name, value, { expirationTtl: EXPIRETTL })
const get = async (store: KVNamespace, name: string): Promise<string | null> =>
    await store.get(name)
const uaFetch = async (url: string, type: UAs = UAs.BROWSER) =>
    await fetch(url, { headers: { 'user-agent': type } })

const assemblySubRequest = (env: Env, target: string, url: string) =>
    `${env.BACKEND}${equals(last(env.BACKEND), '/') ? '' : '/'}sub?target=${target}&url=${url}&config=${env.CONFIG_ADDRESS}&emoji=false&add_emoji=false&list=false&xudp=false&udp=false&tfo=false&expand=true&sort=true&fdn=false&new_name=true`
const assemblySubInfo = (subArr: number[]) =>
    `upload=${subArr[0]}; download=${subArr[1]}; total=${subArr[2]};` // expire=${subArr[3]}

export { put, get, assemblySubRequest, assemblySubInfo, uaFetch }
