// const {Id} = require('../id');
const ObjectId = require('mongojs').ObjectId;

module.exports.makeCommentsDb = function ({makeDb}) {
    return Object.freeze({
        findAll,
        findByHash,
        findById,
        findByContextId,
        findReplies,
        insert,
        remove,
        update,
        buildAuthorName
    })
    async function findAll ({ publishedOnly = true } = {}) {
        const db = await makeDb();
        const query = publishedOnly ? { published: true } : {}
        const result = await db.collection('comments').find(query)
        return (await result.toArray()).map(({ _id: id, ...found }) => ({
            id,
            ...found
        }))
    }
    async function findById ({ id: _id }) {
        const db = await makeDb()
        const result = await db.collection('comments').find({ _id })
        const found = await result.toArray()
        if (found.length === 0) {
            return null
        }
        const { _id: id, ...info } = found[0]
        return { id, ...info }
    }
    async function findByContextId ({ contextId, omitReplies = true }) {
        const result = () => {
            return new Promise((resolve, reject) => {
                const query = { contextId: contextId }
                if (omitReplies) {
                    query.replyToId = null
                }
                db.collection('comments').find(query, (err, comments) => {
                    if (err) reject(err);
                    comments = comments.map(({ _id: id, ...found }) => ({
                        id,
                        ...found
                    }));
                    resolve(comments)
                })
            })
        }
        return await result()
    }
    async function findReplies ({ commentId, publishedOnly = true }) {
        const db = await makeDb()
        const query = publishedOnly
            ? { published: true, replyToId: commentId }
            : { replyToId: commentId }
        const result = await db.collection('comments').find(query)
        return (await result.toArray()).map(({ _id: id, ...found }) => ({
            id,
            ...found
        }))
    }
    async function insert ({ ...commentInfo }) {
        const db = await makeDb()
        const result = () => {
            return new Promise((resolve, reject) => {
                db.collection('comments').insert({ ...commentInfo }, function (err, result) {
                    if (err) reject(err)
                    resolve(result)
                })
            })
        }
        return await result();
    }

    async function update ({ id: _id, ...commentInfo }) {
        const db = await makeDb()
        const result = await db
            .collection('comments')
            .updateOne({ _id }, { $set: { ...commentInfo } })
        return result.modifiedCount > 0 ? { id: _id, ...commentInfo } : null
    }
    async function remove ({ id: _id }) {
        const db = await makeDb()
        const result = await db.collection('comments').deleteOne({ _id })
        return result.deletedCount
    }
    async function findByHash (comment) {
        const db = await makeDb()
        const result = () => {
            return new Promise((resolve, reject) => {
                db.collection('comments').find({ hash: comment.hash }, function(err, result){
                    if (err) reject(err)
                    resolve(result)
                })
            })
        }
        const found = await result();
        if (found.length === 0) {
            return null
        }
        const { _id: id, ...insertedInfo } = found[0]
        return { id, ...insertedInfo }
    }
    async function buildAuthorName (comments) {
        let author_ids = {}
        comments.forEach((c)=>{
            author_ids[c.author] = {full_name:"Bot", username:"bot"};
        });
        let author_ids_arr = Object.keys(author_ids).map((_id)=>{
            return ObjectId(_id)
        })
        const result = () => {
            return new Promise((resolve, reject) => {
                db.collection('user_account').find({ _id:{$in: author_ids_arr} }, function(err, result){
                    if (err) reject(err)

                    result.forEach((author)=>{
                        author_ids[author._id]["display_name"] = (author.full_name === "") ? author.email : author.full_name;
                        author_ids[author._id]["full_name"] = author.full_name;
                        author_ids[author._id]["username"] = author.username
                    });

                    resolve(author_ids)
                })
            })
        }
        return await result();
    }
}