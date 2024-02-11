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
            $("#fullscreen-on").show();
            $("#fullscreen-off").hide();
            $("#fullscreenDiv").removeClass("fullscreen");
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
        $("#fullscreen-on").hide();
        $("#fullscreen-off").show();
        $("#fullscreenDiv").addClass("fullscreen");
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
        $("#fullscreen-on").show();
        $("#fullscreen-off").hide();
        $("#fullscreenDiv").removeClass("fullscreen");
    }
});