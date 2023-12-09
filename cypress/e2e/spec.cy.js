describe('Index Page', () => {
    let testPoint = { x: 100, y: 150 }
    it('Deve ser capaz de criar um registro no mapa', () => {
        cy.visit('http://localhost:8080/');
        cy.wait(2000); // espera o mapa carregar
        cy.get('#map').should('be.visible').then(() => {
            cy.get('#map').click(testPoint.x, testPoint.y);
        });

        cy.get('#titulo').type('Example Title');
        cy.get('#tipo').select('Assalto');
        cy.get('#data').type('2022-01-01T12:00');

        cy.get('#register').click();

        cy.reload();
        cy.wait(2000)
        cy.get('#map').click(testPoint.x, testPoint.y - 15);

        cy.get('p').should('contain', 'Título: Example Title');
        cy.get('p').should('contain', 'Tipo: Assalto');
        cy.get('p').should('contain', `Data: 1/1/2022, 12:00:00 PM`);
    });

    it('Deve ser capaz de deletar um registro no mapa', () => {
        cy.visit('http://localhost:8080/');
        cy.wait(2000); // espera o mapa carregar

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
