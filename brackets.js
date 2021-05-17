/*===========================*/
/*====== 'G'lobals ==========*/
/*===========================*/
var Entries = [];       // List of Type Entry
var Bracket = [[]];     // 2D List of Entry Name strings
const BYE = "BYE";
const TBD = "TBD";
var InvalidEntryNames = ["", BYE, TBD];

// IDs FOLLOW NAMING SCHEME:
// left pane        bracket
// entry-Name       bracket-col-#-row-#-entry-Name
var LeftPaneNamePrefix = "entry-";
var BracketColPrefix = "bracket-col-";
var BracketRowPrefix = "bracket-col-#-row-";
var BracketNamePrefix = "bracket-col-#-row-#-entry-";


/*===========================*/
/*===== Window Loading ======*/
/*===========================*/
window.onload = function() {
    // Sets up Globals and Event Listeners
    listenForEntry();
    Entries = [];
}
window.onbeforeunload = function() {
    // Prevents unintentional refreshing, which loses data
    Entries = [];
    return "Data will be lost if you leave the page, are you sure?";
};


/*===========================*/
/*===== Event Listeners =====*/
/*===========================*/
function listenForEntry() {
    // Allows user to shortcut clicking the button by pressing 'Enter' 
    let input = document.getElementById('entry');
    input.addEventListener('keyup', function(event) {
        if (event.code === 'Enter') {
            event.preventDefault();
            let submitButton = document.getElementById('btn-entry-submit');
            submitButton.click();
        }
    });
}


/*===========================*/
/*===== Helper Classes ======*/
/*===========================*/
class Entry {
    constructor(name) {
        this.Name = name;
        this.GamesPlayed = 0;
    }
}


/*===========================*/
/*======= Entries List ======*/
/*===========================*/
function addNewEntryToList() {
    function isValidEntry(newEntry) {
        if (newEntry.Name == undefined) {
            return false;
        }
    
        let newEntryName = newEntry.Name;
        for (let i = 0; i < InvalidEntryNames.length; i++) {
            if (newEntryName == InvalidEntryNames[i]) {
                return false;
            }
        }
        return true;
    }
    function isEntryUnique(newEntry) {
        for (let i = 0; i < Entries.length; i++) {
            if (Entries[i].Name == newEntry.Name) {
                return false;
            }
        }
        return true;
    }
    function addDeleteButtonToNewEntry(newEntry) {
        let button = document.createElement("img");
        button.src = "img/button-x.png";
        button.style.height = 100 + "%";
        button.style.width = "auto";
        button.style.float = "right";
        button.className = "pointer";
        button.setAttribute('onclick', "deleteEntryFromList(this.parentNode)");
        button.setAttribute("alt", "delete entry");
        newEntry.appendChild(button);
    }


    let input = document.getElementById("entry");
    let val = input.value;
    let newEntry = new Entry(val);
    
    if (!isValidEntry(newEntry)){
        alert("Entry: '" + newEntry.Name + "' is invalid.");
        delete newEntry;
    }
    else if (!isEntryUnique(newEntry)) {
        alert("Entry '" + newEntry.Name + "' has already been added.");
        delete newEntry;
    }
    else {
        Entries.push(newEntry);
        let newEntryElement = document.createElement('div');
        newEntryElement.innerHTML = newEntry.Name;
        newEntryElement.id = LeftPaneNamePrefix + newEntry.Name;
        addDeleteButtonToNewEntry(newEntryElement);
        document.getElementById("entryList").appendChild(newEntryElement);
    }
    // Reset the form to blank string
    input.value = '';    
}
function deleteEntryFromList(entry) {
    function getEntryIndex(entryName) {
        for (let i = 0; i < Entries.length; i++) {
            if (Entries[i].Name == entryName) {
                return i;
            }
        }
        return null;  // not found
    }
    
    
    entry.remove();
    let entryToRemoveName = entry.id.slice(LeftPaneNamePrefix.length);
    let entryToRemoveIndex = getEntryIndex(entryToRemoveName);
    if (entryToRemoveIndex != null) {
        Entries.splice(entryToRemoveIndex, 1);
    }
}
function getEntry(name) {
    for (let i = 0; i < Entries.length; i++) {
        if (Entries[i].Name == name) {
            return Entries[i];
        }
    }
    return null;
}

