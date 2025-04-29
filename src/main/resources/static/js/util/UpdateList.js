class UpdateList{
    constructor(objectList, listElement, objectComparator) {
        this.objectList = objectList
        this.listElement = listElement
        this.objectComparator = objectComparator
    }
    clearList(){
        this.objectList = []
        this.listElement.replaceChildren()
    }
    addItem(element){
        let newArray = []
        let flag = false
        for(let i = 0; i<this.objectList.length; i++){
            if(!flag && this.objectComparator(element, this.objectList[i]) < 0){
                newArray.push(element)
                this.listElement.insertBefore(element.updateForm.HTML, this.objectList[i].updateForm.HTML)
                flag=true;
            }
            newArray.push(this.objectList[i])
        }
        if(!flag){
            newArray.push(element)
            this.listElement.appendChild(element.updateForm.HTML)
        }
        this.objectList = newArray
    }
    removeItem(element){
        let ind = this.objectList.indexOf(element)
        if(ind===-1) return
        this.objectList.splice(ind,1)
        element.updateForm.HTML.remove()
        if(this.objectList.length === 0 || !element.updateForm.HTML.classList.contains("selectedListForm")) return
        ind = Math.min(ind,this.objectList.length-1)
        this.objectList[ind].updateForm.select()
    }
    sort(){
        this.objectList.sort(this.objectComparator)
        this.render()
    }
    render(){
        this.objectList.forEach(el => this.listElement.appendChild(el.updateForm.HTML))
    }
}

export default UpdateList