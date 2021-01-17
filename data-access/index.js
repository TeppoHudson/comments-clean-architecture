const makeCommentsDb = require('./comments-db.js').makeCommentsDb
import mongodb from 'mongodb'

/** you need to set the mongo db names in env */
const MongoClient = mongodb.MongoClient
const url = process.env.DM_COMMENTS_DB_URL
const dbName = process.env.DM_COMMENTS_DB_NAME
const client = new MongoClient(url, { useNewUrlParser: true })

async function makeDb () {
    if (!client.isConnected()) {
        await client.connect()
    }
    return client.db(dbName)
}

const commentsDb = makeCommentsDb({makeDb});

const databaseServices = Object.freeze({
    commentsDb
})

module.exports.databaseServices = databaseServices;