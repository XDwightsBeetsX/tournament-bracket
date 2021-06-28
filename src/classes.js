/*===========================*/
/*======== Classes ==========*/
/*===========================*/
class Entry {
    constructor(name) {
        this.Name = name;
        this.W = 0;
        this.L = 0;
    }
}


class Entries {
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


class Bracket {
    constructor(entries) {
        // TODO make big bracket w/ TBDs here
        this.Entries = entries;

        this.Height = (Math.ceil(entries.length / 2) + 1)**2;
        this.Depth = Math.ceil(Math.log2(entries.length)) + 1;
    }

    advanceEntryAt(pos) {
        // do some math to see which index to set entry at

        // set the Entries[index] = Entries[pos]

        // update the DOM in logic.js
        return;
    }
}
