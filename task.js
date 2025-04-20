// 使用新的 API 密钥
const API_KEY = 'sk-crwxyeeunmctsxflzddrsyoprydfxaquykdseudywgkacaag';
// 使用提供的 API 端点
const API_URL = 'https://api.siliconflow.cn/v1/chat/completions';

const chatContainer = document.getElementById('chat-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

sendButton.addEventListener('click', async () => {
    const message = messageInput.value;
    if (message.trim()!== '') {
        // 显示用户消息
        const userMessage = document.createElement('div');
        userMessage.classList.add('user-message');
        userMessage.textContent = `你: ${message}`;
        chatContainer.appendChild(userMessage);
        messageInput.value = '';

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
            agentMessage.classList.add('agent-message');

            if (data.choices && data.choices.length > 0) {
                const content = data.choices[0].message.content;
                if (content) {
                    agentMessage.textContent = `评价型智能体: ${content}`;
                } else {
                    agentMessage.textContent = '评价型智能体: 无有效回答';
                }
            } else {
                if (data.error) {
                    agentMessage.textContent = `评价型智能体: API 返回错误 - ${data.error.message}`;
                } else {
                    agentMessage.textContent = '评价型智能体: 无有效回答';
                }
            }
            chatContainer.appendChild(agentMessage);
        } catch (error) {
            console.error('调用 API 出错:', error);
            const errorMessage = document.createElement('div');
            errorMessage.classList.add('error-message');
            errorMessage.textContent = `与评价型智能体通信时出现错误: ${error.message}，请稍后再试。`;
            chatContainer.appendChild(errorMessage);
        }
    }
});

// 任务功能聊天实现文件
// 提供与任务型AI助手的交互功能
// 包括消息发送、API调用和响应处理
