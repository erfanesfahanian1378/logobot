const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
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
            isInvitingFriend: false,
            lastText: ""
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
            await sendCustomMessage(bot, chatId);
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
            await bot.sendMessage(chatId, welcomeMessage);
            await sendCustomMessage(bot, chatId);


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
        let isMember = await checkChannelMembership(chatId, msg.from.id);
        if (!isMember) {
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
            userStates.set(chatId, {...userState, isRequestingImage: true});
            let message = "سلام رفیق اینجا پروتیین لند قسمت هنر های تجسمیه بهم بگو تو ذهنت چی میگذره تا من بکشمش هر چی دوست داری برات میکشم از طراحی نمای یک ویلا بگیر تا هر چیز عجیب و غریبی که دوسش داشته باشی ولی یادت باشه باید خیلی دقیق برام توصیفش کنی";
            await bot.sendMessage(chatId, message);
        }


    } else if (userState.isRequestingImage) {
        console.log(userState.lastText);
        try {
            await bot.sendMessage(chatId, "پیام شما برای هنرمند سرزمین پروتیین ارسال شد کمی منتظر بمانید تا کارش تمام شود و عکس را برای شما یفرستد");

            const response = await axios.post('http://localhost:3000/dall', {
                prompt: userState.lastText + text,
                username: username
            });
            await bot.sendMessage(chatId, `پاسخ هنر مند پروتیین به شما:  ${response.data}`);
            let describe = userState.lastText + "" + text
            let forwardMessage = `درخواست کاربران به هنرمند پروتیین: ${describe}\nجواب هنرمندمون: ${response.data}`;
            await bot.sendMessage(channelUsername, forwardMessage);
            bot.sendMessage(chatId, "اگر میخواهید توضیحاتی به عکس فعلی اضافه کنید تا هنرمند پروتیین لند برای شما تغییرش دهد دکمه ادامه توضیحات رو بزنید", {
                reply_markup: {
                    keyboard: [
                        [{text: 'ادامه توضیحات'}],
                        [{text: 'منو اصلی'}],
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });


        } catch (error) {
            console.error('Error sending data to server:', error);
            await bot.sendMessage(chatId, 'خطا در ارسال پیام. سقف مجاز استفاده شما از ربات تمام شده باید شارژ کنید ');
            await sendCustomMessage(bot, chatId);
            // await bot.sendMessage(chatId, error.response.data.error);
        }
        userStates.set(chatId, {...userState, isRequestingImage: false, lastText: text});

    } else if (text === 'منو اصلی') {
        userStates.set(chatId, {...userState, lastText: ""});
        await sendCustomMessage(bot, chatId);
    } else if (text === 'ادامه توضیحات') {
        await bot.sendMessage(chatId, 'ادامه توضیحات رو بنویسید.');
        userStates.set(chatId, {...userState, isRequestingImage: true});
    } else if (text === 'حساب کاربری شما در سرزمین پروتیین') {
        // localhost:3000/messages?userName=Nothingtoexplaintoyou
        let textProfile = "";
        try {
            const url = 'http://localhost:3000/messages?userName=' + encodeURIComponent(username);
            const response = await axios.get(url);
            console.log(response.data[0]);
            textProfile = textProfile + "سلام پروتيینی عزیز چطوری خوش میگذره ؟ میبینم که حسابی داری از هنرمند سرزمین پروتیین کار میکشی امیدوارم از بقیه ربات های سرزمین پروتیین هم به خوبی استفاده کنی "
            textProfile = textProfile + " " + response.data[0].name + ' عزیز';
            textProfile = textProfile + "\n" + "وضعیت اشتراک های شما در سرزمین پروتیین"
            textProfile = textProfile + "\n" + " تعداد دفعات مجاز برای استفاده از ربات عکس ساز🌉 : " + response.data[0].tokenDallE + " بار"
            textProfile = textProfile + "\n" + " تعداد دفعات مجاز برای استفاده از ربات فیلم یاب🎥 : " + response.data[0].tokenFilmYab + " بار"
            textProfile = textProfile + "\n" + " تعداد دفعات مجاز برای استفاده از ربات ریاضی دان🎒 : " + response.data[0].tokenMath + " بار"
            textProfile = textProfile + "\n" + " تعداد دفعات مجاز برای استفاده از ربات نویسنده و مترجم🖋 : " + response.data[0].tokenTextGenerator + " بار"
            textProfile = textProfile + "\n" + " تعداد دفعات مجاز برای استفاده از ربات دکتر و ازمایش خوان💉 : " + response.data[0].tokenBloodTest + " بار"
            textProfile = textProfile + "\n" + "موجودی حساب کاربری شما💰💸 :" + response.data[0].universalWallet + " تومان"
            textProfile = textProfile + "\n" + "حالا اگه بخوای میتونی یا تک به تک برای هر کدوم از ربات ها اشتراک ماهانه بخری یا این که حساب کاربریت رو شارژ کنی تا هر موقع به هر رباتی نیاز داشتی و تعداد دفعات استفاده رایگانت تمام شده بود از موجودی حساب کاربریت استفاده کنی."
            await bot.sendMessage(chatId, textProfile, {
                reply_markup: {
                    keyboard: [
                        [{text: 'شارژ کردن کل حساب یا شارژ روبات لگو ساز'}],
                        [{text: 'استفاده مجدد از روبات با دعوت از دوستان'}],
                        [{text: 'مشاهده تعرفه ها'}],
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });
        } catch (error) {
            console.error('Error fetching data:', error);
            await bot.sendMessage(chatId, 'خطا پیش آمده ');
        }
    } else if (text === 'استفاده مجدد از روبات با دعوت از دوستان') {
        console.log("it is working");
    } else {
    }
});

async function sendCustomMessage(bot, chatId) {
    await bot.sendMessage(chatId, "با معرفی ما به دوستان خود از ما حمایت کنید .", {
        reply_markup: {
            keyboard: [
                [{text: 'بیا خیال پردازی کنیم(عکست رو تولید کن)'}],
                [{text: 'حساب کاربری شما در سرزمین پروتیین'}],
                [{text: 'درباره ما'}]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    });
}


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
