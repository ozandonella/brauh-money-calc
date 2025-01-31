class EventHandler{
    constructor(eventType){
        this.eventType = eventType
    }
    handle = (event) => {
        console.log(this)
        console.log(event.target)
        if(event.target.dataset.event!==this.eventType) return
        const action = event.target.dataset.action
        if(!this[action]){
            console.log(action + " for event "+this.eventType + " does not exist")
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
        element.setAttribute("data-event", eventName)
        element.setAttribute("data-action", actionName)
    }
}
export const updateFormHandler = new EventHandler("click")
export default EventHandler