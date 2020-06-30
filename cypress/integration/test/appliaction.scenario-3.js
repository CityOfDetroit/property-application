/// <reference types="cypress" />

context('Appliation Scenario 2', () => {
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

    it('Identified property for purchase', () => {
        cy.contains('No').click()

        cy.contains('Has the applicant identified a property/properties for purchase?')
    })

    it('Test Hints', () => {
        cy.get('button.hint-btn.show-hint').click()

        cy.get('.intake-hint.active').should('be.visible')

        cy.get('button.hint-btn.close-hint').click()

        cy.get('.intake-hint.active').should('not.be.visible')
    })

    it('Interested Property Address', () => {
        cy.contains('Yes').click()

        cy.contains('Please add the address(es) of all properties the applicant is interested in purchasing.')

        cy.get('#interested-property-0').type('1301 third, 48226')
    })

    it('Test Hints', () => {
        cy.get('button.hint-btn.show-hint').click()

        cy.get('.intake-hint.active').should('be.visible')

        cy.get('button.hint-btn.close-hint').click()

        cy.get('.intake-hint.active').should('not.be.visible')
    })

    it('Test Add/Remove Property Address', () => {
        cy.get('[aria-label="add"]').click()

        cy.get('#interested-property-1').should('exist')

        cy.get('[aria-label="remove"]').click()

        cy.get('#interested-property-1').should('not.exist')
    })

    it('Adjecent Property', () => {
        cy.contains('Next').click()

        cy.contains('Is the property adjacent to another property that the applicant owns?')
    })

    it('Test Hints', () => {
        cy.get('button.hint-btn.show-hint').click()

        cy.get('.intake-hint.active').should('be.visible')

        cy.get('button.hint-btn.close-hint').click()

        cy.get('.intake-hint.active').should('not.be.visible')
    })

    it('List of Adjecent Properties', () => {
        cy.contains('Yes').click()

        cy.contains('Please add the address(es) of the adjacent property.')

        cy.get('#adjacent-property-0').type('1301 third, 48226')
    })

    it('Test Hints', () => {
        cy.get('button.hint-btn.show-hint').click()

        cy.get('.intake-hint.active').should('be.visible')

        cy.get('button.hint-btn.close-hint').click()

        cy.get('.intake-hint.active').should('not.be.visible')
    })

    it('Test Add/Remove Property Address', () => {
        cy.get('[aria-label="add"]').click()

        cy.get('#adjacent-property-1').should('exist')

        cy.get('[aria-label="remove"]').click()

        cy.get('#adjacent-property-1').should('not.exist')
    })

    it('Own or Rent', () => {
        cy.contains('Next').click()

        cy.contains('Did the applicant previously own or rent this property?')
    })

    it('Purchase or Lease', () => {
        cy.contains('Rent').click()

        cy.contains('Is the application seeking to purchase or commercial lease the property?')
    })

    it('Offer', () => {
        cy.contains('Purchase').click()

        cy.contains('The first step to negotiating a property’s price is to put in an offer. After you submit an offer, DLBA or DBA will work with you on final pricing. Pricing is based on which Detroit Land Bank Authority or Detroit Building Authority program you are eligible for. The Detroit Land Bank Authority and Detroit Building Authority sell property at fair market value.')

        cy.get('#offer').type('$5,500')
    })

    it('Test Hints', () => {
        cy.get('button.hint-btn.show-hint').click()

        cy.get('.intake-hint.active').should('be.visible')

        cy.get('button.hint-btn.close-hint').click()

        cy.get('.intake-hint.active').should('not.be.visible')
    })

    it('Primary Use', () => {
        cy.contains('Next').click()

        cy.contains('Select the primary use for the property')

        cy.get('#commercial-retail').check()
    })

    it('Anticipated Work', () => {
        cy.contains('Next').click()

        cy.contains('Check all work that the applicant anticipates completing on this parcel(s):')

        cy.get('#new-construction').check()
    })

    it('Proposal', () => {
        cy.contains('Next').click()

        cy.contains('Detroit is actively seeking viable projects that creates the highest probability of success.')

        cy.get('#proposal').type('Test Proposal here.')
    })

    it('Zoning Compliant', () => {
        cy.contains('Next').click()

        cy.contains('Is the Proposed Zoning Compliant?')
    })

    it('Test Hints', () => {
        cy.get('button.hint-btn.show-hint').click()

        cy.get('.intake-hint.active').should('be.visible')

        cy.get('button.hint-btn.close-hint').click()

        cy.get('.intake-hint.active').should('not.be.visible')
    })

    it('Zoning Compliant', () => {
        cy.contains('Yes').click()

        cy.contains('What is the applicants total development costs?')
        cy.contains('What is the applicants construction timeline?')
        cy.contains('What is the applicants funding source?')

        cy.get('#development-cost').type('$500')
        cy.get('#construction-timeline').type('5 months')
        cy.get('#funding-source').type('Mom')
    })

    it('Zoning Compliant', () => {
        cy.contains('Yes').click()

        cy.contains('What is the applicants total development costs?')
        cy.contains('What is the applicants construction timeline?')
        cy.contains('What is the applicants funding source?')

        cy.get('#development-cost').type('$500')
        cy.get('#construction-timeline').type('5 months')
        cy.get('#funding-source').type('Mom')
    })

    it('Additional Files', () => {
        cy.contains('Next').click()

        cy.contains('Attach any additional information or support letters.')
    })

    it('Test Add/Remove Property Address', () => {
        cy.get('[aria-label="add"]').click()

        cy.get('#additional-files-1').should('exist')

        cy.get('[aria-label="remove"]').click()

        cy.get('#additional-files-1').should('not.exist')
    })

    it('Acknowwledge Page', () => {
        cy.contains('Next').click()

        cy.contains('I acknowledge that failure to disclose a material fact or to misrepresent a fact can result in a rejection of my application.')

        cy.get('#agreement-understanding').type('John Doe')
        cy.get('#today-date').type('07/01/2020')
    })

    it('Finished Application', () => {
        cy.contains('Next').click()

        cy.contains('Thank you! You should receive a response within in 15 business days. You can learn more about how to prepare for a smooth property purchase at “xxx” link.')
    })
})