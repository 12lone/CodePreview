// 获取DOM元素
const codeInput = document.getElementById('code-input');
const preview = document.getElementById('preview');
const convertBtn = document.getElementById('convert-btn');

// 安全渲染HTML
function safeRenderHTML(html) {
    try {
        // 创建新的文档片段
        const parser = new DOMParser();
        const doc = parser.parseFromString(`
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { margin: 0; padding: 20px; }
                    img { max-width: 100%; height: auto; }
                    * { max-width: 100% !important; }
                </style>
            </head>
            <body>
                ${html}
            </body>
            </html>
        `, 'text/html');

        // 创建容器
        const container = document.createElement('div');
        container.style.overflow = 'auto';
        container.style.height = '100%';
        container.style.backgroundColor = '#fff';
        container.style.padding = '20px';
        container.style.boxSizing = 'border-box';

        // 仅插入body内容
        const bodyContent = doc.body.cloneNode(true);
        container.appendChild(bodyContent);

        // 清空预览区域并添加新内容
        preview.innerHTML = '';
        preview.appendChild(container);

        // 触发重绘
        container.offsetHeight;
        return '';
    } catch (error) {
        console.error('渲染HTML失败:', error);
        preview.innerHTML = '<p class="error">HTML渲染失败，请检查代码</p>';
        return '';
    }
}

// 获取当前选择的模式
function getSelectedMode() {
    return document.querySelector('input[name="mode"]:checked').value;
}

// 根据选择模式渲染内容
function renderContent(content) {
    const mode = getSelectedMode();
    if (mode === 'markdown') {
        preview.innerHTML = marked.parse(content);
    } else {
        safeRenderHTML(content); // 直接调用，不操作innerHTML
    }
}

// 添加事件监听
convertBtn.addEventListener('click', () => {
    const content = codeInput.value.trim();
    if (content) {
        renderContent(content);
    } else {
        preview.innerHTML = '<p class="empty">请输入HTML或Markdown代码</p>';
    }
});

// 初始化显示
preview.innerHTML = '<p class="empty">预览内容将显示在这里</p>';

// 添加样式到预览区域
const style = document.createElement('style');
style.textContent = `
    .empty {
        color: #999;
        text-align: center;
        margin-top: 20px;
    }
    
    .preview img {
        max-width: 100%;
        height: auto;
    }
    
    .preview pre {
        background-color: #f8f9fa;
        padding: 15px;
        border-radius: 6px;
        overflow-x: auto;
    }
    
    .preview code {
        font-family: 'Consolas', monospace;
        font-size: 14px;
    }
`;
document.head.appendChild(style);
