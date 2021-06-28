/*===========================*/
/*======== Globals ==========*/
/*===========================*/
let _EntriesList;
let _EntryListElement;
let _Bracket;
let _BracketElement;

const IMG_DELETE = "./img/delete.png";

// DOM IDs
/* !!! THESE NEED TO MATCH HTML !!! */
const ID_MAKE_BRACKET_BTN = "make-bracket-btn";
const ID_ADD_ENTRY_BTN = "add-entry-btn";
const ID_ENTRY_NAME = "entry-name";
const ID_ENTRY_LIST = "entry-list";
const ID_BRACKET = "bracket";

const CLASS_VERDANA_GRAY = "verdana-gray";
const CLASS_ENTRY = "entry";
const CLASS_ENTRYLIST_ENTRYNAME = "entrylist-entryname";
const CLASS_ENTRYLIST_DELETEBTN = "entrylist-deletebtn";
const CLASS_BRACKET_ENTRY = "bracket-entry";
const CLASS_ADVANCE_BTN = "advance-btn";
const CLASS_REVERT_BTN = "revert-btn";

// NAMES
const BYE = "BYE";
const TBD = "TBD";
const INVALID_ENTRY_NAMES = ["", BYE, TBD];

// DIMENSIONS
const BTN_SIZE = 20 + "px";
const BRACKET_ENTRY_HEIGHT = 30 + "px";
