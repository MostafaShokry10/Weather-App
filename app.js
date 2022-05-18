/* Global Variables */
// URL to retrieve  OpenWeatherMap Info 
const baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
// Personal API Key for OpenWeatherMap API(default US)
//temperature in Fahrenheit use units=imperial & in Celsius use units = metric
const apiKey = ',US&appid=f22482c558feeda09ca05cb46d930a77&units=imperial';
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.toDateString();
//showing error to user
const error = document.getElementById('error');
// Event listener to add function to existing HTML DOM element
// Function called by event listener
document.getElementById('generate').addEventListener('click', performAction);

function performAction(){
const zip = document.getElementById('zip').value;
const feeling = document.getElementById('feelings').value;

    getWeather(zip)

        .then(function (data)
        {
            // Add data
            console.log(data)
            postData('/add', { date: newDate, temp: Math.round(data.main.temp), content: feeling, city: data.name, descr: data.weather[0].description, cond: data.weather[0].main,icon:data.weather[0].icon })
            updateUI()
            document.getElementById('entry').style.opacity = 1
})
}
//POST Example
const postData = async (url = '', data = {}) => {
    console.log(data);
    const response = await fetch(url, {
        method: 'POST',//*Get, Post, PUT, DELETE, etc.
        credentials: 'same-origin',//include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
        },
        // Body data type must match "Content-Type" header        
        body: JSON.stringify(data),
    });

    try {
        const newData = await response.json();
        console.log(`You just saved:`,newData);
        return newData;
    } catch (error) {
        console.log("error", error);
        //appropriately handel the error
    }
}
const getWeather = async (zip) => {
        
    const res = await fetch(baseURL + zip + apiKey)
        try {
            const newData = await res.json();
            console.log(newData)

            //generate custom error messages.
            //Check if cod != 200 then there is error .
            if (newData.cod != 200) {
                // display the error message on UI for 3 sec 
                error.innerHTML = newData.message;
                setTimeout(_ => error.innerHTML = '', 3000)
                throw `${newData.message}`;
            }
            return newData;
        } catch (error) {
            // appropriately handle the error
            console.log("error", error);
        }
    }

const updateUI = async () => {
    const request = await fetch('/all');
    try {
        const allData = await request.json();
    
        document.getElementById('date').innerHTML = allData.date;
        document.getElementById('temp').innerHTML = allData.temp +'&degF';
        document.getElementById('city').innerHTML = allData.city + ',US';
        document.getElementById('description').innerHTML = `<span>${allData.descr}</span>` + ` <img src="http://openweathermap.org/img/wn/${allData.icon}.png" alt="icon"> `;
        
        (allData.content === "")? (document.getElementById('content').innerHTML = allData.content):(document.getElementById('content').innerHTML = `I feel: `+ allData.content);

        if (allData.cond === "Clouds") {
            document.body.style.backgroundImage = "url('./cloud.gif')";
}
        else if (allData.cond === "Rain") {
            document.body.style.backgroundImage  = "url('./rain.gif')";
        }
        else if (allData.cond === "Thunderstorm") {
            document.body.style.backgroundImage = "url('./lightening.gif')";
        }    
        else if (allData.cond === "Snow") {
            document.body.style.backgroundImage = "url('./snow.gif')";
        }  
        else if (allData.cond === "Clear") {
            document.body.style.backgroundImage = "url('./Clear.gif')";
        }
        else if (allData.cond === "Mist" || allData.cond === "Fog" || allData.cond === "Haze" || allData.cond === "Smoke") {
            document.body.style.backgroundImage = "url('./mist.gif')";
        }                                            
        else {
            document.body.style.backgroundImage = "url('./bg.jpg')";
}
    } catch (error) {
        console.log("error", error);
    }
}