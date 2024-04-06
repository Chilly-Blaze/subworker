import ss from './proxies/ss'
import vmess from './proxies/vmess'
import vless from './proxies/vless'
import trojan from './proxies/trojan'
import hysteria from './proxies/hysteria'
import hysteria2 from './proxies/hysteria2'
import { always, compose, concat, cond, startsWith } from 'ramda'
import { Err } from '../utils/exception'

const instanceOfProxy = (_: any): _ is Proxy =>
    typeof _ === 'object' &&
    _ !== null &&
    'password' in _ &&
    'address' in _ &&
    'port' in _ &&
    'name' in _ &&
    'params' in _
const notProxyErr = compose(Err, concat('object is not Proxy: '))

const proxyFactory = (url: string): Proxy | null =>
    cond([
        [startsWith('ss://'), ss],
        [startsWith('vmess://'), vmess],
        [startsWith('vless://'), vless],
        [startsWith('trojan://'), trojan],
        [startsWith('hysteria://'), hysteria],
        [startsWith('hysteria2://'), hysteria2],
        [always(true), compose(Err, concat('unknown protocol: '))],
    ])(url)

export { proxyFactory, notProxyErr, instanceOfProxy }
