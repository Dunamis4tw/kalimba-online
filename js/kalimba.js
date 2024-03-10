
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

class Kalimba_Online {
    _kalimba = {};

    get soundfont() { return loadFromLocalStorage("soundfont", "Keylimba"); }
    get arrangement() { return loadFromLocalStorage("arrangement", "Alternating"); }
    get keysCount() { return loadFromLocalStorage("keysCount", 17); }
    get labelType() { return loadFromLocalStorage("labelType", "Number"); }
    get currentSoundfont () { return Soundfonts[this.soundfont]; }
    get kalimba () { return this._kalimba; }
    get baseNote() { return parseInt(loadFromLocalStorage("baseNote", allNotesSharp.indexOf("C4"))); }
    get tunes() { return loadFromLocalStorage("tunes", Array(21).fill(0).join(',')).split(",").map(Number); }

    set soundfont(value) { saveToLocalStorage("soundfont", value); }
    set arrangement(value) { saveToLocalStorage("arrangement", value); }
    set keysCount(value) { saveToLocalStorage("keysCount", value); }
    set labelType(value) { saveToLocalStorage("labelType", value); }
    set kalimba(value) { this._kalimba = value; }
    set baseNote(value) { saveToLocalStorage("baseNote", value); }
    set tunes(value) { saveToLocalStorage("tunes", value); }


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
        var KalimbaSF = Soundfont.instrument(this._audioContext, this.currentSoundfont.url, { gain: this.currentSoundfont.gain });

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
        $('.kalimba-keys').empty();

        // let notesArray = getArrayNotesKalimba(this.keysCount, this.arrangement);
        let notesArray = this.getNotes();
        
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
        sortedNotes.forEach((note, index) => {
            
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

            // Расчитываем множитель высоты
            let heightMultiplier = (27 + notesArray.length) - notesArray.indexOf(note);

            // Расчитываем высоту клавиши
            let keyHeight = 30 + 5 * heightMultiplier;

            let letter = note.replace(/#/g, '♯');
            
            // Создаём клавишу
            const keyZone = $('<div>')
            .addClass('key-zone')
            .attr('note', note)
            .attr('notenumber', notesArray.indexOf(note))
            .css('height', keyHeight + 'px')
            .append(
                $('<div>').addClass('key').append(
                    $('<div>').addClass('note-text').append(
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

        // Обновляем метки
        updateLabels();
    }

    // Воспроизводит звук
    playSound(note) {
        this._kalimba.play(note);
        this.keyShake($(`.key-zone[note='${note}'] .key`));
        console.log('Pressed \'' + note + '\' (' + allNotesSharp.indexOf(note) + ')');
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

// updateTunes обновляет элементы управления, которые настраивают клавиши
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
                $('<span>').text(letter.slice(0, -1)).append(
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
            $('<span>').text(letter.slice(0, -1)).append(
                $('<sub>').text(letter.slice(-1))
            )
        );
        // Воспроизводим звук изменённой клавиши
        kalimba_online.playSound(notesArray[notenumber]);
    });
}

$(document).ready(function () {

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

    // Событие при смене количества клавиш
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
        kalimba_online.playSound(allNotesSharp[kalimba_online.baseNote]);
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


    let isSpacePressed = false;

    // Обработчик события keydown
    $(document).on('keydown', function (event) {
        let keyNumMap = {
            65: 7, //a
            83: 5, //s
            68: 3, //d
            70: 1, //f
            71: 0, //g
            72: 2, //h
            74: 4, //j
            75: 6, //k
            76: 8, //l
        };

        // Если нажат пробел
        if (event.keyCode == 32) {
            // Включаем маркер
            isSpacePressed = true;
            // И останавливаем дальнейшую обработку
            event.preventDefault();
            return;
        }

        // Проверка, есть ли нота для нажатой клавиши
        if (keyNumMap.hasOwnProperty(event.keyCode)) {
            // Получаем номер нажатой клавиши и массив нот
            let keyNum = keyNumMap[event.keyCode];
            let notesArray = kalimba_online.getNotes();
            // Если нажат пробел, повышаем октаву
            if (isSpacePressed) keyNum +=7;
            // Вопроизводим звук
            if (notesArray.hasOwnProperty(keyNum)) kalimba_online.playSound(notesArray[keyNum]);
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
        + Тюнинг нот
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
    + Установка сайта как веб-приложение (PWA)

TODO (в долгосрочной перспективе):
    - Запись нажимаемых клавиш и воспроизведение
    - Возможность сохранить записанный трек в файл
    - Репозиторий треков
    - Страница, где можно будет научиться играть трек
 */