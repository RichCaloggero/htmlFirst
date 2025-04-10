customElements.define("list-box", class Listbox extends HTMLElement {
#focusableElements = "button, input, textarea, select, a";
#shadow = null;
#listbox = null;
#init = false;

constructor (id) {
super ();

const shadow = this.#shadow = this.attachShadow({mode: "open", /*delegatesFocus: true*/});
const container = document.createElement("div");
container.role = "application";
container.insertAdjacentHTML("beforeEnd",
`<ul role="grid" aria-roledescription="listbox"
style="list-style-type:none">
<slot></slot>
</ul>
`);

shadow.appendChild(container);
this.#listbox = container.querySelector("ul");
this.#listbox.setAttribute("tabindex", "0");
//this.setAttribute("tabindex", "0");
} // constructor

connectedCallback () {
const label = document.querySelector(`#${this.getAttribute("aria-labelledby")}`);
if (label) this.#listbox.ariaLabelledByElements = [label];


this.#shadow.addEventListener("slotchange", e => {
const slot = this.#shadow.querySelector("slot");
if (this.#validateContents(slot)) this.#addAria(slot.assignedElements());
else throw new Error("list-box: slot must contain only \"li\" elements");
}); // slotchange event

this.addEventListener("keydown", this.#keyboardHandler);
} // connectedCallback

#next () {
const current = this.#active();

if (current && current.nextElementSibling) this.#setFocus(current.nextElementSibling);
} // #next

#previous () {
const current = this.#active();

if (current && current.previousElementSibling) this.#setFocus(current.previousElementSibling);
} // #previous

#setFocus (row) {
if (row.role !== "row") throw new Error("list-box: bad ARIA; aborting");
this.ariaActiveDescendantElement = null;

const activeDescendant= this.#activate(row);
//this.ariaActiveDescendantElement = activeDescendant;
//this.focus();
this.#listbox.ariaActiveDescendantElement= activeDescendant;
this.#listbox.focus();
} // #setFocus

#activate (row) {
const focusable = row.querySelectorAll(this.#focusableElements);
if (focusable.length > 0) {
//focusable[0].setAttribute("aria-selected", "true");
return focusable[0];
} else {
row.firstChild.setAttribute("aria-selected", "true");
return row.firstChild;
} // if

} // #activate

#active () {
const descendant = this.#listbox.ariaActiveDescendantElement;
return descendant? descendant.closest("li") : null;
} // #active

#validateContents (slot) {
const ok = slot.assignedElements().every(x => x.tagName === "LI");
if (ok) return true;
} // #validateContents

#addAria (elements) {
if (elements.length === 0) {
this.#init = false;
return;
} // if

for (const element of elements) {
element.role = "row";
element.firstChild.role = "gridcell";
element.querySelectorAll(this.#focusableElements).forEach(x => x.tabIndex = -1);
} // for

if (this.#init) return;
this.#setFocus(elements[0]);
this.#init = true;
} // #addAria

#keyboardHandler (e) {
const key = e.key;
console.log(`key: ${key}`);
if (key === "ArrowDown") {
this.#next();
} else if (key === "ArrowUp") {
this.#previous();
} else if (key === "Enter" || key === " ") {
const active = this.#listbox.ariaActiveDescendantElement;
if (active && active.matches(this.#focusableElements)) {
active.click();
} // if

} else if (key.length === 1) {
this.#findMatch(key);
} else {
return;
} // if

e.preventDefault();
return false;
} // #keyboardHandler

#findMatch (key) {

} // #findMatch


}); // class
