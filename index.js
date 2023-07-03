const Crawler = require("crawler");
const fs = require('fs');
const path = require('path');
let obselete = []; // Array of what was crawled already

let c = new Crawler();

const writeFile = (filePath, fileContent) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, fileContent, writeFileError => {
            if (writeFileError) {
                reject(writeFileError);
                return;
            }

            resolve(filePath);
        });
    });
}

function crawlAllUrls(url) {
    console.log(`Crawling ${url}`);
    c.queue({
        uri: url,
        callback: function (err, res, done) {
            if (err) throw err;
            let $ = res.$;
            try {
                let urls = $("a");
                Object.keys(urls).forEach((item) => {
                    if (urls[item].type === 'tag') {
                        let href = urls[item].attribs.href;
                        if (href && !obselete.includes(href)) {
                            href = href.trim();
                            obselete.push(href);
                            // Slow down the
                            setTimeout(function () {
                                href.startsWith('http') ? crawlAllUrls(href) : crawlAllUrls(`${url}${href}`) // The latter might need extra code to test if its the same site and it is a full domain with no URI
                            }, 5000)

                        }
                    }
                });
            } catch (e) {
                console.error(`Encountered an error crawling ${url}. Aborting crawl.`);
                done()

            }
            done();
        }
    })
}

writeFile('./data/lynda.courses.json', JSON.stringify(obselete, null, 2)).then(()=>{ console.log("wrote file")}).catch((e) => { });



crawlAllUrls('https://lynda.com/')
