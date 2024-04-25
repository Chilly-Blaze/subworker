import {
    add,
    append,
    compose,
    dropLastWhile,
    flatten,
    isEmpty,
    isNil,
    join,
    replace,
    split,
} from 'ramda'
import { get } from '../api/request'
import { Err, removeNull } from './exception'

const raw2Links = compose(
    dropLastWhile<string>(isEmpty),
    split('\n'),
    replace(/\r/g, ''),
)
const getLinks = async (
    address: string,
    kv: KVNamespace,
): Promise<string[] | null> => {
    if (!address.startsWith('https://')) return [address]
    const raw = await get(kv, address)
    if (isNil(raw)) return Err('get subscribe error: ' + add)
    return raw2Links(raw)
}
const encodeLinks = compose(
    btoa,
    join('\r\n'),
    append(''),
    flatten,
    removeNull<string[] | string>,
)

export { getLinks, encodeLinks, raw2Links }
