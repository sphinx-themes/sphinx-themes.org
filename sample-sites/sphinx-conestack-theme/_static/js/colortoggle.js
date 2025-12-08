/**
 * Taken from cone-app 2.0
 * =======================
 * 
 * Class to manage color modes (light and dark themes).
 * Modified to remove treibstoff and jQuery dependencies.
 */
class ColorMode {

    /**
     * The media query for the user's preferred color scheme.
     * @returns {MediaQueryList}
     */
    static get media_query() {
        return window.matchMedia('(prefers-color-scheme: dark)');
    }

    /**
     * The stored theme from local storage.
     * @returns {string | null}
     */
    static get stored_theme() {
        return localStorage.getItem('sphinx-conestack-theme-color-theme');
    }

    /**
     * @param {string} theme The theme to store in local storage.
     */
    static set stored_theme(theme) {
        localStorage.setItem('sphinx-conestack-theme-color-theme', theme);
    }

    /**
     * The user's preferred theme ('dark' or 'light').
     * @returns {string}
     */
    static get preferred_theme() {
        if (this.stored_theme) {
            return this.stored_theme;
        }
        return this.media_query.matches ? 'dark' : 'light';
    }

    /**
     * Adds an event listener to watch for changes in the media query.
     * @param {function} handle The callback function to handle changes.
     */
    static watch(handle) {
        this.media_query.addEventListener('change', handle);
    }

    /**
     * Sets the current theme on the document.
     * @param {string} theme The theme to set ('dark', 'light', or 'auto').
     */
    static set_theme(theme) {
        const elem = document.documentElement;
        const is_dark = (theme === 'dark');
        if (theme === 'auto' && this.media_query.matches) {
            // Set to dark if 'auto' and dark mode is preferred
            elem.setAttribute('data-bs-theme', 'dark');
            document.getElementById('pygments_dark_css').disabled = false;
        } else {
            elem.setAttribute('data-bs-theme', theme);
            document.getElementById('pygments_dark_css').disabled = !is_dark;
        }

        // customized for sphinx-conestack-theme pygments styles
        if (theme === 'dark') {
            document.getElementById('pygments_dark_css').disabled = false;
        } else if (theme === 'light') {
            document.getElementById('pygments_dark_css').disabled = true;
        }
    }

    /**
     * Initializes the ColorMode instance and sets the preferred theme.
     */
    constructor() {
        this.bind();
        // INFO: Remove default media check (checks for prefers-dark-mode)
        // from pygments_dark_css stylesheet generated in theme.conf
        document.getElementById('pygments_dark_css').removeAttribute('media');
        ColorMode.set_theme(ColorMode.preferred_theme);
        this.observe_theme_change();
    }

    /**
     * Binds the change event listener to update the theme.
     */
    bind() {
        ColorMode.watch(() => {
            const stored_theme = this.stored_theme;
            if (stored_theme !== 'light' && stored_theme !== 'dark') {
                ColorMode.set_theme(ColorMode.preferred_theme);
            }
        });
    }

    /**
     * Observes changes to the 'data-bs-theme' attribute and triggers updates.
     */
    observe_theme_change() {
        const themeObserver = new MutationObserver((mutationsList) => {
            mutationsList.forEach(mutation => {
                if (mutation.attributeName === 'data-bs-theme') {
                    const newTheme = mutation.target.getAttribute('data-bs-theme');
                }
            });
        });

        const targetElement = document.documentElement;
        themeObserver.observe(targetElement, {
            attributes: true,
            childList: false,
            subtree: false
        });
    }
}

/**
 * Class to toggle the color theme based on user input (visible as a Switch).
 */
class ColorToggler {

    /**
     * Initializes the ColorToggler and binds the toggle switch.
     * @param {Element} context
     */
    static initialize(context) {
        const elem = context.querySelector('#colortoggle-switch');
        if (!elem) {
            return;
        }
        new ColorToggler(elem);
    }

    /**
     * @param {Element} elem The toggle switch element.
     */
    constructor(elem) {
        this.elem = elem;
        this.update();
        ColorMode.watch(() => {
            this.update();
        });
        this.elem.addEventListener('change', this.on_change.bind(this));
    }

    /**
     * Updates the toggle switch state based on the preferred theme.
     */
    update() {
        const preferred_theme = ColorMode.preferred_theme;
        const checked = this.elem.checked;

        if (preferred_theme === 'dark' && !checked) {
            this.elem.checked = true;
        } else if (preferred_theme === 'light' && checked) {
            this.elem.checked = false;
        }
    }

    /**
     * Handles changes when the toggle is switched.
     */
    on_change() {
        const theme = this.elem.checked ? 'dark' : 'light';
        ColorMode.set_theme(theme);
        ColorMode.stored_theme = theme;
    }
}

new ColorMode();

window.addEventListener('load', () => ColorToggler.initialize(document));