/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://github.com/joelpurra/talkie>

Copyright (c) 2016, 2017 Joel Purra <https://joelpurra.com/>

Talkie is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Talkie is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Talkie.  If not, see <https://www.gnu.org/licenses/>.
*/

/* global
document:false,
window:false,
*/

/*
*    Tabrow. A simple clickable tab system.
*
*    Features
*    A. Simple setup, based on naming conventions.
*    B. Opens selected tab based on URL, ie /stuff/more.html#thistabwillbeselectedonload
*
*    The original (jquery.tabrow.js) was created by Joel Purra, 2010-05-08 17:17.
*    Copyright (c) 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017 Joel Purra <https://joelpurra.se/>
*    "It's a rainy day. After this is finished, maybe I'll play some games."
*    https://joelpurra.se/ contains more.
*
*    This version (tabrow.js) was created by Joel Purra, 2017-02-03 16:55.
*    Copyright (c) 2017 Joel Purra <https://joelpurra.com/>
*    "The tea in the pot is cold and I have a headache. Is it too late for a nap?"
*    https://joelpurra.com/ contains more.
*
*    A. Create a hiearchy like so:
*        1. a container with id set
*        2. containing an ordered list
*        3. with list items
*        4. containing one html part link (href="#pagepart") each.
*    B. Create containers with id's matching the part link  (id="pagepart").
*    C. Formatting is up to you. Define CSS for li.tabrowselected if you want to.
*    D. The hide/show effect is configurable below.
*
*        <div id="my-tabrow">
*           <ol>
*                <li><a href="#theidofthefirsttab">Title of the first tab</a></li>
*                <li><a href="#theidofthesecondtab">Another title for the second tab</a></li>
*            </ol>
*        </div>
*
*        <div id="theidofthefirsttab">Content of the first tab can be whatever.</div>
*        <div id="theidofthesecondtab">Second tab can be even more whatever.</div>
*
*        <script type="text/javascript" src="tabrow.js"></script>
*        <script type="text/javascript">
*           const myTabrow = new Tabrow("my-tabrow");
*           myTabrow.initialize();
*        </script>
*
*/

export default class Tabrow {
    constructor(tabContainerId) {
        this.tabContainerId = tabContainerId;
        this.selectedTabContentElement = null;
        this.selectedTabLinkContainerElement = null;
        this.tabrowSelectedClassName = "tabrowselected";
    }

    showEffect(tabElement) {
        // NOTE: could be overridden with animations.
        tabElement.style.display = "block";
    };

    hideEffect(tabElement) {
        // NOTE: could be overridden with animations.
        tabElement.style.display = "none";
    };

    getTabLinks() {
        return Array.from(document.querySelectorAll(`#${this.tabContainerId} ol li a[href^='#']`));
    }

    getLinkedTabContentElement(tabLinkElement) {
        const href = tabLinkElement.getAttribute("href");
        const linkedId = href.substring(1);

        const linkedElement = document.getElementById(linkedId);

        return linkedElement;
    }

    tabLinkClick(tabLinkElement) {
        const newlyFocusedTabContentElement = this.getLinkedTabContentElement(tabLinkElement);

        if (this.selectedTabContentElement !== newlyFocusedTabContentElement) {
            this.hideEffect(this.selectedTabContentElement);
            this.selectedTabLinkContainerElement.classList.remove(this.tabrowSelectedClassName);
            this.selectedTabLinkContainerElement = tabLinkElement.parentNode;
            this.selectedTabLinkContainerElement.classList.add(this.tabrowSelectedClassName);
            this.selectedTabContentElement = newlyFocusedTabContentElement;
            this.showEffect(this.selectedTabContentElement);
        }
    }

    initialize() {
        const self = this;
        let initialSelectedIndex = 0;

        // Find and set initially selected tab, if a #tabtoselect is given in URL
        if (document.location && typeof document.location.hash === "string" && document.location.hash.length > 0) {
            const locationHash = "#" + decodeURIComponent(document.location.hash.replace("#", ""));

            self.getTabLinks().forEach((tabLinkElement, index) => {
                if (tabLinkElement.getAttribute("href") === locationHash) {
                    initialSelectedIndex = index;
                }
            });
        }

        // Setup click events on tabs
        self.getTabLinks().forEach((tabLinkElement, index) => {
            tabLinkElement.addEventListener("click", (event) => {
                self.tabLinkClick(event.target);
            });

            if (index !== initialSelectedIndex) {
                self.getLinkedTabContentElement(tabLinkElement).style.display = "none";
            } else {
                self.selectedTabLinkContainerElement = tabLinkElement.parentNode;
                self.selectedTabLinkContainerElement.classList.add(self.tabrowSelectedClassName);
                self.selectedTabContentElement = self.getLinkedTabContentElement(tabLinkElement);
            }
        });
    };
}
