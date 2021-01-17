module.exports.makeListComments = function ({ commentsDb }) {
    return async function listComments ({ contextId } = {}) {
        if (!contextId) {
            throw new Error('You must supply a post id.')
        }
        let comments = await commentsDb.findByContextId({
            contextId,
            omitReplies: false
        });

        const authorNames = await commentsDb.buildAuthorName(comments);
        comments = await buildAuthors(comments, authorNames);
        return nest(comments);

        /** If this gets slow introduce caching. */
        function nest (comments) {
            if (comments.length === 0) {
                return comments
            }
            return comments.reduce((nested, comment) => {
                comment.replies = comments.filter(
                    reply => reply.replyToId === comment.id
                )
                nest(comment.replies)
                if (comment.replyToId == null) {
                    nested.push(comment)
                }
                return nested
            }, [])
        }

        async function buildAuthors (comments, authorNames) {
            return comments.map((comment)=>{
                comment.author = authorNames[comment.author]
                return comment
            })
        }
    }
}