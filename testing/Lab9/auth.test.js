const { registerUser, authenticateUser } = require('./auth');
const { db } = require('./db');

jest.mock('./db');

describe('Authentication module tests', () => {
    beforeEach(() => {
        db.data = [];
        db.select.mockClear();
    });

    test('register a new user', async () => {
        const user = await registerUser('1', 'Alice Johnson', '2000-05-15');
        expect(user).toEqual({ id: '1', name: 'Alice Johnson', birthday: '2000-05-15' });
    });

    test('authenticate an existing user', async () => {
        db.select.mockResolvedValue([
            { id: '1', name: 'Alice Johnson', birthday: '2000-05-15' },
            { id: '2', name: 'Bob Smith', birthday: '2001-07-20' }
        ]);

        await registerUser('2', 'Bob Smith', '2001-07-20');
        const user = await authenticateUser('2');
        expect(user).toEqual({ id: '2', name: 'Bob Smith', birthday: '2001-07-20' });
    
    });

    test('authenticate a non-existent user', async () => {
        db.select.mockResolvedValue([
            { id: '1', name: 'Alice Johnson', birthday: '2000-05-15' }
        ]);

        const user = await authenticateUser('999');
        expect(user).toBeNull();
    });
});