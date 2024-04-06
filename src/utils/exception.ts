import { always, compose, concat, isNil, reject, tryCatch, unless } from 'ramda'

// Error
const ERR_INFO = `Error: ${new Date().toLocaleString()} - `
const delay =
    (fn: Function, ...args1: any) =>
    (...args2: any) =>
        fn(...args1, ...args2)
const Err = compose(always(null), console.error, concat(ERR_INFO))
const Catcher = (s: string) => (_: Error, v: any) => compose(Err, concat(s))(v)

// Maybe
const maybe = <T, R>(fn: (x: T) => R) =>
    unless(isNil, fn) as (x: T | null) => R | null
const removeNull = reject(isNil) as <T>(x: (T | null)[]) => T[]

const safeJSONParse = maybe(tryCatch(JSON.parse, Catcher('invalid JSON: ')))
const safeAtob = maybe(tryCatch(atob, Catcher(`invalid base64: `)))

export { safeJSONParse, safeAtob, Err, Catcher, delay, maybe, removeNull }
