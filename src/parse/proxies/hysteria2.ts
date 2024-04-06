import { match } from 'ramda'
import { Err } from '../../utils/exception'
import { instanceOfProxy, notProxyErr } from '..'

function parse(url: string): Proxy | null {
    url = url.replace('hysteria2://', '')
    const urlSplit = match(/^(\S+?)@(\S+?):(\d+)\/?\?(\S+?)#(.+)$/, url)
    if (urlSplit.length !== 6) return Err('hysteria2 parse error: ' + url)
    const [, password, address, port, params, name] = urlSplit
    return { password, address, port, name, params, urlify }
}

function urlify(this: Proxy): string | null {
    if (!instanceOfProxy(this)) return notProxyErr(this)
    const { password, address, port, name, params } = this
    return `hysteria2://${password}@${address}:${port}/?${params}#${name}`
}

export default parse
