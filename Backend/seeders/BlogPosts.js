const axios = require('axios');

function convertToJSX(bodyHtml) {
    const jsxCode = `${bodyHtml
        .replace(/\n/g, ' ')
        .replace(/"/g, '\'')
        .replace(/<a /g, "<a target='_blank' ")}`;

    return jsxCode;
}

async function fetchData() {
    const apiUrl = 'https://dev.to/api/articles?limit=100&page=25';
    const response = await axios.get(apiUrl);
    const articles = response.data;

    const blogposts = [];

    for (const article of articles) {
        const articleId = article.id;
        const articleUrl = `https://dev.to/api/articles/${articleId}`;
        const articleResponse = await axios.get(articleUrl);
        const articleData = articleResponse.data;

        const title = articleData.title;
        const description = articleData.description;
        const socialImage = articleData.social_image;
        const tags = articleData.tag_list;
        const bodyHtml = articleData.body_html;
        const author = articleData.user.name;
        const image = articleData.social_image;

        // console.log({bodyHtml: convertToJSX(bodyHtml)});
        // console.log({images: [{ path: image }]})

        blogposts.push({
            title: title,
            description: description,
            socialImage: socialImage,
            tags: tags,
            body_html: convertToJSX(bodyHtml),
            author: author,
            images: [{ path: image }]
        });
    }

    // console.log(blogposts.bodyHtml)
    return blogposts;
}

// fetchData()

module.exports = fetchData;
