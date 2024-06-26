
// saveToLocalStorage сохранянет значение value в localStorage под ключом key
function saveToLocalStorage(key, value) {
    window.localStorage && window.localStorage.setItem(key, value);
}

// loadFromLocalStorage возвращает значение ключа key из localStorage, если его нет, возращает default_value
function loadFromLocalStorage(key, default_value) {
    return window.localStorage && null !== window.localStorage.getItem(key) ? window.localStorage.getItem(key) : default_value;
}

// saveJSONToLocalStorage записывает в localStorage объект value под ключом key в формате JSON
function saveJSONToLocalStorage(key, value) {
    if (window.localStorage) {
        try {
            const serializedValue = JSON.stringify(value);
            window.localStorage.setItem(key, serializedValue);
        } catch (error) {
            console.error("Error saving to localStorage:", error);
        }
    }
}

// loadJSONFromLocalStorage возвращает значение ключа key из localStorage в формате JSON, если его нет, возвращает default_value
function loadJSONFromLocalStorage(key, default_value) {
    if (window.localStorage) {
        const serializedValue = window.localStorage.getItem(key);
        if (serializedValue !== null) {
            try {
                return JSON.parse(serializedValue);
            } catch (error) {
                console.error("Error loading from localStorage:", error);
                return default_value;
            }
        }
    }
    return default_value;
}

// // // // // //
//  КОНСТАНТЫ  //
// // // // // //

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

const allNotesSharp = [                                       "A0", "A#0", "B0",
    "C1", "C#1", "D1", "D#1", "E1", "F1", "F#1", "G1", "G#1", "A1", "A#1", "B1", 
    "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2", 
    "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3", 
    "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4", 
    "C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5", "A5", "A#5", "B5", 
    "C6", "C#6", "D6", "D#6", "E6", "F6", "F#6", "G6", "G#6", "A6", "A#6", "B6", 
    "C7", "C#7", "D7", "D#7", "E7", "F7", "F#7", "G7", "G#7", "A7", "A#7", "B7", 
    "C8"
];

// Объект с клавишами, где ключ - это keycode, а значение - название клавиши
const keyboardKeys = {
    192: "`", 49: "1", 50: "2", 51: "3", 52: "4", 53: "5", 54: "6", 55: "7", 56: "8", 57: "9", 48: "0", 189: "-", 187: "=", 8: "←",
    9: "Tab", 81: "Q", 87: "W", 69: "E", 82: "R", 84: "T", 89: "Y", 85: "U", 73: "I", 79: "O", 80: "P", 219: "[", 221: "]", 220: "\\",
    20: "Caps", 65: "A", 83: "S", 68: "D", 70: "F", 71: "G", 72: "H", 74: "J", 75: "K", 76: "L", 186: ";", 222: "'", 13: "Enter",
    16: "Shift", 90: "Z", 88: "X", 67: "C", 86: "V", 66: "B", 78: "N", 77: "M", 188: ",", 190: ".", 191: "/",
    17: "Ctrl", 18: "Alt", 32: "Space", 0: " "
};

// Массив с клавишами обычной QWERTY раскладки, содержит информацию о положении кнопки и её длине 
const keyboardKeyInfo = [
    // Ряд 1
    [
        { code: 192, length: 1 }, { code: 49, length: 1 }, { code: 50, length: 1 }, { code: 51, length: 1 },
        { code: 52, length: 1 }, { code: 53, length: 1 }, { code: 54, length: 1 }, { code: 55, length: 1 },
        { code: 56, length: 1 }, { code: 57, length: 1 }, { code: 48, length: 1 }, { code: 189, length: 1 },
        { code: 187, length: 1 }, { code: 8, length: 2.5 }
    ],
    // Ряд 2
    [
        { code: 9, length: 1.5 }, { code: 81, length: 1 }, { code: 87, length: 1 }, { code: 69, length: 1 },
        { code: 82, length: 1 }, { code: 84, length: 1 }, { code: 89, length: 1 }, { code: 85, length: 1 },
        { code: 73, length: 1 }, { code: 79, length: 1 }, { code: 80, length: 1 }, { code: 219, length: 1 },
        { code: 221, length: 1 }, { code: 220, length: 2 }
    ],
    // Ряд 3
    [
        { code: 20, length: 2 }, { code: 65, length: 1 }, { code: 83, length: 1 }, { code: 68, length: 1 },
        { code: 70, length: 1 }, { code: 71, length: 1 }, { code: 72, length: 1 }, { code: 74, length: 1 },
        { code: 75, length: 1 }, { code: 76, length: 1 }, { code: 186, length: 1 }, { code: 222, length: 1.05 },
        { code: 13, length: 2.5 }
    ],
    // Ряд 4
    [
        { code: 16, length: 2.5 }, { code: 90, length: 1 }, { code: 88, length: 1 }, { code: 67, length: 1 },
        { code: 86, length: 1 }, { code: 66, length: 1 }, { code: 78, length: 1 }, { code: 77, length: 1 },
        { code: 188, length: 1 }, { code: 190, length: 1 }, { code: 191, length: 1 }, { code: 16, length: 3.1 }
    ],
    // Ряд 5
    [
        { code: 17, length: 1.5 }, { code: 0, length: 1 }, { code: 18, length: 1.5 }, { code: 32, length: 6.3 },
        { code: 18, length: 1.5 }, { code: 0, length: 1 }, { code: 0, length: 1 }, { code: 17, length: 2 }
    ]
];

