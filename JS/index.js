document.addEventListener('DOMContentLoaded', function() {
    const videoBlocks = document.querySelectorAll('.ExamplesOfWork__VideoBlock, .header__block');
    const videoModal = document.getElementById('videoModal');
    const closeModal = document.getElementById('closeModal');
    const videoPlayer = document.getElementById('videoPlayer');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');

    videoBlocks.forEach(block => {
        block.addEventListener('click', function() {
            const videoUrl = this.getAttribute('data-video-url');
            const videoTitle = this.getAttribute('data-video-title');
            const videoDescription = this.getAttribute('data-video-description');
            
            videoPlayer.src = videoUrl;
            modalTitle.textContent = videoTitle;
            modalDescription.textContent = videoDescription;
            
            videoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        });
    });

    closeModal.addEventListener('click', closeVideoModal);

    videoModal.addEventListener('click', function(e) {
        if (e.target === videoModal) closeVideoModal();
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) closeVideoModal();
    });

    function closeVideoModal() {
        videoModal.classList.remove('active');
        videoPlayer.src = '';
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
    }

    videoModal.addEventListener('touchmove', function(e) {
        if (e.target === videoModal) e.preventDefault();
    }, { passive: false });
});

document.addEventListener('DOMContentLoaded', function() {
    const dropdownMenus = document.querySelectorAll('.dropdown-menu2');
    
    dropdownMenus.forEach(function(dropdownMenu) {
        const dropdownToggle = dropdownMenu.querySelector('.dropdown-toggle2');
        
        dropdownToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            
            dropdownMenus.forEach(function(otherMenu) {
                if (otherMenu !== dropdownMenu) otherMenu.classList.remove('active');
            });
            
            dropdownMenu.classList.toggle('active');
        });
    });
    
    document.addEventListener('click', function(e) {
        let isClickInside = false;
        
        dropdownMenus.forEach(function(dropdownMenu) {
            if (dropdownMenu.contains(e.target)) isClickInside = true;
        });
        
        if (!isClickInside) dropdownMenus.forEach(d => d.classList.remove('active'));
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') dropdownMenus.forEach(d => d.classList.remove('active'));
    });
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

const priceModal = document.getElementById('priceModal');
const successModal = document.getElementById('successModal');
const priceCloseBtn = document.querySelector('.price-close');
const priceForm = document.getElementById('priceForm');
const BOT_TOKEN = '8310260346:AAGUoK62ehPDc-r5BmqaHs4SuM9ZifWpEoM';
const CHAT_ID = '952089103';
const openBtns = document.querySelectorAll('.costBlock__menu');

function initCustomSelect() {
    const customSelect = document.getElementById('messengerSelect');
    if (!customSelect) return;

    const selectSelected = customSelect.querySelector('.select-selected');
    const selectItems = customSelect.querySelector('.select-items');
    const hiddenInput = customSelect.querySelector('input[type="hidden"]');
    const options = customSelect.querySelectorAll('.select-option');

    selectSelected.addEventListener('click', function(e) {
        e.stopPropagation();
        selectItems.classList.toggle('show');
        selectSelected.classList.toggle('active');
    });

    options.forEach(option => {
        option.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            const text = this.textContent;
            
            options.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            selectSelected.querySelector('span').textContent = text;
            selectSelected.style.color = 'white';
            hiddenInput.value = value;
            
            selectItems.classList.remove('show');
            selectSelected.classList.remove('active');
            hiddenInput.setAttribute('data-valid', 'true');
        });
    });

    document.addEventListener('click', function(e) {
        if (!customSelect.contains(e.target)) {
            selectItems.classList.remove('show');
            selectSelected.classList.remove('active');
        }
    });
}

openBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        priceModal.style.display = 'flex';
        priceForm.reset();
        resetCustomSelect();
    });
});

function resetCustomSelect() {
    const customSelect = document.getElementById('messengerSelect');
    if (!customSelect) return;

    const selectSelected = customSelect.querySelector('.select-selected');
    const hiddenInput = customSelect.querySelector('input[type="hidden"]');
    const options = customSelect.querySelectorAll('.select-option');

    selectSelected.querySelector('span').textContent = 'Выберите мессенджер';
    selectSelected.style.color = '#aaa';
    hiddenInput.value = '';
    options.forEach(opt => opt.classList.remove('selected'));
    selectSelected.classList.remove('active');
    customSelect.querySelector('.select-items').classList.remove('show');
}

priceCloseBtn.addEventListener('click', function() {
    priceModal.style.display = 'none';
    priceForm.reset();
    resetCustomSelect();
});

window.addEventListener('click', function(event) {
    if (event.target === priceModal) {
        priceModal.style.display = 'none';
        priceForm.reset();
        resetCustomSelect();
    }
    if (event.target === successModal) successModal.style.display = 'none';
});

async function sendToTelegram(messenger, phone) {
    const message = `📋 Новая заявка на прайс-лист:\n📱 Мессенджер: ${messenger}\n📞 Контакт: ${phone}\n⏰ Время: ${new Date().toLocaleString()}`;
    
    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: 'HTML' })
        });
        
        const data = await response.json();
        return data.ok;
    } catch (error) {
        return false;
    }
}

priceForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const messengerInput = document.getElementById('messenger');
    const messenger = messengerInput.value;
    const phone = document.getElementById('phone').value;
    
    if (!messenger) {
        const customSelect = document.getElementById('messengerSelect');
        customSelect.querySelector('.select-selected').style.borderColor = '#ff4444';
        return;
    }
    
    const submitBtn = priceForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;
    
    try {
        const success = await sendToTelegram(messenger, phone);
        
        if (success) {
            priceModal.style.display = 'none';
            successModal.style.display = 'flex';
            priceForm.reset();
            resetCustomSelect();
            
            setTimeout(() => successModal.style.display = 'none', 3000);
        } else alert('Ошибка отправки. Попробуйте еще раз.');
        
    } catch (error) {
        alert('Ошибка отправки. Попробуйте еще раз.');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

function scrollToTarget() {
    document.getElementById('section1').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

document.addEventListener('DOMContentLoaded', function() {
    const blocks = document.querySelectorAll('.stageOfWork__block');
    
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return rect.top <= window.innerHeight * 0.85;
    }
    
    function handleScrollAnimation() {
        blocks.forEach(block => {
            if (isElementInViewport(block)) block.classList.add('animate');
        });
    }
    
    let ticking = false;
    function updateOnScroll() {
        handleScrollAnimation();
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    });
    
    handleScrollAnimation();
    window.addEventListener('resize', handleScrollAnimation);
    window.addEventListener('load', handleScrollAnimation);
});