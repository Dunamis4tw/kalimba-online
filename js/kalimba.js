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

    // C4	C#4	D4	D#4	E4	F4	F#4	G4	G#4	A4	A#4	B4  - Все ноты по порядку
    // C4		D4		E4	F4		G4		A4		B4  - Ноты без смещения
    // C#4		D#4		F4	F#4		G#4		A#4		C5  - Ноты со смещением

    // Do	Do#	Re	Re#	Mi	Fa	Fa#	Sol	Sl#	La	La#	Si  - Все ноты по порядку
    // Do		Re		Mi	Fa		Sol		La		Si  - Ноты без смещения
    // Do#		Re#		Fa	Fa#		Sl#		La#		Do  - Ноты со смещением


    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    // Загружаем звуки калимбы
    const Kalimba = Soundfont.instrument(audioContext, 'kalimba');
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


    // Возвращает массив нот, где keys - количество клавиш, arrangement - порядок
    function getArrayNotesKalimba(keys, arrangement) {
        const posC4 = 23;
        slicedNotes = allNotes.slice(posC4, posC4+parseInt(keys));
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
        for (let i = notesArr.length - notesArr.length%2-1; i > 0; i-=2) {
            sortedArr.push(notesArr[i]);
        }
        for (let i = 0; i < notesArr.length; i+=2) {
            sortedArr.push(notesArr[i]);
        }
        return sortedArr;
    }

    // Добавляет Клавиши на форму
    function addKeys(notesArray) {
        // Чистим поле
        kalimbaKeysContainer.empty();
        // Перебираем массив с клавишами, которые надо добавить на поле
        notesArray.forEach(note => {

            // Получаем номер клавиши, где C4 - 0, D4 - 1 и т.д.
            let num = convertStringToNumber(note)-28;
            // Теперь номера 8 9 10 ... преобразовываем в 1 2 3 ...
            let labelNum = num % 7 + 1;

            // Определяем сколько точек нужно нарисовать сверху цифры
            dots = ""
            for (let i = 0; i < Math.floor(num / 7); i++) dots += ".";
            
            // Получаем итоговую метку клавиши
            let label = dots + "\n" + labelNum;

            // Создаём элемент клавиши указав высоту и ноту
            const keyElement = $('<div>', {
                class: 'key',
                note: note,
                height: (350 - 5*convertStringToNumber(note)) + "px"
            });

            // Создаём блок с меткой клавиши
            keyElement.append($('<div>', {
                class: 'note-text',
                text: label,
            }))

            // Добавляем созданную клавишу на поле
            kalimbaKeysContainer.append(keyElement);
        });

        // Обновляем события
        Kalimba.then(function (kalimba) {
            attachEventListeners(kalimba);
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
    
    // Добавляем события на нажатия клавиш
    function attachEventListeners(kalimba) {
        const keys = $('.key');

        keys.each(function () {
            const note = $(this).attr('note');
            $(this).on('mouseover', function () {
                if (isMouseDown) {
                    playSound(kalimba, note);
                    keyShake($(this));
                }
            });
            $(this).on('click', function () {
                playSound(kalimba, note);
                keyShake($(this));
            });
        });

    }


    // Добавляем события на нажатия клавиш через клавиатуру
    function attachKeyboardEventListeners(kalimba) {

        let isSpacePressed = false;

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

            if (event.keyCode == 32 && event.target == document.body) {
                isSpacePressed = true;
                event.preventDefault();
                return;
            }
            
            // Проверка, есть ли нота для нажатой клавиши
            if (keyNoteMap.hasOwnProperty(event.keyCode)) {
                const baseNote = keyNoteMap[event.keyCode];

                let octaveModifier=parseInt(baseNote[1]);
                // Если пробел нажат, увеличиваем октаву на 1
                if (isSpacePressed) octaveModifier++;

                const note = `${baseNote[0]}${octaveModifier}`;

                let KeyDiv = $(`[note="${note}"]`);
                // Если соотвествующая клавиша есть на странице
                if (KeyDiv.length)
                {
                    // Вызов функций воспроизведения звука и анимации клавиши
                    playSound(kalimba, note);
                    keyShake(KeyDiv);

                }

            }
        });

        // Обработчик события keyup
        $(document).on('keyup', function (event) {
            const releasedKey = event.key.toLowerCase();

            // Проверка, отпущен ли пробел
            if (event.keyCode == 32 && event.target == document.body) {
                isSpacePressed = false;
            }
        });


    }
    
    // Присваивает события на нажатия когда Калимба загрузится
    Kalimba.then(function (kalimba) {
        attachEventListeners(kalimba);
        attachKeyboardEventListeners(kalimba);
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
        console.log('Pressed \'' + note + '\' (' + convertStringToNumber(note) + ')' );
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
    
    // Событие при смене количества клавиш
    $('#range-keys').change( function() {
        let keys = $('#range-keys').val();
        $('#range-keys-value').text(keys);
        let arrangement = $('input:checked','#arrangement-radio-list').attr("id");
        addKeys(getArrayNotesKalimba(keys, arrangement));

    });

    // Событие при смене Arrangement
    $('input', '#arrangement-radio-list').on("click", function () {
        let keys = $('#range-keys').val();
        let arrangement = $('input:checked','#arrangement-radio-list').attr("id");
        addKeys(getArrayNotesKalimba(keys, arrangement));
    });

    // Добавляем клавиш
    addKeys(getArrayNotesKalimba(17, "Alternating"));
});

// TODO:
// ? Добавить возможность работать с сенсора
// + Добавить всевозможные настройки:
//   + Количество клавиш
// + Распределить файлы по папкам css и js
// - Цвета калимбы под цвет темы
// - Залить на гитхаб
// - Громкость звука
// - Смена нот
// - 