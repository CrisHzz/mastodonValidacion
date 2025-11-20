/**
 * Cypress Basic UI Tests for Mastodon
 * 10 simple tests to validate basic UI elements
 */

describe('Mastodon Basic UI Tests', () => {

    beforeEach(() => {
        // Visit the base URL before each test
        cy.visit('/');
    });

    it('Test 1: Should load the home page successfully', () => {
        // Verify page loads by checking URL
        cy.url().should('include', 'localhost:3000');
        // Page should have content
        cy.get('body').should('exist');
    });

    it('Test 2: Should have a page title', () => {
        // Verify page has a title
        cy.title().should('not.be.empty');
        // Title should contain some text
        cy.title().should('have.length.gt', 0);
    });

    it('Test 3: Should have HTML structure', () => {
        // Basic HTML elements should exist
        cy.get('html').should('exist');
        cy.get('head').should('exist');
        cy.get('body').should('exist');
    });

    it('Test 4: Should have meta tags', () => {
        // Check for common meta tags
        cy.get('head meta').should('have.length.gt', 0);
    });

    it('Test 5: Should load CSS stylesheets', () => {
        // Verify stylesheets are loaded
        cy.get('head link[rel="stylesheet"]').should('have.length.gt', 0);
    });

    it('Test 6: Should have interactive elements', () => {
        // Page should have some clickable elements (buttons, links, etc)
        cy.get('body').within(() => {
            // At least one of these should exist
            cy.get('a, button, input, [role="button"]').should('have.length.gt', 0);
        });
    });

    it('Test 7: Should have visible content', () => {
        // Body should have text content
        cy.get('body').invoke('text').should('not.be.empty');
    });

    it('Test 8: Should be responsive', () => {
        // Test different viewport sizes
        cy.viewport(1280, 720); // Desktop
        cy.get('body').should('be.visible');

        cy.viewport(375, 667); // Mobile
        cy.get('body').should('be.visible');
    });

    it('Test 9: Should have proper document structure', () => {
        // Document should be properly formed
        cy.document().should('have.property', 'charset', 'UTF-8');
        cy.document().its('readyState').should('eq', 'complete');
    });

    it('Test 10: Should have navigation elements', () => {
        // Page should have some form of navigation
        cy.get('body').within(() => {
            // Look for common navigation patterns
            cy.get('a').should('have.length.gt', 0);
        });
    });

});
