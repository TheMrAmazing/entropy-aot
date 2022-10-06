import { Database } from '../../entropy-db/src/Database'
import { User } from  './entities/User'
import { db } from '..'
import { fnArg } from 'lib/praxis/remote/Controller'

const idMap = new Map()
const PASSWORD_SALT = 8
const sessions = new Map<string, string>()
export class API {
    async postUser(req: {email:string, password: string, image: string, name: string}) {
         if(db.users.find(val => val.email == req.email)) {
            return 'Error: Email already exists'
        } else {
            let user = new User()
            user.email = req.email
            user.password = req.password
            user.image = req.image
            user.name = req.name
            db.users.push(user)
            return user
        }
    }

    async me(sess: string){
        let user = await db.users.find(val => val.id == idMap.get(sess))
        if (user) {
            return user
        } else {
            return 'Error: Not found'
        }
    }

    async login(email: string, password: string) {
        let user = await db.users.find(fnArg({email}, val => val.email == email.toLowerCase()))
        if(user?.verified) {
            if(user.password == password) {
                return user
            }
        }
        return undefined
    }
}