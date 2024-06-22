enum UAs {
    CLASH = 'clash',
    BROWSER = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.5410.0 Safari/537.36',
}
enum ROUTER {
    RESET = '/reset',
    SUB = '/sub',
    CLASH = '/clash',
    BROWSER = 'Mozilla',
}
const EXPIRETTL = 60 * 60 * 24
const SUB_INFO_KEY = 'subscription-userinfo'
export { EXPIRETTL, SUB_INFO_KEY, UAs, ROUTER }
