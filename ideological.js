// 使用新的 API 密钥
const API_KEY = 'sk-crwxyeeunmctsxflzddrsyoprydfxaquykdseudywgkacaag';
// 使用提供的 API 端点
const API_URL = 'https://api.siliconflow.cn/v1/chat/completions';

const chatContainer = document.getElementById('chat-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// 处理发送消息
async function sendMessage() {
    const message = messageInput.value.trim();
    if (message !== '') {
        // 显示用户消息
        const userMessage = document.createElement('div');
        userMessage.classList.add('message', 'message-user');
        userMessage.textContent = message;
        chatContainer.appendChild(userMessage);
        messageInput.value = '';
        chatContainer.scrollTop = chatContainer.scrollHeight;

        // 构建请求体
        const requestBody = {
            "model": "Qwen/QwQ-32B",
            "messages": [
                {
                    "role": "user",
                    "content": message
                }
            ],
            "stream": false,
            "max_tokens": 2048,
            "stop": null,
            "temperature": 0.2,
            "top_p": 0.5,
            "top_k": 50,
            "frequency_penalty": 0.5,
            "n": 1,
            "response_format": {
                "type": "text"
            },
            "tools": [
                {
                    "type": "function",
                    "function": {
                        "description": "<string>",
                        "name": "<string>",
                        "parameters": {},
                        "strict": false
                    }
                }
            ]
        };

        // 调用 API
        try {
            console.log('开始发送请求:', requestBody);
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('API 响应:', data);

        const agentMessage = document.createElement('div');
        agentMessage.classList.add('message', 'message-assistant');

            if (data.choices && data.choices.length > 0) {
                const content = data.choices[0].message.content;
                // 去除内容中的星号
                const cleanContent = content ? content.replace(/\*/g, '') : '无有效回答';
                agentMessage.textContent = cleanContent;
            } else if (data.error) {
                agentMessage.textContent = `API错误: ${data.error.message.replace(/\*/g, '')}`;
            } else {
                agentMessage.textContent = '无有效回答';
            }
        chatContainer.appendChild(agentMessage);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        } catch (error) {
            console.error('调用 API 出错:', error);
            const errorMessage = document.createElement('div');
            errorMessage.classList.add('error-message');
            errorMessage.textContent = `与评价型智能体通信时出现错误: ${error.message}，请稍后再试。`;
            chatContainer.appendChild(errorMessage);
        }
    }
}

// 按钮点击发送
sendButton.addEventListener('click', sendMessage);

// Enter键发送
messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// 思想交流功能实现文件
// 提供与思想交流AI助手的交互功能  
// 包括消息发送、API调用和响应处理
