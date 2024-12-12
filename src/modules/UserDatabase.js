class UserDatabase {
    constructor(db) {
        this.db = db;
    }

    // Sparar en ny användare i databasen
    saveUser(user) {
        const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        return new Promise((resolve, reject) => {
            this.db.query(query, [user.username, user.email, user.password], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    // Hittar en användare baserat på användarnamn
    findUserByUsername(username) {
        const query = 'SELECT * FROM users WHERE username = ?';
        return new Promise((resolve, reject) => {
            this.db.query(query, [username], (err, result) => {
                if (err) reject(err);
                resolve(result[0]); // Returnerar första användaren om det finns någon
            });
        });
    }

    // Ändrar lösenordet för en användare
    changePassword(username, newPassword) {
        const query = 'UPDATE users SET password = ? WHERE username = ?';
        return new Promise((resolve, reject) => {
            this.db.query(query, [newPassword, username], (err, result) => {
                if (err) reject(err);
                if (result.affectedRows === 0) {
                    reject(new Error('No user found to update'));
                } else {
                    resolve(result);
                }
            });
        });
    }

    async getAllUsers() {
        const sql = 'SELECT username, email FROM users'; // Hämtar bara nödvändig data
        const [rows] = await this.db.promise().query(sql);
        return rows;
    }
}

module.exports = UserDatabase;
