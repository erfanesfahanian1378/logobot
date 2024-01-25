const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with the actual token from BotFather
const token = '6439788591:AAHSXV8yBfR6pBoL9cVj1Hb3qZgqDNLDYNM';
const bot = new TelegramBot(token, {polling: true});
let ifItsJoined = false;
const userStates = new Map();
const channelUsername = '@imaginAi';


bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    let name = msg.from.first_name + "";
    let surName = msg.from.last_name + "";
    let username = msg.from.username;
    let userState = userStates.get(chatId);
    if (!userState) {
        userState = {
            isRequestingImage: false,
            isRequestingRecharge: false,
            isCompletingProfile: false,
            isInvitingFriend: false
            // any other initial state properties
        };
        userStates.set(chatId, userState);
    }


    if (text === '/start') {
        let isMember = await checkChannelMembership(chatId, msg.from.id);
        if (!isMember) {
            try {
                await axios.post('http://localhost:3000/start', {
                    username: username,
                    name: name,
                    surName: surName,
                    sexuality: "",
                    age: ""
                });
            } catch (error) {
                console.error('Error sending data to server:', error);
            }
            bot.sendMessage(chatId, `لطفا ابتدا عضو کانال ${channelUsername} شوید.`, {
                reply_markup: {
                    keyboard: [
                        [{text: 'عضو شدم'}]
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });
        } else {

            try {
                await axios.post('http://localhost:3000/start', {
                    username: username,
                    name: name,
                    surName: surName,
                    sexuality: "",
                    age: "",
                    logoChannel: true
                });
                await bot.sendMessage(chatId, "خوش آمدید" + name + 'حالا تو یکی از اعضا تیم پروتیینی');
            } catch (error) {
                console.error('Error sending data to server:', error);
                await bot.sendMessage(chatId, 'مشکلی پیش آمده است.');
            }

            const welcomeMessage = `سلام, ${msg.from.first_name}! به ربات عکس ساز خوش آمدید `;
            bot.sendMessage(chatId, "با معرفی ما به دوستان خود از ما حمایت کنید .", {
                reply_markup: {
                    keyboard: [
                        [{text: 'بیا خیال پردازی کنیم(عکست رو تولید کن)'}],
                        [{text: 'پروفایلت رو تکمیل کن'}],
                        [{text: 'شارژ کردن حساب کاربری یا دعوت از دوستان'}],
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });
        }
        userStates.set(chatId, {
            isRequestingImage: false,
            isRequestingRecharge: false,
            isCompletingProfile: false,
            isInvitingFriend: false
        });

    } else if (text === 'عضو شدم') {
        // Check if the user is a member of the channel
        let isMember = await checkChannelMembership(chatId, msg.from.id);
        if (isMember) {
            bot.sendMessage(chatId, 'شما عضو کانال هستید. خوش آمدید!');

            try {
                await axios.post('http://localhost:3000/start', {
                    username: username,
                    name: name,
                    surName: surName,
                    sexuality: "",
                    age: "",
                    logoChannel: true
                });
                await bot.sendMessage(chatId, "خوش آمدید" + name + 'حالا تو یکی از اعضا تیم پروتیینی');
            } catch (error) {
                console.error('Error sending data to server:', error);
                await bot.sendMessage(chatId, 'مشکلی پیش آمده است.');
            }

            const welcomeMessage = `سلام, ${msg.from.first_name}! به ربات عکس ساز خوش آمدید `;
            bot.sendMessage(chatId, "با معرفی ما به دوستان خود از ما حمایت کنید .", {
                reply_markup: {
                    keyboard: [
                        [{text: 'بیا خیال پردازی کنیم(عکست رو تولید کن)'}],
                        [{text: 'پروفایلت رو تکمیل کن'}],
                        [{text: 'شارژ کردن حساب کاربری یا دعوت از دوستان'}],
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });


        } else {
            bot.sendMessage(chatId, `لطفا ابتدا عضو کانال ${channelUsername} شوید.`, {
                reply_markup: {
                    keyboard: [
                        [{text: 'عضو شدم'}]
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });
        }
    }

    if (text === 'بیا خیال پردازی کنیم(عکست رو تولید کن)') {
        // isRequestingMovie = true;
        userStates.set(chatId, {...userState, isRequestingImage: true});
        let message = "";

        bot.sendMessage(chatId, message);
        bot.sendMessage(chatId, 'لطفا توضیحات فیلم مورد نظر خود را یا قسمتی از ان که به یاد دارید به صورت خلاصه وارد کنید:');
    } else if (userState.isRequestingImage) {


    } else {
        // bot.sendMessage(chatId, 'انتخاب شما :  ' + text);
    }
});

bot.on('callback_query', async (callbackQuery) => {
    const gender = callbackQuery.data;
    const chatId = callbackQuery.message.chat.id;
    const userId = callbackQuery.from.id; // You can use the user's ID or username

    // Send the user's gender to your backend server
    try {
        await axios.post('http://localhost:3000/user-gender', {
            userId: userId,
            gender: gender
        });

        // Notify the user that their choice has been saved
        bot.sendMessage(chatId, `جنسیت شما ذخیره شد: ${gender}`);
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, 'متاسفانه خطایی رخ داده است.');
    }
});

async function checkChannelMembership(chatId, userId) {
    try {
        const member = await bot.getChatMember(channelUsername, userId);
        return member && (member.status === 'member' || member.status === 'administrator' || member.status === 'creator');
    } catch (error) {
        console.error('Error checking channel membership:', error);
        bot.sendMessage(chatId, 'خطا در بررسی عضویت کانال.');
        return false;
    }
}
