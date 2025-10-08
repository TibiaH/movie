document.addEventListener('DOMContentLoaded', function() {
    const blocks = document.querySelectorAll('.stageOfWork__block');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.15, // Анимация запустится когда 15% элемента видно
        rootMargin: '0px 0px -30px 0px'
    });
    
    blocks.forEach(block => {
        observer.observe(block);
    });
});

// Функция для открытия модального окна
function openModal(button) {
    const videoBlock = button.closest('.ExamplesOfWork__VideoBlock');
    const videoTitle = videoBlock.getAttribute('data-video-title');
    const videoUrl = videoBlock.getAttribute('data-video-url');
    const videoDescription = videoBlock.getAttribute('data-video-description');
    
    const modalOverlay = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalVideoTitle');
    const videoIframe = document.getElementById('modalVideo');
    const modalDescription = document.querySelector('.modal-description');
    
    // Устанавливаем контент модального окна
    modalTitle.textContent = videoTitle;
    videoIframe.src = videoUrl;
    modalDescription.textContent = videoDescription;
    
    // Показываем модальное окно
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Функция для закрытия модального окна
function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    const videoIframe = document.getElementById('modalVideo');
    
    // Скрываем модальное окно
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Останавливаем видео
    videoIframe.src = '';
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Обработчик закрытия
    document.getElementById('closeModal').addEventListener('click', closeModal);
    
    // Закрытие при клике вне окна
    document.getElementById('modalOverlay').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Добавляем кнопки воспроизведения на все видео блоки
    const videoBlocks = document.querySelectorAll('.ExamplesOfWork__VideoBlock');
    videoBlocks.forEach(block => {
        const playButton = document.createElement('button');
        playButton.className = 'video-play-button';
        playButton.innerHTML = '▶';
        playButton.onclick = function(e) {
            e.stopPropagation();
            openModal(this);
        };
        
        const videoContainer = block.querySelector('.ExamplesOfWork__VideoBlock_video');
        videoContainer.appendChild(playButton);
        
        // Также делаем кликабельным весь блок
        block.style.cursor = 'pointer';
        block.addEventListener('click', function() {
            openModal(playButton);
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Используем querySelectorAll для всех dropdown меню
    const dropdownMenus = document.querySelectorAll('.dropdown-menu2');
    
    dropdownMenus.forEach(function(dropdownMenu) {
        const dropdownToggle = dropdownMenu.querySelector('.dropdown-toggle2');
        
        // Открытие/закрытие по клику
        dropdownToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Закрываем все остальные открытые меню
            dropdownMenus.forEach(function(otherMenu) {
                if (otherMenu !== dropdownMenu) {
                    otherMenu.classList.remove('active');
                }
            });
            
            // Переключаем текущее меню
            dropdownMenu.classList.toggle('active');
        });
    });
    
    // Закрытие при клике вне меню
    document.addEventListener('click', function(e) {
        let isClickInside = false;
        
        dropdownMenus.forEach(function(dropdownMenu) {
            if (dropdownMenu.contains(e.target)) {
                isClickInside = true;
            }
        });
        
        if (!isClickInside) {
            dropdownMenus.forEach(function(dropdownMenu) {
                dropdownMenu.classList.remove('active');
            });
        }
    });
    
    // Закрытие при нажатии Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            dropdownMenus.forEach(function(dropdownMenu) {
                dropdownMenu.classList.remove('active');
            });
        }
    });
});


function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Получаем элементы DOM для прайс-листа
const priceModal = document.getElementById('priceModal');
const successModal = document.getElementById('successModal');
const openBtn = document.getElementById('openModal');
const priceCloseBtn = document.querySelector('.price-close');
const priceForm = document.getElementById('priceForm');

// Открытие модального окна прайс-листа
openBtn.addEventListener('click', function() {
    priceModal.style.display = 'flex';
    priceForm.reset();
});

// Закрытие модального окна прайс-листа
priceCloseBtn.addEventListener('click', function() {
    priceModal.style.display = 'none';
    priceForm.reset();
});

// Закрытие при клике вне модального окна
window.addEventListener('click', function(event) {
    if (event.target === priceModal) {
        priceModal.style.display = 'none';
        priceForm.reset();
    }
    if (event.target === successModal) {
        successModal.style.display = 'none';
    }
});

// Обработка отправки формы прайс-листа
priceForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const messenger = document.getElementById('messenger').value;
    const phone = document.getElementById('phone').value;
    
    // Закрываем основное модальное окно
    priceModal.style.display = 'none';
    
    // Показываем окно успеха
    successModal.style.display = 'flex';
    
    // Здесь должен быть код для отправки данных в Telegram
    // const botToken = 'YOUR_BOT_TOKEN';
    // const chatId = 'YOUR_CHAT_ID';
    // const message = `Новая заявка на прайс-лист:\nМессенджер: ${messenger}\nКонтакт: ${phone}`;
    // 
    // fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //         chat_id: chatId,
    //         text: message
    //     })
    // });
    
    // Через 3 секунды закрываем окно успеха
    setTimeout(function() {
        successModal.style.display = 'none';
        priceForm.reset();
    }, 3000);
});

 function scrollToTarget() {
            const targetElement = document.getElementById('section1');
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }



