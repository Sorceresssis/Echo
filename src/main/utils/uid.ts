/**
 * 要求时间不能回拨
 */
const generateUid: () => string = (function () {
    let timestamp: number | undefined
    let cnt: number = 0
    return function () {
        if (timestamp === Date.now()) {
            return `${timestamp}${cnt++}`
        }
        else {
            timestamp = Date.now()
            cnt = 0;
            return generateUid()
        }
    }
})()

export default generateUid 