/*===========================*/
/*=== Bracket Operations ====*/
/*===========================*/
function makeBracket() {
    function setBracket(prettyBracketSize) {
        // Initialize first column with the Entries List
        let bracketEntries = [];
        for (let i = 0; i < Entries.length; i++) {
            bracketEntries.push(Entries[i].Name);
        }
        Bracket = [bracketEntries];
        
        // Fill first col with byes
        let newByeEntryCount = prettyBracketSize - Bracket[0].length;
        for (let i = 0; i < newByeEntryCount; i++) {        
            Bracket[0].push(BYE);
        }
    
        // Swap out byes to make bracket fair
        let lowI = 1;
        let highI = prettyBracketSize - 1;
        while (lowI < highI) {
            let swapEntry = Bracket[0][lowI];
            Bracket[0][lowI] = Bracket[0][highI];
            Bracket[0][highI] = swapEntry;
            lowI += 2;
            highI -= 2;
        }
    
        // Fill remaining cols with TBDs
        let colSize = prettyBracketSize;
        for (let col = 1; col <= Math.log2(prettyBracketSize); col++) {
            colSize = colSize / 2;
            Bracket[col] = [];
            for (let i = 0; i < colSize; i++) {
                Bracket[col].push(TBD);
            }
        }
    }
    function addBracketSpace(colId, spacePx) {
        let col = document.getElementById(colId);
        let space = document.createElement("div");
        space.className = "bracket-matchup-separator";
        space.style.height = spacePx + "px";
        space.style.width = 100 + "%";
        col.appendChild(space);
    }


    let bracketElement = document.getElementById("bracket");
    bracketElement.innerHTML = "";  // clear any old bracket

    //  CASE 1: no entries
    if (Entries.length == 0) {
        // Bracket wrapper for single entry
        let singleEntryDiv = document.createElement('div');
        singleEntryDiv.className = "single-entry";
        singleEntryDiv.style.textAlign = "center";
        bracketElement.appendChild(singleEntryDiv);

        // Add descriptive entry
        let entryDiv = document.createElement('div');
        entryDiv.innerHTML = "No Entries Found";
        entryDiv.className = "bracket-entry";
        entryDiv.style.display = "inline";
        singleEntryDiv.appendChild(entryDiv);
    }
    //  CASE 2: one entry
    else if (Entries.length == 1) {
        //  Bracket wrapper for single entry
        let singleEntryDiv = document.createElement("div");
        singleEntryDiv.className = "single-entry";
        singleEntryDiv.style.textAlign = "center";
        bracketElement.appendChild(singleEntryDiv);

        //  Add descriptive entry
        let entryDiv = document.createElement("div");
        entryDiv.innerHTML = "One Entry: " + Entries[0].Name;
        entryDiv.className = "bracket-entry";
        entryDiv.style.display = "inline";
        singleEntryDiv.appendChild(entryDiv);
    }
    //  CASE 3: 2+ entries, typical
    else {
        let bracketEntryHeight = 30;  // px

        //  Set Global Bracket
        //      Find nearest 2^n that can fit the number of entries
        let bracketDepth = Math.ceil(Math.log2(Entries.length)) + 1;
        let prettyBracketSize = 2**(bracketDepth - 1);
        setBracket(prettyBracketSize);
        
        //  Make columns and add entries to each column
        for (let colIndex = 0; colIndex < bracketDepth; colIndex++) {
            //  Make col
            let col = document.createElement("div");
            let colHeight = bracketEntryHeight * (2**bracketDepth - 1);
            let colId = "bracket-col-" + colIndex;
            col.className = "bracket-col";
            col.style.width = 100 / bracketDepth + "%";
            col.style.height = colHeight + "px";
            col.id = colId;
            bracketElement.appendChild(col);

            //  Add leading spacing before first element in col
            if (colIndex != 0) {
                let leadingSpaceCount = 2**colIndex - 1;
                for (let i = 0; i < leadingSpaceCount; i++) {
                    addBracketSpace(colId, bracketEntryHeight);
                }
            }

            //  Add entries
            let colEntries = Bracket[colIndex];
            for (i = 0; i < colEntries.length; i++) {
                let entryElement = document.createElement("div");
                let entry = colEntries[i];
                entryElement.className = "bracket-entry verdana-gray";
                entryElement.id = BracketColPrefix + colIndex + "-row-" + i + "-entry-" + entry;
                entryElement.innerHTML = entry;
                
                //  EntryElements begin with both arrows
                if (entry != BYE && entry != TBD) {
                    addAdvanceArrowToElement(entryElement);
                }
                
                col.appendChild(entryElement);

                // Add inter-Entry spacing
                if (i != col.length - 1) {
                    let interEntrySpaceCount = 2**(colIndex + 1) - 1;
                    for (let i = 0; i < interEntrySpaceCount; i++) {
                        addBracketSpace(colId, bracketEntryHeight);
                    }
                } 
            }

            // Add leading spacing before first element in col
            if (colIndex != 0) {
                let trailingSpaceCount = 2**colIndex - 1;
                for (let i = 0; i < trailingSpaceCount; i++) {
                    addBracketSpace(colId, bracketEntryHeight);
                }
            }
        }

        // Check if any teams have first round BYEs and advance them
        let firstCol = Bracket[0];
        for (let i = 0; i < firstCol.length; i+=2) {
            let matchupTopName = firstCol[i];
            let matchupBottomName = firstCol[i+1];
            if (matchupTopName == BYE) {
                let winnerId = BracketColPrefix + 0 + "-row-" + (i+1) + "-entry-" + matchupBottomName;
                let winner = document.getElementById(winnerId);
                advanceElement(winner);
            }
            else if (matchupBottomName == BYE) {
                let winnerId = BracketColPrefix + 0 + "-row-" + i + "-entry-" + matchupTopName;
                let winner = document.getElementById(winnerId);
                advanceElement(winner);
            }
        }
    }
}


