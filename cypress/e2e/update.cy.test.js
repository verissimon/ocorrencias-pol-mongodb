describe('Index Page', () => {
    let testPoint = { x: 100, y: 150 }

    beforeEach(() => {
        cy.visit('http://localhost:8080/');
        cy.wait(5000); // Wait for the map to load
        cy.get('#map').should('be.visible').then(() => {
            cy.get('#map').click(testPoint.x, testPoint.y);
        });

        cy.get('#titulo').type('Example Title');
        cy.get('#tipo').select('Assalto');
        cy.get('#data').type('2022-01-01T12:00');

        cy.get('#register').click();
    });

    
    it('Deve ser capaz de atualizar um registro no mapa', () =>{
        cy.get('#map').should('be.visible').then(() => {
            cy.get('#map').click(testPoint.x, testPoint.y -15 );
        });

        cy.get('.update').should('be.visible').then(() => {
            cy.get('#titulo').type('Example Occurrence');
            cy.get('#tipo').select('Homicídio');
            cy.get('#data').type('2022-01-01T12:00');

            cy.get('.update').click();
        });

        cy.on('window:alert', (message) => {
            expect(message).to.equal('Ocorrência atualizada com sucesso');
        });
    });
});