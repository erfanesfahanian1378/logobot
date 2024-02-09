const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const token = '6439788591:AAHSXV8yBfR6pBoL9cVj1Hb3qZgqDNLDYNM';
const bot = new TelegramBot(token, {polling: true});
let ifItsJoined = false;
const userStates = new Map();
const channelUsername = '@imaginAi';
const channelUsername2 = '@ProteinTeam';
const messageChargeOption1 = "شارژ حساب کاربری | Charge your account";
const messageChargeByInvite = 'استفاده مجدد از ربات با دعوت دوستان\ninvite friends to get free subscription';
let waitingMessage = "پیامت برای هنرمند سرزمین پروتئین ارسال شد یه کوچولو دندون رو جیگر بزار تا کارش تموم بشه و عکس رو برات بفرسته🤩\n\nYour message has been sent to the artist of Protein Land. Just hang in there a little longer, and they'll wrap up their work. They'll send you the photo 🤩.";
let addToCurrentImage = "📣 اگه میخوای رو عکست تغییر بیشتری بدی یا چیزی بهش اضافه کنی، گزینه «ادامه توضیحات» رو بزن😎\n\n📣 If you want to make further changes or add something to your photo, hit the 'More Details' option 😎.";
let introduction = "✨تصور کنید در دنیایی زندگی می کنید که با یک جمله ساده دنیایی از تخیلات خود را به تصویر می کشید. کوردرا بر پایه آخرین مدل های DALL.E مبتنی بر هوش مصنوعی دقیقا این امکان را برای شما فراهم میکند. 🌌✨\n\n🎨 هر آنچه در ذهن دارید کوردرا می تواند آن را به تصویر تبدیل کند و به این ترتیب، شما را به جادوگری در عرصه خلق تصاویر تبدیل می کند. 🧙‍♂️🔮\n\n🤖فقط کافیست یک توضیح متنی را به آن بدهید و ناگهان شاهد خلق تصاویری از دنیا های فانتزی و موجودات اسرار آمیز گرفته تا طراحی های مدرن و مناظر دل انگیز خواهید بود که از دل کلمات شما بیرون می آید. 🤩\n\n🔥توجه کنید که برای رسیدن به بهترین نتیجه ممکن باید به بهترین حالت ممکن و با بیشترین جزییات تصویر مد نظرتان را توصیف کنید تا کوردرا بتواند هر چه در ذهن شما میگذرد را پیاده سازی کند🔥\n\nPicture a world where a single sentence sparks vivid imagination. CORDRAW, inspired by the latest DALL·E models, grants you this power precisely. 🌌✨\n\n🎨 Describe anything, and CORDRAW transforms it, making you a wizard of visual storytelling. 🧙‍♂️🔮\n\n🤖 Just write, and watch as CORDRAW brings your ideas to life from fantastical realms to modern scenes all from your words. 🤩\n\n🔥For best results, describe with detail so CORDRAW can capture every nuance of your vision.🔥";
const joined = 'عضو شدم';
let mainMenu = 'منو اصلی | Main Menu';
let inviteAlert = 'کوردرایی عزیز باید حداقل ۲ نفر از دوستانت را با استفاده از لینک زیر به ربات ما دعوت کنی ';
let successInvite = "به حساب شما دسترسی مجدد به ربات کوردرا داده شد";
let makeImaginationReal = 'خیال پردازی هایت را به تصویر بکش 🎨👨🏻‍🎨 | 🎨👨🏻‍🎨 Draw your imagination';
let userProfile = 'حساب کاربری شما📖✏️|Your profile';
let aboutUsText = `
ما در پروتئین، یک تیم پویا و نوآور در عرصه هوش مصنوعی هستیم. 🚀👨‍💻👩‍💻 با ارائه خدمات و سرویس‌های متنوع و خلاقانه، 🌟🛠️ می‌کوشیم تا دسترسی عموم جامعه به ابزارهای پیشرفته هوش مصنوعی را فراهم آوریم. هدف ما، تسهیل فعالیت‌های حرفه‌ای افراد شاغل از طریق به کارگیری قدرت هوش مصنوعی است. 💡🤖💼 ما بر این باوریم که هر فردی باید بتواند از مزایای این فناوری شگفت‌انگیز به نفع خود و جامعه‌اش بهره ببرد. 🌍❤️ با ما همراه باشید تا با هم آینده‌ای روشن‌تر و هوشمندتر بسازیم. 🌈🛠️🔮

At Protein, we are a dynamic and innovative team in the field of AI. 🚀👨‍💻👩‍💻 Offering a variety of creative services and solutions, 🌟🛠️ we strive to provide the public access to advanced AI tools. Our goal is to facilitate professional activities for working individuals by leveraging the power of AI. 💡🤖💼 We believe that everyone should have the opportunity to benefit from the wonders of this incredible technology for their own and societal good. 🌍❤️ Join us in building a brighter and smarter future together. 🌈🛠️🔮
`;
let aboutUs = 'درباره ما | about us';
let promoteUs = "با معرفی ما به دوستان خود از ما حمایت کنید . پس از دعوت از دوستان برای فعال شدن اشتراک دوباره به منو دعوت از دوستان مراجعه کنید. \n\n Support us by introducing us to your friends for activating your subscription after inviting your friends go to the invite your friends menu.";
let continueExplainingOption = 'ادامه توضیحات';
let continueExplain = 'ادامه توضیحات رو بنویسید. | Tell me more';
let needDeCharge = 'خطا در ارسال پیام. سقف مجاز استفاده شما از ربات تمام شده باید شارژ کنید یا از منو حساب کاربری از دوستان خود دعوت کنید که در ربات عضو شوند' + 'need to recharge your account go to your profile recharge your account or invite friends.';
let error = 'مشکلی پیش آمده است.';
let plansMessage = "";
let introductionPayment = "شما میتوانید به صورت کلی اکانت خود را شارژ کنید که بتوانید از آن در تمامی ربات های ما که به زودی تا ۱۵ اسفند لانچ میشوند استفاده کنید یا این که فقط اشتراکی برای اکانت کوردرا خود بگیرید یا از دوستان خود دعوت کنید تا بتوانید اشتراک رایگان دریافت کنید"
let channelJoin = `لطفا ابتدا عضو کانال‌های ${channelUsername} و ${channelUsername2} شوید.` + 'join these channels to use the bot';
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    let name = msg.from.first_name + "";

    plansMessage = `سلام ${name} عزیز! 🌈
خوشحالیم که می‌خوای با ما همراه باشی. برای شارژ حساب کاربریت و استفاده از 30 درخواست از ربات، فقط کافیه 44 هزار تومان به شماره کارت زیر واریز کنی و فیش پرداختی رو برامون ارسال کنی. 😊💳
شماره کارت: 🏦
5054 1610 1394 1236
نام صاحب کارت: ✨
عرفان اصفهانیان
به محض اینکه فیش پرداختی رو به اکانت زیر در تلگرام بفرستی، حساب کاربریت شارژ می‌شه. ⏰🚀
@nothingtoexplaintoyou
اگر خارج از ایران هستی و دوست داری از ربات ما استفاده کنی، لطفاً به آیدی زیر پیام بده تا روش‌های پرداخت بین‌المللی رو برات توضیح بدیم. 🌍💬
برای اطلاعات بیشتر پیام بده:
@nothingtoexplaintoyou
مرسی که پروتئینی  هستی!  🎉💐

Hello dear ${name}! 🌈

We're thrilled that you want to join us. To recharge your user account and enjoy 30 requests, you just need to transfer 1 Euro to the following IBAN number and send us the payment receipt. 😊💳

IBAN Number:
LT023250069833288118

As soon as you send the payment slip to our account on Telegram, your user account will be charged within a maximum of one hour. ⏰🚀
@nothingtoexplaintoyou

Thank you for being awesome! 🎉💐`;


    let surName = msg.from.last_name + "";
    let username = msg.from.username;
    let welcomeMessage = "✨درود بر " + name + " 👋 به کوردرا از خانواده پروتئین خوش آمدی\nجایی که همراه با کنجکاوی و خلاقیت شما به فراتر از محدودیت های ممکن میرویم😎\n✨بیایید با هم این سفر هیجان انگیز را به دنیای هوش مصنوعی آغاز کنیم🔥\n\n🎯 برای کار با ربات کوردرا در منو، گزینه «خیال پردازی هایت را به تصویر بکش» را انتخاب کن.✨✨";
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
                await axios.post('http://localhost:3001/invite', {
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
        let isMember2 = await checkChannelMembership2(chatId, msg.from.id);
        if (!(isMember && isMember2)) {
            console.log("should be here");
            try {
                await axios.post('http://localhost:3001/start', {
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
            bot.sendMessage(chatId, channelJoin, {
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
                await axios.post('http://localhost:3001/start', {
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
        let isMember2 = await checkChannelMembership2(chatId, msg.from.id);
        if (isMember && isMember2) {

            try {
                await axios.post('http://localhost:3001/start', {
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

            // await bot.sendMessage(chatId, welcomeMessage);
            await sendCustomMessage(bot, chatId);


        } else {
            bot.sendMessage(chatId, channelJoin, {
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
        let isMember2 = await checkChannelMembership2(chatId, msg.from.id);
        if (!(isMember && isMember2)) {
            bot.sendMessage(chatId, channelJoin, {
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

            const response = await axios.post('http://localhost:3001/dall', {
                prompt: userState.lastText + text,
                idChat: msg.from.id
            });
            await bot.sendMessage(chatId, `پاسخ هنرمند پروتیین به شما:  ${response.data}`);
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
        console.log("here");
        let textProfile = "";
        try {
            const url = 'http://localhost:3001/messages?idChat=' + encodeURIComponent(msg.from.id);
            const response = await axios.get(url);
            console.log(response.data[0]);
            let ProteinTeam = response.data[0].name; // Assuming this is how you get the team's name


            textProfile = `سلام ${ProteinTeam} عزیز

وضعیت اشتراک های شما در محصولات پروتئین:

🟢 تعداد دفعات مجاز برای استفاده از ربات کوردرا 🌉 : ${response.data[0].tokenDallE} بار

🔵 تعداد دفعات مجاز برای استفاده از ربات درگوشی🖋 : ${response.data[0].tokenTextGenerator} بار

🟠 تعداد دفعات مجاز برای استفاده از ربات فیلم یاب🎥 : ${response.data[0].tokenFilmYab} بار

🔴 تعداد دفعات مجاز برای استفاده از ربات ریاضی دان🎒 : ${response.data[0].tokenMath} بار

🟣 تعداد دفعات مجاز برای استفاده از ربات دکتر و ازمایش خوان💉 : ${response.data[0].tokenBloodTest} بار

🔶 موجودی حساب کاربری شما💰💸 : 🟣 تعداد دفعات مجاز برای استفاده از ربات دکتر و ازمایش خوان💉 : ${response.data[0].universalWallet} تومان

📣 اگر دوست داری کلی از ربات کوردرا، رایگان استفاده کنی فقط کافیه 2 نفر از دوستانت را عضو کنی🤩🔥

Dear ${ProteinTeam},

Here's the status of your subscriptions for Protein products:

🟢 Allowed uses for Cordraw Bot 🌉: ${response.data[0].tokenDallE} times

🔵 Allowed uses for Chatter Bot 🖋: ${response.data[0].tokenTextGenerator} times

🟠 Allowed uses for the Film Finder Bot 🎥: ${response.data[0].tokenFilmYab} times

🔴 Allowed uses for the Math Wizard Bot 🎒: ${response.data[0].tokenMath} times

🟣 Allowed uses for the Doctor and Lab Test Bot 💉: ${response.data[0].tokenBloodTest} times

🔶 Your account balance 💰💸: ${response.data[0].universalWallet} Euros

📣 If you'd like to use all of Protein Bots for free, just invite 2 friends to join!🔥🤩`;


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
            await axios.get('http://localhost:3001/invite?idChat=' + msg.from.id);
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
    } else if (text === aboutUs) {
        await bot.sendMessage(chatId, aboutUsText);
        sendCustomMessage(bot, chatId);
    } else if (text === messageChargeOption1) {
        await bot.sendMessage(chatId, introductionPayment);
        await bot.sendMessage(chatId, plansMessage);
        sendCustomMessage(bot, chatId);
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
        await axios.post('http://localhost:3001/user-gender', {
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

async function checkChannelMembership2(chatId, userId) {
    try {
        const member = await bot.getChatMember(channelUsername2, userId);
        return member && (member.status === 'member' || member.status === 'administrator' || member.status === 'creator');
    } catch (error) {
        console.error('Error checking channel membership:', error);
        bot.sendMessage(chatId, 'خطا در بررسی عضویت کانال.');
        return false;
    }
}
