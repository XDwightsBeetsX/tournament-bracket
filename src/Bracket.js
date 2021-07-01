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
        // add all the bracketEntries to the DOM
        // FORMAT
        // <div id="bracket">
        //     <div class="bracket-row">
        //         <div class="bracket-spacer"></div>
        //         <div class="bracket-spacer"></div>
        //         <div class="bracket-entry">EntryName</div>
        //     </div>
        // </div>
        for (let i = 0; i < this.Height; i++) {
            let prettyEntry = this.PrettyEntries[i];
            
            let bEERowElement = document.createElement("div");
            bEERowElement.id = CLASS_BE_ROW + "-" + i;
            bEERowElement.className = CLASS_BE_ROW;
            bEERowElement.style.width = 100 + "%";

            let newBEE = document.createElement("div");
            newBEE.id = "be-" + i + "-" + prettyEntry.Name;
            newBEE.className = "be";
            newBEE.style.width = 100 / this.Depth + "%";
            bEERowElement.appendChild(newBEE);

            let bEENameElement = document.createElement("div");
            bEENameElement.className = CLASS_BE_NAME + " " + CLASS_VERDANA_GRAY;
            bEENameElement.innerText = prettyEntry.Name; 
            newBEE.appendChild(bEENameElement);
            
            _B_Element.appendChild(bEERowElement);
            _B_Row_Elements.push(bEERowElement);
        }

        // offset entries to make the bracket shape
        this.offsetEntries();

        // advance any entries that have BYEs first round
        this.advanceEntries();
    }

    offsetEntries() {
        // Go through oddly indexed powers of two that are less than the length of PrettyEntries
        //  2, 4, 8, ...
        // (2, 4, 6, ...), (4, 8, 12, ...), (8, 16, 24, ...), ...
        // Getting powers of two is easy so use (i-1)

        for(let i = 2; i < this.PrettyEntries.length; i *= 2) {
            for (let ei = i; ei < this.PrettyEntries.length; ei+=i) {
                let spacerE = document.createElement("div");
                spacerE.style.width = 100 / this.Depth + "%";                
                debugger;
                let rowId = CLASS_BE_ROW + "-" + (ei-1);

                console.log("finding: " + rowId);
                let rowE = document.getElementById(rowId);

                rowE.prepend(spacerE);
            }
        }
    }

    advanceEntries() {
        return;
    }

    addAdvanceButtonTo(bEE) {
        // <div> to store <img> element
        let bEEAdvanceElement = document.createElement("div");
        bEEAdvanceElement.className = CLASS_BE_BTN;

        // make the <img>
        let bEEAdvancImgElement = document.createElement("img");
        bEEAdvancImgElement.src = IMG_ADVANCE;

        // store the <img> in the parent <div>
        bEEAdvanceElement.appendChild(bEEAdvancImgElement);

        // Add the bEEAdvanceElement as the first child
        bEE.childNodes.splice(0, 0, bEEAdvanceElement);
    }

    addRevertButtonTo(bEE) {
        // <div> to store <img> element
        let bEERevertElement = document.createElement("div");
        bEERevertElement.className = CLASS_BE_BTN;

        // make the <img>
        let bEERevertImgElement = document.createElement("img");
        bEERevertImgElement.src = IMG_REVERT;

        // store the <img> in the parent <div>
        bEERevertElement.appendChild(bEERevertImgElement);

        // Add the bEERevertElement as the first child
        bEE.childNodes.splice(0, 0, bEERevertElement);
    }
}
