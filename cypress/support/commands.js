// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/**
 * Custom command to check if element exists
 */
Cypress.Commands.add('elementExists', (selector) => {
    cy.get('body').then(($body) => {
        return $body.find(selector).length > 0;
    });
});

/**
 * Custom command to safely check element visibility
 */
Cypress.Commands.add('checkElementVisible', (selector, shouldExist = true) => {
    if (shouldExist) {
        cy.get(selector, { timeout: 10000 }).should('exist');
    }
});

/**
 * Custom command to wait for page load
 */
Cypress.Commands.add('waitForPageLoad', () => {
    cy.document().its('readyState').should('eq', 'complete');
});
