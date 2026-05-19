/* 全局样式 */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: 'Inter', system-ui, sans-serif;
    line-height: 1.6;
    color: #111827;
    background-color: #FFFFFF;
    overflow-x: hidden;
}

/* 自定义鼠标样式 */
#custom-cursor {
    width: 24px;
    height: 24px;
    border-radius: 0;
    border: 1px solid #000000;
    pointer-events: none;
    position: fixed;
    z-index: 9999;
    mix-blend-mode: difference;
    transition: width 0.3s ease, height 0.3s ease, opacity 0.3s ease;
}

#custom-cursor.cursor-hover {
    width: 64px;
    height: 64px;
    background-color: rgba(0, 0, 0, 0.05);
}

/* 页面容器 */
.screen {
    position: relative;
    min-height: 100vh;
    width: 100%;
    transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* 页面过渡动画 */
section {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.5s ease, transform 0.5s ease;
}

section.hidden {
    opacity: 0;
    transform: translateY(20px);
}

/* 按钮样式 */
button {
    cursor: pointer;
    font-family: inherit;
    transition: all 0.3s ease;
    border-radius: 0;
}

button:focus {
    outline: 1px solid #000000;
    outline-offset: 2px;
}

/* 评分选项样式 */
.rating-btn {
    transition: all 0.3s ease;
    border-radius: 0;
}

.rating-btn.selected {
    border-color: #000000;
    background-color: #F9FAFB;
    color: #000000;
}

.rating-btn.selected span {
    color: #000000;
}

/* 是/否选项样式 */
.yes-no-btn {
    transition: all 0.3s ease;
    border-radius: 0;
}

.yes-no-btn.selected {
    border-color: #000000;
    background-color: #F9FAFB;
    color: #000000;
}

/* 输入框样式 */
input[type="text"] {
    font-family: inherit;
    transition: all 0.3s ease;
    border-radius: 0;
}

input[type="text"]:focus {
    border-color: #000000;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
}

/* 进度条动画 */
@keyframes progress {
    from {
        width: 0;
    }
}

/* 加载动画 */
@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

@keyframes bounce {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}

/* 维度得分条动画 */
@keyframes grow {
    from {
        height: 0;
    }
}

.dimension-score div[class$="-score-bar"] {
    animation: grow 1s ease-out forwards;
}

/* 线条元素样式 */
.line-element {
    height: 1px;
    background-color: #000000;
    margin: 24px 0;
    transition: width 0.3s ease;
}

/* 指示器线条动画 */
.indicator-line {
    height: 1px;
    background-color: #000000;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    transition: width 0.3s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .container {
        padding: 1rem;
    }
    
    h1 {
        font-size: 3rem;
    }
    
    h2 {
        font-size: 1.5rem;
    }
    
    .dimension-score {
        font-size: 0.875rem;
    }
    
    .rating-btn span:last-child {
        font-size: 0.75rem;
    }
    
    /* 在移动设备上隐藏自定义鼠标 */
    #custom-cursor {
        display: none;
    }
}

@media (max-width: 480px) {
    h1 {
        font-size: 2.5rem;
    }
    
    h2 {
        font-size: 1.25rem;
    }
    
    .rating-btn {
        padding: 0.5rem;
    }
    
    .rating-btn span:first-child {
        font-size: 1rem;
    }
    
    .rating-btn span:last-child {
        display: none;
    }
}

/* 无障碍支持 */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
    .rating-btn.selected,
    .yes-no-btn.selected {
        border-width: 2px;
    }
    
    .dimension-score div[class$="-score-bar"] {
        opacity: 0.9;
    }
}