/// <reference types="Cypress" />

context('Actions', () => {
    beforeEach(() => {
        cy.visit('http://quadrance.test');

        login('vincent.veysset+admin@adfab.com', 'Adfab2019!');
    });

    it('Emails process', () => {
        cy.contains('Email Campaign').click();

        // sendEmail('Subject', 'Message', 1);
        // sendEmail('Subject', 'Message', 1, 'Montreal', 'base tag');
        // sendEmail('Subject', 'Message', 1, null, null, ['fabrice labbé', 'fabrice mtl'], ['fabrice mtl']);
    });

    function login(username, password) {
        cy.get('.inviteCode').click();
        cy.get('.form button').eq(1).click();

        cy.get('.form input').eq(0).type(username);
        cy.get('.form input').eq(1).type(password);

        cy.get('.form button').eq(0).click();

        cy.wait(1000);
    }

    function sendEmail(subject, body, contentType, team, tag, users, usersPreview) {
        let subjectInput = 0;

        if (team && tag && !users) {
            cy.contains('To Everyone').click({force: true});
            cy.contains('To Selected Teams/Tags').click({force: true});

            cy.contains('Global (All Teams)').click({force: true});
            cy.contains(team).click({force: true});

            cy.contains('Don\'t Limit By Tag').click({force: true});
            cy.contains(tag).click({force: true});

            subjectInput = 2;
        }

        if (users && !team && !tag) {
            cy.contains('To Everyone').click({force: true});
            cy.contains('To Select Users').click({force: true});

            users.forEach(function (user) {
                cy.get('.selection').eq(0).find('.search').eq(0).click({force: true});
                cy.contains(user).click({force: true});
                cy.contains('Add').click({force: true});
            });

            subjectInput = 1;
        }

        cy.get('input').eq(subjectInput).type(subject, {force: true});

        if (contentType) {
            contentType = contentType - 1;

            cy.contains('What should the email body contain?').next().find('.item').eq(contentType).click({force: true});

            switch (contentType) {
                case 0:
                    cy.get('.public-DraftEditor-content').click().type(body);
                    break;
                case 1:
                    cy.get('.public-DraftEditor-content').click().type(body);
                    break;
                case 2:
                    break;
            }
        }

        if (usersPreview) {
            cy.contains(' Preview & Options... ').click();

            usersPreview.forEach(function (userPreview) {
                cy.get('.selection').eq(1).find('.search').eq(0).click();
                cy.get('.selection').eq(1).contains(userPreview).click();
                cy.get('.form').eq(3).contains('Add').eq(0).click();
                // cy.get('.form').eq(3).contains('Send Preview').eq(0).click();
            });
        } else {
            // cy.contains('Send Now').eq(0).click();
        }
    }
});
