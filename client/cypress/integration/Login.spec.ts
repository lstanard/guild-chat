import messages from '../../src/messages';

describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should show error message when submitting empty form', () => {
    cy.findByRole('heading', { name: 'Guild Chat' }).should('exist');
    cy.findByText('Log in').should('exist');
    cy.findByRole('textbox', { name: 'Username' }).as('nameField');
    cy.get('#login-password').as('passField'); // not sure why findByRole isn't working for this
    cy.findByRole('button', { name: 'Submit' }).as('submitBtn');
    cy.get('@submitBtn').click();
    cy.findByText(messages.en.LoginError).should('exist');
  });

  it('should show error message when submitting invalid credentials', () => {
    cy.findByRole('heading', { name: 'Guild Chat' }).should('exist');
    cy.findByText('Log in').should('exist');
    cy.findByRole('textbox', { name: 'Username' }).as('nameField');
    cy.get('#login-password').as('passField'); // not sure why findByRole isn't working for this
    cy.findByRole('button', { name: 'Submit' }).as('submitBtn');
    cy.get('@nameField').type('SOME TEST NAME{enter}');
    cy.get('@passField').type('foobarbaz{enter}');
    cy.get('@submitBtn').click();
    cy.findByText(messages.en.LoginError).should('exist');
  });

  it('should show login form and allow user to log in', () => {
    cy.findByRole('heading', { name: 'Guild Chat' }).should('exist');
    cy.findByText('Log in').should('exist');
    cy.findByRole('textbox', { name: 'Username' }).as('nameField');
    cy.get('@nameField').should('exist');
    cy.get('#login-password').as('passField'); // not sure why findByRole isn't working for this
    cy.get('@passField').should('exist');
    cy.findByRole('button', { name: 'Submit' }).as('submitBtn');
    cy.get('@submitBtn').should('exist');
    cy.get('@nameField').clear().type('test-user{enter}');
    cy.get('@passField').clear().type('test{enter}');
    cy.get('@submitBtn').click();
    cy.findByText(messages.en.LoginError).should('not.exist');
    cy.findByRole('button', { name: 'Log out' }).should('exist');
    cy.findByText('Welcome, Test User!').should('exist');
  });

  it('should log user out', () => {
    cy.findByRole('textbox', { name: 'Username' }).as('nameField');
    cy.get('#login-password').as('passField');
    cy.findByRole('button', { name: 'Submit' }).as('submitBtn');

    // log in
    cy.get('@nameField').clear().type('test-user{enter}');
    cy.get('@passField').clear().type('test{enter}');
    cy.get('@submitBtn').click();
    cy.findByText(messages.en.LoginError).should('not.exist');
    cy.findByRole('button', { name: 'Log out' }).as('logoutBtn');
    cy.get('@logoutBtn').should('exist');
    cy.findByText('Welcome, Test User!').should('exist');

    // log out
    cy.get('@logoutBtn').click();
    cy.findByText('Welcome, Test User!').should('not.exist');
    cy.findByText('Log in').should('exist');
  });
});
