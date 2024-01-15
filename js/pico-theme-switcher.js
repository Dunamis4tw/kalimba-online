/* Код кнопки смены полностью взят с оф. сайта */
"use strict";
!function () {
    var e = {
        _scheme: "auto",
        change: {
            light: "<i>Turn on dark mode</i>",
            dark: "<i>Turn off dark mode</i>"
        },
        buttonsTarget: ".theme-switcher",
        localStorageKey: "picoPreferredColorScheme",
        init() {
            this.scheme = this.schemeFromLocalStorage;
            this.initSwitchers();
        },
        get schemeFromLocalStorage() {
            return window.localStorage && null !== window.localStorage.getItem(this.localStorageKey) ? window.localStorage.getItem(this.localStorageKey) : this._scheme;
        },
        get preferredColorScheme() {
            return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        },
        initSwitchers() {
            $(this.buttonsTarget).on("click", function () {
                e.scheme = e.scheme === "dark" ? "light" : "dark";
            });
        },
        addButton(config) {
            $(config.tag, {
                class: config.class,
                text: config.text
            }).appendTo(config.target);
        },
        set scheme(e) {
            "auto" == e ? "dark" == this.preferredColorScheme ? this._scheme = "dark" : this._scheme = "light" : "dark" != e && "light" != e || (this._scheme = e);
            this.applyScheme();
            this.schemeToLocalStorage();
        },
        get scheme() {
            return this._scheme;
        },
        applyScheme() {
            $("html").attr("data-theme", this.scheme);
            $(this.buttonsTarget).each(function () {
                var buttonText = e.scheme === "dark" ? e.change.dark : e.change.light;
                $(this).html(buttonText).attr("aria-label", buttonText.replace(/<[^>]*>?/gm, ""));
            });
        },
        schemeToLocalStorage() {
            window.localStorage && window.localStorage.setItem(this.localStorageKey, this.scheme);
        }
    };
    e.addButton({
        tag: "<button>",
        class: "contrast switcher theme-switcher",
        target: "body"
    });
    e.init();
}();
