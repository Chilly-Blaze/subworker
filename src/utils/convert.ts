import {
    add,
    append,
    compose,
    dropLastWhile,
    flatten,
    isEmpty,
    isNil,
    join,
    split,
} from 'ramda'
import { get } from '../api/request'
import { Err, removeNull } from './exception'

const getLinks = async (
    address: string,
    kv: KVNamespace,
): Promise<string[] | null> => {
    if (!address.startsWith('https://')) return [address]
    const raw = await get(kv, address)
    if (isNil(raw)) return Err('get subscribe error: ' + add)
    const links = compose(dropLastWhile<string>(isEmpty), split('\r\n'))(raw)
    return links
}
const encodeLinks = compose(
    btoa,
    join('\r\n'),
    append(''),
    flatten,
    removeNull<string[] | string>,
)

export { getLinks, encodeLinks }
