import { isNil } from 'ramda'
import { Err, safeAtob, safeJSONParse } from '../../utils/exception'
import { instanceOfProxy, notProxyErr } from '..'

const instanceofVMessJSON = (_: any): _ is VMessJSON =>
    typeof _ === 'object' &&
    _ !== null &&
    'ps' in _ &&
    'add' in _ &&
    'port' in _ &&
    'id' in _

function parse(url: string): Proxy | null {
    // only support v2rayN style link
    const withoutProtocol = url.replace('vmess://', '')
    const obj = safeJSONParse(
        safeAtob(withoutProtocol)?.replace(/\\u/g, '\\\\u') || null,
    ) as VMessJSON | null
    if (isNil(obj)) return null
    if (!instanceofVMessJSON(obj)) return Err('vmess parse error: ' + url)
    const { add: address, port, id: password, ps: name, ...params } = obj
    return { password, address, port, name, params, urlify }
}

function urlify(this: Proxy): string | null {
    if (!instanceOfProxy(this)) return notProxyErr(this)
    const { password, address, port, name, params } = this
    const urlobj = { add: address, port, id: password, ps: name, ...params }
    return 'vmess://' + btoa(JSON.stringify(urlobj).replace(/\\\\u/g, '\\u'))
}

export default parse