// Схемы управления клавиатурой, каждый массив - отдельная схема, в которой хранятся keycode клавиш в порядке возрастания частоты ноты
const keyboardSchemes = [
    // B V N C M X < F H D J S K A U R I E O P W
    [66, 86, 78, 67, 77, 88, 188, 70, 72, 68, 74, 83, 75, 65, 85, 82, 73, 69, 79, 80, 87],

    // A S D F G H J K L
    [71, 70, 72, 68, 74, 83, 75, 65, 76],

    // 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, -, =
    [49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 189, 187],
];

// Флаг, нажата ли ЛКМ
var isMouseDown = false;

// Флаг, нажат ли пробел (используется для повышения октавы при игре на клавиатуре)
var isSpacePressed = false;

// Флаг, ведётся ли запись
var isRecording = false;

// Флаг, воспроизводится ли запись
var isPlaying = false;

// Переменная для сохранения записи
var sequence = [];

// Переменная для хранения времени последней нажатой клавиши
var prevTime;

// Выключаем флаг isMouseDown когда отжата ЛКМ
$(document).on('mouseup', (event) => {
    // Проверка, что отпущена левая кнопка мыши (код 0)
    if (event.button === 0) {
        isMouseDown = false;
    }
});

// Включаем флаг isMouseDown когда нажата ЛКМ
$(document).on('mousedown', (event) => {
    // Проверка, что нажата левая кнопка мыши (код 0)
    if (event.button === 0) {
        isMouseDown = true;
    }
});

// Включаем флаг isSpacePressed когда нажат Пробел
$(document).on('keydown', function (event) {
    if (event.keyCode == 32) {
        isSpacePressed = true;
        event.preventDefault(); // Отменяем прокрутку при нажатии на пробел
    }
});

// Выключаем флаг isSpacePressed когда отжат Пробел
$(document).on('keyup', function (event) {
    if (event.keyCode == 32) {
        isSpacePressed = false;
    }
});


