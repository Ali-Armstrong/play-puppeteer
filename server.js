const express = require("express");
const puppeteer = require("puppeteer");
const app = express();

//check this out for creating dynamic pages from node and generating pdfs
//https://www.freecodecamp.org/news/how-to-generate-an-html-table-and-a-pdf-with-node-google-puppeteer-32f94d9e39f6/

app.get("/pdf", async (req, res) => {
    const url = req.query.target;
    
    console.time("launching puppeteer")
    const browser = await puppeteer.launch({
        headless: true
    });
    console.timeEnd("launching puppeteer")

    console.time("opening page")
    const webPage = await browser.newPage();
    console.timeEnd("opening page")

    console.time("loading page")
    await webPage.goto(url, {
        waitUntil: "networkidle0"
    });
    console.timeEnd("loading page")
    
    console.time("generating PDF")
    const pdf = await webPage.pdf({
        printBackground: true,
        format: "Letter",
        margin: {
            top: "20px",
            bottom: "40px",
            left: "20px",
            right: "20px"
        }
    });
    console.timeEnd("generating PDF");

    console.time("closing browser")
    await browser.close();
    console.timeEnd("closing browser")

    res.contentType("application/pdf");
    res.send(pdf);
})

app.listen(3000, () => {
    console.log("Server started");
});