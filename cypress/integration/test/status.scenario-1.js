/// <reference types="cypress" />

context('Status Check Scenario 1', () => {
    it('Start Application', () => {
        cy.visit('/')
    
        cy.contains('Welcome to City of Detroit Property Application Intake.')
    })

    it('Test Hints', () => {
        cy.get('button.hint-btn.show-hint').click()

        cy.get('.intake-hint.active').should('be.visible')

        cy.get('button.hint-btn.close-hint').click()

        cy.get('.intake-hint.active').should('not.be.visible')
    })

    it('Check Status', () => {

        cy.contains('Check Application Status').click()

        cy.contains('Please enter the Application ID you wish to check.')

        cy.get('#app-id').type('2de64372-aca9-4ad3-abef-daa6f9424f9e')
    })

    it('Test Hints', () => {
        cy.get('button.hint-btn.show-hint').click()

        cy.get('.intake-hint.active').should('be.visible')

        cy.get('button.hint-btn.close-hint').click()

        cy.get('.intake-hint.active').should('not.be.visible')
    })

    it('Status Complete', () => {
        cy.contains('Check').click()

        cy.contains('The current status of your application is:')
        cy.contains('Completed,')
    })

    it('Test Hints', () => {
        cy.get('button.hint-btn.show-hint').click()

        cy.get('.intake-hint.active').should('be.visible')

        cy.get('button.hint-btn.close-hint').click()

        cy.get('.intake-hint.active').should('not.be.visible')
    })
})