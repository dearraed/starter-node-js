const mongoose = require('mongoose');
const { db } = require("./../config")

const dbURI = 'mongodb://' + db.host + ':' + db.port + '/' + db.name;
console.log(dbURI);
module.exports.connect = async () => {
    try {
        const conn = await mongoose.connect(dbURI)   
        console.log('Mongo db connected', conn.connection.host)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}


