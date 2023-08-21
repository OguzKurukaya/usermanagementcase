
function responseJson(code, data) {

    let msg = ''
    msg = code === 200 ? 'success' : 'error'

    return {
        code: code,
        msg: msg,
        data: data
    }

}

module.exports = {
    responseJson
}