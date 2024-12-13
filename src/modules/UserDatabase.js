class UserDatabase {
    constructor(db) {
        this.db = db
    }

    saveUser(user) {
        const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)'
        return new Promise((resolve, reject) => {
            this.db.query(query, [user.username, user.email, user.password], (err, result) => {
                if (err) reject(err)
                resolve(result)
            })
        })
    }

    findUserByUsername(username) {
        const query = 'SELECT * FROM users WHERE username = ?'
        return new Promise((resolve, reject) => {
            this.db.query(query, [username], (err, result) => {
                if (err) reject(err)
                resolve(result[0])
            })
        })
    }

    changePassword(username, newPassword) {
        const query = 'UPDATE users SET password = ? WHERE username = ?'
        return new Promise((resolve, reject) => {
            this.db.query(query, [newPassword, username], (err, result) => {
                if (err) reject(err)
                if (result.affectedRows === 0) {
                    reject(new Error('No user found to update'))
                } else {
                    resolve(result)
                }
            })
        })
    }

    async getAllUsers() {
        const sql = 'SELECT username, email FROM users'
        const [rows] = await this.db.promise().query(sql)
        return rows
    }
}

module.exports = UserDatabase;
