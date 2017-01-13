export default class PhidiasColorUtils {
    constructor() {}

    static isValidCssColour(stringToTest) {
       if (stringToTest === ""){
            return false; 
        }
        if (stringToTest === "inherit"){
            return false; 
        }
        if (stringToTest === "transparent"){
            return false; 
        }

        var isValid = false;

        var image = document.createElement("img");
        image.style.color = "rgb(0, 0, 0)";
        image.style.color = stringToTest;
        if (image.style.color !== "rgb(0, 0, 0)"){ 
            isValid = true; 
        }

        if(!isValid){
            image.style.color = "rgb(255, 255, 255)";
            image.style.color = stringToTest;
            isValid =  image.style.color !== "rgb(255, 255, 255)";
        }

        return isValid; 
    }
    
    static getTextColorForBG(hexcolor){
        //*******************************
        //working only with hex colors by now :S
        //*******************************
        
        if(hexcolor[0] != "#"){
            hexcolor = "#" + hexcolor;
        }
        
        if(hexcolor.length < 4 || hexcolor.length > 7 ){
            return "#000";
        }
        
        if(hexcolor.length === 4){
            hexcolor = String(hexcolor[0]) + String(hexcolor[1]) + String(hexcolor[1]) + String(hexcolor[2]) + String(hexcolor[2]) + String(hexcolor[3]) + String(hexcolor[3]);
        }
        
        if(this.isValidCssColour(hexcolor)){
            let r = parseInt(hexcolor.substr(1,2),16);
            let g = parseInt(hexcolor.substr(3,2),16);
            let b = parseInt(hexcolor.substr(5,2),16);

            let yiq = ((r*299)+(g*587)+(b*114))/1000;
            return (yiq >= 128) ? "#000" : "#fff";
        }else{
            return "#000";
        }
        
    }
    
    static createColorGradient(frequency1, frequency2, frequency3,phase1, phase2, phase3,center, width, len){
        //from http://krazydad.com/tutorials/makecolors.php
        
        if(center == undefined){
            center = 128;
        }
        
        if(width == undefined){
            width = 127;
        }
        
        if(len == undefined){
            len = 50;
        }

        var result = [];

        for (var i = 0; i < len; ++i){
            let red = Math.sin(frequency1*i + phase1) * width + center;
            let green = Math.sin(frequency2*i + phase2) * width + center;
            let blue = Math.sin(frequency3*i + phase3) * width + center;
            
            result.push( "#" +  ("0" + parseInt(red,10).toString(16)).slice(-2) +  ("0" + parseInt(green,10).toString(16)).slice(-2) +  ("0" + parseInt(blue,10).toString(16)).slice(-2));
        }

        return result;
    }
    
    static getColorsList(numberOfColors){
        //use predefined values to get a list of different colors, acording to http://krazydad.com/tutorials/makecolors.php
        
        return this.createColorGradient(1.4, 2.4, 3.4, 0, 2, 4, 176, 79, numberOfColors);
    }
}

