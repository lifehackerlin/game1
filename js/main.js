// 深色模式管理
const DarkMode = {
    init() {
        this.darkModeToggle = document.querySelector('button i.fa-moon');
        this.setupEventListeners();
        this.loadPreference();
    },

    setupEventListeners() {
        this.darkModeToggle.addEventListener('click', () => this.toggle());
    },

    toggle() {
        document.documentElement.classList.toggle('dark');
        this.darkModeToggle.classList.toggle('fa-moon');
        this.darkModeToggle.classList.toggle('fa-sun');
        this.savePreference();
    },

    loadPreference() {
        if (localStorage.getItem('darkMode') === 'true') {
            document.documentElement.classList.add('dark');
            this.darkModeToggle.classList.remove('fa-moon');
            this.darkModeToggle.classList.add('fa-sun');
        }
    },

    savePreference() {
        localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
    }
};

// 搜索功能
const Search = {
    init() {
        this.searchInput = document.querySelector('input[type="text"]');
        this.setupEventListeners();
    },

    setupEventListeners() {
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });
    },

    performSearch() {
        const searchTerm = this.searchInput.value.toLowerCase().trim();
        if (searchTerm) {
            window.location.href = `/search.html?q=${encodeURIComponent(searchTerm)}`;
        }
    }
};

// 分类筛选
const CategoryFilter = {
    init() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.setupEventListeners();
    },

    setupEventListeners() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => this.filter(button));
        });
    },

    filter(selectedButton) {
        this.filterButtons.forEach(btn => {
            btn.classList.remove('bg-funion-primary', 'text-white');
            btn.classList.add('bg-white', 'dark:bg-gray-800', 'text-gray-800', 'dark:text-white');
        });
        selectedButton.classList.remove('bg-white', 'dark:bg-gray-800', 'text-gray-800', 'dark:text-white');
        selectedButton.classList.add('bg-funion-primary', 'text-white');
    }
};

// 图片懒加载
const LazyLoad = {
    init() {
        this.images = document.querySelectorAll('img[data-src]');
        this.setupIntersectionObserver();
    },

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        this.images.forEach(image => observer.observe(image));
    },

    loadImage(image) {
        const src = image.getAttribute('data-src');
        if (!src) return;
        
        image.src = src;
        image.removeAttribute('data-src');
        image.classList.remove('img-placeholder');
    }
};

// 表单验证
const FormValidation = {
    init() {
        this.forms = document.querySelectorAll('form');
        this.setupEventListeners();
    },

    setupEventListeners() {
        this.forms.forEach(form => {
            form.addEventListener('submit', (e) => this.validateForm(e, form));
        });
    },

    validateForm(e, form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                this.showError(field, '此字段为必填项');
            } else {
                this.clearError(field);
            }
        });

        if (!isValid) {
            e.preventDefault();
        }
    },

    showError(field, message) {
        const errorDiv = field.nextElementSibling?.classList.contains('error-message')
            ? field.nextElementSibling
            : document.createElement('div');
        
        errorDiv.textContent = message;
        errorDiv.className = 'error-message text-red-500 text-sm mt-1';
        
        if (!field.nextElementSibling?.classList.contains('error-message')) {
            field.parentNode.insertBefore(errorDiv, field.nextSibling);
        }
        
        field.classList.add('border-red-500');
    },

    clearError(field) {
        const errorDiv = field.nextElementSibling;
        if (errorDiv?.classList.contains('error-message')) {
            errorDiv.remove();
        }
        field.classList.remove('border-red-500');
    }
};

// 页面加载时初始化所有功能
document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
    initSearch();
    
    // 初始化游戏按钮
    initGameButtons();
});

// 初始化夜间模式
function initDarkMode() {
    const darkModeToggle = document.querySelector('button i.fas.fa-moon')?.parentElement || 
                           document.querySelector('button i.fa-moon')?.parentElement ||
                           document.querySelector('#darkModeToggle');
    
    if (!darkModeToggle) return;
    
    // 检查用户之前的夜间模式偏好
    const darkModeEnabled = localStorage.getItem('darkMode') === 'enabled';
    
    // 如果之前启用了夜间模式，则应用它
    if (darkModeEnabled) {
        document.documentElement.classList.add('dark');
        const icon = darkModeToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }
    
    // 夜间模式切换事件
    darkModeToggle.addEventListener('click', function() {
        const icon = this.querySelector('i');
        if (document.documentElement.classList.contains('dark')) {
            // 切换到亮色模式
            document.documentElement.classList.remove('dark');
            localStorage.setItem('darkMode', 'disabled');
            if (icon) {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        } else {
            // 切换到夜间模式
            document.documentElement.classList.add('dark');
            localStorage.setItem('darkMode', 'enabled');
            if (icon) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        }
    });
}

// 初始化搜索功能
function initSearch() {
    const searchForm = document.querySelector('form[action="/search.html"]');
    const searchInput = document.querySelector('input[name="q"]');
    
    if (!searchForm || !searchInput) return;
    
    // 搜索按钮点击事件
    const searchButton = searchInput.closest('div').querySelector('button');
    if (searchButton) {
        searchButton.addEventListener('click', function(e) {
            e.preventDefault();
            searchForm.submit();
        });
    }
    
    // 回车键搜索
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchForm.submit();
        }
    });
}

// 初始化游戏按钮点击事件
function initGameButtons() {
    const gameContainers = document.querySelectorAll('.game-container');
    
    if (gameContainers.length === 0) return;
    
    gameContainers.forEach(container => {
        const gameId = container.getAttribute('data-game-id');
        const playButton = container.querySelector('button');
        
        if (!playButton) return;
        
        playButton.addEventListener('click', function() {
            // 移除按钮界面
            const buttonInterface = container.querySelector('.text-center');
            if (buttonInterface) {
                container.removeChild(buttonInterface);
            }
            
            // 根据游戏ID加载相应的iframe
            let gameUrl = '';
            
            if (gameId === 'epic-quest') {
                gameUrl = '//game287709.konggames.com/gamez/0028/7709/live/index.html?kongregate_game_version=1606746247&kongregate_host=www.kongregate.com';
            } else if (gameId === 'bit-heroes') {
                gameUrl = 'https://web.bitheroesgame.com/kongregatewebgl/';
            } else if (gameId === 'animation-throwdown') {
                gameUrl = 'https://cb-cdn.synapse-games.com/webgl/Throwdown_WebGL_v1.157.1_r27681/index.html';
            }
            
            loadGameIframe(container, gameUrl);
        });
    });
}

// 加载游戏iframe的函数
function loadGameIframe(container, src) {
    // 添加加载中提示
    const loadingElement = document.createElement('div');
    loadingElement.className = 'text-center py-8';
    loadingElement.innerHTML = '<i class="fas fa-spinner fa-spin text-4xl text-funion-primary"></i><p class="mt-4">游戏加载中，请稍候...</p>';
    
    container.appendChild(loadingElement);
    
    // 创建游戏iframe
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.width = '100%';
    iframe.height = '640';
    iframe.frameBorder = '0';
    iframe.allowFullscreen = true;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    
    // 加载完成后移除提示
    iframe.onload = function() {
        if (loadingElement.parentNode === container) {
            container.removeChild(loadingElement);
        }
    };
    
    // 加载失败处理
    iframe.onerror = function() {
        loadingElement.innerHTML = '<i class="fas fa-exclamation-triangle text-4xl text-red-500"></i><p class="mt-4">游戏加载失败，请稍后再试</p>';
    };
    
    container.appendChild(iframe);
} 