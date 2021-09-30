//AUTHORS: Christian Yaacoub, Xinyang Fang, Surya Kannan
//DESCRIPTION: occupancy.js uses aggregateBy to bucket instances according to time of day (ranging from 8am-6pm). It displays the worst five room observations in terms of occupancy (how many seat are used in the room) or all observations if there are less than five in that bucket. 
//CREATED DATE: 11/09/18
//LAST MODIFIED: 11/10/18
"use strict";

// referencing an id, and creating a timeBucket using aggregateBy to sort instances in the same hour together
let output = document.getElementById("content");
let timeBucket = roomUsageList.aggregateBy(classfyBytime);
let timeArray=[];

// using a for in loop to cycle through hours of the day, which are properties, to store into timeArray,
//timeArray is an array that is made up of every second element from 0 being the hour and every second element from 1 being the instances that are grouped by the same hour.
for(let key in timeBucket)
{
 timeArray.push(key);
 timeArray.push(timeBucket[key]);    
}


// going through every second element of timeArray, which are hours, and correcting for AM and PM and only using times between 8AM and 6PM.
for(let i=0;i<timeArray.length;i+=2)
    {
        let hour="";
        let eachRoom="";

        // only true if between 8AM and 6PM
       if((timeArray[i]>=8)&&(timeArray[i]<=18))
           {
           
            if (timeArray[i]<12)
                {
                  hour= timeArray[i]+"AM";
                    
                }
            else if (timeArray[i]==12)
                {
                  hour= timeArray[i]+"PM";
                }
            else
                {
                 hour=timeArray[i]-12+"PM"
                }

               
               //accessing all instances for the given hour 
        let roomlist=timeArray[i+1]._roomList;
                let occupancyArray=[]; 
             
                    for(let j=0;j<roomlist.length;j++)
                        {
                let seatUsed=roomlist[j]._seatsUsed;
                let seatTotal=roomlist[j]._seatsTotal;
               let  occupancy = 0;
              
                if (seatTotal===0)
                    {
                        occupancy=0
                    }
                else{
                    occupancy= parseFloat(((seatUsed/seatTotal)*100).toFixed(1));
                }
                occupancyArray.push(occupancy)
                occupancyArray.push(roomlist[j])   
                        }
                     
                selectionSort(occupancyArray)
                    
               
               let number=0;
            if(roomlist.length>5)
                {
                    number=10;
                }
             else
                {
                  number=2*roomlist.length;     
                 }
                         
                 
               
             for(let k =0;k<number;k+=2)  
                 {
                     
                 // Calculating all statistics 
                     
            let roomInstance=occupancyArray[k+1]; 
            let Occupancy =occupancyArray[k];
            let heatingCooling;
            let lights;
            let timeList = [String(roomInstance._timeChecked.getHours()), String(roomInstance.timeChecked.getMinutes()), String(roomInstance.timeChecked.getSeconds())];
                     
            for (let l=0;l<timeList.length;l++)
            {
                if (timeList[l].length < 2)
                {
                    timeList[l] = '0' + timeList[l]
                }
            }
                     
            let dateList = [String(roomInstance.timeChecked.getFullYear()), String(roomInstance.timeChecked.getMonth()), String(roomInstance.timeChecked.getDate())]
            
            for (let m=1;m<dateList.length;m++)
            {
                if (dateList[m].length < 2)
                {
                    dateList[m] = '0' + dateList[m]
                }
            }
                     
            let time = timeList[0] + ":" + timeList[1] + ":" + timeList[2];
            let date = dateList[2] + "/" + dateList[1] + "/" + dateList[0];
                     
            if (roomInstance.heatingCoolingOn===true)
            {
                heatingCooling = "On";
            }
            else
            {
                heatingCooling = "Off";
            }
            if (roomInstance.lightsOn===true)
            {
                lights="On"
            }
            else
            {
                lights="Off"
            }
                    
                     // HTML that outputs to screen. This occurs 5 times for the same bucketed group.
            eachRoom += '<tr><td class="mdl-data-table__cell--non-numeric"><div><b>' + roomInstance.address.split(",")[0] + '; Rm ' + roomInstance.roomNumber + '</b></div><div>Occupancy: ' + Occupancy + '%</div><div>Heating/cooling: ' + heatingCooling + '</div><div>Lights: ' + lights + '</div><div><font color="grey"><i>'+date+', '+time+'</i></font></div></td></tr>';
  
                     
                 }
               
                output.innerHTML += '<div class="mdl-cell mdl-cell--4-col"><table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp"><thead><tr><th class="mdl-data-table__cell--non-numeric"><h5>Worst occupancy for ' + hour + '</h5></th></tr></thead><tbody>' + eachRoom + '</tbody></table></div>';
           }
                           
           }

// message box stating how many buildings were found
let occupancyTimeStatsREF= document.getElementById("timeSlots");

let numberOfObservations= Object.keys(timeBucket).length;
 
    if (numberOfObservations===1)
        {
         occupancyTimeStatsREF.innerHTML= numberOfObservations+"   time slot found, only displaying 8AM to 6PM";  
        }
    else 
        {
         occupancyTimeStatsREF.innerHTML= numberOfObservations+"   time slots found, only displaying 8AM to 6PM";
        }
   

//==============================================================================================================================
// FUNCTIONS THAT ARE USED BY THE WEBPAGE
//============================================================================================================================
// selectionSort takes an array and sorts in from the lowest to highest value. using a counter to shift through the array, the unsorted element with the smallest (or largest) value is moved to its proper position in the array. This occurs repeatedly until the last element has the highest value. This function was directly taken from Monash University's ENG1003 week 10 lab practical. url-https://www.alexandriarepository.org/syllabus/eng1003/86873/

function selectionSort(array)
{
    // Move through the list selecting the lowest value from
    // remaining elements.  Everything before index i will be
    // sorted.
    for (let i = 0; i < array.length - 1; i+=2)
    {
        // min is the index of the lowest value we've seen in
        // remaining elements.
        let minIndex = i;
 
        // For each remaining element beyond i
        for (let j = i + 2; j < array.length; j+=2)
        {
            // See if this value it lower than the value at
            // index min.
            if (array[j] < array[minIndex])
            {
                // If it is, make this the new min index.
                minIndex = j;
            }
        }
 
        // If the lowest value was not already at index i
        if (minIndex != i)
        {
            // Swap elements to put the lowest value at index i
            let temp = array[i];
            array[i] = array[minIndex];
            array[minIndex] = temp;
            
            let Temp=array[i+1];
            array[i+1]=array[minIndex+1]
            array[minIndex+1]=Temp;
            
            
        }
 
        // Everything up to index i is now sorted, increment i.
    }
}

