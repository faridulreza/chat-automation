

export const getTelegramBotInfo = async (token)=>{
    const res = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    if (!res.ok) {
        throw new Error('Failed to fetch bot info');
    }
    const data = await res.json();
    return data.result;
}


export const setTelegramWebhook = async (token, chatId) => {
    const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            url: `${process.env.SERVER_URL}/api/telegram/${chatId}`,
            secret: process.env.TELEGRAM_SECRET,
        }),
    });

    if (!res.ok) {
        console.error('Failed to set webhook', res.statusText);
        throw new Error('Failed to set webhook');
    }
    const data = await res.json();
    return data;
}

export const removeTelegramWebhook = async (token) => {
    const res = await fetch(`https://api.telegram.org/bot${token}/deleteWebhook`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error('Failed to remove webhook');
    }
    const data = await res.json();
    return data;
}