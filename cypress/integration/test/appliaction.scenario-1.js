/// <reference types="cypress" />

context('Appliation Scenario 1', () => {
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

    it('Begin new application process', () => {

        cy.contains('Start New Application').click()

        cy.contains('BEFORE YOU BEGIN CHECKLIST')
        cy.contains('BEFORE YOU BEGIN CHECKLIST FOR SPECIFIC USES')
        cy.contains('Ready to start')
    })

    it('Test Hints', () => {
        cy.get('button.hint-btn.show-hint').click()

        cy.get('.intake-hint.active').should('be.visible')

        cy.get('button.hint-btn.close-hint').click()

        cy.get('.intake-hint.active').should('not.be.visible')
    })

    it('Start', () => {
        cy.contains('Ready to start').click()

        cy.contains('Are you representing yourself or serving as an agent on behalf of someone else and/or an entity?')
        cy.contains('Myself')
        cy.contains('Someone else / entity')
    })

    it('Test Hints', () => {
        cy.get('button.hint-btn.show-hint').click()

        cy.get('.intake-hint.active').should('be.visible')

        cy.get('button.hint-btn.close-hint').click()

        cy.get('.intake-hint.active').should('not.be.visible')
    })
})