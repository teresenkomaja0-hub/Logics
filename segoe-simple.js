// segoe-force.js - Принудительная загрузка Segoe Print
(function() {
    'use strict';
    
    // Конфигурация
    const CONFIG = {
        checkTimeout: 500,
        retryCount: 3,
        fallbackDelay: 1000
    };
    
    // Главная функция проверки и применения Segoe Print
    function forceSegoePrint() {
        console.log('[Segoe Force] Запуск проверки Segoe Print...');
        
        // Создаем тестовый элемент
        const tester = document.createElement('div');
        tester.style.cssText = `
            position: absolute;
            left: -9999px;
            top: -9999px;
            font-family: 'Segoe Print', Arial;
            font-size: 100px;
            visibility: hidden;
            white-space: nowrap;
        `;
        
        // Добавляем тестовый текст
        const testText1 = document.createElement('span');
        testText1.textContent = 'iii';
        testText1.style.fontFamily = "'Segoe Print', Arial";
        tester.appendChild(testText1);
        
        const testText2 = document.createElement('span');
        testText2.textContent = 'iii';
        testText2.style.fontFamily = 'Arial';
        tester.appendChild(testText2);
        
        document.body.appendChild(tester);
        
        // Измеряем ширину
        const widthSegoe = testText1.offsetWidth;
        const widthArial = testText2.offsetWidth;
        
        document.body.removeChild(tester);
        
        // Анализируем результат
        const isSegoeAvailable = widthSegoe !== widthArial;
        
        if (isSegoeAvailable) {
            console.log('[Segoe Force] ✓ Segoe Print найден на устройстве');
            applySegoeForcibly();
            return true;
        } else {
            console.log('[Segoe Force] ✗ Segoe Print не найден на устройстве');
            
            // Попытка загрузить из внешнего источника
            tryLoadExternalSegoe();
            return false;
        }
    }
    
    // Принудительное применение Segoe Print ко всем элементам
    function applySegoeForcibly() {
        console.log('[Segoe Force] Применяем Segoe Print ко всем элементам...');
        
        // Применяем к body
        document.body.style.fontFamily = "'Segoe Print', cursive !important";
        
        // Применяем ко всем элементам с текстом
        const allElements = document.querySelectorAll('*');
        
        allElements.forEach(element => {
            // Пропускаем элементы без текста и скрипты/стили
            if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') return;
            
            // Проверяем есть ли текст или это интерактивный элемент
            const hasText = element.textContent && element.textContent.trim().length > 0;
            const isInteractive = ['INPUT', 'BUTTON', 'TEXTAREA', 'SELECT'].includes(element.tagName);
            
            if (hasText || isInteractive) {
                // Сохраняем оригинальный стиль и добавляем Segoe Print
                const currentFont = element.style.fontFamily || '';
                if (!currentFont.includes('Segoe Print')) {
                    element.style.fontFamily = "'Segoe Print', " + (currentFont || 'cursive');
                    element.dataset.segoeOriginal = currentFont;
                }
            }
        });
        
        // Особые правила для заголовков
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6, .title, .heading');
        headings.forEach(heading => {
            heading.style.fontFamily = "'Segoe Print', cursive !important";
            heading.style.fontWeight = '700';
            heading.style.fontStyle = 'italic';
        });
        
        // Особые правила для кнопок
        const buttons = document.querySelectorAll('button, .btn, [role="button"], input[type="button"], input[type="submit"]');
        buttons.forEach(button => {
            button.style.fontFamily = "'Segoe Print', cursive !important";
        });
        
        console.log('[Segoe Force] ✓ Segoe Print применен ко всем элементам');
    }
    
    // Попытка загрузить Segoe Print из внешнего источника
    function tryLoadExternalSegoe() {
        console.log('[Segoe Force] Пытаемся загрузить Segoe Print из внешних источников...');
        
        // Создаем элемент для загрузки шрифта
        const fontFaceCSS = `
            @font-face {
                font-family: 'Segoe Print';
                src: local('Segoe Print'),
                     local('SegoePrint'),
                     url('https://raw.githubusercontent.com/HiTman77/fonts/master/Segoe%20Print.ttf') format('truetype'),
                     url('https://cdn.jsdelivr.net/gh/HiTman77/fonts/Segoe%20Print.ttf') format('truetype'),
                     url('fonts/segoepr.ttf') format('truetype'),
                     url('segoepr.ttf') format('truetype');
                font-weight: normal;
                font-style: normal;
                font-display: swap;
            }
            
            @font-face {
                font-family: 'Segoe Print';
                src: local('Segoe Print Bold'),
                     url('https://raw.githubusercontent.com/HiTman77/fonts/master/Segoe%20Print%20Bold.ttf') format('truetype'),
                     url('fonts/segoeprb.ttf') format('truetype');
                font-weight: bold;
                font-style: normal;
                font-display: swap;
            }
        `;
        
        // Встраиваем стили
        const style = document.createElement('style');
        style.textContent = fontFaceCSS;
        document.head.appendChild(style);
        
        // Ждем и проверяем снова
        setTimeout(() => {
            console.log('[Segoe Force] Проверяем загружен ли Segoe Print...');
            const checkAgain = forceSegoePrint();
            
            if (!checkAgain) {
                console.log('[Segoe Force] ⚠ Segoe Print не удалось загрузить, но мы все равно попробуем его использовать');
                // Все равно применяем, возможно сработает
                applySegoeForcibly();
            }
        }, CONFIG.fallbackDelay);
    }
    
    // Мониторинг новых элементов (для динамического контента)
    function setupMutationObserver() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Element node
                            applySegoeToElement(node);
                            
                            // Рекурсивно для дочерних элементов
                            if (node.querySelectorAll) {
                                node.querySelectorAll('*').forEach(child => {
                                    applySegoeToElement(child);
                                });
                            }
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('[Segoe Force] MutationObserver запущен для отслеживания новых элементов');
    }
    
    // Применить Segoe к конкретному элементу
    function applySegoeToElement(element) {
        if (!element || element.tagName === 'SCRIPT' || element.tagName === 'STYLE') return;
        
        const hasText = element.textContent && element.textContent.trim().length > 0;
        const isInteractive = ['INPUT', 'BUTTON', 'TEXTAREA', 'SELECT'].includes(element.tagName);
        
        if (hasText || isInteractive) {
            const currentFont = element.style.fontFamily || '';
            if (!currentFont.includes('Segoe Print')) {
                element.style.fontFamily = "'Segoe Print', " + (currentFont || 'cursive');
                element.dataset.segoeOriginal = currentFont;
            }
        }
    }
    
    // Запуск при загрузке страницы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(forceSegoePrint, 100);
            setupMutationObserver();
        });
    } else {
        setTimeout(forceSegoePrint, 100);
        setupMutationObserver();
    }
    
    // Экспортируем функции для ручного управления
    window.SegoeForce = {
        check: forceSegoePrint,
        apply: applySegoeForcibly,
        reload: function() {
            document.body.style.fontFamily = '';
            setTimeout(forceSegoePrint, 50);
        }
    };
    
    console.log('[Segoe Force] Скрипт инициализирован');
})();