
// saveToLocalStorage сохранянет значение value в localStorage под ключом key
function saveToLocalStorage(key, value) {
    window.localStorage && window.localStorage.setItem(key, value);
}

// loadFromLocalStorage возвращает значение ключа key в localStorage, если его нет, возращает default_value
function loadFromLocalStorage(key, default_value) {
    return window.localStorage && null !== window.localStorage.getItem(key) ? window.localStorage.getItem(key) : default_value;
}

const Soundfonts = {
    'FluidR3_GM': {
        url: 'https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/kalimba-mp3.js',
        sourceUrl: 'https://gleitz.github.io/midi-js-soundfonts/',
        gain: 6,
    },
    'FatBoy': {
        url: 'https://gleitz.github.io/midi-js-soundfonts/FatBoy/kalimba-mp3.js',
        sourceUrl: 'https://gleitz.github.io/midi-js-soundfonts/',
        gain: 6,
    },
    'Keylimba': {
        url: '/soundfonts/keylimba/kalimba.mp3.js',
        sourceUrl: 'https://keylimba.carrd.co/',
        gain: 1,
    },
};

const allNotes = [
    "A0", "B0",
    "C1", "D1", "E1", "F1", "G1", "A1", "B1",
    "C2", "D2", "E2", "F2", "G2", "A2", "B2",
    "C3", "D3", "E3", "F3", "G3", "A3", "B3",
    "C4", "D4", "E4", "F4", "G4", "A4", "B4",
    "C5", "D5", "E5", "F5", "G5", "A5", "B5",
    "C6", "D6", "E6", "F6", "G6", "A6", "B6",
    "C7", "D7", "E7", "F7", "G7", "A7", "B7",
    "C8"
];

// Возвращает числовое значение, соотвествующее ноте (Ноте C4 соотвествует число 28, D4 - 29 и т.д.)
function convertStringToNumber(str) {
    // Преобразование буквы в число
    var firstLetterValue = 'CDEFGAB'.indexOf(str[0]);
    // Преобразование цифры в число
    var secondDigitValue = parseInt(str[1]);
    // Получаем номер числа
    var result = firstLetterValue + (secondDigitValue * 7);
    return result;
}

// Сортирует входящий массив клавиш и выводит их в порядке Калимбы
function sortArrayKalimba(notesArr) {
    let sortedArr = []
    for (let i = notesArr.length - notesArr.length % 2 - 1; i > 0; i -= 2) {
        sortedArr.push(notesArr[i]);
    }
    for (let i = 0; i < notesArr.length; i += 2) {
        sortedArr.push(notesArr[i]);
    }
    return sortedArr;
}

// Возвращает массив нот, где keys - количество клавиш, arrangement - порядок
function getArrayNotesKalimba(keys, arrangement) {
    const posC4 = 23;
    slicedNotes = allNotes.slice(posC4, posC4 + parseInt(keys));
    orderedNotes = sortArrayKalimba(slicedNotes);

    switch (arrangement) {
        case "Ascending":
            return slicedNotes;
        case "Alternating":
            return sortArrayKalimba(slicedNotes);
        case "Descending":
            return slicedNotes.reverse();
        default:
            return slicedNotes;
    }
}


// Флаг, нажата ли ЛКМ
var isMouseDown = false;
        
// Выключаем флаг isMouseDown когда отжат ЛКМ
$(document).on('mouseup', (event) => {
    // Проверка, что отпущена левая кнопка мыши (код 0)
    if (event.button === 0) {
        isMouseDown = false;
    }
});


// Включаем флаг isMouseDown когда нажат ЛКМ
$(document).on('mousedown', (event) => {
    // Проверка, что нажата левая кнопка мыши (код 0)
    if (event.button === 0) {
        isMouseDown = true;
    }
});


// Обновляет метки на клавишах
function updateLetter() {
    switch (kalimba_online.labelType) {
        case "Number":
            $('.note-letter').hide();
            $('.note-number').show();
            break;
        case "Letter":
            $('.note-letter').show();
            $('.note-number').hide();
            break;
        case "Letter_number":
            $('.note-letter').show();
            $('.note-number').show();
            break;
        default:
            break;
    }
}

