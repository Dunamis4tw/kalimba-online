
var langs = [
    {code: 'ru', text: 'Russian (Русский)'}, // Русский язык
    {code: 'en', text: 'English (English)'}, // Английский язык
    {code: 'de', text: 'German (Deutsch)'}, // Немецкий язык
    {code: 'es', text: 'Spanish (Español)'}, // Испанский язык
    {code: 'fr', text: 'French (Français)'}, // Французский язык
    {code: 'zh-CN', text: 'Chinese (中文)'}, // Китайский язык (упрощённый)
    {code: 'ar', text: 'Arabic (العربية)'}, // Арабский язык
    {code: 'pt', text: 'Portuguese (Português)'}, // Португальский язык
    {code: 'ja', text: 'Japanese (日本語)'}, // Японский язык
    {code: 'id', text: 'Indonesian (Bahasa Indonesia)'} // Индонезийский язык
];

// Сортирует массив языков по полю text
langs.sort(function(a, b) {
    var textA = a.text.toUpperCase();
    var textB = b.text.toUpperCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
});

var currentLang = window.localStorage && null !== window.localStorage.getItem("localization") ? window.localStorage.getItem("localization") : getUserLang();

// Возвращает код языка пользователя
function getUserLang() {
    // Получаем предпочитаемые языки пользователя из navigator.languages
    var userLangs = navigator.languages;

    // Перебираем языки в порядке предпочтения
    for (var i = 0; i < userLangs.length; i++) {
        // Находим язык пользователя в массиве langs
        var userLanguage = langs.find(function(lang) {
            return lang.code === userLangs[i];
        });
        // Если язык нашёлся, то возвращаем его код
        if (userLanguage) return userLanguage.code;
    }

    // Если ни один из языков не нашёлся, возвращаем код Английского языка
    return 'en';
}

// Подгружаем дефолтный язык (на случай, если в выбранном языке нет локализации для каких-либо ключей)
var defaultLocalization;
$.getJSON('/lang/en.json', function(data) {
    defaultLocalization = data;
});

// Переводит всю страницу на указанный язык
function loadLanguage(lang) {
    $.getJSON('/lang/' + lang + '.json', function(data) {
        $('html').attr('lang', lang);
        $('[data-i18n]').each(function() {
            var key = $(this).data('i18n');
            // Если ключа в локализации нет, ключ берётся из дефолтного языка
            $(this).text(data[key] || defaultLocalization[key]);
        });
        $('meta[name="description"]').attr('content', data["seo.description"] || defaultLocalization["seo.description"]);
    });
}

// Заполняет элемент выбора языка на странице доступными языками 
function fillLangSelector() {
    const LangSelector = $('#localization');
    LangSelector.empty();
    langs.forEach(lang => {
        LangSelector.append(
            $('<option>', {
                value: lang.code,
                text: lang.text
            })
        );
    });
    LangSelector.val(currentLang);
}

$(document).ready(function() {
    // Заполняем элемент выбора языка на странице доступными языками
    fillLangSelector();

    // Подгружаем текущий язык
    loadLanguage(currentLang);

    // Событие при смене локализации
    $('#localization').change(function () {
        currentLang = $(this).val();
        window.localStorage && window.localStorage.setItem("localization", currentLang);
        loadLanguage(currentLang);
    });
});