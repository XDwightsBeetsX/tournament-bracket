/*===========================*/
/*====== EntriesList ========*/
/*===========================*/

class EntriesList {
    constructor() {
        this.Entries = [];
    }
    
    addEntry(entry) {
        function addDeleteButtonToNewEntry(newEntryElement) {
            let button = document.createElement("img");
            button.src = IMG_DELETE;
            button.className = CLASS_EL_DELETE;
            button.setAttribute('onclick', "deleteEntry(this.parentNode)");
            button.setAttribute("alt", "delete entry button");
            newEntryElement.appendChild(button);
        }

        // Create newEntryElement
        let newEntryElement = document.createElement("div");
        newEntryElement.className = CLASS_EL_ROW;

        // Add name to newEntryElement
        let newEntryElementName = document.createElement("div");
        newEntryElementName.innerText = entry.Name;
        newEntryElementName.className = CLASS_EL_NAME + " " + CLASS_VERDANA_GRAY;
        newEntryElement.appendChild(newEntryElementName);

        // Add delete button to newEntryElement
        addDeleteButtonToNewEntry(newEntryElement);

        // Add newEntryElement to EntryListElement
        _E_List_Element.appendChild(newEntryElement);
        this.Entries.push(entry);
    }

    removeEntry(entryElement) {
        for (let i = 0; i < this.Entries.length; i++){
            if (this.Entries[i].Name == entryElement.firstElementChild.innerText){
                this.Entries.splice(i, 1);
                break;
            }
        }
        entryElement.remove();
    }
}
