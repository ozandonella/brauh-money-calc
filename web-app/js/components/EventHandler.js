class EventHandler{
    constructor(eventType){
        this.eventType = eventType
    }
    handle = (event) => {
        if(!event.target.dataset[this.eventType]) return
        const action = event.target.dataset[this.eventType]
        if(!this[action]){
            console.log("'" + action + "' for event: "+this.eventType + " does not exist")
            return
        }
        this[action]()
    }
    appendTo(element){
        element.addEventListener(this.eventType, this.handle)
    }
    addElement(actionName, fn, element){
        this.addAction(actionName, fn)
        EventHandler.setEventData(this.eventType, actionName, element)
    }
    addAction(actionName, fn){
        this[actionName] = fn  
    }

    static setEventData(eventName, actionName, element){
        element.setAttribute("data-"+eventName, actionName)
    }
}
export const clickHandler = new EventHandler("click")
export const touchenedHandler = new EventHandler("touchend")
export default EventHandler