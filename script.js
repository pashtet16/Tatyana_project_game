// Данные заданий с правильными ответами
const tasksData = {
    1: {
        title: "Выберите из предложенного списка то, что может доказать невиновность Томаса:",
        options: [
            { text: "Газета Вулверхэмптона", correct: false },
            { text: "Досье Джейка", correct: false },
            { text: "Досье Чарли", correct: false },
            { text: "Досье Уильяма", correct: false },
            { text: "Досье Паулы", correct: false },
            { text: "Досье Томаса", correct: false },
            { text: "Досье Беллы", correct: false },
            { text: "Досье Эдварда", correct: false },
            { text: "Досье Дилана", correct: false },
            { text: "Досье Элизабет", correct: false },
            { text: "Досье Зои", correct: true },
            { text: "Орден полицейского", correct: false },
            { text: "Кусок полицейской рубашки", correct: false },
            { text: "Письмо Роберта", correct: false },
            { text: "Фото с места преступления с телом Адама", correct: false },
            { text: "Газетная статья о суде над Томасом", correct: false },
            { text: "Карта города", correct: false },
            { text: "Маршрут машины", correct: true },
            { text: "Фото машины", correct: false },
            { text: "Рабочее место Томаса", correct: true },
            { text: "Выписка по счету", correct: true }
        ]
    },
    2: {
        title: "Является ли Элизабет соучастницей убийства Адама?",
        options: [
            { text: "Нет", correct: true },
            { text: "Да", correct: false }
        ]
    },
    3: {
        title: "Кто является убийцей Адама? Если вариантов несколько, выберите подходящие:",
        options: [
            { text: "Джейк", correct: false },
            { text: "Роберт", correct: true },
            { text: "Стив", correct: false },
            { text: "Чарли", correct: false },
            { text: "Уильям", correct: false },
            { text: "Паула", correct: false },
            { text: "Томас", correct: false },
            { text: "Белла", correct: false },
            { text: "Эдвард", correct: false },
            { text: "Дилан", correct: false },
            { text: "Элизабет", correct: false },
            { text: "Зои", correct: false }
        ]
    }
};

// Переменные состояния
let currentTask = null;
let userSelections = {};

// DOM элементы
let container;

// Функция для обновления времени
function updateCurrentTime() {
    const timeElement = document.getElementById('currentTime');
    if (!timeElement) return;

    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    timeElement.textContent = `${hours}:${minutes}`;
}

// Функция для обновления времени при переключении страниц
function ensureTimeElementExists() {
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        updateCurrentTime();
    }
}

// Обновляем время каждую минуту
function startTimeUpdater() {
    // Обновляем сразу при загрузке
    updateCurrentTime();

    // Обновляем каждую минуту
    setInterval(updateCurrentTime, 60000);
}

// Функция для настройки кнопок в футере (cookies и политика конфиденциальности)
function setupFooterButtons() {
    // Обработка cookies уведомления
    const cookiesBtn = document.getElementById('cookiesButton');
    if (cookiesBtn) {
        // Удаляем старые обработчики
        cookiesBtn.replaceWith(cookiesBtn.cloneNode(true));

        // Добавляем новый обработчик
        const newCookiesBtn = document.getElementById('cookiesButton');
        newCookiesBtn.addEventListener('click', function() {
            const cookiesNotice = this.closest('.cookies-notice');
            if (cookiesNotice) {
                cookiesNotice.style.display = 'none';

                // Сохраняем в localStorage, что пользователь согласился
                localStorage.setItem('cookiesAccepted', 'true');
            }
        });

        // Проверяем, если уже было согласие, скрываем уведомление
        if (localStorage.getItem('cookiesAccepted') === 'true') {
            const cookiesNotice = newCookiesBtn.closest('.cookies-notice');
            if (cookiesNotice) {
                cookiesNotice.style.display = 'none';
            }
        }
    }

    // Обработка ссылки на политику конфиденциальности
    const privacyLink = document.querySelector('.privacy-link');
    if (privacyLink) {
        // Удаляем старые обработчики
        privacyLink.replaceWith(privacyLink.cloneNode(true));

        // Добавляем новый обработчик
        const newPrivacyLink = document.querySelector('.privacy-link');
        newPrivacyLink.addEventListener('click', function(e) {
            e.preventDefault();
            openPrivacyModal();
        });
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    container = document.querySelector('.container');

    // Инициализируем состояние выбора для каждого задания
    for (let taskId in tasksData) {
        userSelections[taskId] = new Array(tasksData[taskId].options.length).fill(false);
    }

    // Настраиваем кнопки в футере
    setupFooterButtons();

    // Обработка закрытия модального окна
    const closeModalBtn = document.querySelector('.close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closePrivacyModal);
    }

    // Закрытие модального окна при клике вне его
    const modal = document.getElementById('privacyModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closePrivacyModal();
            }
        });
    }

    // Добавляем обработчики событий для кнопок заданий
    const task1Button = document.getElementById('task1Button');
    if (task1Button) {
        task1Button.addEventListener('click', function() {
            openTask(1);
        });
    }

    const task2Button = document.getElementById('task2Button');
    if (task2Button) {
        task2Button.addEventListener('click', function() {
            openTask(2);
        });
    }

    const task3Button = document.getElementById('task3Button');
    if (task3Button) {
        task3Button.addEventListener('click', function() {
            openTask(3);
        });
    }

    // Запускаем обновление времени
    startTimeUpdater();
});

