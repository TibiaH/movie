document.addEventListener('DOMContentLoaded', function() {
    // Выбираем все блоки с видео из обеих секций
    const videoBlocks = document.querySelectorAll('.ExamplesOfWork__VideoBlock, .header__block');
    const videoModal = document.getElementById('videoModal');
    const closeModal = document.getElementById('closeModal');
    const videoPlayer = document.getElementById('videoPlayer');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');

    // Открытие модального окна при клике на любую карточку
    videoBlocks.forEach(block => {
        block.addEventListener('click', function() {
            const videoUrl = this.getAttribute('data-video-url');
            const videoTitle = this.getAttribute('data-video-title');
            const videoDescription = this.getAttribute('data-video-description');
            
            // Устанавливаем данные в модальное окно
            videoPlayer.src = videoUrl;
            modalTitle.textContent = videoTitle;
            modalDescription.textContent = videoDescription;
            
            // Показываем модальное окно
            videoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        });
    });

    // Закрытие модального окна
    closeModal.addEventListener('click', function() {
        closeVideoModal();
    });

    // Закрытие модального окна при клике вне контента
    videoModal.addEventListener('click', function(e) {
        if (e.target === videoModal) {
            closeVideoModal();
        }
    });

    // Закрытие модального окна при нажатии Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
            closeVideoModal();
        }
    });

    function closeVideoModal() {
        videoModal.classList.remove('active');
        videoPlayer.src = '';
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
    }

    // Предотвращаем скролл страницы когда модальное окно открыто
    videoModal.addEventListener('touchmove', function(e) {
        if (e.target === videoModal) {
            e.preventDefault();
        }
    }, { passive: false });
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
const priceCloseBtn = document.querySelector('.price-close');
const priceForm = document.getElementById('priceForm');

// Конфигурация бота (ЗАМЕНИТЕ НА СВОИ ДАННЫЕ)
const BOT_TOKEN = '8310260346:AAGUoK62ehPDc-r5BmqaHs4SuM9ZifWpEoM';
const CHAT_ID = '952089103';

// Получаем все кнопки для открытия модального окна
const openBtns = document.querySelectorAll('.costBlock__menu'); // Добавьте этот класс к обеим кнопкам

// Открытие модального окна прайс-листа для всех кнопок
openBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        priceModal.style.display = 'flex';
        priceForm.reset();
    });
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

// Функция отправки в Telegram
async function sendToTelegram(messenger, phone) {
    const message = `📋 Новая заявка на прайс-лист:\n📱 Мессенджер: ${messenger}\n📞 Контакт: ${phone}\n⏰ Время: ${new Date().toLocaleString()}`;
    
    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });
        
        const data = await response.json();
        console.log('Telegram response:', data);
        return data.ok;
    } catch (error) {
        console.error('Error sending to Telegram:', error);
        return false;
    }
}

// Обработка отправки формы прайс-листа
priceForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const messenger = document.getElementById('messenger').value;
    const phone = document.getElementById('phone').value;
    
    // Показываем загрузку
    const submitBtn = priceForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;
    
    try {
        // Отправляем в Telegram
        const success = await sendToTelegram(messenger, phone);
        
        // Закрываем основное модальное окно
        priceModal.style.display = 'none';
        
        // Показываем окно успеха
        successModal.style.display = 'flex';
        
        // Сбрасываем форму
        priceForm.reset();
        
    } catch (error) {
        console.error('Error:', error);
        alert('Ошибка отправки. Попробуйте еще раз.');
    } finally {
        // Восстанавливаем кнопку
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
    
    // Через 3 секунды закрываем окно успеха
    setTimeout(function() {
        successModal.style.display = 'none';
    }, 3000);
});

 function scrollToTarget() {
            const targetElement = document.getElementById('section1');
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }



