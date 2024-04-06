type VMessJSON = {
    v?: string
    ps: string
    add: string
    port: string
    id: string
    aid?: string
    scy?: string
    net?: string
    type?: string
    host?: string
    path?: string
    tls?: string
    sni?: string
    alpn?: string
    fp?: string
}

type Proxy = {
    password: string
    address: string
    port: string
    name: string
    params: any
    urlify(): string | null
}
