module.exports.buildMakeComment = function ({ Id, md5, sanitize, makeSource }) {
    return function makeComment ({
                                     author,
                                     createdAt = Math.floor(Date.now() / 1000),
                                     id = Id.makeId(),
                                     source,
                                     modifiedOn = Math.floor(Date.now() / 1000),
                                     contextId,
                                     published = false,
                                     replyToId,
                                     text,
                                     type
                                 } = {}) {
        if (!Id.isValidId(id)) {
            throw new Error('Comment must have a valid id.')
        }
        if (!author) {
            throw new Error('Comment must have an author of logged in user.')
        }
        if (author.length < 2) {
            throw new Error("Comment author's name must be longer than 2 characters.")
        }
        if (!contextId) {
            throw new Error('Comment must contain a contextId.')
        }
        if (!text || text.length < 1) {
            throw new Error('Comment must include at least one character of text.')
        }
        if (!source) {
            throw new Error('Comment must have a source.')
        }
        let sanitizedText = sanitize(text).trim()
        if (sanitizedText.length < 1) {
            throw new Error('Comment contains no usable text.')
        }

        const validSource = makeSource(source)
        const deletedText = '.xX This comment has been deleted Xx.'
        let hash

        return Object.freeze({
            getAuthor: () => author,
            getCreatedAt: () => createdAt,
            getHash: () => hash || (hash = makeHash()),
            getId: () => id,
            getModifiedOn: () => modifiedOn,
            getContextId: () => contextId,
            getReplyToId: () => replyToId,
            getSource: () => validSource,
            getText: () => sanitizedText,
            getType: () => type,
            isDeleted: () => sanitizedText === deletedText,
            isPublished: () => published,
            markDeleted: () => {
                sanitizedText = deletedText
                author = 'deleted'
            },
            publish: () => {
                published = true
            },
            unPublish: () => {
                published = false
            }
        })

        function makeHash () {
            return md5(
                sanitizedText +
                published +
                (author || '') +
                (contextId || '') +
                (replyToId || '')
            )
        }
    }
}