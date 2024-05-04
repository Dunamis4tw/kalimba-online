const CACHE_NAME = 'kalimba-game-cache-v1';
// Таймаут ожидания загрузки в миллисекундах
const CACHE_TIMEOUT = 400;
// Список URL-адресов для кэширования
const urlsToCache = [
    './css/kalimba.css',
    './css/pico-color-picker.css',
    './css/pico-theme-switcher.css',
    './img/144.png',
    './img/152.png',
    './img/192.png',
    './img/512.png',
    './img/screen1.png',
    './img/screen2.png',
    './img/screen3.png',
    './js/fullscreen.js',
    './js/kalimba.js',
    './js/lang.js',
    './js/pico-color-picker.js',
    './js/pico-theme-switcher.js',
    './lang/ar.json',
    './lang/de.json',
    './lang/en.json',
    './lang/es.json',
    './lang/fr.json',
    './lang/id.json',
    './lang/ja.json',
    './lang/pt.json',
    './lang/ru.json',
    './lang/zh-CN.json',
    './soundfonts/keylimba/kalimba.mp3.js',
    './favicon.ico',
    './index.html',
    './manifest.json',
    // './service-worker.js',
    'https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js',
    'https://cdn.jsdelivr.net/npm/soundfont-player@0.12.0/dist/soundfont-player.min.js',
    'https://cdn.jsdelivr.net/npm/@picocss/pico@1.5.13/css/pico.min.css',
    'https://gleitz.github.io/midi-js-soundfonts/FatBoy/kalimba-mp3.js',
    'https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/kalimba-mp3.js',
];

// Инициализация кэша при установке service-worker
const initCache = () => {
    return caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(urlsToCache);
    }, (error) => {
        console.log(error)
    });
};

// Попытка получить данные по сети с установленным таймаутом
const tryNetwork = (req, timeout) => {
    // console.log(req)
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(reject, timeout);
        fetch(req).then((res) => {
            clearTimeout(timeoutId);
            const responseClone = res.clone();
            caches.open(CACHE_NAME).then((cache) => {
                cache.put(req, responseClone)
            })
            resolve(res);
            // Отклонить промис, если запрос в сеть завершается ошибкой.
        }, reject);
    });
};

// Получение данных из кэша при отсутствии сети
const getFromCache = (req) => {
    console.log('[Service-worker] Не удалось загрузить данные из интернета, получаем данные из кэша...');
    console.log(req.url);
    return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(req).then((result) => {
            return result || Promise.reject("no-match");
        });
    });
};

// Событие установки service-worker
self.addEventListener("install", (e) => {
    console.log("[Service-worker] Установлен");
    e.waitUntil(initCache());
});

// Событие активации service-worker
self.addEventListener('activate', (e) => {
    console.log("[Service-worker] Активирован");
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        })
    );
});

// Событие получения запроса
self.addEventListener("fetch", (e) => {
    // console.log("[Service-worker] Попытка получить данные из сети или из кэша: " + e.request.url);
    // Попытаться получить данные из сети, и если не удается, вернуть закэшированную копию.
    e.respondWith(tryNetwork(e.request, CACHE_TIMEOUT).catch(() => getFromCache(e.request)));
});
