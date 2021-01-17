module.exports.notFound = function() {
    return {
        headers: {
            'Content-Type': 'application/json'
        },
        body: { error: 'Not found.' },
        statusCode: 404
    }
}