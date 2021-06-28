/*===========================*/
/*====== EntriesList ========*/
/*===========================*/

class EntriesList {
    constructor() {
        this.Entries = [];
    }

    isValidEntry(entryName) {
        if (INVALID_ENTRY_NAMES.includes(entryName)){
            return false;
        }
        for (let i = 0; i < this.Entries.length; i++){
            if (this.Entries[i].Name == entryName){
                return false;
            }
        }
        return true;
    }
    addEntry(entry) {
        this.Entries.push(entry);
    }

    removeEntry(entryName) {
        for (let i = 0; i < this.Entries.length; i++){
            if (this.Entries[i].Name == entryName){
                this.Entries.splice(i, 1);
                return;
            }
        }
    }
}
