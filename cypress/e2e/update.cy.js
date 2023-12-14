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

    afterEach(function () {
        cy.visit('http://localhost:8080/');
        cy.wait(2000)
        cy.get('#map').should('be.visible').then(() => {
            cy.get('#map').click(testPoint.x, testPoint.y - 10);
        });

        cy.get('.delete').should('be.visible').then(() => {
            cy.get('.delete').click();
        });
        
        cy.reload();
    });

    it('Deve ser capaz de atualizar um registro do mapa', () => {
        cy.wait(1000);
        cy.get('#map').should('be.visible').then(() => {
            cy.get('#map').click(testPoint.x, testPoint.y - 15);
        });

        cy.get('.update').should('be.visible').then(() => {
            cy.get('#titulo').clear();
            cy.get('#titulo').type('Example Atualizou');
            cy.get('#tipo').select('Homicídio');
            cy.get('#data').type('2022-01-01T12:00');

            cy.get('.update').click();
        });
        cy.wait(500)
        cy.on('window:alert', (message) => {
            expect(message).to.equal('Ocorrência atualizada com sucesso');
        });

        cy.reload();
        cy.wait(5000);
        cy.get('#map').click(testPoint.x, testPoint.y - 15);

        cy.get('p').should('contain', 'Título: Example Atualizou');
        cy.get('p').should('contain', 'Tipo: Homicídio');
        // cy.get('p').should('contain', `Data: 01/01/2022, 12:00:00`);
    });

});