class Kalimba_Online {
    _kalimba = {};

    get soundfont() { return loadFromLocalStorage("soundfont", "Keylimba"); }
    get arrangement() { return loadFromLocalStorage("arrangement", "Alternating"); }
    get keysCount() { return loadFromLocalStorage("keysCount", 17); }
    get labelType() { return loadFromLocalStorage("labelType", "Number"); }
    get currentSoundfont () { return Soundfonts[this.soundfont]; }
    get kalimba () { return this._kalimba; }

    set soundfont(value) { saveToLocalStorage("soundfont", value); }
    set arrangement(value) { saveToLocalStorage("arrangement", value); }
    set keysCount(value) { saveToLocalStorage("keysCount", value); }
    set labelType(value) { saveToLocalStorage("labelType", value); }
    set kalimba(value) { this._kalimba = value; }


    constructor() {
        this.loadSF();
    }

    // Маркер, определяющий тачскрин
    ifTouchscreen = false;
    
    // Перменная буфер, хранящая последнюю нажатую тачпадом клавишу
    lastTouchKeysPressed=[];
    
    loadSF() {
        // Загружаем звуки калимбы
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        var KalimbaSF = Soundfont.instrument(audioContext, this.currentSoundfont.url, { gain: this.currentSoundfont.gain });

        // Скрываем и чистим поле от предыдущих клавишь
        $('.kalimba-keys').hide();
        // Отображаем колесо загрузки
        $('#loading').show();

        // Обновляем события
        KalimbaSF.then((k) => {
            this.kalimba = k;
            this.addKeys();
            $('#loading').hide();
            $('.kalimba-keys').show();
        });
    }

    
    // Добавляет Клавиши на форму
    addKeys() {
        $('.kalimba-keys').empty();

        let notesArray = getArrayNotesKalimba(this.keysCount, this.arrangement);

        // Перебираем массив с клавишами, которые надо добавить на поле
        notesArray.forEach(note => {

            // Получаем номер клавиши, где C4 - 0, D4 - 1 и т.д.
            let num = convertStringToNumber(note) - 28;
            // Теперь номера 8 9 10 ... преобразовываем в 1 2 3 ...
            let labelNum = num % 7 + 1;

            // Определяем сколько точек нужно нарисовать сверху цифры
            let dots = "";
            for (let i = 0; i < Math.floor(num / 7); i++) dots += ".";
            if (dots === "..") dots = ":";

            // Получаем итоговую метку клавиши
            let label = dots + "\n" + labelNum;

            // Расчитываем множитель высоты
            let heightMultiplier = (27 + notesArray.length) - convertStringToNumber(note);

            // Расчитываем высоту клавиши
            let keyHeight = 170 + 5 * heightMultiplier;

            // Создаём клавишу
            const keyZone = $('<div>')
            .addClass('key-zone')
            .attr('note', note)
            .css('height', keyHeight + 'px')
            .append(
                $('<div>').addClass('key').append(
                    $('<div>').addClass('note-text').append(
                        $('<span>').addClass('note-number').text(label)
                    ).append(
                        $('<span>').addClass('note-letter').text(note[0])
                    )
                )
            );

            /* В keyZone генерируется следующая структура:
                <div class="key-zone" note="{note}" style="height: {keyHeight + 'px'};">
                    <div class="key">
                        <div class="note-text">
                            <span class="note-number">{label}</span>
                            <span class="note-letter">{note[0]}</span>
                        </div>
                    </div>
                </div>
            */

            // Событие: Одиночное нажатие мышкой по клавише
            keyZone.on('mousedown', () => {
                // Если пользователь с тачскрином, звук воспроизводится в другом событии
                if (!this.ifTouchscreen) {
                    this.playSound(note);
                }
            });

            // Событие: Зажатие мышки и ведение по клавишам
            keyZone.on('mouseover', (event) => {
                // Если нажата мышь и курсор находится внутри клавиши (без второй проверки, событие вызывается лишний раз)
                if (isMouseDown && !$(event.relatedTarget).closest(keyZone).length) {
                    this.playSound(note);
                }
            });

            // Событие: Одиночное нажатие пальцем по клавише
            keyZone.on('touchstart', (event) => {
                // Если сработало это событие, значит пользователь с тачскрином
                this.ifTouchscreen = true;

                // let note = $(this).attr('note');
                this.playSound(note);
                // keyShake($('.key', this));

                // Смотрим какое последнее касание экрана было
                let key = $(event.touches[event.touches.length - 1].target);
                // Находим родительский элемент, пока у него не будет аттрибута note
                let i = 0;
                while (key.attr('note') === undefined && i<2) {
                    key = key.parent();
                    i++;
                }
                // Получаем ноту из атрибута и записываем
                this.lastTouchKeysPressed[event.touches.length - 1] = key.attr('note');

            });

            // Событие: Зажатие пальцем и ведение по клавишам
            keyZone.on('touchmove', (event) => {
                for (let j = 0; j < event.touches.length; j++) {
                    var touch = event.touches[j]; // Получаем информацию о первом пальце
                    var key = $(document.elementFromPoint(touch.clientX, touch.clientY));

                    let i = 0;
                    while (key.attr('note') === undefined && i<2) {
                        key = key.parent();
                        i++;
                        if (i>2) console.log(i);
                    }
                    let note = key.attr('note');

                    if (note !== undefined && !this.lastTouchKeysPressed.includes(note)) {
                        this.lastTouchKeysPressed[j]=note;
                        this.playSound(note);
                    }
                }
            });

            // Добавляем созданную клавишу на поле
            $('.kalimba-keys').append(keyZone);
        });

        updateLetter();
    }

