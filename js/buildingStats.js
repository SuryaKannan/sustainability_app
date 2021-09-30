//AUTHORS: Christian Yaacoub, Xinyang Fang, Surya Kannan
//DESCRIPTION: buildingStats.js uses the aggregateBy method, found in the RoomUsageList Class, that buckets instances based on the address atrribute (building). It checks every instance that shares the same building address and summarises its attributes into useful statistcal information that is loaded to a webpage using buildingStats.html. These statistics include average seat, lighting, heating/cooling ultilisation as well as any wasteful observations recorded.
//CREATED DATE: 11/09/18
//LAST MODIFIED: 11/10/18
"use strict";
/*===============================================================================================================================
    CODE THAT RUNS ON PAGE
===============================================================================================================================*/
// initialises all key values as 0, and sets a new variable "roomClassfiedByAddress" to an object containing all bucketed addresses
let roomClassfiedByAddress = roomUsageList.aggregateBy(classfyByaddress);
let seatUsed=0;
let seatTotal=0;
let lightOn=0;
let heatingOrCoolingOn=0;
let wasteFull = 0;
let averageSeatUtilisation = 0;
let averageLightsUtilisation = 0;
let averageHeatingOrCoolingUtilisation = 0;

// using for in loop to cycle through each property of "roomClassfiedByAddress"
for(let key in roomClassfiedByAddress)
    {
        
        // number of observations for that property
    let observations=roomClassfiedByAddress[key]._roomList.length;
  
       //going through every instance of roomUsage for that property 
    for(let i =0;i<observations;i++)
    {
        
   let seatUsedPerRoom=roomClassfiedByAddress[key]._roomList[i]._seatsUsed;
   let seatTotalPerRoom=roomClassfiedByAddress[key]._roomList[i]._seatsTotal;  
        
        // checking if it is a wasteful observation
   if((seatUsedPerRoom===0&& roomClassfiedByAddress[key]._roomList[i].heatingCoolingOn)||(seatUsedPerRoom===0&& roomClassfiedByAddress[key]._roomList[i].lightsOn))
       {
           wasteFull= wasteFull + 1;
 
       }
    
        //sums for for: seatsUsed, seatsTotal, lightsOn and heatingCoolingOn
    seatUsed+= seatUsedPerRoom;
    seatTotal+= seatTotalPerRoom;
            
    if(roomClassfiedByAddress[key]._roomList[i]._heatingCoolingOn)
        {
    heatingOrCoolingOn=heatingOrCoolingOn+1;
        }
        
    if(roomClassfiedByAddress[key]._roomList[i]._lightsOn)
        {
      lightOn=lightOn+1      
        }
        
    }
       
        // calculating averages
    averageSeatUtilisation = ((seatUsed/seatTotal)*100).toFixed(1);
    averageLightsUtilisation = ((lightOn/observations)*100).toFixed(1);
    averageHeatingOrCoolingUtilisation = ((heatingOrCoolingOn/observations)*100).toFixed(1);
        
        // limiting outputed building address to less than 25 characters
    let address = key;
    if (address.length > 25)
    {
        address = address.substring(0,25)
        address += "..."
    }
 
        
        // if it is a wasteful observation, output with a red background
    if(wasteFull===0)
        {
        
        document.getElementById("content").innerHTML+='<div class="mdl-cell mdl-cell--4-col"><table class="observation-table mdl-data-table mdl-js-data-table mdl-shadow--2dp"><thead><tr><th class="mdl-data-table__cell--non-numeric"><h4>'+address+'</h4>'+'</th></tr></thead><tbody><tr><td class="mdl-data-table__cell--non-numeric">'+"Observations: " +observations+'<br />'+"Wasteful observations: " +wasteFull+'<br />'+"Average seat utilisation: "+averageSeatUtilisation+"%"+'<br />'+"Average lights utilisation: "+averageLightsUtilisation+"%"+'<br />'+"Average heating/cooling utilisation: "+ averageHeatingOrCoolingUtilisation+"%"+'</td></tr></tbody></table></div>'
        }
    else
        {
                
        document.getElementById("content").innerHTML+='<div class="mdl-cell mdl-cell--4-col"><table class="observation-table mdl-data-table mdl-js-data-table mdl-shadow--2dp"><thead><tr> <th style="background-color:#DC143C"; class="mdl-data-table__cell--non-numeric"> <h4>'+key+'</h4>'+'</th></tr></thead><tbody><tr><td class="mdl-data-table__cell--non-numeric">'+"Observations: " +observations+'<br />'+"Wasteful observations: " +wasteFull+'<br />'+"Average seat utilisation: "+averageSeatUtilisation+"%"+'<br />'+"Average lights utilisation: "+averageLightsUtilisation+"%"+'<br />'+"Average heating/cooling utilisation: "+ averageHeatingOrCoolingUtilisation+"%"+'</td></tr></tbody></table></div>'         

        }
        
        // resetting sums/counters
  wasteFull=0;
  lightOn=0;
  heatingOrCoolingOn=0;
  seatUsed=0;
  seatTotal=0;

    }

// message box stating how many buildings were found
let numberOfObservationsForBuildingStatsREF= document.getElementById("numberOfObservationsForBuildingStats");

let numberOfObservations= Object.keys(roomClassfiedByAddress).length;

    if (numberOfObservations===1)
        {
         numberOfObservationsForBuildingStatsREF.innerHTML= (numberOfObservations)+"   building found";  
        }
    else 
        {
         numberOfObservationsForBuildingStatsREF.innerHTML= (numberOfObservations)+"   buildings found";
        }
    
    

    
