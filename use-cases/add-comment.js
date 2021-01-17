const makeComment = require( '../comment').makeComment
module.exports.makeAddComment = function ({ commentsDb, handleModeration }) {
    return async function addComment (commentInfo) {
        const comment = makeComment(commentInfo)
        const exists = await commentsDb.findByHash({ hash: comment.getHash() });
        console.log('exists:',exists);
        if (exists) {
            return exists
        }

        /** todo later modedation handler - now just get source directly from comment object */
        const moderated = await handleModeration({ comment });
        const commentSource = moderated.getSource();

        return commentsDb.insert({
            author: moderated.getAuthor(),
            createdOn: moderated.getCreatedAt(),
            hash: moderated.getHash(),
            id: moderated.getId(),
            modifiedOn: moderated.getModifiedOn(),
            contextId: moderated.getContextId(),
            published: moderated.isPublished(),
            replyToId: moderated.getReplyToId(),
            source: {
                ip: commentSource.getIp(),
                browser: commentSource.getBrowser(),
                referrer: commentSource.getReferrer()
            },
            text: moderated.getText(),
            type: moderated.getType()
        })
    }
}