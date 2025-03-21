# HTML First

HTML has gains many features over the years which precludes the use of homegrown widgets in many circumstances. The `dialog` element, `popover` API, and the CSS `appearance` property are notable in that they allow developers to create dialog / popups, and selection lists via pure HTML with options for styling via CSS, eliminating the need to reinvent the wheel via javascript, which, more often than not, results in inaccessible and brittle difficult to maintain code.

## Popups and dialogs

[The Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API)
allows web developers to use HTML and CSS to create modal dialogs, non-modal dialogs, and popups / popovers of all types easily. Here is the basic markup (see the Mozilla docs for details):

```
<!-- this launches the popup, and focus returns here when it is closed -->
<p><button popoverTarget="myPopup">Launch popup</button></p>

<!-- this is modal, but using a div instead will create a non-modal popup.
keyboard navigation is included automatically (i.e. tab focus remains in the modal, and escape closes modal / non-modal popups.
use CSS to position and style as appropriate
-->

<dialog popover id="myPopup">
<div><h2>My popup</h2>
<button class="close" popovertarget="myPopup" popovertargetaction="hide">Close</button>
</div>

<div class="content">
<p>... some random content here ...</p>
</div>
</dialog>
```


- [The Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API)
   + [Modal dialogs via ARIA](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
   + [Alert and message dialog via ARIA](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/)

### List boxes and comboboxes

Using the `appearance` property allows styling of `select` lists, so it is now possible to use them instead of javascript and ARIA to create list boxes. These can be simple select lists (i.e. choose a state / country), or parts of other components such as comboboxes. The latter will most likely still require javascript and ARIA, but using HTML `select` rather than coding a selection list component from scratch reduces the effort significantly!

- [Appearance](https://developer.mozilla.org/en-US/docs/Web/CSS/appearance)
   + [Listbox via ARIA](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/)
   + [Combobox via ARIA](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)

