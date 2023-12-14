describe('Index Page', () => {
    let testPoint = { x: 200, y: 400 }
    beforeEach(function () {
        cy.visit('http://localhost:8080/');
        cy.wait(2000)
        cy.get('#map').should('be.visible').then(() => {
            cy.get('#map').click(testPoint.x, testPoint.y);
        });

        cy.get('#titulo').type('Example Title');
        cy.get('#tipo').select('Assalto');
        cy.get('#data').type('2022-01-01T12:00');

        cy.get('#register').click();
        cy.wait(1000)
    })

    it('Deve ser capaz de deletar um registro no mapa', () => {
        cy.wait(1000);
        cy.get('#map').should('be.visible').then(() => {
            cy.get('#map').click(testPoint.x, testPoint.y - 15);
        });
        cy.get('.delete').should('be.visible').then(() => {
            cy.get('.delete').click();
        });

        cy.on('window:alert', (message) => {
            expect(message).to.equal('Ocorrência deletada com sucesso');
        });
    });

});
