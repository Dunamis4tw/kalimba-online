$(document).ready(function () {
    // Кнопка переключения Фуллскрина
    const fullscreenButton = $("#fullscreenButton");
    // Блок, который необходимо делать в фулл скрин
    const fullscreenDiv = $("#fullscreenDiv")[0];

    // Событие на нажатие на кнопку Фуллскрина
    fullscreenButton.on("click", function () {
        if (document.fullscreenElement) {
            exitFullscreen();
        } else {
            enterFullscreen();
        }
    });

    // Событие вызывается при смене состояния фуллскрина
    $(document).on("fullscreenchange", function () {
        // Если полный экран выключен, выходим из него
        if (!document.fullscreenElement) {
            $("header").show();
            $("footer").show();
            $("#fullscreen-on").show();
            $("#fullscreen-off").hide();
        }
    });

    // Функция входа в полный экран
    function enterFullscreen() {
        if (fullscreenDiv.requestFullscreen) {
            fullscreenDiv.requestFullscreen();
        } else if (fullscreenDiv.mozRequestFullScreen) {
            fullscreenDiv.mozRequestFullScreen();
        } else if (fullscreenDiv.webkitRequestFullscreen) {
            fullscreenDiv.webkitRequestFullscreen();
        } else if (fullscreenDiv.msRequestFullscreen) {
            fullscreenDiv.msRequestFullscreen();
        }
        $("header").hide();
        $("footer").hide();
        $("#fullscreen-on").hide();
        $("#fullscreen-off").show();
    }

    // Функция выхода из полного экрана
    function exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        $("header").show();
        $("footer").show();
        $("#fullscreen-on").show();
        $("#fullscreen-off").hide();
    }
});