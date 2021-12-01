import * as faker from 'faker'

describe('Users', () => {
  const deleteModal = '[data-cy=deleteUserModal]'
  const createOrUpdateModal = '[data-cy=createOrUpdateUserModal]'
  const submitCreateOrUpdateButton = '[data-cy=submitCreateOrUpdateUser]'
  const nameInput = '[data-cy=nameInput]'
  const descriptionInput = '[data-cy=descriptionInput]'

  it('Create user and see them in home page', () => {
    const name = faker.name.findName()
    const description = faker.lorem.sentence()

    cy.visit('/')
    cy.get('[data-cy=openCreateUserModal]').click()
    cy.get(createOrUpdateModal).should('exist')

    cy.get(submitCreateOrUpdateButton).should('be.disabled')
    cy.get(nameInput).type(name)
    cy.get(submitCreateOrUpdateButton).should('not.be.disabled')
    cy.get(descriptionInput).type(description)

    cy.get(submitCreateOrUpdateButton).click()
    cy.get(createOrUpdateModal).should('not.exist')

    cy.contains(name)
    cy.contains(description)
  })

  it('Create user then change their name and see it changed', () => {
    const editUserModalTitle = 'Edit user'
    const initialName = faker.name.findName()
    const changedName = faker.name.findName()

    cy.visit('/')
    cy.get('[data-cy=openCreateUserModal]').click()
    cy.get(createOrUpdateModal).should('exist')

    cy.get(nameInput).type(initialName)
    cy.get(submitCreateOrUpdateButton).click()
    cy.get(createOrUpdateModal).should('not.exist')

    cy.contains(initialName).closest('[data-cy=userCard]').find('[data-cy=editUser]').click()
    cy.contains(editUserModalTitle)

    cy.get(nameInput).clear().type(changedName)
    cy.get(submitCreateOrUpdateButton).click()
    cy.get(createOrUpdateModal).should('not.exist')

    cy.contains(initialName).should('not.exist')
    cy.contains(changedName)
  })

  it('Delete user and not see them in home page', () => {
    cy.visit('/')
    cy.get('[data-cy=userCard]').first().find('[data-cy=userCardName]').then((cardName) => {
      const name = cardName.text()
      cardName.closest('[data-cy=userCard]').find('[data-cy=deleteUser]').click()
      cy.get(deleteModal).contains(name)
      cy.get('[data-cy=submitDeleteUser]').click()
      cy.get(deleteModal).should('not.exist')
      cy.contains(name).should('not.exist')
    })
  })
})
