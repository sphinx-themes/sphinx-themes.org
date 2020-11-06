"use strict";

class SidebarButton {
    constructor() {
        if(document.sidebarButtonLoaded===true) {
            return;
        }
        this.buttonToggle = document.querySelector('button.sidebar-button');

        if(this.buttonToggle!==undefined) {
            document.sidebarButtonLoaded = true;
        }

        this.buttonToggle.addEventListener('click', event => {
            this.toggleSidebar();
        });
        this.buttonToggle.addEventListener('keydown', event => {
            if(event.keyCode === 13 || event.keyCode === 32 ) {
                this.toggleSidebar();
            }
        });
    }

    toggleSidebar() {
        document.querySelector('#sidebar').toggleAttribute('opened');
    }
}

new SidebarButton();
