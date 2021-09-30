//AUTHORS: Christian Yaacoub, Xinyang Fang, Surya Kannan
//DESCRIPTION: observations.js is a file that is used to output all observations recorded by the user on the oberservations webpage (observations.html). It contains three primary functions. displayObservations, which is called when the webpage is loaded, deleteObservations, which is called by user interaction with a "bin" icon and searchObservations, which is called on by the user while using the search bar.
//CREATED DATE: 11/09/18
//LAST MODIFIED: 11/10/18

"use strict";
/*=============================================================================================================
// FUNCTIONS USED BY THE WEBPAGE
========================================================================================================+*/
// displayObservations is called when the webpage is loaded. It takes the roomList attribute of roomUsageList as an input and uses information found in every roomUsage Instance to generate HTML to the webpage 
function displayObservations(observationList)
{
    document.getElementById("content").innerHTML='<div class="mdl-cell mdl-cell--4-col"><table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp"><tbody><tr><td class="mdl-data-table__cell--non-numeric" id="numberOfObservations"></td></tr></tbody></table></div>'
    
    // uses a for loop to generate HTML for every instance
    for (let i=observationList.length-1;i>=0;i--)
    {
        // accessing the Date class stored in every instance to extract time and month
        let dateTimeSet= observationList[i]._timeChecked;
        let months=["Jan","Feb","Mar","Apr","May","June","July","Aug","Sep","Oct","Nov","Dec"];
        let dateObservation= dateTimeSet.getDate()+"  "+months[dateTimeSet.getMonth()]+"."

     // checking whether heating/cooling or lighting was used 
        let onOrOff= [observationList[i]._lightsOn,observationList[i]._heatingCoolingOn];

        for(let j=0;j<=onOrOff.length-1;j++)
     {
        if (onOrOff[j]===true)
            {
                onOrOff[j]="On"
            }
        if (onOrOff[j]===false) 
            {
                onOrOff[j]="Off"
            }
     }

        // creating a variable that stores seats used over total seats available
        let seatUsage= observationList[i]._seatsUsed+" / "+observationList[i]._seatsTotal;

        // limiting outputed building address to less than 25 characters
        let address = observationList[i]._address.split(",")[0];
   
        // HTML for every instance
        document.getElementById("content").innerHTML+='<div class="mdl-cell mdl-cell--4-col"><table class="observation-table mdl-data-table mdl-js-data-table mdl-shadow--2dp"><thead><tr><th class="mdl-data-table__cell--non-numeric"><h4 class="date">'+dateObservation+'</h4><h4>'+address+' <br />Rm '+observationList[i]._roomNumber +'</h4></th></tr></thead><tbody><tr><td class="mdl-data-table__cell--non-numeric">'+"Time:  "+dateTimeSet.toLocaleTimeString('en-US')+'<br />'+"Lights:  "+onOrOff[0]+'<br />'+"Heating/Cooling:   "+onOrOff[1]+'<br />'+"Seat Usage:  "+seatUsage+'<br/ ><button class="mdl-button mdl-js-button mdl-button--icon" onclick="deleteObservationAtIndex('+i+');"><i class="material-icons">delete</i></button></td></tr></tbody></table></div>'


    }

     // message card that states number of observations found 
    let numberOfObservationsREF= document.getElementById("numberOfObservations");

    if (observationList.length===1)
        {
         numberOfObservationsREF.innerHTML= (observationList.length)+"   observation found";   
        }
    else 
        {
         numberOfObservationsREF.innerHTML= (observationList.length)+"   observations found";
        }
}

/*=============================================================================================================
========================================================================================================+*/
// deleteObservationAtIndex uses the index stored by every instance, when generating a HTML, to delete a particular instance when an icon is clicked on by the user. It then re-intialises the roomUsageList found in local storage and refreshes the page.
    function deleteObservationAtIndex(index)
    {           
        // getting rid of a roomUsage instance 
        roomUsageList._roomList.splice(index,1);
        
        // checking if local storage is available on the browser. If it exists, it re-initialises the value of the key with the new roomUsageList. 
        if (typeof(Storage)!=="undefined")
        {
            localStorage.setItem(STORAGE_KEY,JSON.stringify(roomUsageList));
        }
        else
        {
            console.log("Error: localStorage is not supported by current browser.");
        }
        location = location
    }
/*=============================================================================================================
========================================================================================================+*/
// the searchFunction takes a user defined string as an input (from text field), corrects for upper and lower case, then searches roomUsageList for a given instance. localRoomList is then returned as an array that contains all the common instances and reloads the webpage using displayObservations.
function searchFunction(string)
{
    if (string.value==null)
    {
        return
    }
    // converting all strings to lower case
    string = string.value.toLowerCase();
    let localRoomList=[];
    for (let i=0;i<roomUsageList._roomList.length;i++)
    {
        if (roomUsageList.accessObservation(i).address.toLowerCase().includes(string) ||String(roomUsageList.accessObservation(i).roomNumber).toLowerCase().includes(string))
        {
            localRoomList.push(roomUsageList.accessObservation(i))
        }
    }
    return displayObservations(localRoomList)
    
}

/*===============================================================================================================================
    CODE THAT RUNS ON PAGE
===============================================================================================================================*/
displayObservations(roomUsageList._roomList)