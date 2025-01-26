const { db } = require('./db.js');

describe('Database module tests', () => {
    beforeEach(() => {
        db.data = [];
    });

    test('insert a new user', async () => {
        const user = await db.insert('1', 'Alice Johnson', '2000-05-15');
        expect(user).toEqual({ id: '1', name: 'Alice Johnson', birthday: '2000-05-15' });
        expect(db.data.length).toBe(1);
    });

    test('select users', async () => {
        await db.insert('2', 'Bob Smith', '2001-07-20');
        await db.insert('3', 'Charlie Brown', '2010-12-03');
        const users = await db.select();
        expect(users).toHaveLength(2);
        expect(users).toContainEqual({ id: '2', name: 'Bob Smith', birthday: '2001-07-20' });
        expect(users).toContainEqual({ id: '3', name: 'Charlie Brown', birthday: '2010-12-03' });
    });

    test('update an existing user', async () => {
        await db.insert('4', 'David Wilson', '2002-01-01');
        const updatedUser = await db.update('4', 'David Williams', '2002-01-01');
        expect(updatedUser).toEqual({ id: '4', name: 'David Williams', birthday: '2002-01-01' });
    });

    test('update a non-existent user', async () => {
        const result = await db.update('999', 'Non-existent User', '2000-01-01');
        expect(result).toBeNull();
    });

    test('delete an existing user', async () => {
        await db.insert('5', 'Eva Green', '2005-03-04');
        const deletedUser = await db.delete('5');
        expect(deletedUser).toEqual({ id: '5', name: 'Eva Green', birthday: '2005-03-04' });
        expect(db.data.length).toBe(0);
    });

    test('delete a non-existent user', async () => {
        const result = await db.delete('999');
        expect(result).toBeNull();
    });

    test('insert multiple users and select them', async () => {
        await db.insert('6', 'Frank Castle', '2009-09-11');
        await db.insert('7', 'Grace Lee', '2010-11-29');
        await db.insert('8', 'Hannah Adams', '2004-04-25');

        const users = await db.select();
        expect(users).toHaveLength(3);
        expect(users).toEqual(expect.arrayContaining([
            { id: '6', name: 'Frank Castle', birthday: '2009-09-11' },
            { id: '7', name: 'Grace Lee', birthday: '2010-11-29' },
            { id: '8', name: 'Hannah Adams', birthday: '2004-04-25' }
        ]));
    });

    test('update multiple users', async () => {
        await db.insert('9', 'Ian Malcolm', '2000-06-12');
        await db.insert('10', 'Judy Hopps', '2010-02-01');

        const updatedUser1 = await db.update('9', 'Ian Malcolm', '2010-06-12');
        const updatedUser2 = await db.update('10', 'Judy Hopps', '2000-02-01');

        expect(updatedUser1).toEqual({ id: '9', name: 'Ian Malcolm', birthday: '2010-06-12' });
        expect(updatedUser2).toEqual({ id: '10', name: 'Judy Hopps', birthday: '2000-02-01' });
    });
});