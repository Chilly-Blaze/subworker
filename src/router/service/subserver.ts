import { compose, equals, isNil, last, split } from 'ramda'
import response from '../../api/response'
import { get } from '../../api/request'
import { Err } from '../../utils/exception'

const emptyErr = (s: string) => Err(s) || response.toRaw('')
export default async function (
    pathname: string,
    kv: KVNamespace,
): Promise<Response> {
    const hash = compose(last<string>, split('/'))(pathname)
    if (isNil(hash) || equals(hash, 'sub'))
        return emptyErr('empty hash: ' + pathname)
    const fake = await get(kv, hash)
    if (isNil(fake)) return emptyErr('invalid hash: ' + hash)
    return response.toRaw(fake)
}
