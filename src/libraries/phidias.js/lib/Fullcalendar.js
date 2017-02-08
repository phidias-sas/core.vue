import PhidiasColorUtils from "./Colors.js";
import PhidiasDOMUtils from "./Dom.js";

export default class PhidiasFullCalendarUtils {
    
    static prepareSources(eventSources){
        
        var defaultColors = PhidiasColorUtils.getColorsList(eventSources.length > 0 ? eventSources.length : 50);
        var lastColorUsed = -1;
        var defaultName = "Calendar";
        var sessionCache = (typeof window.sessionStorage !== "undefined");
        
        eventSources.forEach( (source, index) => {
            if(!eventSources[index].hasOwnProperty("title")){
                eventSources[index].title =  defaultName + " " + index;
            }
            
            if(sessionCache){
                let cache = sessionStorage.getItem(eventSources[index].title);
                
                if(cache !== null){
                    eventSources[index].enabled = JSON.parse(cache);
                }
            }
            
            if(!eventSources[index].hasOwnProperty("enabled")){
                eventSources[index].enabled = true;
            }
            
            if(!eventSources[index].hasOwnProperty("id")){
                eventSources[index].id = PhidiasDOMUtils.generateUUID();
            }
            
            if(!eventSources[index].hasOwnProperty("color")){
                eventSources[index].color = defaultColors[lastColorUsed += 1];
            }else{
                if(!PhidiasColorUtils.isValidCssColour(source.color)){
                    //lets asume bad formating from api
                    if(String(source.color).length == 6){
                        let fixedColor = "#" + String(source.color);
                        
                        if(!PhidiasColorUtils.isValidCssColour(fixedColor)){
                            eventSources[index].color = defaultColors[lastColorUsed += 1];
                        }else{
                            eventSources[index].color = fixedColor;
                        }
                    }else{
                        eventSources[index].color = defaultColors[lastColorUsed += 1];
                    }
                }
            }
            
            if(!eventSources[index].hasOwnProperty("textColor")){
                eventSources[index].textColor = PhidiasColorUtils.getTextColorForBG(eventSources[index].color);
            }else{
                if(!PhidiasColorUtils.isValidCssColour(source.textColor)){
                    eventSources[index].textColor = PhidiasColorUtils.getTextColorForBG(eventSources[index].color);
                }
            }
            
        });
        
        return eventSources;
    }
    
    static injectSources(fullCalendarInstance, eventSources){
        var sessionCache = (typeof window.sessionStorage !== "undefined");
        
        eventSources.forEach( (source, index) => {
            
            if(eventSources[index].enabled){
                fullCalendarInstance.fullCalendar("addEventSource", eventSources[index]);
            }
            
            eventSources[index].toggle = () => {
                
                if(eventSources[index].enabled){
                    
                    fullCalendarInstance.fullCalendar("removeEventSource", eventSources[index]);
                    eventSources[index].enabled = false;
                    
                    if(sessionCache){
                        sessionStorage.setItem(eventSources[index].title, false);
                    }
                    
                }else{
                    
                    fullCalendarInstance.fullCalendar("addEventSource", eventSources[index]);
                    eventSources[index].enabled = true;
                    
                     if(sessionCache){
                        sessionStorage.setItem(eventSources[index].title, true);
                    }

                }
                
            }
        });
          
        return eventSources;
    }
    
}

