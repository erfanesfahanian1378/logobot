const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const token = '6439788591:AAHSXV8yBfR6pBoL9cVj1Hb3qZgqDNLDYNM';
const bot = new TelegramBot(token, {polling: true});
let ifItsJoined = false;
const userStates = new Map();
const channelUsername = '@imaginAi';
const messageChargeOption1 = "شارژ کردن کل حساب یا شارژ ربات لگو ساز";
const messageChargeByInvite = 'استفاده مجدد از روبات با دعوت از دوستان';
const waitingMessage = "پیام شما برای هنرمند سرزمین پروتیین ارسال شد کمی منتظر بمانید تا کارش تمام شود و عکس را برای شما یفرستد"
const addToCurrentImage = "اگر میخواهید توضیحاتی به عکس فعلی اضافه کنید تا هنرمند پروتیین لند برای شما تغییرش دهد دکمه ادامه توضیحات رو بزنید"
let introduction = "معرفی کوردرا: تصور کنید در دنیایی زندگی می کنید که با یک جمله ساده دنیایی از تخیلات خود را به تصویر می کشید. کوردرا بر پایه آخرین مدل های DALL.E دقیقا این امکان را برای شما فراهم میکند. 🌌✨ فقط کافیست یک توضیح متنی را به آن بدهید وناگهان شاهد خلق تصاویری از دنیاهای فانتزی و موجودات اسرار آمیز گرفته تا طراحی های مدرن و مناظر دل انگیز خواهید بود که از دل کلمات شما بیرون می آید. 🎨🖼 هر آنچه در ذهن دارید کوردرا می تواند آن را به تصویر تبدیل کند و به این ترتیب، شما را به جادوگری در عرصه خلق تصاویر تبدیل می کند. 🧙‍♂️🔮"+ "\n" + "🔥" + "توجه کنید که برای رسیدن به نتیجه دلخواهتان باید به بهترین شکل ممکن و با بیشترین جزییات تصویر مد نظرتان را توصیف کنید تا هنرمند ما بتواند هر چه در ذهن شما میگذرد پیاده سازی کند" + "🔥";
const joined = 'عضو شدم';
let mainMenu = 'منو اصلی';
let inviteAlert = 'کوردرایی عزیز باید حداقل ۵ نفر از دوستانت را با استفاده از لینک زیر به ربات ما دعوت کنی ';
let successInvite = "به حساب شما دسترسی مجدد به ربات کوردرا داده شد";
let makeImaginationReal = 'خیال پردازی هایت را به تصویر بکش';
let userProfile = 'حساب کاربری شما در سرزمین پروتیین';
let aboutUs = 'درباره ما';
let promoteUs = "با معرفی ما به دوستان خود از ما حمایت کنید .";
let continueExplainingOption = 'ادامه توضیحات';
let continueExplain = 'ادامه توضیحات رو بنویسید.';
let needDeCharge = 'خطا در ارسال پیام. سقف مجاز استفاده شما از ربات تمام شده باید شارژ کنید ';
let error = 'مشکلی پیش آمده است.';
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    let name = msg.from.first_name + "";
    let surName = msg.from.last_name + "";
    let username = msg.from.username;
    let welcomeMessage = "درود بر " + name + " 👋 " + " به خانواده پروتئین خوش آمدی، جایی که همراه با کنجکاوی و خلاقیت شما به فراتر از محدودیت های ممکن میرویم😎. بیایید با هم این سفر هیجان انگیز را به دنیای هوش مصنوعی اغاز کنیم.";
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


    if (text.startsWith('/start')) {
        console.log("this is id " + msg.from.id);
        console.log(msg.text)

        const args = msg.text.split(' '); // Splits the message into parts
        if (args.length > 1) {
            const referralId = args[1]; // The second part is the referral ID
            // Handle the referral logic here
            console.log(`User ${username || name} was referred by ${referralId}`);
            try {
                await axios.post('http://localhost:3000/invite', {
                    idChatInvitePerson: referralId,
                    idChatGuest: msg.from.id
                });
                console.log("its in the try");
            } catch (error) {
                console.log("its in the error");
                console.error('Error sending data to server:', error);
            }
        }
        console.log("its before is member");
        let isMember = await checkChannelMembership(chatId, msg.from.id);
        if (!isMember) {
            console.log("should be here");
            try {
                await axios.post('http://localhost:3000/start', {
                    username: username,
                    name: name,
                    surName: surName,
                    sexuality: "",
                    age: "",
                    idChat: msg.from.id
                });
            } catch (error) {
                console.error('Error sending data to server:', error);
            }
            bot.sendMessage(chatId, `لطفا ابتدا عضو کانال ${channelUsername} شوید.`, {
                reply_markup: {
                    keyboard: [
                        [{text: joined}]
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });
        } else {
            console.log("is it in else ?");
            try {
                await axios.post('http://localhost:3000/start', {
                    username: username,
                    name: name,
                    surName: surName,
                    sexuality: "",
                    age: "",
                    logoChannel: true,
                    idChat: msg.from.id
                });
                await bot.sendMessage(chatId, welcomeMessage);
            } catch (error) {
                console.error('Error sending data to server:', error);
                await bot.sendMessage(chatId, error);
            }
            await sendCustomMessage(bot, chatId);
        }
        userStates.set(chatId, {
            isRequestingImage: false,
            isRequestingRecharge: false,
            isCompletingProfile: false,
            isInvitingFriend: false
        });

    } else if (text === joined) {
        console.log("this is id " + msg.from.id);
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
                    logoChannel: true,
                    idChat: msg.from.id
                });
                await bot.sendMessage(chatId, welcomeMessage);
            } catch (error) {
                console.error('Error sending data to server:', error);
                await bot.sendMessage(chatId, error);
            }

            await bot.sendMessage(chatId, welcomeMessage);
            await sendCustomMessage(bot, chatId);


        } else {
            bot.sendMessage(chatId, `لطفا ابتدا عضو کانال ${channelUsername} شوید.`, {
                reply_markup: {
                    keyboard: [
                        [{text: joined}]
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });
        }
    }

    if (text === makeImaginationReal) {
        console.log("this is id " + msg.from.id);
        let isMember = await checkChannelMembership(chatId, msg.from.id);
        if (!isMember) {
            bot.sendMessage(chatId, `لطفا ابتدا عضو کانال ${channelUsername} شوید.`, {
                reply_markup: {
                    keyboard: [
                        [{text: joined}]
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });
        } else {
            userStates.set(chatId, {...userState, isRequestingImage: true});
            await bot.sendMessage(chatId, introduction);
        }


    } else if (userState.isRequestingImage) {
        console.log(userState.lastText);
        try {
            await bot.sendMessage(chatId, waitingMessage);

            const response = await axios.post('http://localhost:3000/dall', {
                prompt: userState.lastText + text,
                idChat: msg.from.id
            });
            await bot.sendMessage(chatId, `پاسخ هنر مند پروتیین به شما:  ${response.data}`);
            let describe = userState.lastText + "" + text
            let forwardMessage = `درخواست کاربران به هنرمند پروتیین: ${describe}\nجواب هنرمندمون: ${response.data}`;
            await bot.sendMessage(channelUsername, forwardMessage);
            bot.sendMessage(chatId, addToCurrentImage, {
                reply_markup: {
                    keyboard: [
                        [{text: continueExplainingOption}],
                        [{text: mainMenu}],
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });


        } catch (error) {
            console.error('Error sending data to server:', error);
            await bot.sendMessage(chatId, needDeCharge, {
                reply_markup: {
                    keyboard: [
                        [{text: messageChargeOption1}],
                        [{text: messageChargeByInvite}],
                        [{text: mainMenu}],
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });
            // await sendCustomMessage(bot, chatId);
            // await bot.sendMessage(chatId, error.response.data.error);
        }
        userStates.set(chatId, {...userState, isRequestingImage: false, lastText: text});

    } else if (text === mainMenu) {
        userStates.set(chatId, {...userState, lastText: ""});
        await sendCustomMessage(bot, chatId);
    } else if (text === continueExplainingOption) {
        await bot.sendMessage(chatId, continueExplain);
        userStates.set(chatId, {...userState, isRequestingImage: true});
    } else if (text === userProfile) {
        // localhost:3000/messages?userName=Nothingtoexplaintoyou
        let textProfile = "";
        try {
            const url = 'http://localhost:3000/messages?idChat=' + encodeURIComponent(msg.from.id);
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
                        [{text: messageChargeOption1}],
                        [{text: messageChargeByInvite}],
                        [{text: mainMenu}],
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });
        } catch (error) {
            console.error('Error fetching data:', error);
            await bot.sendMessage(chatId, 'خطا پیش آمده ');
        }
    } else if (text === messageChargeByInvite) {
        let inviteCompletedOrNot = false;
        try {
            await axios.get('http://localhost:3000/invite?idChat=' + msg.from.id);
            inviteCompletedOrNot = true;
            console.log("checkCompleted");
        } catch (error) {
            console.log("WEEEEEEEEEEEEEEEE");
            console.error('Error sending data to server:', error);
        }
        if (inviteCompletedOrNot) {
            bot.sendMessage(chatId, successInvite);
            sendCustomMessage(bot, chatId);
        } else {
            bot.sendMessage(chatId, inviteAlert);
            const referralLink = `https://t.me/AiImageLogoCreator_bot?start=${msg.from.id}`;
            // Send the referral link with the message in Persian
            bot.sendMessage(chatId, `از دوستانت دعوت کن: ${referralLink}`);
            sendCustomMessage(bot, chatId);
        }
    } else {
    }
});

async function sendCustomMessage(bot, chatId) {
    await bot.sendMessage(chatId, promoteUs, {
        reply_markup: {
            keyboard: [
                [{text: makeImaginationReal}],
                [{text: userProfile}],
                [{text: aboutUs}]
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
