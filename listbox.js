customElements.define("list-box", class Listbox extends HTMLElement {
#focusableElements = "button, input, textarea, select, a";
#shadow = null;
#top = null;
#init = false;

constructor (id) {
super ();

const shadow = this.#shadow = this.attachShadow({mode: "open", /*delegatesFocus: true*/});
const container = document.createElement("div");
//container.role = "application";
container.insertAdjacentHTML("beforeEnd",
`<ul style="list-style-type:none">
<slot></slot>
</ul>
`);

shadow.appendChild(container.firstChild);
this.#top = shadow.firstChild;
} // constructor

connectedCallback () {
const label = document.querySelector(`#${this.getAttribute("aria-labelledby")}`);
if (label) this.#top.ariaLabelledByElements = [label];


this.#shadow.addEventListener("slotchange", e => {
const slot = this.#shadow.querySelector("slot");
const elements = slot.assignedElements({flatten: true});

if (this.#init) return;
this.#addAria(elements);
this.#setFocus(elements[0]);
this.#init = true;
}); // slotchange event

this.addEventListener("keydown", this.#keyboardHandler);
} // connectedCallback

#keyboardHandler (e) {
const key = e.key;
console.log(`key: ${key}`);

if (key === "ArrowDown") {
this.#next();
} else if (key === "ArrowUp") {
this.#previous();
} else if (key === "ArrowRight") {
this.#down();
} else if (key === "ArrowLeft") {
this.#up();
}else if (key === "Home") {
this.#first();
} else if (key === "End") {
this.#last();
} else if (key === "Enter" || key === " ") {
const active = this.#top.ariaActiveDescendantElement;
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

#next () {
const current = this.#selected();

if (current && current.nextElementSibling) this.#setFocus(current.nextElementSibling);
} // #next

#previous () {
const current = this.#selected();

if (current && current.previousElementSibling) this.#setFocus(current.previousElementSibling);
} // #previous

#first () {
const current = this.#selected();

if (current) this.#setFocus(current.closest("[role='grid'], [role='treegrid']").querySelector("[role='row']"));
} // #first

#last () {
const current = this.#selected();

if (current) this.#setFocus(current.closest("[role='grid'], [role='treegrid'] [role='row']:last-child"));
} // #last

#down () {
const current = this.#selected();
const branch = current?.querySelector("[role='grid'] [role='row']")

if (branch) {
branch.closest("[role='grid']").hidden = false;
this.#setFocus(branch);
} // if
} // #down

#up () {
const current = this.#selected();
const branch = current && current.closest("[role='grid']")?.closest("[role='row']");

if (branch) {
current.closest("[role='grid']").hidden = true;
this.#setFocus(branch);
} // if
} // #up

#setFocus (row) {
if (row.role !== "row") throw new Error("list-box: bad ARIA; aborting");
this.#unsetFocus();
const selectedElement = this.#select(row);
selectedElement.tabIndex = 0;
selectedElement.focus();
} // #setFocus

#unsetFocus () {
this.#selected()?.querySelector("[aria-selected]").removeAttribute("aria-selected");
this.querySelector("[tabindex='0']")?.setAttribute("tabindex", "-1");
} // #unsetFocus

#select(row) {
const focusable = row.querySelectorAll(this.#focusableElements);
if (focusable.length > 0) {
focusable[0].setAttribute("aria-selected", "true");
return focusable[0];
} else {
row.firstChild.setAttribute("aria-selected", "true");
return row.firstChild;
} // if

} // #select

#selected () {
return this.querySelector("[aria-selected]")?.closest("[role='row']");
} // #selected

#validateContents (elements) {
const ok = elements.every(x => x.tagName === "LI");
if (ok) return true;
} // #validateContents

#addAria (elements) {
for (const element of elements) {
const branch = element.querySelector("ul, ol, table");
if (branch) {
branch.role = "grid";
element.setAttribute("aria-expanded", "false");
this.#addAria(branch.children);
} // if
if (element.matches("li, tr")) {
element.role = "row";
element.firstChild.role = "gridcell";
element.firstChild.querySelectorAll(this.#focusableElements).forEach(x => x.tabIndex = -1);
} // if
} // for

if ([...elements].find(x => x.querySelector("[role='grid']"))) {
this.#top.setAttribute("role", "treegrid");
this.#top.setAttribute("aria-roledescription", "tree");
this.querySelectorAll("[role='grid']").forEach(x => x.hidden = true);
} else {
this.#top.setAttribute("role", "grid");
this.#top.setAttribute("aria-roledescription", "listbox");
} // if

} // #addAria



}); // class
