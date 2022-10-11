import * as crypto from 'crypto'

export function hash(password: string) {
    return crypto.createHash('sha256').update(password).digest().toString()
}