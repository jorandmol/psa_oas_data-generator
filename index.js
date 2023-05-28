import { askFileName, askResource } from "./cli.js";
import { readFile, writeFile } from "fs/promises";
import { extractResources, generateData } from "./openai.js";

const INPUT_DIR = './input';
const OUTPUT_DIR = './output';

const main = async () => {
    console.log('🌐 Generate data through OpenAPI specification 🌐');

    // get filename
    const { filename } = await askFileName();
    
    // read the file
    let fileContent = "";
    try {
        fileContent = await readFile(`${INPUT_DIR}/${filename}`, 'utf8');
        console.log('🌐 File read correctly... 🌐');
    } catch {
        console.log('❌ Problem during file reading, check it is in "input" folder ❌');
        process.exit();
    }

    // get the resources from ChatGPT
    let resourceList = [];
    try {
        console.log('🌐 Waiting for ChatGPT response... 🌐');
        const gptResourcesResponse = await extractResources(fileContent);
        resourceList = JSON.parse(gptResourcesResponse).map(rr => rr.name);
    } catch {
        console.log('❌ Problem connecting with ChatGPT, check your usage rate ❌');
        process.exit();
    }
    const { resource } = await askResource(resourceList);
    
    // get the data
    let data = [];
    try {
        console.log('🌐 Waiting for ChatGPT response... 🌐');
        data = await generateData(resource);
    } catch (error) {
        console.log('❌ Problem connecting with ChatGPT, check your usage rate ❌');
        console.error(error);
        process.exit();
    }

    // store data in a json file
    const dataFilename = filename.split('.')[0] + '_data.json';
    try {
        writeFile(`${OUTPUT_DIR}/${dataFilename}`, data);
        console.log(`🌐 Data successfully loaded! Check ${OUTPUT_DIR} directory 🌐`);
    } catch {
        console.log('❌ Problem during file writing ❌');
        process.exit();
    }

    console.log('🌐 Process finished! 🌐');
};

main();