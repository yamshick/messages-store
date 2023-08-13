const areArrayEqual = (arr1, arr2) => {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
        return false
    }

    if (arr1.length !== arr2.length) {
        return false
    }

    arr1.sort((a, b) => a - b)
    arr2.sort((a, b) => a - b)

    for(let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false
        }
    }

    return true
}


module.exports = {areArrayEqual}
