// i kinda shit this out in an hour don't really expect anything top notch

import puppeteer, { executablePath } from 'puppeteer';
import fs from 'fs';
import YAML from 'yaml';
import jsPDF, { ImageOptions } from "jspdf";

async function main() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const viewport = await page.viewport();
    if(viewport == null) {
        console.log("Failed to get viewport of page due to an unknown error");
        process.exit(1);
    }
    
    // if the results directories don't exist, make them.
    if (!fs.existsSync("result")) fs.mkdirSync("result");
    if (!fs.existsSync("result/images")) fs.mkdirSync("result/images");
    if (!fs.existsSync("result/pdfs")) fs.mkdirSync("result/pdfs");

    let file: string;
    try {
        file = fs.readFileSync('./slides.yml', 'utf8');
    } catch(ex) {
        let e = ex as Error;
        console.log(e.message);
        process.exit(1);
    }

    let options = YAML.parse(file);

    if(typeof options["slides"] === undefined) {
        console.log("No slides given.");
        return;
    }

    let o: number = 0;

    for (let index in options["slides"]) {
        const doc = new jsPDF();
        var width = doc.internal.pageSize.getWidth();
        var height = doc.internal.pageSize.getHeight();
        let img_height = height/2;

        let time: number = Date.now();

        let slide: string = options["slides"][index];
        console.log("Screenshotting "+slide+"...");
        await page.goto(slide);

        let next_btn = await page.$(".punch-viewer-navbar-next");
        if(next_btn == null) {
            console.log("No next button was found on this page. We've saved the page itself to error.png. Is it a public Google slide?");
            await page.screenshot({
                path: "error.png",
                type: "png",
            });
            process.exit(1);
        }

        let counter = await page.$(".docs-material-menu-button-flat-default-caption");
        if(counter == null) {
            console.log("No counter was found. We've saved the page itself to error.png. Is it a public Google slide?");
            await page.screenshot({
                path: "error.png",
                type: "png",
            });
            process.exit(1);
        }

        let selectable: Boolean = true;
        let n: number = -1;
        let temp_height: number = 0;

        while(selectable) {
            let count: number = await counter.evaluate(el => +(el.innerHTML));
            
            if(n != count) {
                n++;
                let path: string = "./result/images/screenshot-"+o+"-"+n+".png";
                console.log("Saving "+path);
                await page.screenshot({
                    path: path,
                    type: "png",
                });
                let imgData = fs.readFileSync(path).toString("base64");
                doc.addImage(imgData,"PNG",0,temp_height,width,img_height);
                temp_height += img_height;
                if(temp_height > img_height) {
                    doc.addPage();
                    temp_height = 0;
                }
            }
            next_btn.click();
            selectable = await next_btn.evaluate(el => !el.classList.contains("goog-flat-button-disabled"));
        }
        doc.save("./result/pdfs/"+o+"-"+time+".pdf");
        console.log("Saved ./result/pdfs/"+o+"-"+time+".pdf")

        o += 1;
    }

    process.exit();
}

main();