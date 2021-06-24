import messages from '../../src/messages';

const user1 = {
  name: 'Jean Luc Picard',
  username: 'user1',
  password: 'test'
};

const user2 = {
  name: 'William Riker',
  username: 'user2',
  password: 'test'
};

describe('Guild Chat App', () => {
  ['Desktop', 'Mobile'].forEach((size) => {
    context(size, () => {
      beforeEach(() => {
        if (size === 'Mobile') {
          cy.viewport('iphone-x');
        }
        cy.visit('/');
      });

      it('should show error message when submitting empty form', () => {
        cy.findByRole('heading', { name: 'Guild Chat' }).should('exist');
        cy.findByText('Log in').should('exist');
        cy.findByRole('textbox', { name: 'Username' }).as('nameField');
        cy.get('#login-password').as('passField');
        cy.findByRole('button', { name: 'Submit' }).as('submitBtn');
        cy.get('@submitBtn').click();
        cy.findByText(messages.en.LoginError).should('exist');
      });

      it('should show error message when submitting invalid credentials', () => {
        cy.findByRole('heading', { name: 'Guild Chat' }).should('exist');
        cy.findByText('Log in').should('exist');
        cy.findByRole('textbox', { name: 'Username' }).as('nameField');
        cy.get('#login-password').as('passField');
        cy.findByRole('button', { name: 'Submit' }).as('submitBtn');
        cy.get('@nameField').type('SOME TEST NAME{enter}');
        cy.get('@passField').type('foobarbaz{enter}');
        cy.get('@submitBtn').click();
        cy.findByText(messages.en.LoginError).should('exist');
      });

      it('should allow user to log in then display greeting and log out button', () => {
        cy.intercept('**/authenticate').as('authRequest');

        cy.findByRole('heading', { name: 'Guild Chat' }).should('exist');
        cy.findByText('Log in').should('exist');
        cy.findByRole('textbox', { name: 'Username' }).as('nameField');
        cy.get('@nameField').should('exist');
        cy.get('#login-password').as('passField');
        cy.get('@passField').should('exist');
        cy.findByRole('button', { name: 'Submit' }).as('submitBtn');
        cy.get('@submitBtn').should('exist');
        cy.get('@nameField').clear().type(`${user1.username}{enter}`);
        cy.get('@passField').clear().type(`${user1.password}{enter}`);
        cy.get('@submitBtn').click();
        cy.wait('@authRequest');
        cy.findByText(messages.en.LoginError).should('not.exist');
        cy.findByRole('button', { name: 'Log out' }).should('exist');
        cy.findByText(`Welcome, ${user1.name}!`).should('exist');
      });

      /**
       * In a real world scenario I wouldn't manually log in via the app UI for every test
       */

      it('should log user out', () => {
        cy.findByRole('textbox', { name: 'Username' }).as('nameField');
        cy.get('#login-password').as('passField');
        cy.findByRole('button', { name: 'Submit' }).as('submitBtn');

        // log in
        cy.get('@nameField').clear().type(`${user1.username}{enter}`);
        cy.get('@passField').clear().type(`${user1.password}{enter}`);
        cy.get('@submitBtn').click();
        cy.findByText(messages.en.LoginError).should('not.exist');
        cy.findByRole('button', { name: 'Log out' }).as('logoutBtn');
        cy.get('@logoutBtn').should('exist');
        cy.findByText(`Welcome, ${user1.name}!`).should('exist');

        // log out
        cy.get('@logoutBtn').click();
        cy.findByText(`Welcome, ${user1.name}!`).should('not.exist');
        cy.findByText('Log in').should('exist');
      });

      it('should display friends list and messages for current logged in user', () => {
        cy.findByRole('textbox', { name: 'Username' }).as('nameField');
        cy.get('#login-password').as('passField');
        cy.findByRole('button', { name: 'Submit' }).as('submitBtn');
        cy.get('@nameField').clear().type(`${user1.username}{enter}`);
        cy.get('@passField').clear().type(`${user1.password}{enter}`);
        cy.get('@submitBtn').click();

        cy.findByRole('heading', { name: 'Friends List' }).should('exist');
        cy.get('[data-cy=friends-panel]').within(() => {
          cy.findByText(`${user2.name}`).should('exist');
        });
        cy.get('[data-cy=messages-panel]').within(() => {
          cy.findByText(`Chat with ${user2.name}`).should('exist');
          cy.findByText('Hello Number One').should('exist');
          cy.findByText('Make it so').should('exist');
          cy.findByText('Engage!').should('exist');
        });

        // log in with other user
        cy.findByRole('button', { name: 'Log out' }).click();
        cy.findByRole('textbox', { name: 'Username' }).as('nameField');
        cy.get('#login-password').as('passField');
        cy.findByRole('button', { name: 'Submit' }).as('submitBtn');
        cy.get('@nameField').clear().type(`${user2.username}{enter}`);
        cy.get('@passField').clear().type(`${user2.password}{enter}`);
        cy.get('@submitBtn').click();

        cy.findByRole('heading', { name: 'Friends List' }).should('exist');
        cy.get('[data-cy=friends-panel]').within(() => {
          cy.findByText(`${user1.name}`).should('exist');
        });
        cy.get('[data-cy=messages-panel]').within(() => {
          cy.findByText(`Chat with ${user1.name}`).should('exist');
          cy.findByText('Aye, captain').should('exist');
        });
      });
    });
  });
});
