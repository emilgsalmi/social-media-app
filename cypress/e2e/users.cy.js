describe('User Management', () => {
  beforeEach(() => {
      cy.visit('http://localhost:3000'); // Byt till din bas-URL
  });

  it('Registers a new user successfully', () => {
    cy.get('#reg-username').type('testuser');
    cy.get('#reg-email').type('testuser@example.com');
    cy.get('#reg-password').type('password123');
    cy.get('#register-form button').click();

    // Kontrollera alert
    cy.on('window:alert', (text) => {
        expect(text).to.contains('Registration successful!');
    }); 
});

it('Logs in an existing user', () => {
  cy.get('#login-username').type('testuser');
  cy.get('#login-password').type('password123');
  cy.get('#login-form button').click();

  // Kontrollera att välkomstmeddelandet visas
  cy.get('#welcome-message').should('contain.text', 'Welcome testuser');

  // Kontrollera att dashboarden visas
  cy.get('#dashboard').should('be.visible');
});


it('Changes password for logged-in user', () => {
  cy.get('#login-username').type('testuser');
  cy.get('#login-password').type('password123');
  cy.get('#login-form button').click();

  // Logga in och ändra lösenord
  cy.get('#new-password').type('newpassword123');
  cy.get('#change-password-form button').click();

  // Kontrollera alert
  cy.on('window:alert', (text) => {
      expect(text).to.contains('Password changed successfully!');
  });
});


  it('Fetches users list for logged-in user', () => {
      // Logga in
      cy.get('#login-username').type('testuser');
      cy.get('#login-password').type('password123');
      cy.get('#login-form button').click();

      // Hämta användarlista
      cy.get('#fetch-users').click();
      cy.get('#users-section').should('be.visible');
      cy.get('#users-list div').should('have.length.at.least', 1); // Kontrollera minst en användare
  });
});
