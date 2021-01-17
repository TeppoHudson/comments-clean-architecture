module.exports.makeHandleModeration = function ({
                                                    isQuestionable,
                                                    initiateReview
                                                }) {
    return async function handleModeration ({ comment }) {
        const shouldModerate = await isQuestionable({
            text: comment.getText(),
            ip: comment.getSource().getIp(),
            browser: comment.getSource().getBrowser(),
            referrer: comment.getSource().getReferrer(),
            author: comment.getAuthor(),
            createdOn: comment.getCreatedAt(),
            modifiedOn: comment.getModifiedOn()
        })
        const moderated = { ...comment }
        if (shouldModerate) {
            // initiateReview({ id: moderated.getId(), content: moderated.getText() })
            moderated.unPublish()
        } else {
            moderated.publish()
        }
        return moderated
    }
}