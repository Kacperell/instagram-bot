const puppeteer = require('puppeteer');

const BASE_URL = 'https://www.instagram.com/accounts/emailsignup/';
const TAG_URL = (tag) => `https://www.instagram.com/explore/tags/${tag}/`;

const instagram = {
    broweser: null,
    page: null,

    initialize: async () => {
        instagram.broweser = await puppeteer.launch({
            headless: false
        });

        instagram.page = await instagram.broweser.newPage();

    },

    login: async (username, password) => {
        await instagram.page.goto(BASE_URL, { waitUntil: 'networkidle2' });

        let loginButton = await instagram.page.$x('//a[contains(text(),"Zaloguj się")]');
        await loginButton[0].click();
        await instagram.page.waitForNavigation({ waitUntil: 'networkidle2' });
        await instagram.page.waitFor(1000);
        await instagram.page.type('input[name="username"]', username, { delay: 50 });
        await instagram.page.type('input[name="password"]', password, { delay: 50 });
        await instagram.page.waitFor(1500);


        let logbutton = await instagram.page.$x('//div[contains(text(),"Zaloguj się")]');
        await logbutton[0].click();
        await instagram.page.waitFor(1000);
        await instagram.page.waitFor('//span[contains(text(),"Szukaj")]');

    },

    likeTagsProcess: async (tags = []) => {
        for (let tag of tags) {
            await instagram.page.goto(TAG_URL(tag), { waitUntil: 'networkidle2' });
            await instagram.page.waitFor(600);
            let posts = await instagram.page.$$('article > div:nth-child(3)  img[decoding="auto"');

            for (let i = 0; i < 4; i++) {
                let post = posts[i];
                await post.click();
                await instagram.page.waitFor(500);
                let isLikable = await instagram.page.$('article div section span button svg[aria-label="Lubię to!"]');
                if (isLikable) {
                    await instagram.page.click('article div section span button');
                    console.log('click');
                }
                await instagram.page.waitFor(2000);
                await instagram.page.click('div[role="dialog"] > div:nth-child(3) button');
                await instagram.page.waitFor(600);
            }
            await instagram.page.waitFor(600);
        }

    }

}

module.exports = instagram;