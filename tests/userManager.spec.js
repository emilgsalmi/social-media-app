const UserManager = require('./../src/modules/UserManager')
const User = require('./../src/modules/User')

describe('UserManager', () => {
    let userManager
    let mockDatabase

    beforeEach(() => {
        mockDatabase = {
            saveUser: jest.fn(),
            findUserByUsername: jest.fn(),
            changePassword: jest.fn(),
        }
        userManager = new UserManager(mockDatabase)
    })

    describe('register', () => {
        it('should register a new user and save it in the database', async () => {
            const username = 'testuser'
            const password = 'password123'
            const email = 'testuser@example.com'

            mockDatabase.saveUser.mockResolvedValue(true)

            const result = await userManager.register(username, password, email)

            expect(mockDatabase.saveUser).toHaveBeenCalledTimes(1)
            expect(mockDatabase.saveUser).toHaveBeenCalledWith(
                expect.any(User)
            )
            expect(result).toBe(true)
        })
    })

    describe('login', () => {
        it('should log in a user with correct credentials', async () => {
            const username = 'testuser'
            const password = 'password123'

            const mockUser = new User(username, password, 'testuser@example.com')
            mockDatabase.findUserByUsername.mockResolvedValue(mockUser)

            const result = await userManager.login(username, password)

            expect(mockDatabase.findUserByUsername).toHaveBeenCalledTimes(1)
            expect(mockDatabase.findUserByUsername).toHaveBeenCalledWith(username)
            expect(userManager.getLoggedInUser()).toBe(mockUser)
            expect(result).toBe(true)
        })

        it('should not log in a user with incorrect credentials', async () => {
            const username = 'testuser'
            const password = 'wrongpassword'

            const mockUser = new User(username, 'correctpassword', 'testuser@example.com')
            mockDatabase.findUserByUsername.mockResolvedValue(mockUser)

            const result = await userManager.login(username, password)

            expect(mockDatabase.findUserByUsername).toHaveBeenCalledTimes(1)
            expect(mockDatabase.findUserByUsername).toHaveBeenCalledWith(username)
            expect(userManager.getLoggedInUser()).toBeNull()
            expect(result).toBe(false)
        })

        it('should not log in a non-existent user', async () => {
            const username = 'nonexistent'
            const password = 'password123'

            mockDatabase.findUserByUsername.mockResolvedValue(null)

            const result = await userManager.login(username, password)

            expect(mockDatabase.findUserByUsername).toHaveBeenCalledTimes(1)
            expect(mockDatabase.findUserByUsername).toHaveBeenCalledWith(username)
            expect(userManager.getLoggedInUser()).toBeNull()
            expect(result).toBe(false)
        })
    })

    describe('changePassword', () => {
        it('should change the password of an existing user', async () => {
            const username = 'testuser'
            const newPassword = 'newpassword123'

            mockDatabase.changePassword.mockResolvedValue(true)

            const result = await userManager.changePassword(username, newPassword)

            expect(mockDatabase.changePassword).toHaveBeenCalledTimes(1)
            expect(mockDatabase.changePassword).toHaveBeenCalledWith(username, newPassword)
            expect(result).toBe(true)
        })

        it('should fail to change the password for a non-existent user', async () => {
            const username = 'nonexistent'
            const newPassword = 'newpassword123'

            mockDatabase.changePassword.mockResolvedValue(false)

            const result = await userManager.changePassword(username, newPassword)

            expect(mockDatabase.changePassword).toHaveBeenCalledTimes(1)
            expect(mockDatabase.changePassword).toHaveBeenCalledWith(username, newPassword)
            expect(result).toBe(false)
        })
    })

    describe('getLoggedInUser', () => {
        it('should return the currently logged in user', async () => {
            const username = 'testuser'
            const password = 'password123'

            const mockUser = new User(username, password, 'testuser@example.com')
            mockDatabase.findUserByUsername.mockResolvedValue(mockUser)

            await userManager.login(username, password)

            const loggedInUser = userManager.getLoggedInUser()
            expect(loggedInUser).toBe(mockUser)
        })

        it('should return null if no user is logged in', () => {
            const loggedInUser = userManager.getLoggedInUser()
            expect(loggedInUser).toBeNull()
        })
    })
})