    // Воспроизводит звук
    playSound(note) {
        this._kalimba.play(note);
        this.keyShake($(`.key-zone[note=${note}] .key`));
        console.log('Pressed \'' + note + '\' (' + convertStringToNumber(note) + ')');
    }
    
    // Иницирует анимацию тряски клавиши
    keyShake(keyObj) {
        keyObj.removeClass('key-click');
        setTimeout(() => {
            keyObj.addClass('key-click');
        }, 1);
    }
}

const kalimba_online = new Kalimba_Online();

$(document).ready(function () {
    $('input[type=range]').on('input', function () {
        $(this).trigger('change');
    });

    // Получаем количество клавиш из localStorage и отображаем на странице
    $('#range-keys').val(kalimba_online.keysCount);
    $('#range-keys-value').text(kalimba_online.keysCount);

    // Событие при смене количества клавиш
    $('#range-keys').change(function () {
        kalimba_online.keysCount = $('#range-keys').val();
        $('#range-keys-value').text(kalimba_online.keysCount);
        kalimba_online.addKeys();
    });

    // Получаем порядок клавиш из localStorage и отображаем на странице
    $("input#" + kalimba_online.arrangement).prop('checked', true);

    // Событие при смене Arrangement
    $('input', '#arrangement-radio-list').on("click", function () {
        kalimba_online.arrangement = $('input:checked', '#arrangement-radio-list').attr("id");
        kalimba_online.addKeys();
    });

    // Получаем метки клавиш из localStorage
    $("input#" + kalimba_online.labelType).prop('checked', true);

    // Событие при смене Labeltype
    $('input', '#labeltype-radio-list').on("click", function () {
        kalimba_online.labelType = $('input:checked', '#labeltype-radio-list').attr("id");
        updateLetter();
    });


    $('#soundfonts').val(kalimba_online.soundfont);
    $("#soundfonts_source").attr("href", kalimba_online.currentSoundfont.sourceUrl);

    // Событие при смене Soundfont
    $('#soundfonts').change(function () {
        kalimba_online.soundfont = $(this).val();
        kalimba_online.loadSF();
        $("#soundfonts_source").attr("href", kalimba_online.currentSoundfont.sourceUrl);
    });

});





