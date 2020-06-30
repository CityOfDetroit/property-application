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

        cy.contains('Application ID')
        cy.contains('This is the ID for your appliation. Remember to keep this ID for your records.')
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

    it('Myself Contact', () => {
        cy.contains('Myself').click()

        cy.contains('Input the best contact information to reach the applicant and/or the representative.')

        cy.get('#name').type('John Doe')
        cy.get('#email').type('john@test.com')
        cy.get('#phone').type('3134443000')
        cy.get('#address').type('1550 Woodward')
        cy.get('#city').type('Detroit')
        cy.get('#zip-code').type('48209')
        cy.get('#state').select('Michigan')
        cy.get('#country').select('United States')
    })

    it('Test Hints', () => {
        cy.get('button.hint-btn.show-hint').click()

        cy.get('.intake-hint.active').should('be.visible')

        cy.get('button.hint-btn.close-hint').click()

        cy.get('.intake-hint.active').should('not.be.visible')
    })

    it('Individual', () => {
        cy.contains('Next').click()

        cy.contains('Is the applicant an individual or business? (check one)')

        cy.get('#individual').check()
    })

    it('Individual Information', () => {
        cy.contains('Next').click()

        cy.contains('Information')

        cy.get('#name').type('John Doe')
        cy.get('#email').type('john@test.com')
        cy.get('#phone').type('3134443000')
        cy.get('#address').type('1550 Woodward')
        cy.get('#city').type('Detroit')
        cy.get('#state').select('Michigan')
        cy.get('#country').select('United States')
    })

    it('Applicant in Detroit', () => {
        cy.contains('Next').click()

        cy.contains('Is the applicant or business in Detroit?*')
    })

    it('DLBA Partner', () => {
        cy.contains('Yes').click()

        cy.contains('Is the applicant apart of the Detroit Land Bank Authority Community Partnership Program or is working with a partner?')
    })

    it('DLBA Partner List', () => {
        cy.contains('Yes').click()

        cy.contains('What is the name of your partner(s)?')

        cy.get('#partners').type('Tim, Sam, Jimmy, Sandra')
    })

    it('Own Property in Detroit', () => {
        cy.contains('Next').click()

        cy.contains('Does the applicant or any affiliated company currently own property in Detroit?*')
    })

    it('List of Properties in Detroit', () => {
        cy.contains('Yes').click()

        cy.contains('Part of the City’s initial screening of the applicants inquiry includes a review of the property that the applicant owns to confirm tax status and blight ticket status. Please add any addresses of property that the applicant owns in Detroit.')

        cy.get('#detroit-property-0').type('1301 third, 48226')
    })

    it('Test Add/Remove Geocoder', () => {
        cy.get('[aria-label="add"]').click()

        cy.wait(500)
        cy.get('#detroit-property-1').should('be.visible')

        cy.get('[aria-label="remove"]').click()
        cy.wait(500)
        cy.get('#detroit-property-1').should('not.exist')
    })

    it('LLCs in Detroit', () => {
        cy.contains('Next').click()

        cy.contains('Does the applicant operate under any LLC’s or Entities in the City of Detroit?')
    })

    it('LLCs in Detroit List', () => {
        cy.contains('Yes').click()

        cy.contains('What LLCs/Entities does the applicant operate under?')

        cy.get('#llc-entities-0').type('Test LLC')
    })

    it('Test Add/Remove LLC', () => {
        cy.get('[aria-label="add"]').click()

        cy.get('#llc-entities-1').should('exist')

        cy.get('[aria-label="remove"]').click()

        cy.get('#llc-entities-1').should('not.exist')
    })

    it('Delinquent Taxes or Blight Tickets', () => {
        cy.contains('Next').click()

        cy.contains('Is the applicant delinquent on any property taxes or blight tickets in the City of Detroit?')
    })

    it('Test Hints', () => {
        cy.get('button.hint-btn.show-hint').click()

        cy.get('.intake-hint.active').should('be.visible')

        cy.get('button.hint-btn.close-hint').click()

        cy.get('.intake-hint.active').should('not.be.visible')
    })

    it('Send them to Payment Links', () => {
        cy.contains('Yes').click()

        cy.contains('Please follow the instructions below:')
        cy.contains('Pay Taxes Here')
        cy.contains('Pay Blight Tickets Here')
    })
})