// Открыть задание
function openTask(taskId) {
    currentTask = taskId;

    // Создаем страницу задания
    const taskData = tasksData[taskId];

    let optionsHTML = '';
    taskData.options.forEach((option, index) => {
        const isChecked = userSelections[taskId][index] ? 'checked' : '';
        optionsHTML += `
            <label class="option-label">
                <input type="checkbox" class="option-checkbox" data-index="${index}" ${isChecked}>
                <span class="option-text">${option.text}</span>
            </label>
        `;
    });

    const taskPageHTML = `
        <main class="task-page">
            <button class="back-btn" id="backButton">
                <i class="fas fa-arrow-left"></i> Назад
            </button>

            <h2 class="task-title">${taskData.title}</h2>

            <div class="options-container">
                ${optionsHTML}
            </div>

            <button class="check-btn" id="checkButton">Проверить ответы</button>

            <div class="result-message" id="resultMessage${taskId}"></div>
        </main>
    `;

    // Заменяем содержимое контейнера
    container.innerHTML = container.querySelector('header').outerHTML +
                         taskPageHTML +
                         container.querySelector('footer').outerHTML;

    // ОБНОВЛЯЕМ ВРЕМЯ ПОСЛЕ ИЗМЕНЕНИЯ ДОМ-СТРУКТУРЫ
    ensureTimeElementExists();

    // Настраиваем кнопки в футере (для cookies и политики конфиденциальности)
    setupFooterButtons();

    // Добавляем обработчики событий для кнопок
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('click', goBack);
    }

    const checkButton = document.getElementById('checkButton');
    if (checkButton) {
        checkButton.addEventListener('click', function() {
            checkAnswers(taskId);
        });
    }

    // Добавляем обработчики событий для чекбоксов
    const checkboxes = document.querySelectorAll('.option-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const index = parseInt(this.getAttribute('data-index'));
            userSelections[taskId][index] = this.checked;
        });
    });
}

// Вернуться назад в главное меню
function goBack() {
    // Восстанавливаем исходную структуру
    const header = document.querySelector('header').outerHTML;
    const footer = document.querySelector('footer').outerHTML;

    const mainMenuHTML = `
        <main class="main-menu">
            <div class="task-buttons">
                <button class="task-btn" id="task1Button">
                    <span class="task-number">Задание №1</span>
                    <span class="task-desc">Доказательства невиновности Томаса</span>
                    <i class="fas fa-chevron-right"></i>
                </button>

                <button class="task-btn" id="task2Button">
                    <span class="task-number">Задание №2</span>
                    <span class="task-desc">Соучастница Элизабет</span>
                    <i class="fas fa-chevron-right"></i>
                </button>

                <button class="task-btn" id="task3Button">
                    <span class="task-number">Задание №3</span>
                    <span class="task-desc">Кто убийца Адама?</span>
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        </main>
    `;

    container.innerHTML = header + mainMenuHTML + footer;
    currentTask = null;

    // ОБНОВЛЯЕМ ВРЕМЯ ПОСЛЕ ВОЗВРАТА НА ГЛАВНУЮ
    ensureTimeElementExists();

    // Настраиваем кнопки в футере
    setupFooterButtons();

    // Добавляем обработчики событий для кнопок заданий
    const task1Button = document.getElementById('task1Button');
    if (task1Button) {
        task1Button.addEventListener('click', function() {
            openTask(1);
        });
    }

    const task2Button = document.getElementById('task2Button');
    if (task2Button) {
        task2Button.addEventListener('click', function() {
            openTask(2);
        });
    }

    const task3Button = document.getElementById('task3Button');
    if (task3Button) {
        task3Button.addEventListener('click', function() {
            openTask(3);
        });
    }
}

