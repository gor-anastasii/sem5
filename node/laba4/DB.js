const EventEmitter = require("events");

class DB extends EventEmitter{
    constructor(){
        super();
        this.db_data =[
            {
                id: '1',
                name: 'Nastya',
                bdate: '14.12.2004'
            },
            {
                id: '2',
                name: 'Vita',
                bdate: '03.02.2005'
            },
            {
                id: '3',
                name: 'Marta',
                bdate: '04.02.2004'
            }
        ]
    }

    dbState = []; 

    async select(obj){
        return this.db_data;
    }

    async insert(obj) {
        return new Promise((resolve, reject) => {
            if (!obj.id || !obj.name || (obj.bdate && new Date(obj.bdate) > new Date())) {
                console.log("Error: invalid input");
                return reject({ error: "ID and Name are required fields." });
            }
    
            let elem = this.db_data.find(item => item.id === obj.id);

            if (elem) {
                console.log("Error: ID already used");
                return reject({ error: "ID already used." });
            }
    
            this.db_data.push({ id: obj.id, name: obj.name, bdate: obj.bdate });
            resolve({ success: this.db_data[this.db_data.length - 1] });
        });
    }

    async update(obj) {
        return new Promise((resolve, reject) => {
             if (obj.bday && new Date(obj.bday) > new Date()) {
                console.log("Error: invalid bdate");
                return reject({ error: "Invalid birth date." });
            } else {
                let elem = this.db_data.find(item => item.id == obj.id);
                if (elem) {
                    let index = this.db_data.indexOf(elem);
                    if (index !== -1) {
                        this.db_data[index] = obj; 
                        console.log(this.db_data);
                        return resolve({ success: this.db_data[index] });
                    }
                }
                return reject({ error: "ID not found." });
            }
        });
    }

    async delete(obj) {
        return new Promise((resolve, reject) => {
            let elem = this.db_data.find(item => item.id == obj.id);
            if (elem) {
                let index = this.db_data.indexOf(elem);
                if (index !== -1) {
                    this.db_data.splice(index, 1); 
                    console.log(this.db_data);
                    return resolve(elem); 
                }
            }
    
            return reject({ error: "ID not found." });
        });
    }
}

exports.DB = DB;