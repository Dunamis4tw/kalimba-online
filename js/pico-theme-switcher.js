/* Код кнопки смены полностью взят с оф. сайта */
"use strict";
!function () {
    var e = {
        _scheme: "auto",
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
            let darkmode = e.scheme === "dark";
            if (darkmode) {
                $('[theme=light]', this.buttonsTarget).show();
                $('[theme=dark]', this.buttonsTarget).hide();
            } else {
                $('[theme=light]', this.buttonsTarget).hide();
                $('[theme=dark]', this.buttonsTarget).show();
            }
        },
        schemeToLocalStorage() {
            window.localStorage && window.localStorage.setItem(this.localStorageKey, this.scheme);
        }
    };
    e.init();
}();
