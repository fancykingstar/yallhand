/// <reference types="Cypress" />

context('Actions', () => {
    beforeEach(() => {
        cy.visit('http://quadrance.test');

        login(Cypress.env('username'), Cypress.env('password'));
    });

    it('Emails process', () => {
        let defaultSubject = 'Lorem ipsum';

        let allUsers = ['fabrice labbé', 'fabrice mtl', 'fabrice new york', 'fabrice paris', 'fabrice labbé tag 1', 'fabrice labbé tag 2', 'fabrice labbé tag 1 + mtl', 'fabrice labbé tag 2 + NY'];

        cy.contains('Email Campaign').click();

        sendEmail(defaultSubject, 'test 1', 1, null, null, null, null, null, ['fabrice mtl']);

        sendEmail(defaultSubject, 'test 2', 2, null, null, null, null, null, ['fabrice mtl']);

        sendEmail(defaultSubject, 'test 3', 3, null, null,null, null, null, ['fabrice mtl']);

        sendEmail(defaultSubject, 'test 4', 2, ['Faq Mtl 1'], ['Announcement tag 1'],null, '- tag 1', null, ['fabrice new york']);

        sendEmail(defaultSubject, 'test 5', 1, null, null,null, null, null, null);

        sendEmail(defaultSubject, 'test 6', 2, ['Faq tag 1'], ['Announcement global 1', 'Announcement Mtl 1'],null, null, null, ['fabrice new york']);

        sendEmail(defaultSubject, 'test 7', 1, null, null,'Montreal', null, null, null);

        sendEmail(defaultSubject, 'test 8', 1, null, null,null, '- tag 1', null, null);

        sendEmail(defaultSubject, 'test 9', 1, null, null,'New york', '- tag 2', null, null);

        sendEmail(defaultSubject, 'test 10', 2, ['Faq tag 1'], null,'Global (All Teams)', 'Don\'t Limit By Tag', null, null);

        sendEmail(defaultSubject, 'test 11', 1, null, null,null, null, ['fabrice mtl'], null);

        sendEmail(defaultSubject, 'test 12', 2, ['Faq tag 1'], ['Announcement Mtl 1'],null, null, ['fabrice mtl'], null);
    });

    function login(username, password) {
        cy.get('.inviteCode').click();
        cy.get('.form button').eq(1).click();

        cy.get('.form input').eq(0).type(username);
        cy.get('.form input').eq(1).type(password);

        cy.get('.form button').eq(0).click();

        cy.wait(1000);
    }

    function sendEmail(subject, body, contentType, faqs, announcements, team, tag, users, usersPreview) {
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

            if (contentType === 0 || contentType === 1) {
                cy.get('.public-DraftEditor-content').click().type(body);
            }

            if (contentType === 1 || contentType === 2) {
                // Add FAQ's
                cy.get('.ContentSearchFrame').eq(0).find('input').eq(0).focus().type(' ');
                cy.wait(1000);

                if (faqs) {
                    faqs.forEach(function (faq, index) {
                        if (index !== 0) {
                            cy.get('.ContentSearchFrame').eq(0).find('input').eq(0).focus().type(' ');
                            cy.wait(1000);
                        }

                        cy.get('.ContentSearchFrame').eq(0).find('.category').eq(1).contains(faq).click({force: true});
                    });
                } else {
                    cy.get('.ContentSearchFrame').eq(0).find('.category').eq(1).find('.result').each(function (value, index) {
                        if (index !== 0) {
                            cy.get('.ContentSearchFrame').eq(0).find('input').eq(0).focus().type(' ');
                            cy.wait(1000);
                        }

                        cy.get('.ContentSearchFrame').eq(0).find('.category').eq(1).find('.result').eq(index).click({force: true});
                    });
                }

                // Add Announcements
                cy.get('.ContentSearchFrame').eq(0).find('input').eq(0).focus().type(' ');
                cy.wait(1000);

                if (announcements) {
                    announcements.forEach(function (announcement, index) {
                        if (index !== 0) {
                            cy.get('.ContentSearchFrame').eq(0).find('input').eq(0).focus().type(' ');
                            cy.wait(1000);
                        }

                        cy.get('.ContentSearchFrame').eq(0).find('.category').eq(2).contains(announcement).click({force: true});
                    });
                } else {
                    cy.get('.ContentSearchFrame').eq(0).find('.category').eq(2).find('.result').each(function (value, index) {
                        if (index !== 0) {
                            cy.get('.ContentSearchFrame').eq(0).find('input').eq(0).focus().type(' ');
                            cy.wait(1000);
                        }

                        cy.get('.ContentSearchFrame').eq(0).find('.category').eq(2).find('.result').eq(index).click({force: true});
                    });
                }
            }
        }

        cy.wait(1000);

        if (usersPreview) {
            cy.contains(' Preview & Options... ').click({force: true});

            usersPreview.forEach(function (userPreview) {
                cy.get('.selection').eq(0).find('.search').eq(0).click({force: true});
                cy.get('.selection').eq(0).find('.menu').contains(userPreview).click();
                cy.get('.form').eq(2).contains('Add').click();
            });

            cy.get('.form').eq(2).contains('Send Preview').eq(0).click();

            backSendEmail();
        } else {
            cy.contains('Send Now').eq(0).click();
        }

        cy.wait(2000);

        clearAll();
    }

    function clearAll() {
        cy.wait(1000);
        cy.contains(' Clear All ').click();
    }

    function backSendEmail() {
        cy.wait(1000);
        cy.get('.left').eq(1).click();
    }
});
