//AUTHORS: Christian Yaacoub, Xinyang Fang, Surya Kannan
//DESCRIPTION: formView.js is a script file that corresponds to index.html, or the page responsible for adding new observations. The file consists of three primary functions that are all called on by user input. These functions are responsible for: clearing all entires, saving roomUsage instances to roomUsageList and determining the users location using a geolocation API.
//CREATED DATE: 11/09/18
//LAST MODIFIED: 11/10/18

"use strict";
//==============================================================================================================================
// FUNCTIONS THAT ARE USED BY THE WEBPAGE
//============================================================================================================================

// clearFunction clears all changeable entires on the page, called by an onlick referenced in index.html
function clearFunction()
{
    // inputs are cleared if text is found
    document.getElementById("errorMessages").innerHTML = ""; 
    let inputs = document.getElementsByTagName("input");
    for (let i=0;i<inputs.length;i++)
    {
        if (inputs[i].type==="text")
        {
            inputs[i].value="";
        }
    }
    // All checkbox details are clears
    if (document.getElementById("useAddress").checked===true)
    {
        document.getElementById("useAddress").click();
    }
    if (document.getElementById("lights").checked===false)
    {
        document.getElementById("lights").click();
    }
    if (document.getElementById("heatingCooling").checked===false)
    {
        document.getElementById("heatingCooling").click();
    }
    
    // refreshes the page
location = location;
}
//==============================================================================================================================
//=============================================================================================================================
// saveFunction saves all changeable entires on the page by creating a new RoomUsage instance and storing it into roomUsageList, called by an onlick referenced in index.html
function saveFunction()
{
    // mainly initalising reference variables to HTML 
    document.getElementById("errorMessages").innerHTML = "";
    let address = document.getElementById("address").value;
    let roomNumber = document.getElementById("roomNumber").value;
    let lightsOn = document.getElementById("lights").checked;
    let heatingCoolingOn = document.getElementById("heatingCooling").checked;
    let seatsUsed = document.getElementById("seatsUsed").value;
    let seatsTotal = document.getElementById("seatsTotal").value;
    
    // error checks for no input for required fields 
    if (address==="")
        {
           document.getElementById("errorMessages").innerHTML+="Error: no entry found for address <br/>";
        }
    if (roomNumber==="")
        {
           document.getElementById("errorMessages").innerHTML+="Error: no entry found for room number <br/>";
        }
    
    if (seatsTotal==="")
        {
           document.getElementById("errorMessages").innerHTML+="Error: no entry found for number of available seats <br/>"; 
        }
    
    if (seatsUsed==="")
        {
           document.getElementById("errorMessages").innerHTML+="Error: no entry found for number of seats in use <br/>"; 
        }
    
    if (Number(seatsUsed)>Number(seatsTotal))
        {
          document.getElementById("errorMessages").innerHTML+="Error: seats available must be greater than or equal to seats in use <br/>";  
        }
    if (seatsTotal===0 && seatsUsed>=0)
        {
          document.getElementById("errorMessages").innerHTML+="Error: Total cannot be zero if seats are available <br/>";  
        }
    
    // checks for text (so if no integers are detected) in seatsUsed text box
    
    for (let i in seatsUsed)
    {
        if (Number(seatsUsed[i]) in [0,1,2,3,4,5,6,7,8,9] ===false )
        {
            document.getElementById("errorMessages").innerHTML+="Error: enter valid number of seats in use <br/>";
            break;
        }
    }
    
    // checks for text (so if no integers are detected) in seatsTotal text box
    for (let i in seatsTotal)
    {
        if (Number(seatsTotal[i]) in [0,1,2,3,4,5,6,7,8,9] ===false)
        {
            document.getElementById("errorMessages").innerHTML+="Error: enter valid number of available seats <br/>";
            break;  
        }
    }
 
    // if any error messages from above are found, returns out of function and does not save to roomUsageList
    if (document.getElementById("errorMessages").innerHTML.includes("Error"))
    {
        return;
    }
    
    // converting appropriate fields to numbers and string
    seatsUsed = Number(seatsUsed);
    seatsTotal= Number(seatsTotal);
    address= String(address);
    roomNumber=String(roomNumber);
    let date = new Date();
    
    // manually declaring a new instance and using setters from shared.js to assign values to attributes
    let roomUsageInstance = new RoomUsage();
    roomUsageInstance.roomNumber= roomNumber;
    roomUsageInstance.address= address;
    roomUsageInstance.lightsOn= lightsOn;
    roomUsageInstance.heatingCoolingOn= heatingCoolingOn;
    roomUsageInstance.seatsTotal= seatsTotal;
    roomUsageInstance.seatsUsed= seatsUsed;
    roomUsageInstance.timeChecked= date;

    // a success message that outputs to screen
    document.getElementById("errorMessages").innerHTML+="The observation was sucessfully saved <br/>";
    setTimeout(timeoutFunction,2000)
    
    // exits function while adding the observation to roomUsageList using a public method of the instance
    return roomUsageList.addObservation(roomUsageInstance);
    
    // function that resets success message after 2 seconds then calls on clearFunction 
    function timeoutFunction()
    {
      document.getElementById("errorMessages").innerHTML=""
      clearFunction();  
    }
    
}
//===============================================================================================================================
//================================================================================================================================
// geoParentFunction is activated an onlick command by the user. It uses the users current Latitude and Longitude to reverse geocode their location through a geocode API made by opencagedata.com. 
function geoParentFunction()
{
    // options is an object that is a parameter of the navigator.geolocation API. It can be used to set a timeout and also set the level of accuracy when determining longitude and latitude. 
    let options= {
  enableHighAccuracy: true, 
  maximumAge        : 30000, 
  timeout           : 100000000000
};
    // checking if the users device has geolocation enabled. If it does not, ann error message as well as a console log will output.
    if (document.getElementById("useAddress").checked===false)
    {
        return
    }
    // check for geolocation 
    if ("geolocation" in navigator) 
    {
        console.log("geolocation is available") 
        navigator.geolocation.getCurrentPosition(onUserPosition,locationNotReceived,options)

    }   
    else 
    {
        document.getElementById("errorMessages").innerHTML="Geolocation is not enabled on your device <br/>";
        console.log("geolocation is not available")
        return;
    }
      function locationNotReceived(positionError)
    {
      document.getElementById("errorMessages").innerHTML="Location was not found for the device <br/>";
    }
    
   // callback function that is a parameter of the navigator.geolocation API. A position object is stored as a parameter, containing all Geolocation data. 
    function onUserPosition(position)
    {
        let latitude=position.coords.latitude;
        let longitude= position.coords.longitude;
        
    // jsonpRequest is a function that builds a html address with a query tag given a url and data object as inputs. This is directly used from Monash University's ENG1003 week 9 lab practical.  url-https://www.alexandriarepository.org/syllabus/eng1003/86870/
        
    function jsonpRequest(url, data)
        {
            // Build URL parameters from data object.
            let params = "";
            // For each key in data object...
            for (let key in data)
            {
            if (data.hasOwnProperty(key))
            {
            if (params.length == 0)
            {
                // First parameter starts with '?'
                params += "?";
            }
            else
            {
                // Subsequent parameter separated by '&'
                params += "&";
            }

            let encodedKey = encodeURIComponent(key);
            let encodedValue = encodeURIComponent(data[key]);

            params += encodedKey + "=" + encodedValue;
            }
            }
            let script = document.createElement('script');
            script.src = url + params;
            document.body.appendChild(script);
        }
        
        // Making the request using jsonpRequest
        let data = 
        {
        q:latitude+","+longitude,
        key:"72cbfeac67384dc683f4d69c76f2a3bd",
        jsonp:"userAddressData",
        };

        jsonpRequest("https://api.opencagedata.com/geocode/v1/json", data);
        
    }
 }
//===============================================================================================================================
//================================================================================================================================
// userAddressData is a callback function that stores the location data created by the geocoder API, made by opencagedata, as a parameter. This data contains the formatted address that outputs to the "building address" text box on the "add observation" webpage.
 function userAddressData(locationData)
 {

            let confidence= locationData.results[0].confidence;
     
            if (confidence<= 5)
                {
                document.getElementById("errorMessages").innerHTML="WARNING: The user's determined location is not accurate"
                }
             
            let formattedAddress= locationData.results[0].formatted;
            document.getElementById("address").value= formattedAddress;
            document.getElementById("formattedAddress").innerHTML=""
            return;
 }
//===============================================================================================================================
//================================================================================================================================


