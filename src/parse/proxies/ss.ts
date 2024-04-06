import { match, split } from 'ramda'
import { Err, delay, safeAtob } from '../../utils/exception'
import { instanceOfProxy, notProxyErr } from '..'

function parse(url: string): Proxy | null {
    url = url.replace('ss://', '')
    const parseErr = delay(Err, 'ss parse error: ' + url)

    const prefixSplit = split('#', url)
    if (prefixSplit.length !== 2) return parseErr()
    const [prefix, name] = prefixSplit

    const urlPatten = match(/^(\S+?)@(\S+?):(\d+)$/)
    const urlSplit =
        url.includes('@') ?
            urlPatten(prefix)
        :   urlPatten(safeAtob(prefix) || '')
    if (urlSplit.length !== 4) return parseErr()
    const [, raw, address, port] = urlSplit

    const passwordPatten = match(/^(\S+?):(\S+)$/)
    const passwordSplit =
        raw.includes(':') ?
            passwordPatten(raw)
        :   passwordPatten(safeAtob(raw) || '')
    if (passwordSplit.length !== 3) return parseErr()
    const [, params, password] = passwordSplit

    return { password, address, port, name, params, urlify }
}

function urlify(this: Proxy): string | null {
    if (!instanceOfProxy(this)) return notProxyErr(this)
    const { password, address, port, name, params } = this
    return `ss://${btoa(params + ':' + password)}@${address}:${port}#${name}`
}

export default parse