function addReturnArrowToElement(entryElement) {
    let returnButton = document.createElement("img");
    returnButton.src = "img/button-arrow-left.png";
    returnButton.style.height = 100 + "%";
    returnButton.style.width = "auto";
    returnButton.style.float = "left";
    returnButton.className = "pointer";
    returnButton.setAttribute("alt", "return entry");
    returnButton.setAttribute('onclick', "returnElement(this.parentNode)");
    entryElement.appendChild(returnButton);
}
function addAdvanceArrowToElement(entryElement) {
    let advanceButton = document.createElement("img");
    advanceButton.src = "img/button-arrow-right.png";
    advanceButton.style.height = 100 + "%";
    advanceButton.style.width = "auto";
    advanceButton.style.float = "right";
    advanceButton.className = "pointer";
    advanceButton.setAttribute('onclick', "advanceElement(this.parentNode)");
    advanceButton.setAttribute("alt", "advance entry");
    entryElement.appendChild(advanceButton);
}

function returnElement(entryElement) {
    let currCol = parseInt(entryElement.id.slice(BracketColPrefix.length));
    let currRow = parseInt(entryElement.id.slice(BracketRowPrefix.length));
    if (currCol > 0) {
        //  Update Bracket
        let oldName = Bracket[currCol][currRow];
        delete Bracket[currCol][currRow];
        Bracket[currCol][currRow] = TBD;
        
        //  Clear current Element
        entryElement.removeChild(entryElement.firstElementChild);  // remove "advance" arrow
        if (getEntry(oldName).GamesPlayed > 0 && currCol < Bracket.length - 1) {
            entryElement.removeChild(entryElement.lastElementChild);  //  remove "return" arrow
        }
        entryElement.id = BracketColPrefix + currCol + "-row-" + currRow + "-entry-" + TBD;
        entryElement.innerText = TBD;

        // Add arrows to prev matchup elements
        let prevMatchupRow = 2*currRow;
        let prevMatchupCol = currCol - 1;
        let prevMatchupTopName = Bracket[prevMatchupCol][prevMatchupRow];
        let prevMatchupBotName = Bracket[prevMatchupCol][prevMatchupRow+1];
        let prevMatchupTopEntry = getEntry(prevMatchupTopName);
        let prevMatchupBotEntry = getEntry(prevMatchupBotName);

        prevMatchupTopEntry.GamesPlayed -= 1;
        prevMatchupBotEntry.GamesPlayed -= 1;

        let prevMatchupTopElement = document.getElementById(BracketColPrefix + prevMatchupCol + "-row-" + prevMatchupRow + "-entry-" + prevMatchupTopName);
        let prevMatchupBotElement = document.getElementById(BracketColPrefix + prevMatchupCol + "-row-" + (prevMatchupRow+1) + "-entry-" + prevMatchupBotName);
        addAdvanceArrowToElement(prevMatchupTopElement);
        addAdvanceArrowToElement(prevMatchupBotElement);
        if (prevMatchupTopEntry.GamesPlayed > 0) {
            addReturnArrowToElement(prevMatchupTopElement);
        }
        if (prevMatchupBotEntry.GamesPlayed > 0) {
            addReturnArrowToElement(prevMatchupBotElement);
        }
    }
}
function advanceElement(entryElement) {
    function canAdvanceAnEntry(col) {
        let filledEntriesInCol = Bracket[col];
        for (let i = 0; i < filledEntriesInCol.length; i++) {
            if (filledEntriesInCol[i] == TBD) {
                return false;
            }
        }
        return true;
    }


    let currCol = parseInt(entryElement.id.slice(BracketColPrefix.length));
    let currRow = parseInt(entryElement.id.slice(BracketRowPrefix.length));
    if (canAdvanceAnEntry(currCol)) {       
        // Update Bracket
        let nextCol = currCol + 1;
        let nextRow = Math.ceil((currRow + 1) / 2) - 1;
        winnerName = Bracket[currCol][currRow];
        Bracket[nextCol][nextRow] = winnerName;

        // Remove arrows from winner in old column
        entryElement.removeChild(entryElement.firstElementChild);  // remove advance arrow
        if (getEntry(winnerName).GamesPlayed > 0){
            entryElement.removeChild(entryElement.lastElementChild);  // remove return arrow
        }

        // find the Element at the new index
        let entryToReplaceId = BracketColPrefix + nextCol + "-row-" + nextRow + "-entry-" + TBD;
        let entryElementToReplace = document.getElementById(entryToReplaceId);

        // replace the content of the next div over to be the winner
        entryElementToReplace.innerText = winnerName;
        entryElementToReplace.id = BracketColPrefix + nextCol + "-row-" + nextRow + "-entry-" + winnerName;
        addAdvanceArrowToElement(entryElementToReplace);
        
        //  Remove "advance" arrow from loser of matchup
        //  Add "return" arrow to winner if they played someone
        let matchupLoserRow = currRow;
        if (matchupLoserRow % 2 == 0) {
            matchupLoserRow += 1;
        }
        else {
            matchupLoserRow -= 1;
        }
        let matchupLoser = Bracket[currCol][matchupLoserRow];
        if (matchupLoser != BYE && matchupLoser != TBD) {
            let matchupLoserId = BracketColPrefix + currCol + "-row-" + matchupLoserRow + "-entry-" + matchupLoser;
            let matchupLoserElement = document.getElementById(matchupLoserId);
            matchupLoserElement.removeChild(matchupLoserElement.firstElementChild);  // remove advance arrow
            addReturnArrowToElement(entryElementToReplace);
            let loserEntry = getEntry(matchupLoser);
            if (loserEntry.GamesPlayed > 0) {
                matchupLoserElement.removeChild(matchupLoserElement.lastElementChild);  //  remove return arrow
            }
            //  After checking previous gamesPlayed, update
            loserEntry.GamesPlayed += 1;
            getEntry(winnerName).GamesPlayed += 1;
        }
    
        // Remove "advance" arrow from winner of entire bracket
        if (nextCol == Bracket.length - 1) {
            let winner = Bracket[nextCol][0];
            let winnerId = BracketColPrefix + nextCol + "-row-" + 0 + "-entry-" + winner;
            let winnerEntryElement = document.getElementById(winnerId);
            winnerEntryElement.removeChild(winnerEntryElement.firstElementChild);
        }
    }
}
