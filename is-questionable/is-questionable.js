module.exports.makeIsQuestionable = function () {
    return async function isQuestionable (
        {
            author,
            browser,
            createdOn,
            ip,
            modifiedOn,
            referrer,
            testOnly,
            text
        } = {}) {
        try {
            /** todo here should be some logics to handle spam and swearing */
            let inappropriate = false;
            // if (querystring) inappropriate = false;
            return inappropriate
        } catch(e){
            return true
        }
    }
}