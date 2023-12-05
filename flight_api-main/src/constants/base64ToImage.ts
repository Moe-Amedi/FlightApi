import fs from "fs";
import { v4 as uuidv4 } from 'uuid';
import { storage_path } from "./static_url";

export function convertBase64ToImage(base64: string): string {
    // const base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCA"; // base64 image
    try {
        const base64Image: string | undefined = base64.split(';base64,').pop();
        
        if (base64Image === undefined) {
            throw new Error("error in convertBase64ToImage");
        }
        const imageBuffer = Buffer.from(base64Image, "base64");
        // get image extension
        const imageExtension = base64.split(';base64,')[0].split('/')[1];

        // image name in uuid format
        const imageName = `${uuidv4()}.${imageExtension}`;

        // image path
        const imagePath = `${storage_path}${imageName}`;

        fs.writeFileSync(imagePath, imageBuffer);

        return imageName;
    } catch (error) {
        // throw error;
        console.log(error);

        throw new Error("error in convertBase64ToImage");
    }
}


// convert multiple base64 to image
export function convertMultipleBase64ToImage(base64: string[]): string[] {
    
    let imageNames: string[] = [];
    try {
        if (base64.length === 0 || base64 === undefined || base64 === null) {
            return [];
        }
        base64.forEach((base64Single: string) => {
            if (!isImageBase64(base64Single)) {
                return imageNames.push(base64Single);
            }
            return imageNames.push(convertBase64ToImage(base64Single));
        });

        return imageNames;
    } catch (error) {
        console.log(error);
        throw new Error("error in convertMultipleBase64ToImage");
    }
}


function isImageBase64(img: string) {
    const regex = /^data:image\/(png|jpg|jpeg);base64,/;
    return regex.test(img);
}
