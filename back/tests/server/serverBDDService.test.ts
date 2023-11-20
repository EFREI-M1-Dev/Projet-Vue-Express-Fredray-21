// Importez ce que vous avez besoin, y compris openConnectionMock
import { ServerBDDService } from '../../src/server/ServerBDDService';
import { describe, test, beforeEach, expect, jest } from '@jest/globals';

describe('ServerBDDService', () => {
    let serverBDDService: ServerBDDService;

    beforeEach(() => {
        // Créez une nouvelle instance du service à tester
        serverBDDService = new ServerBDDService();
    });

    // Testez la méthode add
    test('add server', async () => {
        const mockServerName = 'MockServer';
        const mockDescription = 'MockDescription';
        const mockOwner = {
            userId: 1,
            username: 'MockUsername',
            email: 'MockEmail',
            password: 'MockPassword',
            creationDate: new Date(),
            bio: 'MockBio',
            avatarUrl: 'MockAvatarUrl',
        };

        const result = await serverBDDService.add(mockServerName, mockDescription, mockOwner);

        // Effectuez vos assertions ici en fonction du comportement attendu
        expect(result.getServerName()).toBe(mockServerName);
        expect(result.getDescription()).toBe(mockDescription);
        expect(result.getOwner().getId()).toBe(mockOwner.userId);
    });
});
