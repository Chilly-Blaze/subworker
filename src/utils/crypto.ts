import { createHmac, createHash } from 'node:crypto'

const shortHmac = (key: string, data: string) =>
    createHmac('sha256', key).update(data).digest('hex').slice(0, 12)

const shortHashArr = (arr: string[]) =>
    arr.map((x) => createHash('sha256').update(x).digest('hex').slice(0, 20))

const hash2uuid = (hash: string) =>
    hash.slice(0, 8) +
    '-' +
    hash.slice(8, 12) +
    '-' +
    hash.slice(12, 16) +
    '-' +
    hash.slice(16, 20) +
    '-' +
    hash.slice(20)

export { shortHmac, shortHashArr, hash2uuid }
