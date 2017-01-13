import PhidiasColorUtils from "./Colors.js";
import PhidiasDOMUtils from "./Dom.js";

export default class PhidiasFullCalendarUtils {
    
    static getEventSources(fullCalendarInstance){
        
        var fullCalendar = fullCalendarInstance;
        var eventSources = fullCalendarInstance.fullCalendar("getEventSources");
        var defaultColors = PhidiasColorUtils.getColorsList(eventSources.length > 0 ? eventSources.length : 50);
        var lastColorUsed = -1;
        var needToRefetch = false;
        var defaultName = "Calendar";
        
        eventSources.forEach( (source, index) => {
            eventSources[index].enabled = true;
            
            if(!source.title){
                eventSources[index].title =  defaultName + " " + index;
            }
            
            if(!source.id){
                eventSources[index].id = PhidiasDOMUtils.generateUUID();
            }
            
            if(!source.color){
                eventSources[index].color = defaultColors[lastColorUsed += 1];
                needToRefetch = true;
            }else{
                if(!PhidiasColorUtils.isValidCssColour(source.color)){
                    eventSources[index].color = defaultColors[lastColorUsed += 1];
                    needToRefetch = true;
                }
            }
            
            if(!source.textColor){
                eventSources[index].textColor = PhidiasColorUtils.getTextColorForBG(eventSources[index].color);
                needToRefetch = true;
            }else{
                if(!PhidiasColorUtils.isValidCssColour(source.textColor)){
                    eventSources[index].textColor = PhidiasColorUtils.getTextColorForBG(eventSources[index].color);
                    needToRefetch = true;
                }
            }
            
            eventSources[index].toggle = () => {
                
                if(eventSources[index].enabled){
                    
                    fullCalendar.fullCalendar("removeEventSource", eventSources[index]);
                    eventSources[index].enabled = false;
                    
                }else{
                    
                    fullCalendar.fullCalendar("addEventSource", eventSources[index]);
                    eventSources[index].enabled = true;

                }
                
            }
        });
        
        if(needToRefetch){
            fullCalendar.fullCalendar("refetchEvents");
        }
        
        return eventSources;
    }
    
}