// Обновляет метки на клавишах
function updateLabels() {
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


// // // // // // //
//  ГЛАВНЫЙ КЛАСС //
// // // // // // //

class Kalimba_Online {
    _kalimba = {};

    get soundfont() { return loadFromLocalStorage("soundfont", "Keylimba"); }
    get currentSoundfont () { return Soundfonts[this.soundfont]; }
    get arrangement() { return loadFromLocalStorage("arrangement", "Alternating"); }
    get keysCount() { return loadFromLocalStorage("keysCount", 17); }
    get labelType() { return loadFromLocalStorage("labelType", "Number"); }
    get kalimba () { return this._kalimba; }
    get baseNote() { return parseInt(loadFromLocalStorage("baseNote", allNotesSharp.indexOf("C4"))); }
    get tunes() { return loadFromLocalStorage("tunes", Array(21).fill(0).join(',')).split(",").map(Number); }
    // get tunes() { return loadJSONFromLocalStorage("tunes", Array(21).fill(0)); } // При переходе на формат json не читаются старые настройки
    get keyboardScheme () { return loadFromLocalStorage("keyboardScheme", 0); }
    get currentKeyboardScheme () { return keyboardSchemes[this.keyboardScheme]; }
    get volume() { return loadFromLocalStorage("volume", 75); }
    get recordedNotes() { return loadJSONFromLocalStorage("recordedNotes", Array(0)); }

    set soundfont(value) { saveToLocalStorage("soundfont", value); }
    set arrangement(value) { saveToLocalStorage("arrangement", value); }
    set keysCount(value) { saveToLocalStorage("keysCount", value); }
    set labelType(value) { saveToLocalStorage("labelType", value); }
    set kalimba(value) { this._kalimba = value; }
    set baseNote(value) { saveToLocalStorage("baseNote", value); }
    set tunes(value) { saveToLocalStorage("tunes", value); }
    // set tunes(value) { saveJSONToLocalStorage("tunes", value); }
    set keyboardScheme(value) { saveToLocalStorage("keyboardScheme", value); }
    set volume(value) { saveToLocalStorage("volume", value); }
    set recordedNotes(value) { saveJSONToLocalStorage("recordedNotes", value); }


    constructor() {
        this.loadSF();
    }

    // Маркер, определяющий тачскрин
    ifTouchscreen = false;
    
    // Перменная буфер, хранящая последнюю нажатую тачпадом клавишу
    lastTouchKeysPressed=[];
    
    // Загружаем звуки калимбы
    _audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Загружает звуки
    loadSF() {
        var KalimbaSF = Soundfont.instrument(this._audioContext, this.currentSoundfont.url);

        // Чистим поле от предыдущих клавиш
        $('.kalimba-container').empty();
        // Отображаем колесо загрузки
        $('.kalimba-container').attr("aria-busy", true);

        // Обновляем события
        KalimbaSF.then((k) => {
            // Получаем новый инструмент
            this.kalimba = k;
            // Добавляем клавиши на экран
            this.addKeys();
            // Скрываем колесо загрузки
            $('.kalimba-container').removeAttr("aria-busy");
        });
    }

    // Возвращает массив нот с текущими настройками
    getNotes() {
        const majorIntervals = [2, 2, 1, 2, 2, 2, 1]; // тон-тон-полутон-тон-тон-тон-полутон
        const minorIntervals = [2, 1, 2, 2, 1, 2, 2]; // тон-полутон-тон-тон-полутон-тон-тон

        // Определяем пустой массив для заполнения
        const notes = [];
        // Получаем начальную (базовую) ноту, с которой пойдёт отсчёт
        var currentIndex = this.baseNote;
        // Цикл по количеству клавиш
        for (let i = 0; i < this.keysCount; i++) {
            // Добавляем в массив клавишу с текущим индексом и плюсом учитываем тюнинг
            notes.push(allNotesSharp[currentIndex + this.tunes[i]]);
            // Добавляем к индексу тон/полутон в зависимости от выбранной гаммы
            currentIndex += majorIntervals[i%7];
        }
        // Возвращаем итоговый массив
        return notes;
    }

    
    // Добавляет Клавиши на форму
    addKeys() {
        // Чистим поле от предыдущих клавиш
        $('.kalimba-container').empty();

        // Получаем массив нот с текущими настройками
        let notesArray = this.getNotes();
        
        // Сортируем ноты
        let sortedNotes = notesArray;

        switch (this.arrangement) {
            case "Ascending":
                sortedNotes = notesArray;
                break;
            case "Alternating":
                sortedNotes = sortArrayKalimba(notesArray);
                break;
            case "Descending":
                sortedNotes = notesArray.slice().reverse();
                break;
            default:
                sortedNotes = notesArray;
                break;
        }

        // Перебираем массив с клавишами, которые надо добавить на поле
        sortedNotes.forEach((note) => {
            // Получаем номер клавиши, где C4 - 0, D4 - 1 и т.д.
            let num = notesArray.indexOf(note);
            // Теперь номера 8 9 10 ... преобразовываем в 1 2 3 ...
            let labelNum = num % 7 + 1;

            // Определяем сколько точек нужно нарисовать сверху цифры
            let dots = "";
            for (let i = 0; i < Math.floor(num / 7); i++) dots += ".";
            if (dots === "..") dots = ":";

            // Получаем итоговую метку клавиши
            let label = dots + "\n" + labelNum;

            let keys = notesArray.length;
            let x = notesArray.indexOf(note);

            // Расчитываем высоту клавиши
            // let keyHeight = 165 + 5*(keys - x); // Прямолинейная
            // let keyHeight = 315 - 5*(21-keys) - 30*Math.sqrt(x); // Степенная
            // let keyHeight = 280 - 4*(21-keys) - 25*Math.sqrt(x); // Степенная
            let keyHeight = 260 - 3*(21-keys) - 20*Math.sqrt(x); // Степенная

            let letter = note.replace(/#/g, '♯');

            // Получаем надпись клавиатурной клавиши по номеру
            let keyboardKey = this.currentKeyboardScheme[num];

            // Создаём клавишу
            const keyZone = $('<div>')
                .addClass('key-zone')
                .attr('note', note)
                .attr('notenumber', notesArray.indexOf(note))
                .css('height', keyHeight + 'px')
                .append(
                    $('<div>').addClass('key').append(
                        $('<div>').addClass('note-text').append(
                            $('<span>').addClass('note-keyboard-key').text(keyboardKeys[keyboardKey])
                        ).append(
                            $('<span>').addClass('note-number').text(label)
                        ).append(
                            $('<span>').addClass('note-letter').text(letter.slice(0, -1)).append(
                                $('<sub>').text(letter.slice(-1))
                            )
                        )
                    )
                );

            /* В keyZone генерируется следующая структура:
                <div class="key-zone" note="{note}" style="height: {keyHeight + 'px'};">
                    <div class="key">
                        <div class="note-text">
                            <span class="note-keyboard-key">{keyboardKeys[keyboardKey]}</span>
                            <span class="note-number">{label}</span>
                            <span class="note-letter">{letter.slice(0, -1)}<sub>{letter.slice(-1)}</sub></span>
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
                        // if (i>2) console.log(i);
                    }
                    let note = key.attr('note');

                    if (note !== undefined && !this.lastTouchKeysPressed.includes(note)) {
                        this.lastTouchKeysPressed[j]=note;
                        this.playSound(note);
                    }
                }
            });

            // Добавляем созданную клавишу на поле
            $('.kalimba-container').append(keyZone);
        });

        // Обновляем метки
        updateLabels();
    }

    // Воспроизводит звук
    playSound(note, options = { play: true, animate: true, record: true }) {

        // Воспроизводим звук, если флаг play установлен в true
        if (options.play) {
            // Считаем громкость по логарифмической шкале (по ощущениям хуже, чем с обычной шкалой):
            // let currentVolume = this.currentSoundfont.gain * Math.log10(1 + 9 * this.volume / 100);
            // Считаем громкость по обычной шкале:
            let currentVolume = this.currentSoundfont.gain * this.volume / 100;
            // Воспроизводим звук с текущей кромкостью
            this._kalimba.play(note, 0, { gain: currentVolume });
        }

        // Запускаем анимацию, если флаг animate установлен в true
        if (options.animate) {
            this.keyShake($(`.key-zone[note='${note}'] .key`));
        }
        console.log('Pressed \'' + note + '\' (' + allNotesSharp.indexOf(note) + ')');

        // Записываем нажатую ноту, если флаги record и isRecording установлены в true
        if (options.record && isRecording) {
            // Если это первая нажатая нота, то запоминаем время нажатия
            if (sequence.length == 0) prevTime = Date.now();
            // Запоминаем текущее время
            var currentTime = Date.now();
            // Считаем сколько времени прошло с предыдущего нажатия ноты
            var timeElapsed = currentTime - prevTime;
            // Добавляем в массив с нотами ноту
            sequence.push({ soundId: note, time: timeElapsed });
            console.log('[REC] Recorded \'' + note + '\' with a duration of ' + timeElapsed + 'ms');
            // Обновляем время последнего нажатия клавиши на текущее
            prevTime = currentTime;
        }
    }
    
    // Воспроизводит анимацию тряски клавиши
    keyShake(keyObj) {
        keyObj.removeClass('key-click');
        setTimeout(() => {
            keyObj.addClass('key-click');
        }, 1);
    }
}

const kalimba_online = new Kalimba_Online();


// // // // // // // //
//  ФУНКЦИИ И МЕТОДЫ //
// // // // // // // //

// updateKeyboardSchemes обновляет надписи клавиатурных клавиш на клавишах калимбы
function updateKeyboardSchemes() {
    $(".key-zone").each(function(){
        var notenumberValue = $(this).attr("notenumber");
        // Получаем надпись клавиатурной клавиши по номеру
        let keyboardKey = kalimba_online.currentKeyboardScheme[notenumberValue];
        
        if (keyboardKey !== undefined) {
            $(this).find(".note-keyboard-key").text(keyboardKeys[keyboardKey]);
        } else {
            $(this).find(".note-keyboard-key").empty();
        }
    });
}

// updateTunes обновляет элементы управления, которые настраивают клавиши (тюнинг клавиш)
function updateTunes() {
    // Опустошаем поле
    $('.tune-field').empty();

    // Получаем массив клавиш с текущими настройками
    let notesArray = kalimba_online.getNotes();
    // Перебираем клавиши
    notesArray.forEach((note, index) => {
        let letter = note.replace(/#/g, '♯');
        $('<label>', {
            'class': 'tune-label',
            'for': 'range-tune-'+index
        }).append(
            $('<input>', {
                'type': 'range',
                'min': '-1',
                'max': '1',
                'value': kalimba_online.tunes[index],
                'id': 'range-tune-' + index,
                'notenumber': index,
                'orient': 'vertical'
            }),
            $('<span>', {
                'id': 'range-tune-value-' + index,
            }).append(
                $('<small>').text(letter.slice(0, -1)).append(
                    $('<sub>').text(letter.slice(-1))
                )
            )
        ).appendTo('.tune-field');
    });

    // Событие при смене ползунков настройки клавиш
    $('input', '.tune-label').on('input', function () {
        // Получаем порядковый номер изменённой клавиши и новое значение
        let notenumber = parseInt($(this).attr('notenumber'));
        let tune = parseInt($(this).val());

        // Получаем текущий массив настроек, меняем и сохраняем обратно
        let tunes = kalimba_online.tunes;
        tunes[notenumber] = tune;
        kalimba_online.tunes = tunes;

        // Пересоздаём клавиши
        kalimba_online.addKeys();
        
        // Получаем текущий список нот
        let notesArray = kalimba_online.getNotes();
        // Находим ноту в массиве по её номеру и заменяем # на ♯
        let letter = notesArray[notenumber].replace(/#/g, '♯');

        // Заменяем навзение клавиши в настройках клавиши
        $('#range-tune-value-' + notenumber).empty().append(
            $('<small>').text(letter.slice(0, -1)).append(
                $('<sub>').text(letter.slice(-1))
            )
        );
        // Воспроизводим звук изменённой клавиши
        kalimba_online.playSound(notesArray[notenumber], { play: true, animate: true, record: false });
    });
}

// showKeyboardScheme выделяет на клавиатуре кнопки выбранной схемы
function showKeyboardScheme(keyMapScheme) {
    // Перебираем все клавиши на клавиатуре
    $('.kb_key', '.kb_container').each(function (index, key) {
        let keycode = $(key).data('keycode');
        // Если клавиша есть в указанной схеме, то добавляем класс, иначе убираем
        if (keyMapScheme.includes(keycode)) {
            $(key).addClass('used');
        } else {
            $(key).removeClass('used');
        }
    });
}

// // // // // // // // // // //
//  ПОСЛЕ ОТРИСОВКИ СТРАНИЦЫ  //
// // // // // // // // // // //

$(document).ready(function () {
    
    // Событие нажатия на кнопку записи
    $('#recordButton').click(function() {
        if (isRecording) {
            // Если запись велась - останавливаем
            isRecording = false;

            // Меняем иконки на кнопке
            $("#icon-record").show();
            $("#icon-spin").hide();

            // Если записана хоть одна нота
            if (sequence.length > 0) {
                // Добавляем пустую ноту с пузой между последней нажатой клавиши и остановкой записи 
                var timeElapsed = Date.now() - prevTime;
                sequence.push({ soundId: null, time: timeElapsed });

                // Делаем активной кнопку воспроизведения
                $("#playButton").attr("disabled", null);

                // Считаем сколько секунд длится вся запись
                let duration = 0;
                for (let i = 0; i < sequence.length; i++) {
                    duration += sequence[i].time;
                }
                duration = duration/1000;
                // Устанавливаем время анимации для кругового прогресс-бара
                $("#playButton .loader").css('--anim-load-duration', duration+"s");

                // Сохраняем запись в localStorage
                kalimba_online.recordedNotes = sequence;
                
                // Сообщаем в логи что запись закончена
                console.log('[REC] Recording stopped. Total duration: ' + duration + 's');
                console.log('[REC] Recorded sequence:', sequence);
            }
        } else {
            // Если запись НЕ велась - начинаем записывать
            isRecording = true;

            // Сообщаем в логи что началась запись
            console.log('[REC] Recording started');

            // Создаём пустой массив для записанной последовательности
            sequence = [];

            // Меняем иконки на кнопке 
            $("#icon-record").hide();
            $("#icon-spin").show();

            // Делаем НЕактивной кнопку воспроизведения
            $("#playButton").attr("disabled", "");
        }
    });

    // Событие нажатия на кнопку воспроизведения
    $('#playButton').click(function() {
        if (isPlaying) {
            // Если запись проигрывалась - останавливаем
            isPlaying = false;
            
            // Меняем иконки на кнопке 
            $("#icon-play").show();
            $("#icon-pause").hide();
            $("#icon-load").hide();

            // Делаем активной кнопку записи
            $("#recordButton").attr("disabled", null);
        } else {
            // Если запись НЕ проигрывалась - начинаем воспроизведение
            isPlaying = true;
            let index = 0;

            // Объявляем рекурсивную функцию, которая воспроизводит текущую ноту и запускает себя со следующей нотой через паузу sequence[index].time
            function playNextNote() {
                // Завершаем воспроизведение, если флаг выключен
                if (!isPlaying) return;
                // Воспроизводим текущую ноту с параметрами: без анимации и без записи
                if (sequence[index].soundId != null) kalimba_online.playSound(sequence[index].soundId, { play: true, animate: false, record: false });
                // Увеличиваем индекс (и зацикливаем)
                index = (index + 1) % sequence.length;
                // Запускаем следующую ноту после паузы
                setTimeout(playNextNote, sequence[index].time);
            }
            // Запускаем рекурсивную функцию
            playNextNote();

            // Меняем иконки на кнопке 
            $("#icon-play").hide();
            $("#icon-pause").show();
            $("#icon-load").show();

            // Делаем НЕактивной кнопку записи
            $("#recordButton").attr("disabled", "");
        }
    });

    // Проверяем, есть ли в localStorage запись
    if (kalimba_online.recordedNotes.length > 0) {
        // Получаем запись из localStorage
        sequence = kalimba_online.recordedNotes;

        // Делаем активной кнопку воспроизведения
        $("#playButton").attr("disabled", null);

        // Считаем сколько секунд длится вся запись
        let duration = 0;
        for (let i = 0; i < sequence.length; i++) {
            duration += sequence[i].time;
        }
        duration = duration/1000;
        // Устанавливаем время анимации для кругового прогресс-бара
        $("#playButton .loader").css('--anim-load-duration', duration+"s");
    }

    // Отображаем настройки громкости на странице (из localStorage)
    $('#range-volume').val(kalimba_online.volume);
    $('#range-volume-value').text(kalimba_online.volume);
    // Событие при смене громкости
    $('#range-volume').on('input', function () {
        kalimba_online.volume = $('#range-volume').val();
        $('#range-volume-value').text(kalimba_online.volume);
        kalimba_online.addKeys();
        updateTunes();
    });

    // Отображаем количество keysCount клавиш на странице (из localStorage)
    $('#range-keys').val(kalimba_online.keysCount);
    $('#range-keys-value').text(kalimba_online.keysCount);
    // Событие при смене количества клавиш
    $('#range-keys').on('input', function () {
        kalimba_online.keysCount = $('#range-keys').val();
        $('#range-keys-value').text(kalimba_online.keysCount);
        kalimba_online.addKeys();
        updateTunes();
    });

    updateTunes();

    // Отображаем базовую клавишу baseNote на странице (из localStorage)
    $('#range-baseNote').val(kalimba_online.baseNote);
    // $('#range-baseNote-value').text(allNotesSharp[kalimba_online.baseNote]);
    let letter = allNotesSharp[kalimba_online.baseNote].replace(/#/g, '♯');
    $('#range-baseNote-value').empty().append(
        $('<span>').text(letter.slice(0, -1)).append(
            $('<sub>').text(letter.slice(-1))
        )
    );

    // Событие при смене базовой ноты
    $('#range-baseNote').on('input', function () {
        kalimba_online.baseNote = $('#range-baseNote').val();
        // $('#range-baseNote-value').text(allNotesSharp[kalimba_online.baseNote]);
        
        let letter = allNotesSharp[kalimba_online.baseNote].replace(/#/g, '♯');
        $('#range-baseNote-value').empty().append(
            $('<span>').text(letter.slice(0, -1)).append(
                $('<sub>').text(letter.slice(-1))
            )
        );
        kalimba_online.addKeys();
        kalimba_online.playSound(allNotesSharp[kalimba_online.baseNote], { play: true, animate: false, record: false });
        updateTunes();
    });

    // Отображаем порядок Arrangement клавиш на странице (из localStorage)
    $("input#"+kalimba_online.arrangement).prop('checked', true);
    // Событие при смене Arrangement
    $('input', '#arrangement-radio-list').on("click", function () {
        kalimba_online.arrangement = $('input:checked', '#arrangement-radio-list').attr("id");
        kalimba_online.addKeys();
    });

    // Отображаем тип меток Labeltype на странице (из localStorage)
    $("input#" + kalimba_online.labelType).prop('checked', true);
    // Событие при смене Labeltype
    $('input', '#labeltype-radio-list').on("click", function () {
        kalimba_online.labelType = $('input:checked', '#labeltype-radio-list').attr("id");
        updateLabels();
    });


    // Отображаем набор звуков Soundfont на странице (из localStorage)
    $('#soundfonts').val(kalimba_online.soundfont);
    $("#soundfonts_source").attr("href", kalimba_online.currentSoundfont.sourceUrl);
    // Событие при смене Soundfont
    $('#soundfonts').change(function () {
        kalimba_online.soundfont = $(this).val();
        kalimba_online.loadSF();
        $("#soundfonts_source").attr("href", kalimba_online.currentSoundfont.sourceUrl);
    });

    // Обработчик события keydown
    $(document).on('keydown', function (event) {

        // Проверка, есть ли нота для нажатой клавиши
        if (kalimba_online.currentKeyboardScheme.includes(event.keyCode)) {
            // Получаем номер нажатой клавиши и массив нот
            let keyNum = kalimba_online.currentKeyboardScheme.indexOf(event.keyCode);
            let notesArray = kalimba_online.getNotes();
            // Если нажат пробел, повышаем октаву
            if (isSpacePressed) keyNum +=7;
            // Вопроизводим звук
            if (notesArray.hasOwnProperty(keyNum)) kalimba_online.playSound(notesArray[keyNum]);
        }
    });


    // Добавляем клавиатуру на страницу
    // Перебираем ряды клавиатуры
    keyboardKeyInfo.forEach(row => {
        const rowElement = $('<div class="kb_row"></div>');
        // Перебираем клавиши в ряду
        row.forEach(key => {
            // Создаём тег с клавишей и добавляем его на страницу
            $('<div class="kb_key"></div>')
                .text(keyboardKeys[key.code])
                .css('flex-grow', key.length)
                .attr("data-keycode", key.code)
                .appendTo(rowElement);
        });
        // Добавляем созданный ряд в контейнер с клавиатурой на странице
        $('#keyboard_container').append(rowElement);
    });

    // Отображаем схемы управления с клавиатур, хранящиеся в массиве keyboardSchemes
    keyboardSchemes.forEach(function(_key, index) {
        $('<label style="padding-right: 1.4em;">')
            .appendTo($('#keyboard_schemes'))
            .append(
                $('<input type="radio" name="kb_scheme">')
                    .attr('data-schemeid', index)
                    .prop('checked', index == kalimba_online.keyboardScheme)
            )
            .append(' ')
            .append($('<span>').text(index + 1));
    });
    // Отображаем на клавиатуре текущую схему
    showKeyboardScheme(kalimba_online.currentKeyboardScheme);
    // Отмечаем выбранной текущую схему
    $("input#"+kalimba_online.currentKeyboardScheme).prop('checked', true);
    // Создаём событие на смену схемы
    $('input', '#keyboard_control').on("click", function () {
        kalimba_online.keyboardScheme = $('input:checked', '#keyboard_control').data("schemeid");
        showKeyboardScheme(kalimba_online.currentKeyboardScheme);
        updateKeyboardSchemes();
    });
});