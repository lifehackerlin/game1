// 深色模式管理
const DarkMode = {
    init() {
        // 查找暗色模式切换按钮
        const darkModeToggle = document.querySelector('#darkModeToggle');
        if (!darkModeToggle) return;

        // 获取或创建图标
        let icon = darkModeToggle.querySelector('i');
        if (!icon) {
            icon = document.createElement('i');
            icon.className = 'fas fa-moon';
            darkModeToggle.appendChild(icon);
        }

        // 保存引用
        this.darkModeToggle = darkModeToggle;
        this.icon = icon;

        // 设置事件监听
        this.setupEventListeners();
        
        // 加载之前的偏好设置
        this.loadPreference();
    },

    setupEventListeners() {
        if (!this.darkModeToggle) return;
        this.darkModeToggle.addEventListener('click', () => this.toggle());
    },

    toggle() {
        if (!this.icon) return;
        
        document.documentElement.classList.toggle('dark');
        this.icon.classList.toggle('fa-moon');
        this.icon.classList.toggle('fa-sun');
        this.savePreference();
    },

    loadPreference() {
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.documentElement.classList.add('dark');
            if (this.icon) {
                this.icon.classList.remove('fa-moon');
                this.icon.classList.add('fa-sun');
            }
        }
    },

    savePreference() {
        localStorage.setItem('darkMode', 
            document.documentElement.classList.contains('dark') ? 'enabled' : 'disabled'
        );
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

// 游戏加载管理
const GameLoader = {
    gameUrls: {
        'epic-quest': '//game287709.konggames.com/gamez/0028/7709/live/index.html',
        'bit-heroes': 'https://web.bitheroesgame.com/kongregatewebgl/',
        'animation-throwdown': 'https://cb-cdn.synapse-games.com/webgl/Throwdown_WebGL_v1.157.1_r27681/index.html'
    },

    init() {
        const gameContainers = document.querySelectorAll('.game-container');
        if (gameContainers.length === 0) return;

        gameContainers.forEach(container => {
            const gameId = container.getAttribute('data-game-id');
            const playButton = container.querySelector('button');
            
            if (!playButton || !gameId) return;
            
            playButton.addEventListener('click', () => this.loadGame(container, gameId));
        });
    },

    loadGame(container, gameId) {
        const gameUrl = this.gameUrls[gameId];
        if (!gameUrl) {
            console.error(`Game URL not found for ${gameId}`);
            return;
        }

        // 移除按钮界面
        const buttonInterface = container.querySelector('.text-center');
        if (buttonInterface) {
            container.removeChild(buttonInterface);
        }

        // 添加加载提示
        const loadingElement = document.createElement('div');
        loadingElement.className = 'text-center py-8';
        loadingElement.innerHTML = `
            <i class="fas fa-spinner fa-spin text-4xl text-funion-primary"></i>
            <p class="mt-4">游戏加载中，请稍候...</p>
        `;
        container.appendChild(loadingElement);

        // 创建游戏iframe
        const iframe = document.createElement('iframe');
        iframe.src = gameUrl;
        iframe.width = '100%';
        iframe.height = '640';
        iframe.frameBorder = '0';
        iframe.allowFullscreen = true;
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';

        // 加载完成后移除提示
        iframe.onload = () => {
            if (loadingElement.parentNode === container) {
                container.removeChild(loadingElement);
            }
        };

        // 加载失败处理
        iframe.onerror = () => {
            loadingElement.innerHTML = `
                <i class="fas fa-exclamation-triangle text-4xl text-red-500"></i>
                <p class="mt-4">游戏加载失败，请稍后再试</p>
            `;
        };

        container.appendChild(iframe);
    }
};

// 页面加载时初始化所有功能
document.addEventListener('DOMContentLoaded', () => {
    // 初始化深色模式
    DarkMode.init();
    
    // 初始化搜索功能
    Search.init();
    
    // 初始化游戏加载器
    GameLoader.init();
}); 