import TipsManager from "../calculator/TipsManager.js";
export const getIconElement = (className, iconName) => {
    const icon = document.createElement("span")
    icon.setAttribute("class", className)
    icon.innerText = iconName
    return icon
}
export const checkFieldsFilled = (formElement, fieldNames) => {
    const formData = new FormData(formElement)
    for(const name of fieldNames) if(!formData.get(name)) return false
    return true
}
export const stringCompare = (a, b) => {
    if(a === "") return 1
    if(b === "") return -1
    a = a.toLowerCase()
    b = b.toLowerCase()
    const len = a.length > b.length ? b.length : a.length
    for(let i = 0; i<len; i++){
        const diff = b.charCodeAt(i) - a.charCodeAt(i)
        if(diff !== 0 ) return diff
    }
    return 0
}
export const numberCompare = (a, b) => {
    return TipsManager.moveDecimal(a, 10) - TipsManager.moveDecimal(b,10)
}