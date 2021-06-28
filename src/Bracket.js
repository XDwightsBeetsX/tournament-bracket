/*===========================*/
/*======== Bracket ==========*/
/*===========================*/

class Bracket {
    constructor(entries) {
        this.RawEntries = deepCopy(entries);

        // determine bracket dimensions
        let nearestP2 = 2**(Math.ceil(Math.log2(entries.length)))
        this.Height = 2*nearestP2 - 1;
        this.Depth = Math.log2(nearestP2) + 1;

        // make a filled list of Entries with BYEs
        let prettyEntries = deepCopy(entries);
        for (let i = prettyEntries.length; i < nearestP2; i++) {
            prettyEntries.push(new Entry(BYE));
        }
        // swap prettyEntries to set byes by default
        for (let i = 1; i < nearestP2-1; i+=2) {
            let swap = prettyEntries[i];
            prettyEntries[i] = prettyEntries[nearestP2-i];
            prettyEntries[nearestP2-i] = swap;
        }
        // add in TBDs to prettyEntries
        for (let i = 1; i < prettyEntries.length; i++) {
            if (i % 2 == 1) {
                prettyEntries.splice(i, 0, new Entry(TBD));
            }
        }
        this.PrettyEntries = prettyEntries;

        // fill initial bracket
        this.makeBracket();
    }

    makeBracket() {
        for (let i = 0; i < this.Height; i++) {
            let offset = this.getBracketOffsetAt(i);
            this.addBracketEntryElement(this.PrettyEntries[i], offset);
        }
    }

    getBracketOffsetAt(index) {
        return 0;
    }
    addBracketEntryElement(prettyEntry, pos) {
        function addAdvanceButtonToBracketEntryElement(bEE) {
            return;
        }
        function addRevertButtonToBracketEntryElement(bEE) {
            return;
        }
        // bracketEntryElement
        let bEE = document.createElement("div");
        


        BracketElement.appendChild(bEE);
    }

    getAdvanceIndexFor(pos) {
        // do some math to see which index to set entry at

        // set the Entries[index] = Entries[pos]

        // update the DOM in logic.js
        return;
    }
}