// Показать диалог выбора
function showAnswerDialog(taskId, correctCount, totalCorrect, allCorrect) {
    // Сначала закрываем предыдущий диалог, если он есть
    closeAnswerDialog();

    const dialogHTML = `
        <div class="modal" id="answerDialog" style="display: flex;">
            <div class="modal-content answer-dialog">
                <div class="modal-header">
                    <h2>Результаты проверки</h2>
                </div>
                <div class="modal-body">
                    <div class="result-summary">
                        <p>Ваш результат: <strong>${correctCount} из ${totalCorrect}</strong></p>
                        ${allCorrect ?
                            '<p class="success-message">🎉 Поздравляем! Все ответы верные!</p>' :
                            '<p class="warning-message">🤔 Есть ошибки. Хотите увидеть правильные ответы?</p>'}
                    </div>
                    <div class="dialog-buttons">
                        ${!allCorrect ? `
                            <button class="dialog-btn show-answers-btn" id="showAnswersBtn">
                                <i class="fas fa-eye"></i> Показать ответы
                            </button>
                            <button class="dialog-btn continue-btn" id="continueBtn">
                                <i class="fas fa-brain"></i> Подумать еще
                            </button>
                        ` : `
                            <button class="dialog-btn success-btn" id="successBtn">
                                <i class="fas fa-check"></i> Продолжить
                            </button>
                        `}
                    </div>
                </div>
            </div>
        </div>
    `;

    // Добавляем диалог в конец body
    document.body.insertAdjacentHTML('beforeend', dialogHTML);

    // Добавляем обработчики событий для кнопок диалога
    if (!allCorrect) {
        const showAnswersBtn = document.getElementById('showAnswersBtn');
        if (showAnswersBtn) {
            showAnswersBtn.addEventListener('click', function() {
                showDetailedAnswers(taskId);
            });
        }

        const continueBtn = document.getElementById('continueBtn');
        if (continueBtn) {
            continueBtn.addEventListener('click', closeAnswerDialog);
        }
    } else {
        const successBtn = document.getElementById('successBtn');
        if (successBtn) {
            successBtn.addEventListener('click', closeAnswerDialog);
        }
    }

    // Закрыть диалог при клике вне его
    const dialog = document.getElementById('answerDialog');
    dialog.addEventListener('click', function(e) {
        if (e.target === dialog) {
            closeAnswerDialog();
        }
    });
}

// Закрыть диалог
function closeAnswerDialog() {
    const dialog = document.getElementById('answerDialog');
    if (dialog) {
        dialog.remove();
    }
}

// Показать подробные ответы (подсветить правильные/неправильные)
function showDetailedAnswers(taskId) {
    const taskData = tasksData[taskId];
    const optionLabels = document.querySelectorAll('.option-label');

    // Подсвечиваем все ответы
    optionLabels.forEach((label, index) => {
        const checkbox = label.querySelector('.option-checkbox');
        const isChecked = checkbox.checked;
        const isCorrect = taskData.options[index].correct;

        // Очищаем предыдущие стили
        label.classList.remove('correct-answer', 'incorrect-answer');

        // Если ответ правильный и выбран - зеленый
        if (isCorrect && isChecked) {
            label.classList.add('correct-answer');
        }
        // Если ответ неправильный и выбран - красный
        else if (!isCorrect && isChecked) {
            label.classList.add('incorrect-answer');
        }
        // Если ответ правильный, но не выбран - тоже подсвечиваем зеленым
        else if (isCorrect && !isChecked) {
            label.classList.add('correct-answer');
        }
    });

    // Закрываем диалог
    closeAnswerDialog();

    // Прокручиваем к началу вариантов ответов
    const optionsContainer = document.querySelector('.options-container');
    if (optionsContainer) {
        optionsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Проверить ответы
function checkAnswers(taskId) {
    const taskData = tasksData[taskId];
    const optionLabels = document.querySelectorAll('.option-label');

    let correctCount = 0;
    let totalCorrect = 0;
    let selectedCount = 0;

    // Подсчитываем общее количество правильных ответов
    taskData.options.forEach(option => {
        if (option.correct) totalCorrect++;
    });

    // Считаем количество выбранных ответов
    selectedCount = countSelected(taskId);

    // Проверяем каждый вариант и считаем правильные
    optionLabels.forEach((label, index) => {
        const checkbox = label.querySelector('.option-checkbox');
        const isChecked = checkbox.checked;
        const isCorrect = taskData.options[index].correct;

        // Если ответ правильный и выбран - увеличиваем счетчик
        if (isCorrect && isChecked) {
            correctCount++;
        }
    });

    // Определяем, все ли ответы правильные
    const allCorrect = (correctCount === totalCorrect && correctCount === selectedCount);

    // Очищаем предыдущие подсветки
    optionLabels.forEach(label => {
        label.classList.remove('correct-answer', 'incorrect-answer');
    });

    // Показываем диалог с выбором
    showAnswerDialog(taskId, correctCount, totalCorrect, allCorrect);
}

// Подсчитать количество выбранных ответов
function countSelected(taskId) {
    return userSelections[taskId].filter(selected => selected).length;
}

// Открыть модальное окно с политикой конфиденциальности
function openPrivacyModal() {
    const modal = document.getElementById('privacyModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

// Закрыть модальное окно
function closePrivacyModal() {
    const modal = document.getElementById('privacyModal');
    if (modal) {
        modal.style.display = 'none';
    }
}