// Времнно оставлен старый код
throw "stop";
$(document).ready(function () {
    // const notes17keysOrder = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5", "E5", "F5", "G5", "A5", "B5", "C6", "D6", "E6"];
    // const notes17keys = ["D6", "B5", "G5", "E5", "C5", "A4", "F4", "D4", "C4", "E4", "G4", "B4", "D5", "F5", "A5", "C6", "E6"];
    // const notes8keys = ["C5", "A4", "F4", "D4", "C4", "E4", "G4", "B4"];

    // const allNotesSharp = [                                       
    //                                                               "A0", "A#0", "B0",
    //     "C1", "C#1", "D1", "D#1", "E1", "F1", "F#1", "G1", "G#1", "A1", "A#1", "B1", 
    //     "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2", 
    //     "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3", 
    //     "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4", 
    //     "C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5", "A5", "A#5", "B5", 
    //     "C6", "C#6", "D6", "D#6", "E6", "F6", "F#6", "G6", "G#6", "A6", "A#6", "B6", 
    //     "C7", "C#7", "D7", "D#7", "E7", "F7", "F#7", "G7", "G#7", "A7", "A#7", "B7", 
    //     "C8"
    // ];

    // const allNotesFlat = [
    //     "A0", "Bb0",
    //     "C1", "Db1", "D1", "Eb1", "E1", "F1", "Gb1", "G1", "Ab1", "A1", "Bb1", "B1",
    //     "C2", "Db2", "D2", "Eb2", "E2", "F2", "Gb2", "G2", "Ab2", "A2", "Bb2", "B2",
    //     "C3", "Db3", "D3", "Eb3", "E3", "F3", "Gb3", "G3", "Ab3", "A3", "Bb3", "B3",
    //     "C4", "Db4", "D4", "Eb4", "E4", "F4", "Gb4", "G4", "Ab4", "A4", "Bb4", "B4",
    //     "C5", "Db5", "D5", "Eb5", "E5", "F5", "Gb5", "G5", "Ab5", "A5", "Bb5", "B5",
    //     "C6", "Db6", "D6", "Eb6", "E6", "F6", "Gb6", "G6", "Ab6", "A6", "Bb6", "B6",
    //     "C7", "Db7", "D7", "Eb7", "E7", "F7", "Gb7", "G7", "Ab7", "A7", "Bb7", "B7",
    //     "C8"
    //   ];

    // C4	C#4	D4	D#4	E4	F4	F#4	G4	G#4	A4	A#4	B4  - Все ноты по порядку
    // C4		D4		E4	F4		G4		A4		B4  - Ноты без смещения
    // C#4		D#4		F4	F#4		G#4		A#4		C5  - Ноты со смещением

    // Do	Do#	Re	Re#	Mi	Fa	Fa#	Sol	Sl#	La	La#	Si  - Все ноты по порядку
    // Do		Re		Mi	Fa		Sol		La		Si  - Ноты без смещения
    // Do#		Re#		Fa	Fa#		Sl#		La#		Do  - Ноты со смещением


    // var kalimbaOptions = {
    //     keysCount: 17,
    //     selectorKeysRange: '#range-keys',
    //     selectorKeysRangeValue: '#range-keys-value',
    //     localStorageKey: "KalimbaKeysCount",

    //     keysCountFromLocalStorage() {
    //         return window.localStorage && null !== window.localStorage.getItem(this.localStorageKey) ? window.localStorage.getItem(this.localStorageKey) : this.keys;
    //     },
    //     keysCountToLocalStorage(e) {
    //         window.localStorage && window.localStorage.setItem(this.localStorageKey, e);
    //     },
    //     init() {
    //         // Событие при смене количества клавиш
    //         $(this.selectorKeysRange).change(function() {
    //             let keys = $(this.selectorKeysRange).val();
    //             $(this.selectorKeysRangeValue).text(keys);
    //             let arrangement = $('input:checked','#arrangement-radio-list').attr("id");
    //             addKeys(getArrayNotesKalimba(keys, arrangement));

    //         });
    //     },
    // }
    // kalimbaOptions.init();


    const Soundfonts = {
        'FluidR3_GM': {
            url: 'https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/kalimba-mp3.js',
            sourceUrl: 'https://gleitz.github.io/midi-js-soundfonts/',
            gain: 6,
        },
        'FatBoy': {
            url: 'https://gleitz.github.io/midi-js-soundfonts/FatBoy/kalimba-mp3.js',
            sourceUrl: 'https://gleitz.github.io/midi-js-soundfonts/',
            gain: 6,
        },
        'Keylimba': {
            url: '/soundfonts/keylimba/kalimba.mp3.js',
            sourceUrl: 'https://keylimba.carrd.co/',
            gain: 1,
        },
    };

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    // Загружаем звуки калимбы
    let soundfont = window.localStorage && null !== window.localStorage.getItem("soundfont") ? window.localStorage.getItem("soundfont") : "FluidR3_GM";
    var KalimbaSF = Soundfont.instrument(audioContext, Soundfonts[soundfont].url, { gain: Soundfonts[soundfont].gain });
    const kalimbaKeysContainer = $('.kalimba-keys');
    const allNotes = [
        "A0", "B0",
        "C1", "D1", "E1", "F1", "G1", "A1", "B1",
        "C2", "D2", "E2", "F2", "G2", "A2", "B2",
        "C3", "D3", "E3", "F3", "G3", "A3", "B3",
        "C4", "D4", "E4", "F4", "G4", "A4", "B4",
        "C5", "D5", "E5", "F5", "G5", "A5", "B5",
        "C6", "D6", "E6", "F6", "G6", "A6", "B6",
        "C7", "D7", "E7", "F7", "G7", "A7", "B7",
        "C8"
    ];
    var kalimba;


    // Возвращает массив нот, где keys - количество клавиш, arrangement - порядок
    function getArrayNotesKalimba(keys, arrangement) {
        const posC4 = 23;
        slicedNotes = allNotes.slice(posC4, posC4 + parseInt(keys));
        orderedNotes = sortArrayKalimba(slicedNotes);

        switch (arrangement) {
            case "Ascending":
                return slicedNotes;
            case "Alternating":
                return sortArrayKalimba(slicedNotes);
            case "Descending":
                return slicedNotes.reverse();
            default:
                return slicedNotes;
        }
    }

    // Сортирует входящий массив клавиш и выводит их в порядке Калимбы
    function sortArrayKalimba(notesArr) {
        let sortedArr = []
        for (let i = notesArr.length - notesArr.length % 2 - 1; i > 0; i -= 2) {
            sortedArr.push(notesArr[i]);
        }
        for (let i = 0; i < notesArr.length; i += 2) {
            sortedArr.push(notesArr[i]);
        }
        return sortedArr;
    }

    // Добавляет Клавиши на форму
    function addKeys(notesArray) {
        // Чистим поле
        kalimbaKeysContainer.empty();
        kalimbaKeysContainer.hide();
        $('#loading').show();

        // Перебираем массив с клавишами, которые надо добавить на поле
        notesArray.forEach(note => {

            // Получаем номер клавиши, где C4 - 0, D4 - 1 и т.д.
            let num = convertStringToNumber(note) - 28;
            // Теперь номера 8 9 10 ... преобразовываем в 1 2 3 ...
            let labelNum = num % 7 + 1;

            // Определяем сколько точек нужно нарисовать сверху цифры
            dots = ""
            for (let i = 0; i < Math.floor(num / 7); i++) dots += ".";
            if (dots === "..") dots = ":";

            // Получаем итоговую метку клавиши
            let label = dots + "\n" + labelNum;

            // Расчитываем множитель высоты
            let heightMultiplier = (27 + notesArray.length) - convertStringToNumber(note);

            // Расчитываем высоту клавиши
            let keyHeight = 170 + 5 * heightMultiplier;

            // Создаём элемент клавиши указав высоту и ноту
            // const keyZone = $('<div>', {
            //     class: 'key-zone',
            //     note: note,
            //     height: (150 + 5 * heightMultiplier) + "px"
            // });

            // // Создаём элемент клавиши указав высоту и ноту
            // const keyElement = $('<div>', {
            //     class: 'key',
            // });
            
            // // Создаём элемент клавиши указав высоту и ноту
            // const NoteTextElement = $('<div>', {
            //     class: 'note-text',
            //     // text: label,
            // })


            // // Создаём элемент клавиши указав высоту и ноту
            // const noteNumber = $('<span>', {
            //     class: 'note-number',
            //     text: label,
            // });

            // // Создаём элемент клавиши указав высоту и ноту
            // const noteLetter = $('<span>', {
            //     class: 'note-letter',
            //     text: note[0],
            // });

            // NoteTextElement.append(noteNumber);
            // NoteTextElement.append(noteLetter);
            
            // // Создаём блок с меткой клавиши
            // keyElement.append(NoteTextElement);

            // Создаём клавишу
            const keyZone = $('<div>')
            .addClass('key-zone')
            .attr('note', note)
            .css('height', keyHeight + 'px')
            .append(
                $('<div>').addClass('key').append(
                    $('<div>').addClass('note-text').append(
                        $('<span>').addClass('note-number').text(label)
                    ).append(
                        $('<span>').addClass('note-letter').text(note[0])
                    )
                )
            );

            /* В keyZone генерируется следующая структура:
                <div class="key-zone" note="{note}" style="height: {keyHeight + 'px'};">
                    <div class="key">
                        <div class="note-text">
                            <span class="note-number">{label}</span>
                            <span class="note-letter">{note[0]}</span>
                        </div>
                    </div>
                </div>
            */

            // Добавляем созданную клавишу на поле
            kalimbaKeysContainer.append(keyZone);
        });

        // Обновляем метки
        updateLetter();

        // Обновляем события
        KalimbaSF.then(function (k) {
            attachEventListeners();
            kalimba = k;
            $('#loading').hide();
            kalimbaKeysContainer.show();
        });
    }

    // Возвращает числовое значение, соотвествующее ноте (Ноте C4 соотвествует число 28, D4 - 29 и т.д.)
    function convertStringToNumber(str) {
        // Преобразование буквы в число
        var firstLetterValue = 'CDEFGAB'.indexOf(str[0]);
        // Преобразование цифры в число
        var secondDigitValue = parseInt(str[1]);
        // Получаем номер числа
        var result = firstLetterValue + (secondDigitValue * 7);
        return result;
    }

    // Перменная буфер, хранящая последнюю нажатую тачпадом клавишу
    var lastTouchKeysPressed=[];

    // Маркер, определяющий тачскрин
    let ifTouchscreen = false;

    // Обработчик события touchstart
    function handleTouchStart(event) {
        // Если сработало это событие, значит пользователь с тачскрином
        ifTouchscreen = true;

        let note = $(this).attr('note');
        playSound(kalimba, note);
        keyShake($('.key', this));

        // Смотрим какое последнее касание экрана было
        let key = $(event.touches[event.touches.length - 1].target);
        // Находим родительский элемент, пока у него не будет аттрибута note
        let i = 0;
        while (key.attr('note') === undefined && i<2) {
            key = key.parent();
            i++;
        }
        // Получаем ноту из атрибута и записываем
        lastTouchKeysPressed[event.touches.length - 1] = key.attr('note');

    }

    // Обработчик события touchmove
    function handleTouchMove(event) {
        for (let j = 0; j < event.touches.length; j++) {
            var touch = event.touches[j]; // Получаем информацию о первом пальце
            var key = $(document.elementFromPoint(touch.clientX, touch.clientY));

            let i = 0;
            while (key.attr('note') === undefined && i<2) {
                key = key.parent();
                i++;
                if (i>2) console.log(i);
            }
            let note = key.attr('note');

            // if (note !== undefined && lastTouchKeysPressed[event.touches.length-1] != note) {
                
            if (note !== undefined && !lastTouchKeysPressed.includes(note)) {
                lastTouchKeysPressed[j]=note;
                playSound(kalimba, note);
                
            }
        }
    }

    // Добавляем события на нажатия клавиш
    function attachEventListeners() {
        const keys = $('.key-zone');

        keys.each(function () {
            const note = $(this).attr('note');
            // Событие наведения мыши на клавишу
            $(this).on('mouseover', function (event) {
                // Если нажата мышь и курсор находится внутри клавиши (без второй проверки, событие вызывается лишний раз)
                if (isMouseDown && !$(event.relatedTarget).closest(this).length) {
                    playSound(kalimba, note);
                }
            });

            // Событие нажатия мыши на клавишу
            $(this).on('mousedown', function () {
                // Если пользователь с тачскрином, звук воспроизводится в другом событии
                if (!ifTouchscreen) {
                    playSound(kalimba, note);
                }
            });

            // Событие нажатия пальцем (тачскрин) на клавишу
            this.addEventListener('touchstart', handleTouchStart, { passive: true });

            // Событие наведения пальцем (тачскрин) на клавишу
            this.addEventListener("touchmove", handleTouchMove);
        });
    }




    let isSpacePressed = false;


    // Добавляем события на нажатия клавиш через клавиатуру
    function attachKeyboardEventListeners() {

        // Обработчик события keydown
        $(document).on('keydown', function (event) {
            let keyNoteMap = {
                65: 'C5', //a
                83: 'A4', //s
                68: 'F4', //d
                70: 'D4', //f
                71: 'C4', //g
                72: 'E4', //h
                74: 'G4', //j
                75: 'B4', //k
                76: 'D5', //l
            };

            if (event.keyCode == 32) {
                isSpacePressed = true;
                event.preventDefault();
                return;
            }

            // Проверка, есть ли нота для нажатой клавиши
            if (keyNoteMap.hasOwnProperty(event.keyCode)) {
                const baseNote = keyNoteMap[event.keyCode];

                let octaveModifier = parseInt(baseNote[1]);
                // Если пробел нажат, увеличиваем октаву на 1
                if (isSpacePressed) octaveModifier++;

                const note = `${baseNote[0]}${octaveModifier}`;

                let KeyDiv = $(`[note="${note}"]`);
                // Если соотвествующая клавиша есть на странице
                if (KeyDiv.length) {
                    // Вызов функций воспроизведения звука и анимации клавиши
                    playSound(kalimba, note);
                }

            }
        });

        // Обработчик события keyup
        $(document).on('keyup', function (event) {
            // Если отпущен пробел
            if (event.keyCode == 32) {
                // Выключаем маркер
                isSpacePressed = false;
            }
        });
    }

    // Присваивает события на нажатия когда Калимба загрузится
    KalimbaSF.then(function () {
        attachKeyboardEventListeners();
    });

    // Иницирует анимацию тряски клавиши
    function keyShake(keyObj) {
        keyObj.removeClass('key-click');
        setTimeout(() => {
            keyObj.addClass('key-click');
        }, 1);
    }

    // Воспроизводит звук
    function playSound(instrument, note) {
        instrument.play(note);
        keyShake($(`.key-zone[note=${note}] .key`));
        console.log('Pressed \'' + note + '\' (' + convertStringToNumber(note) + ')');
    }

    // Флаг, нажата ли ЛКМ
    let isMouseDown = false;

    // Включаем флаг isMouseDown когда нажат ЛКМ
    $(document).on('mousedown', function (event) {
        // Проверка, что нажата левая кнопка мыши (код 0)
        if (event.button === 0) {
            isMouseDown = true;
        }
    });

    // Выключаем флаг isMouseDown когда отжат ЛКМ
    $(document).on('mouseup', function (event) {
        // Проверка, что отпущена левая кнопка мыши (код 0)
        if (event.button === 0) {
            isMouseDown = false;
        }
    });


    $('input[type=range]').on('input', function () {
        $(this).trigger('change');
    });


    // Получаем количество клавиш из localStorage и отображаем на странице
    let keysCount = window.localStorage && null !== window.localStorage.getItem("KeysCount") ? window.localStorage.getItem("KeysCount") : 17;
    $('#range-keys').val(keysCount);
    $('#range-keys-value').text(keysCount);

    // Событие при смене количества клавиш
    $('#range-keys').change(function () {
        keysCount = $('#range-keys').val();
        window.localStorage && window.localStorage.setItem("KeysCount", keysCount);
        $('#range-keys-value').text(keysCount);
        addKeys(getArrayNotesKalimba(keysCount, arrangement));
    });


    // Получаем порядок клавиш из localStorage и отображаем на странице
    let arrangement = window.localStorage && null !== window.localStorage.getItem("Arrangement") ? window.localStorage.getItem("Arrangement") : "Alternating";
    $("input#" + arrangement).prop('checked', true);

    // Событие при смене Arrangement
    $('input', '#arrangement-radio-list').on("click", function () {
        arrangement = $('input:checked', '#arrangement-radio-list').attr("id");
        window.localStorage && window.localStorage.setItem("Arrangement", arrangement);
        addKeys(getArrayNotesKalimba(keysCount, arrangement));
    });


    // Получаем метки клавиш из localStorage
    let labeltype = window.localStorage && null !== window.localStorage.getItem("Labeltype") ? window.localStorage.getItem("Labeltype") : "Number";
    $("input#" + labeltype).prop('checked', true);
    // Событие при смене Labeltype
    $('input', '#labeltype-radio-list').on("click", function () {
        labeltype = $('input:checked', '#labeltype-radio-list').attr("id");
        window.localStorage && window.localStorage.setItem("Labeltype", labeltype);
        updateLetter();
    });

    // Обновляет метки на клавишах
    function updateLetter() {
        switch (labeltype) {
            case "Number":
                $('.note-letter').hide();
                $('.note-number').show();
                break;
            case "Letter":
                $('.note-letter').show();
                $('.note-number').hide();
                break;
            case "Letter_number":
                $('.note-letter').show();
                $('.note-number').show();
                break;
            default:
                break;
        }
    }


    $('#soundfonts').val(soundfont);
    // $("#soundfonts_source").text(soundfont + " source");
    $("#soundfonts_source").attr("href", Soundfonts[soundfont].sourceUrl);

    // Событие при смене Soundfont
    $('#soundfonts').change(function () {
        var soundfont = $(this).val();
        console.log('Current Soundfont: ' + soundfont);
        KalimbaSF = Soundfont.instrument(audioContext, Soundfonts[soundfont].url, { gain: Soundfonts[soundfont].gain });
        addKeys(getArrayNotesKalimba(keysCount, arrangement));
        // $("#soundfonts_source").text(soundfont + " source");
        $("#soundfonts_source").attr("href", Soundfonts[soundfont].sourceUrl);

        window.localStorage && window.localStorage.setItem("soundfont", soundfont);
    });

    // Создаём Калимбу с полученными значениями
    addKeys(getArrayNotesKalimba(keysCount, arrangement));
});

