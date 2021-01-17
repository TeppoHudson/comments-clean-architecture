const {addComment, listComments} = require('../use-cases').commentService;

/** todo: edit comments and remove comments */
// const {editComments} = require('../use-cases').commentService;
// const {removeComments} = require('../use-cases').commentService;

const makeGetComments = require('./get-comments').makeGetComments;
const makePostComment = require('./post-comment').makePostComment;
const notFound = require('./not-found').notFound;

const getComments = makeGetComments({listComments});
const postComment = makePostComment({ addComment });

const commentController = Object.freeze({
    // deleteComment,
    getComments,
    notFound,
    postComment,
    // patchComment
});

module.exports.commentController = commentController
module.exports.notFound = notFound