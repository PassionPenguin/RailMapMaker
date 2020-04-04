self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open('mainPage').then(function (cache) {
            return cache.addAll([
                './',
                './assets/Colors/Colors.js',
                './assets/locales/en-US.js',
                './assets/locales/zh-CN.js',
                './assets/locales/zh-HK.js',
                './assets/locales/zh-YUE.js',
                './assets/mipmap/border.png',
                './assets/mipmap/grid.png',
                './assets/mipmap/icon@1024.png',
                './assets/mipmap/icon@512.png',
                './assets/mipmap/icon@192.png',
                './assets/mipmap/opacity.png',
                './dist/libs/bundle/PenguinUI/font/Anodina-Bold.otf',
                './dist/libs/bundle/PenguinUI/font/Anodina-Regular.otf',
                './dist/libs/bundle/PenguinUI/font/MaterialIcons-Regular.woff2',
                './dist/libs/bundle/PenguinUI/require/color.css',
                './dist/libs/bundle/PenguinUI/require/CookieManager.js',
                './dist/libs/bundle/PenguinUI/require/HoverTips.js',
                './dist/libs/bundle/PenguinUI/require/LocaleStorageManager.js',
                './dist/libs/bundle/PenguinUI/require/MediaQuery.js',
                './dist/libs/bundle/PenguinUI/require/NotificationManager.js',
                './dist/libs/bundle/PenguinUI/require/PenguinUI.selector.js',
                './dist/libs/bundle/PenguinUI/require/PenguinUI.switchToggle.js',
                './dist/libs/bundle/PenguinUI/require/ProgressManager.js',
                './dist/libs/bundle/PenguinUI/require/utils.js',
                './dist/libs/bundle/PenguinUI/require/WindowManager.js',
                './dist/libs/bundle/PenguinUI/bundle.PenguinUI.js',
                './dist/libs/bundle/PenguinUI/bundle.PenguinUI.css',
                './dist/libs/bundle/storyboard/bundle.storyboard.css',
                './dist/libs/bundle/ColorUtils/bundle.colorUtils.js',
                './dist/libs/attachWindowCursorEvent.js',
                './dist/libs/build.package.js',
                './dist/libs/drawMap.js',
                './dist/libs/editPathsInfo.js',
                './dist/libs/editStationsInfo.js',
                './dist/libs/exportDrawable.js',
                './dist/libs/initDrawable.js',
                './dist/libs/initInterface.js',
                './dist/libs/savePathComp.js',
                './dist/libs/SystemFunction.js',
                './index.html',
            ]).then(() => self.skipWaiting());
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.open("mainPage")
            .then(cache => cache.match(event.request, {ignoreSearch: true}))
            .then(response => {
                return response || fetch(event.request);
            })
    );
});