export const prettySize = size =>{
    let arr = ["b", "kb", "mb", "gb"]
    let out = ""
    arr.every(sz => {
        if (size < 1024) {
            out = size.toFixed(2) + sz
            return false
        }
        size/=1024
        return true
    })
    return out
}