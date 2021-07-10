/*===========================*/
/*======== Bracket ==========*/
/*===========================*/
//  <div id="bracket">
//      <div class="be-row" id="be-row-ROW">
//          <div class="be-spacer"></div>
//          <div class="be-spacer"></div>
//          <div class="be" id="be-NAME">
//              <div class="be-btn"></div>
//              <div class="be-name"></div>
//              <div class="be-btn"></div>
//          </div>
//      </div>
//  </div>


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
        for (let i = 1; i < nearestP2/2; i+=2) {
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
        // make be-rows and insert PrettyEntries
        for (let i = 0; i < this.Height; i++) {
            let prettyEntry = this.PrettyEntries[i];
            
            // BEE row
            let bEERowElement = document.createElement("div");
            bEERowElement.id = ID_BE_ROW + i;
            bEERowElement.className = CLASS_BE_ROW;
            bEERowElement.style.width = 100 + "%";

            // BEE
            let bEE = document.createElement("div");
            bEE.id = ID_BE + prettyEntry.Name;
            bEE.className = CLASS_BE;
            bEE.style.width = 100 / this.Depth + "%";

            //      BEE REVERT ARROW
            let bEERevertElement = document.createElement("div");
            bEERevertElement.className = CLASS_BE_BTN;
            bEERevertElement.style.visibility = "hidden";
            bEERevertElement.setAttribute('onclick', "revertRowEntry(this.parentNode.parentNode)");

            let bEERevertImgElement = document.createElement("img");
            bEERevertImgElement.src = IMG_REVERT;
            bEERevertElement.appendChild(bEERevertImgElement);

            //      BEE NAME
            let bEENameElement = document.createElement("div");
            bEENameElement.className = CLASS_BE_NAME + " " + CLASS_VERDANA_GRAY;
            bEENameElement.innerText = prettyEntry.Name; 
            bEE.appendChild(bEENameElement);
            
            //      BEE ADVANCE ARROW
            let bEEAdvanceElement = document.createElement("div");
            bEEAdvanceElement.className = CLASS_BE_BTN;
            bEEAdvanceElement.style.visibility = "hidden";
            bEEAdvanceElement.setAttribute('onclick', "advanceRowEntry(this.parentNode.parentNode)");

            let bEEAdvancImgElement = document.createElement("img");
            bEEAdvancImgElement.src = IMG_ADVANCE;
            bEEAdvanceElement.appendChild(bEEAdvancImgElement);

            // APPEND ELEMENTS
            bEE.appendChild(bEERevertElement);
            bEE.appendChild(bEENameElement);
            bEE.appendChild(bEEAdvanceElement);
            bEERowElement.appendChild(bEE);
            _B_Element.appendChild(bEERowElement);
            _B_Row_Elements.push(bEERowElement);
        }

        // offset entries to make the bracket shape
        this.offsetEntries();

        // advance any entries that have BYEs first round. also adds advance arrows to entries
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
                
                _B_Row_Elements[ei-1].prepend(spacerE);
            }
        }
    }

    advanceEntries() {
        // Check all even indexes if they are BYEs
        for (let i = 0; i < this.PrettyEntries.length; i+=4) {
            if (this.PrettyEntries[i].Name == BYE) {
                // advance this.PrettyEntries[i+2].Name
                let winnerName = this.PrettyEntries[i+2].Name;
                
                let winnerE = _B_Row_Elements[i+1].lastChild;
                winnerE.id = ID_BE + winnerName;
                winnerE.lastChild.style.visibility = "visible";

                let winnerNameE = winnerE.childNodes[1];
                winnerNameE.innerText = winnerName;
            }
            else if (this.PrettyEntries[i+2].Name == BYE) {
                // advance this.PrettyEntries[i].Name
                let winnerName = this.PrettyEntries[i].Name;
                
                let winnerE = _B_Row_Elements[i+1].lastChild;
                winnerE.id = ID_BE + winnerName;
                winnerE.lastChild.style.visibility = "visible";

                let winnerNameE = winnerE.childNodes[1];
                winnerNameE.innerText = winnerName;
            }
            else {
                _B_Row_Elements[i].lastChild.lastChild.style.visibility = "visible";
                _B_Row_Elements[i+2].lastChild.lastChild.style.visibility = "visible";
            }
        }
    }

    advanceRowEntry(thisBracketRow) {
        // Takes care of advancing a bracket entry
        function hideArrowsFrom(BEE) {
            let vis = "hidden";
            BEE.firstChild.firstChild.style.visibility = vis;
            BEE.lastChild.firstChild.style.visibility = vis;
        }
        function setNewWinner(BEE, winnerName) {
            function showArrowsFor(BEE) {
                let vis = "visible";
                BEE.firstChild.firstChild.style.visibility = vis;
                BEE.lastChild.firstChild.style.visibility = vis;
            }

            BEE.id = ID_BE + winnerName;
            BEE.childNodes[1].innerText = winnerName;
            showArrowsFor(BEE);

            // set advance button as hidden if overall winner
            if (BEE.parentNode.childNodes.length == _B.Depth - 1) {
                BEE.lastChild.firstChild.visibility = "hidden";
            }            
        }

        // Set matchup vars
        let bracketIndexSplit = thisBracketRow.id.split("-");
        let thisIndex = parseInt(bracketIndexSplit[bracketIndexSplit.length-1]);
        let thisName = thisBracketRow.lastChild.childNodes[1].innerText;

        let thisSpacing = thisBracketRow.childElementCount - 1;
        let matchupSize = 2**(thisSpacing);

        let topIndex = thisIndex - matchupSize;
        let topRow = document.getElementById(ID_BE_ROW + topIndex);

        let botIndex = thisIndex + matchupSize;
        let botRow = document.getElementById(ID_BE_ROW + botIndex);

        debugger;
        let matchupLoser = null;
        // Matchup out of bracket bounds - over
        if (_B_Row_Elements.length - 1 < botIndex) {
            setNewWinner(topRow.lastChild, thisName);
            matchupLoser = document.getElementById(ID_BE_ROW + (topIndex - matchupSize));
        } // Check if top row is the winner
        else if (topRow != null) {
            if (topRow.childElementCount - 1 == thisSpacing + 1) {
                setNewWinner(topRow.lastChild, thisName);
                matchupLoser = document.getElementById(ID_BE_ROW + (topIndex - matchupSize));
            }
        } // Matchup out of bracket bounds - under
        else if (topIndex < 0) {
            setNewWinner(botRow.lastChild, thisName);
            matchupLoser = document.getElementById(ID_BE_ROW + (botIndex + matchupSize));
        } // Check if bottom row is the winner
        else if (botRow != null) {
            if (botRow.childElementCount - 1 == thisSpacing + 1) {
                setNewWinner(botRow.lastChild, thisName);
                matchupLoser = document.getElementById(ID_BE_ROW + (botIndex + matchupSize));
            }
        }
        else {
            let msg = "issue advancing: " + winnerName;
            console.log(msg);
            alert(msg);
        }
        
        // Remove advance/revert arrows from the advanced entry and the matchup loser
        hideArrowsFrom(thisBracketRow.lastChild);
        if (matchupLoser != null) {
            hideArrowsFrom(matchupLoser.lastChild);
        }
    }

    revertRowEntry(bracketRowElement) {
        console.log("asdf");
    }
}
