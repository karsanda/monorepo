describe('hackernews-react', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('navbar link should function properly', () => {
    cy.get('nav').contains('Hacker News - React')
    cy.get('main[aria-label="topstories"]')

    cy.get('a[data-page="newstories"]').click()
    cy.url().should('include', '/newstories')
    cy.get('main[aria-label="newstories"]')

    cy.get('a[data-page="beststories"]').click()
    cy.url().should('include', '/beststories')
    cy.get('main[aria-label="beststories"]')

    cy.get('a[data-page="askstories"]').click()
    cy.url().should('include', '/askstories')
    cy.get('main[aria-label="askstories"]')

    cy.get('a[data-page="showstories"]').click()
    cy.url().should('include', '/showstories')
    cy.get('main[aria-label="showstories"]')

    cy.get('a[data-page="jobstories"]').click()
    cy.url().should('include', '/jobstories')
    cy.get('main[aria-label="jobstories"]')
  })
})