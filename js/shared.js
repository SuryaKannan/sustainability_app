//AUTHORS: Christian Yaacoub, Xinyang Fang, Surya Kannan
//DESCRIPTION: shared.js is a script file used by all other js files that form the app. It contains all the Class declarations as well as their methods. This file also is in charge of initalising the roomUsageList from local storage and will automatically create a new instance if one does not exist. 
//CREATED DATE: 11/09/18
//LAST MODIFIED: 11/10/18

"use strict";
/*=============================================================================================================
CLASS DEFINITONS
========================================================================================================+*/
class RoomUsage
{
	constructor(roomNumber,address,lightsOn,heatingCoolingOn,seatsUsed,seatsTotal,timeChecked)
    {
        this._roomNumber= roomNumber;
        this._address= address;
        this._lightsOn= lightsOn;
        this._heatingCoolingOn= heatingCoolingOn;
        this._seatsUsed= seatsUsed;
        this._seatsTotal= seatsTotal;
        this._timeChecked= timeChecked;
    }
    
// Getter methods for each attribute
     get roomNumber()
    {
        return this._roomNumber;
    }
    
     get address()
    {
        return this._address;
    }
    
     get lightsOn()
    {
        return this._lightsOn;
    }
    
     get heatingCoolingOn()
    {
        return this._heatingCoolingOn;
    }
    
     get seatsUsed()
    {
        return this._seatsUsed;
    }
    
     get seatsTotal()
    {
        return this._seatsTotal;
    }
    
     get timeChecked()
    {
        return this._timeChecked;
    }
    
// Setter methods for each attribute with appropriate restrictions
	
    set roomNumber(newRoomNumber)
    {
        if (typeof(newRoomNumber)==="string")
		   { 
			this._roomNumber=newRoomNumber;
		   }
        else
           {
            console.log("Enter a valid room number");
           }
    }
    
    set address(newAddress)
    {
         if (typeof(newAddress)==="string")
		    {
			 this._address=newAddress;
		    }
        else
            {
             console.log("Enter a valid address");
            }
        
    }
    
      set seatsTotal(newSeatsTotal)
    {
       if (typeof(newSeatsTotal)==="number"&& newSeatsTotal>=0) 
           {
               this._seatsTotal= newSeatsTotal;
           }
        else
           {
            console.log("enter a valid number of total seats");  
           }
    }
	
	set seatsUsed(newSeatsUsed)
    {    
        if (typeof(newSeatsUsed)==="number" && newSeatsUsed>=0 && newSeatsUsed<=this._seatsTotal)
            {
                this._seatsUsed = newSeatsUsed;
            }
        else
            {
                console.log("enter a Non_empty and valid number of seats used");
            }
    }
    
    
    set heatingCoolingOn(newHeatingCoolingOn)
    {
        this._heatingCoolingOn= newHeatingCoolingOn;  
    }
    
    set lightsOn(newLightsOn)
    {   
        this._lightsOn= newLightsOn;
    }
    
    set timeChecked(newTimeChecked)
    {
        this._timeChecked= newTimeChecked;
    }
    
    // Reinitialises a given instance from a public-data card object.
    initialiseFromRoomUsagePDO(roomUsageObject)
    {
        // Initialise the instance using setter methods from the PDO object.
        this._roomNumber= roomUsageObject._roomNumber;
        this._address= roomUsageObject._address;
        this._lightsOn= roomUsageObject._lightsOn;
        this._heatingCoolingOn= roomUsageObject._heatingCoolingOn;
        this._seatsUsed= roomUsageObject._seatsUsed;
        this._seatsTotal= roomUsageObject._seatsTotal;
        this._timeChecked= new Date(roomUsageObject._timeChecked);
    }
}

class RoomUsageList
    {
        constructor(roomList)
        {
            this._roomList= [];
        }
        
        
		// method that adds observations (roomUsage instances) to roomList
        addObservation(roomUsageInstance)
        {
           this._roomList.push(roomUsageInstance); 
            
            // Whenever a RoomUsage instance is added, store the new version of the array in local storage
            
                if (typeof(Storage)!=="undefined")
                {
                      localStorage.setItem(STORAGE_KEY,JSON.stringify(roomUsageList));
                }
                else
                {
                     console.log("Error: localStorage is not supported by current browser.");
                }

        }
        
        //this is basically the getter, able to access roomUsage Instance given an index                  
        accessObservation(roomUsageInstanceIndex)
        {
            return this._roomList[roomUsageInstanceIndex];
        }
        
       // method outputs roomUsage instances from most recent to earliest entry
       observationList()
        {
	       for (let i=this._roomList.length-1; i<=0;i--)
	       {
		let observationsRecent= this._roomList[i];
		
		return observationsRecent;
	       }
	
         }
        
        // public method that initalises roomUsageList from local-storage. Uses another method from RoomUsage
        initialiseFromRoomUsageListPDO(roomUsageListPDO)
        {
            this._roomList=[];
            for (let j=0; j<roomUsageListPDO._roomList.length;j++)
                {
                    let roomUsage= new RoomUsage();
                    roomUsage.initialiseFromRoomUsagePDO(roomUsageListPDO._roomList[j]);
                    this._roomList.push(roomUsage);
                }
        }
        

        // aggregateBy is a bucketing function. By taking an input parameter called "key", which can be either classfyByaddress or classfyBytime, a bucketRoom variable is returned that contains all the instances stored in an object. The objects properties detemine how instances are bucketed. 
        
        aggregateBy(key)
        {
     let observationArray = this._roomList;
     let bucketRoom = {};
            
            // sorts every instance into its appropriate bucket
        for(let i =0;i<observationArray.length;i++)    
            {   
                
             let property=key(observationArray[i]);
        if(bucketRoom.hasOwnProperty(property))
                 {    
                    bucketRoom[property]._roomList.push(observationArray[i])            
                }
        else
                {   
                  bucketRoom[property]=new RoomUsageList();   
                  bucketRoom[property]._roomList.push(observationArray[i])  
                }
                
            }              
            
            return bucketRoom;          
        }
        
    }
        
    //input for aggregateBy
    function classfyByaddress(obs)
{
    let shortAddress=obs.address.split(",");
    return shortAddress[0];
        
}
    //input for aggregateBy
  function classfyBytime(obs)
{
    
let time=obs.timeChecked.getHours().toString();
    
    return time;
    
    
}

/*===============================================================================================================================
    CODE THAT RUNS ON PAGE
===============================================================================================================================*/

// Creating a local storage key and a new RoomUsageList instance
const STORAGE_KEY="ENG1003-RoomUseList";

let roomUsageList;
//let roomUsageList = new RoomUsageList();
 if (typeof(Storage) !== "undefined" && JSON.parse(localStorage.getItem(STORAGE_KEY)) !== null)
    {
        roomUsageList = new RoomUsageList();
        // retrieved object without methods
       let roomUsageListObject = JSON.parse(localStorage.getItem(STORAGE_KEY));
        
        
        // combining methods from empty instance with values from stored instances
        roomUsageList.initialiseFromRoomUsageListPDO(roomUsageListObject);
        
    }
    else if (typeof(Storage) !== "undefined" && JSON.parse(localStorage.getItem(STORAGE_KEY)) === null)
    {
        console.log("No current information stored in local storage, new roomUsageList created");
            // creating roomUsageList 
         roomUsageList = new RoomUsageList();
    }
    else  
    {
        console.log("localStorage is not supported by current browser or No current information stored.");
    }




