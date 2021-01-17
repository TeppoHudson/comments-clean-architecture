const {makeAddComment} = require('./add-comment')
const {makeListComments} = require('./list-comments')
const {makeHandleModeration} = require('./handle-moderation')
const {commentsDb} = require('../data-access').databaseServices
const {isQuestionable} = require('../is-questionable')

const handleModeration = makeHandleModeration({
    isQuestionable,
    initiateReview: async () => {} // TODO: Make proper initiate review function.
});
const addComment = makeAddComment({
    commentsDb,
    handleModeration
})

// const editComment = makeEditComment({ commentsDb, handleModeration })

const listComments = makeListComments({
    commentsDb
})

// const removeComment = makeRemoveComment({ commentsDb })

const commentService = Object.freeze({
    addComment,
    // editComment,
    // handleModeration,
    listComments,
    // removeComment
})

module.exports.commentService = commentService