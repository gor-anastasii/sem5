const createUser = (id, name, birthday) => ({
    id, 
    name, 
    birthday
});

const db = {
    data: [],

    async select(){
        return this.data;
    },

    async insert(id, name, birthday){
        const newUser = createUser(id, name, birthday);
        this.data.push(newUser);
        return newUser;
    },

    async update(id, name, birthday){
        const indUser = this.data.findIndex(user => user.id == id);
        if(indUser !== -1){
            this.data[indUser] = createUser(id, name, birthday);
            return this.data[indUser];
        }
        return null;
    },

    async delete(id){
        const indUser = this.data.findIndex(user => user.id == id);
        if(indUser !== -1){
            return this.data.splice(indUser, 1)[0];
        }
        return null;
    }
};

module.exports = { db };