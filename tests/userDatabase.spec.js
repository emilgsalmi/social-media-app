const UserDatabase = require('./src/modules/UserDatabase')

describe('UserDatabase', () => {
    let userDatabase;
    let mockDb;

    beforeEach(() => {
        const mockQuery = jest.fn(() => Promise.resolve([[]]))
     
        mockDb = {
            query: jest.fn((query, params, callback) => {
                callback(null, [])
            }),
            promise: jest.fn(() => ({
                query: mockQuery,
            })),
        }
    
        userDatabase = new UserDatabase(mockDb)
    })
    
    describe('saveUser', () => {
        it('should save a user to the database', async () => {
            const user = { username: 'testuser', email: 'test@example.com', password: 'password123' }

            mockDb.query.mockImplementationOnce((query, params, callback) => {
                callback(null, { affectedRows: 1 })
            })

            const result = await userDatabase.saveUser(user)

            expect(mockDb.query).toHaveBeenCalledTimes(1)
            expect(mockDb.query).toHaveBeenCalledWith(
                'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                [user.username, user.email, user.password],
                expect.any(Function)
            )
            expect(result).toEqual({ affectedRows: 1 })
        })

        it('should throw an error if the query fails', async () => {
            const user = { username: 'testuser', email: 'test@example.com', password: 'password123' }

            mockDb.query.mockImplementationOnce((query, params, callback) => {
                callback(new Error('SQL Error'), null)
            })

            await expect(userDatabase.saveUser(user)).rejects.toThrow('SQL Error')
        })
    })

    describe('findUserByUsername', () => {
        it('should find a user by username', async () => {
            const username = 'testuser'
            const mockUser = { id: 1, username: 'testuser', email: 'test@example.com', password: 'password123' }

            mockDb.query.mockImplementationOnce((query, params, callback) => {
                callback(null, [mockUser])
            })

            const result = await userDatabase.findUserByUsername(username)

            expect(mockDb.query).toHaveBeenCalledTimes(1)
            expect(mockDb.query).toHaveBeenCalledWith(
                'SELECT * FROM users WHERE username = ?',
                [username],
                expect.any(Function)
            )
            expect(result).toEqual(mockUser)
        })

        it('should return null if no user is found', async () => {
            const username = 'nonexistent'

            mockDb.query.mockImplementationOnce((query, params, callback) => {
                callback(null, [])
            })

            const result = await userDatabase.findUserByUsername(username)

            expect(mockDb.query).toHaveBeenCalledTimes(1)
            expect(mockDb.query).toHaveBeenCalledWith(
                'SELECT * FROM users WHERE username = ?',
                [username],
                expect.any(Function)
            )
            expect(result).toBeUndefined()
        })
    })

    describe('changePassword', () => {
        it('should change the password for an existing user', async () => {
            const username = 'testuser'
            const newPassword = 'newpassword123'

            mockDb.query.mockImplementationOnce((query, params, callback) => {
                callback(null, { affectedRows: 1 })
            })

            const result = await userDatabase.changePassword(username, newPassword)

            expect(mockDb.query).toHaveBeenCalledTimes(1)
            expect(mockDb.query).toHaveBeenCalledWith(
                'UPDATE users SET password = ? WHERE username = ?',
                [newPassword, username],
                expect.any(Function)
            )
            expect(result).toEqual({ affectedRows: 1 })
        })

        it('should throw an error if no user is found', async () => {
            const username = 'nonexistent'
            const newPassword = 'newpassword123'

            mockDb.query.mockImplementationOnce((query, params, callback) => {
                callback(null, { affectedRows: 0 })
            })

            await expect(userDatabase.changePassword(username, newPassword)).rejects.toThrow('No user found to update')
        })

        it('should throw an error if the query fails', async () => {
            const username = 'testuser'
            const newPassword = 'newpassword123'

            mockDb.query.mockImplementationOnce((query, params, callback) => {
                callback(new Error('SQL Error'), null)
            })

            await expect(userDatabase.changePassword(username, newPassword)).rejects.toThrow('SQL Error')
        })
    })

    describe('getAllUsers', () => {
        it('should return a list of all users', async () => {
            const mockUsers = [
                { username: 'user1', email: 'user1@example.com' },
                { username: 'user2', email: 'user2@example.com' },
            ]

            mockDb.promise().query.mockResolvedValue([mockUsers])

            const result = await userDatabase.getAllUsers()

            expect(mockDb.promise().query).toHaveBeenCalledTimes(1)
            expect(mockDb.promise().query).toHaveBeenCalledWith('SELECT username, email FROM users')
            expect(result).toEqual(mockUsers)
        })

        it('should return an empty list if no users exist', async () => {

            mockDb.promise().query.mockResolvedValue([[]])

            const result = await userDatabase.getAllUsers()

            expect(mockDb.promise().query).toHaveBeenCalledTimes(1)
            expect(result).toEqual([])
        })
    })
})
