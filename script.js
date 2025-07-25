document.addEventListener('DOMContentLoaded', () => {
    // --- Гарантированно играем oldpcbutton.mp3 на .control-knob и .power-button ---
    // (даже если они не имеют .btn)
    const powerBtnEl = document.querySelector('.power-button');
    const controlKnobEls = document.querySelectorAll('.control-knob');
    if (powerBtnEl) {
        powerBtnEl.addEventListener('click', () => {
            glitchSound.currentTime = 0;
            glitchSound.play();
        });
    }
    if (controlKnobEls) {
        controlKnobEls.forEach(knob => {
            knob.addEventListener('click', () => {
                glitchSound.currentTime = 0;
                glitchSound.play();
            });
        });
    }
    const avatar = document.getElementById('avatar');
    const title = document.getElementById('title');
    const buttons = document.querySelectorAll('.btn');
    const content = document.querySelector('.content');
    const dateText = document.getElementById('date');
    const commandText = document.querySelector('.command');
    const powerButton = document.querySelector('.power-button');
    const controlKnobs = document.querySelectorAll('.control-knob');
    const cursor = document.querySelector('.cursor');
    const copiedMessage = document.querySelector('.copied-message');
    const secretMessage = document.querySelector('.secret-message');

    // Подключаем реальные аудиофайлы (должны лежать в корне проекта)
    const clickSound = new Audio('click.mp3');
    const clickedSound = new Audio('clicked.mp3');
    const startupSound = new Audio('startup.mp3');
    const glitchSound = new Audio('oldpcbutton.mp3');
    
    // Устанавливаем громкость
    clickSound.volume = 0.3;
    clickedSound.volume = 0.3;
    startupSound.volume = 0.5;
    glitchSound.volume = 0.4;

    // --- Sound unlock for browsers ---
    let audioUnlocked = false;
    function unlockAudio() {
        if (!audioUnlocked) {
            [clickSound, clickedSound, startupSound, glitchSound].forEach(sound => {
                sound.volume = sound.volume; // Touch audio context
            });
            clickSound.play().catch(()=>{});
            clickSound.pause();
            clickSound.currentTime = 0;
            audioUnlocked = true;
        }
    }
    document.body.addEventListener('pointerdown', unlockAudio, { once: true });

    // Обработчики кнопок (универсально для всех .btn)
    buttons.forEach(button => {
        // Наведение: звук + стиль
        button.addEventListener('mouseenter', () => {
            clickSound.currentTime = 0;
            clickSound.play();
            button.style.transform = 'translateX(10px)';
            button.style.background = 'var(--accent-color)';
            button.style.color = 'var(--primary-color)';
            button.style.boxShadow = '0 0 20px var(--shadow-color), inset 0 0 20px var(--shadow-color)';
        });
        // Уход курсора: сброс стиля
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateX(0)';
            button.style.background = 'transparent';
            button.style.color = 'var(--text-color)';
            button.style.boxShadow = '0 0 10px var(--shadow-color), inset 0 0 10px var(--shadow-color)';
        });
        // Клик: для powerButton и controlKnobs — oldpcbutton.mp3, для остальных — clickedSound
        button.addEventListener('click', (e) => {
            if (
                (powerButton && button === powerButton) ||
                (button.classList.contains('control-knob'))
            ) {
                glitchSound.currentTime = 0;
                glitchSound.play();
            } else {
                clickedSound.currentTime = 0;
                clickedSound.play();
            }
            // Почта — копировать
            if (button.href && button.href.startsWith('mailto:')) {
                e.preventDefault();
                const email = button.href.replace('mailto:', '');
                navigator.clipboard.writeText(email).then(() => {
                    if (copiedMessage) {
                        copiedMessage.classList.add('show');
                        setTimeout(() => {
                            copiedMessage.classList.remove('show');
                        }, 2000);
                    }
                });
            }
            // Для обычных ссылок больше ничего не делаем — пусть браузер сам решает (ctrl/cmd/колёсико)
        });
    });

    // (удалено дублирование блока dropdowns)

    // --- Dropdown logic + sound ---
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const dropbtn = dropdown.querySelector('.dropbtn');
        const dropdownInner = dropdown.querySelector('.dropdown-inner');
        const chevron = dropbtn ? dropbtn.querySelector('.chevron') : null;
        if (dropbtn && dropdownInner) {
            dropbtn.addEventListener('click', function(e) {
                e.stopPropagation();
                // Звук открытия/закрытия
                clickSound.currentTime = 0;
                clickSound.play();
                // Закрыть все другие дропдауны
                document.querySelectorAll('.dropdown-inner').forEach(inner => {
                    if (inner !== dropdownInner) inner.classList.remove('show');
                });
                // Переключить текущий
                dropdownInner.classList.toggle('show');
                if (chevron) chevron.classList.toggle('open');
            });
        }
    });
    // Закрытие дропдауна при клике вне
    document.addEventListener('click', function(e) {
        document.querySelectorAll('.dropdown-inner').forEach(inner => {
            inner.classList.remove('show');
        });
        document.querySelectorAll('.chevron.open').forEach(chevron => {
            chevron.classList.remove('open');
        });
    });

    // Обработчики мини-кнопок
    if (powerButton) {
        powerButton.addEventListener('click', rebootSystem);
    }

    if (controlKnobs) {
        controlKnobs.forEach(knob => {
            knob.addEventListener('click', () => {
                const control = knob.dataset.control;
                switch(control) {
                    case 'brightness':
                        content.style.filter = 'brightness(1.5)';
                        break;
                    case 'contrast':
                        content.style.filter = 'contrast(1.5)';
                        break;
                    case 'color':
                        content.style.filter = 'hue-rotate(90deg)';
                        break;
                }
                setTimeout(() => {
                    content.style.filter = 'none';
                }, 1000);
            });
        });
    }

    // Инициализация
    updateDateTime();
    createScanline();
    createCRTEffect();
    createNoise();
    systemBoot();

    // Улучшенная функция перезагрузки
    function rebootSystem() {
        // Скрываем контент с анимацией
        content.style.transition = 'opacity 0.5s ease';
        content.style.opacity = '0';

        // Очищаем консоль и показываем курсор
        if (commandText) {
            commandText.textContent = '';
            cursor.style.display = 'block';
        }

        // Последовательность перезагрузки
        const rebootSequence = [
            '> Инициализация перезагрузки...',
            '> Сохранение данных...',
            '> Остановка процессов...',
            '> Перезапуск системы...',
            '> Загрузка ядра...',
            '> Инициализация драйверов...',
            '> Запуск интерфейса...',
            '> Готово!'
        ];

        let currentStep = 0;
        const rebootInterval = setInterval(() => {
            if (currentStep < rebootSequence.length) {
                typeWriter(rebootSequence[currentStep], commandText);
                currentStep++;
            } else {
                clearInterval(rebootInterval);
                setTimeout(() => {
                    if (commandText) {
                        commandText.textContent = '';
                        cursor.style.display = 'none';
                    }
                    content.style.opacity = '1';
                    systemBoot();
                }, 1000);
            }
        }, 2000);
    }

    // Улучшенный код Konami
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let isSecretModeActive = false;
    let isGlitchModeActive = false;

    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            activateSecretMode();
            konamiCode = [];
        }
    });

    // Улучшенная активация секретного режима
    function activateSecretMode() {
        if (!isSecretModeActive) {
            isSecretModeActive = true;
            document.body.classList.add('secret-mode');
            secretMessage.textContent = 'Секретный режим активирован!';
            secretMessage.classList.add('show');

            content.style.filter = 'hue-rotate(180deg)';
            buttons.forEach(button => {
                button.style.borderColor = '#ff00ff';
                button.style.boxShadow = '0 0 20px #ff00ff';
            });

            const flickerInterval = setInterval(() => {
                if (!isSecretModeActive) {
                    clearInterval(flickerInterval);
                    return;
                }
                content.style.opacity = Math.random() * 0.2 + 0.8;
            }, 100);

            setTimeout(() => {
                deactivateSecretMode();
            }, 30000);
        }
    }

    // Оптимизированная функция обновления даты и времени
    function updateDateTime() {
        const now = new Date();
        const options = { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        dateText.textContent = now.toLocaleDateString('ru-RU', options);
    }

    // Оптимизированная функция печатания текста
    function typeWriter(text, element, speed = 30) {
        if (!element) return;
        let i = 0;
        element.textContent = '';
        const interval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(interval);
            }
        }, speed);
        return interval;
    }

    // Оптимизированная функция загрузки системы
    function systemBoot() {
        const commands = [
            '> Загрузка системы...',
            '> Проверка памяти...',
            '> Инициализация дисков...',
            '> Загрузка драйверов...',
            '> Запуск интерфейса...',
            '> Готово!'
        ];

        let currentCommand = 0;
        const interval = setInterval(() => {
            if (currentCommand < commands.length) {
                typeWriter(commands[currentCommand], commandText);
                currentCommand++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    if (commandText) {
                        commandText.textContent = '';
                    }
                    if (cursor) {
                        cursor.style.display = 'none';
                    }
                }, 1000);
            }
        }, 2000);
    }

    // Оптимизированная анимация появления элементов
    function animateElements() {
        const elements = document.querySelectorAll('.content > *');
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    animateElements();

    // Эффект при наведении на аватарку
    avatar.addEventListener('mouseenter', () => {
        avatar.style.filter = 'grayscale(0%) contrast(100%) brightness(1)';
        clickSound.currentTime = 0;
        clickSound.play();
    });

    avatar.addEventListener('mouseleave', () => {
        avatar.style.filter = 'grayscale(100%) contrast(120%) brightness(0.9)';
    });

    // Функция создания эффекта мерцания CRT
    function createCRTEffect() {
        const crt = document.createElement('div');
        crt.className = 'crt-effect';
        crt.style.position = 'fixed';
        crt.style.top = '0';
        crt.style.left = '0';
        crt.style.width = '100%';
        crt.style.height = '100%';
        crt.style.background = 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.2) 100%)';
        crt.style.pointerEvents = 'none';
        crt.style.zIndex = '9999';
        document.body.appendChild(crt);

        setInterval(() => {
            crt.style.opacity = Math.random() * 0.1 + 0.9;
        }, 100);
    }

    // Функция создания эффекта сканирования
    function createScanline() {
        const scanline = document.createElement('div');
        scanline.className = 'scanline';
        scanline.style.position = 'absolute';
        scanline.style.top = '0';
        scanline.style.left = '0';
        scanline.style.width = '100%';
        scanline.style.height = '2px';
        scanline.style.background = 'rgba(0, 255, 0, 0.3)';
        scanline.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.5)';
        scanline.style.animation = 'scan 8s linear infinite';
        content.appendChild(scanline);
    }

    // Функция создания эффекта шума
    function createNoise() {
        const noise = document.createElement('div');
        noise.className = 'noise';
        noise.style.position = 'fixed';
        noise.style.top = '0';
        noise.style.left = '0';
        noise.style.width = '100%';
        noise.style.height = '100%';
        noise.style.background = 'url("data:image/png;base64,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")';
        noise.style.opacity = '0.05';
        noise.style.pointerEvents = 'none';
        noise.style.zIndex = '9998';
        document.body.appendChild(noise);
    }

    // Деактивация секретного режима
    function deactivateSecretMode() {
        if (isSecretModeActive) {
            isSecretModeActive = false;
            document.body.classList.remove('secret-mode');
            secretMessage.classList.remove('show');
            content.style.filter = 'none';
            content.style.opacity = '1';
            buttons.forEach(button => {
                button.style.borderColor = '';
                button.style.boxShadow = '';
            });
        }
    }

    // Активация режима глюка
    function activateGlitchMode() {
        if (!isGlitchModeActive) {
            isGlitchModeActive = true;
            glitchSound.play();
            
            // Создаем эффект глюка
            const glitchInterval = setInterval(() => {
                if (!isGlitchModeActive) {
                    clearInterval(glitchInterval);
                    return;
                }
                
                // Случайное смещение элементов
                content.style.transform = `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`;
                
                // Случайное изменение цветов
                buttons.forEach(button => {
                    button.style.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
                });
            }, 50);
            
            // Автоматическое отключение через 15 секунд
            setTimeout(() => {
                deactivateGlitchMode();
            }, 15000);
        }
    }

    // Деактивация режима глюка
    function deactivateGlitchMode() {
        if (isGlitchModeActive) {
            isGlitchModeActive = false;
            content.style.transform = 'none';
            buttons.forEach(button => {
                button.style.color = '';
            });
        }
    }
});

