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
        cy.get('p').should('contain', `Data: 01/01/2022, 12:00:00`);
    });
    
    it('Deve ser capaz de atualizar um registro do mapa', () => {
        cy.visit('http://localhost:8080/');
        cy.wait(2000);

        cy.get('#map').should('be.visible').then(() => {
            cy.get('#map').click(testPoint.x, testPoint.y - 15);
        });

        cy.get('.update').should('be.visible').then(() => {
            cy.get('#titulo').clear();
            cy.get('#titulo').type('Example Occurrence');
            cy.get('#tipo').select('Homicídio');
            cy.get('#data').type('2022-01-01T12:00');

            cy.get('.update').click();
        });

        cy.on('window:alert', (message) => {
            expect(message).to.equal('Ocorrência atualizada com sucesso');
        });

        cy.reload();
        cy.wait(2000);
        cy.get('#map').click(testPoint.x, testPoint.y - 15);

        cy.get('p').should('contain', 'Título: Example Occurrence');
        cy.get('p').should('contain', 'Tipo: Homicídio');
        cy.get('p').should('contain', `Data: 01/01/2022, 12:00:00`);
 
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

    it('Deve retornar um erro ao registrar uma ocorrência sem marcar o local no mapa', () => {
        cy.visit('http://localhost:8080/');
        cy.wait(2000);

        cy.get('#map').should('be.visible').then(() => {
            cy.get('#titulo').type('Example Title');
            cy.get('#tipo').select('Assalto');
            cy.get('#data').type('2022-01-01T12:00');

            cy.get('#register').click();
        });

        cy.on('window:alert', (message) => {
            expect(message).to.equal('Selecione um local no mapa antes de registrar');
        });
    });
    
});
