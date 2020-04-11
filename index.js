const ig = require('./instagram');

(async () => {

    await ig.initialize();
    await ig.login("login", "password");
    await ig.likeTagsProcess(["tag1", "tag2"]);
})()