const User = require('./User')

class UserManager{
    constructor(userDatabase){
        this.userDatabase = userDatabase
        this.loggedInUser = null
    }

    async register(username, password, email){
        const user = new User(username, password, email)
        return this.userDatabase.saveUser(user)
    }

    async login(username, password){
        const user = await this.userDatabase.findUserByUsername(username)
        if(user && user.password === password){
            this.loggedInUser = user
            return true
        }
        return false
    }

    async changePassword(username, newPassword){
        return this.userDatabase.changePassword(username, newPassword)
    }

    getLoggedInUser(){
        return this.loggedInUser
    }
}

module.exports = UserManager