/*
TODO:
    + Добавить возможность работать с сенсора:
        + Одновременное нажатие на несколько клавиш
        + Водить пальцем по экрану
        - Исправить баг: После одновременного нажатия на 2 клавиши, при ведении пальцем она не работает
    - Добавить настройки Калимбы:
        + Количество клавиш
        + Различное звучание (soundfonts)
        + Выбор цвета калимбы и темы всего сайта
        + Порядок клавиш
        + Отображение меток клавиш
        - Громкость звука
        - Тюнинг нот
    - Игра на клавиатуре:
        + Возможность играть на клавиатуре
        + Нажатие клавиши с пробелом повышает её звучание на 1 октаву
        - Различные пресеты управления
        - Настроить отображение клавиатурных клавиш на клавишах калимбы
    + Распределить файлы по папкам css и js
    + Залить на GitHub
    + Реструктуризировать JS код (Прикрутить ООП)
    - Написать readme.md (перенести туда TODO)
    + Сделать кнопку "Во весь экран"
    + Перевод на разные языки
    - Сделать более компактными настройки калимбы

TODO (в долгосрочной перспективе):
    - Запись нажимаемых клавиш и воспроизведение
    - Возможность сохранить записанный трек в файл
    - Репозиторий треков
    - Страница, где можно будет научиться играть трек
 */