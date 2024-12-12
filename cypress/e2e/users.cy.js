describe('User Management', () => {
  beforeEach(() => {
      cy.visit('http://localhost:3000')
  })

  it('Registers a new user successfully', () => {
    cy.get('#reg-username').type('test7')
    cy.get('#reg-email').type('test@test.com')
    cy.get('#reg-password').type('test')
    cy.get('#register-form button').click()

    cy.on('window:alert', (text) => {
        expect(text).to.contains('Registration successful!')
    })
})

it('Logs in an existing user', () => {
  cy.get('#login-username').type('test')
  cy.get('#login-password').type('test')
  cy.get('#login-form button').click()

  cy.get('#welcome-message').should('contain.text', 'Welcome, test')

  cy.get('#dashboard').should('be.visible')
})


it('Changes password for logged-in user', () => {
  cy.get('#login-username').type('testuser')
  cy.get('#login-password').type('password123')
  cy.get('#login-form button').click()

  cy.get('#login-password').as('passwordField')

  cy.get('@passwordField').should('be.visible')
  cy.get('@passwordField').type('testpassword123')

  cy.on('window:alert', (text) => {
      expect(text).to.contains('Password changed successfully!')
  })
})


  it('Fetches users list ', () => {  
    cy.get('#fetch-users').click()
    cy.get('#users-section').should('be.visible')
    cy.get('#users-list div').should('have.length.at.least', 1)
  })
})
