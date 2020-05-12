/* Global Variables */
// Personal API Key for OpenWeatherMap API
const API_KEY = '&appid=104ec94c9efb96e5545065b88c1f59c1&units=imperial';
const baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';

// Convert date
function convertDate(unixtimestamp) {
  // Months array
  var months_arr = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];

  // Convert timestamp to milliseconds
  var date = new Date(unixtimestamp * 1000);

  // Year
  var year = date.getFullYear();

  // Month
  var month = months_arr[date.getMonth()];

  // Day
  var day = date.getDate();

  // Display date time in MM-dd-yyyy format
  var convertedTime = month + '-' + day + '-' + year;

  return convertedTime;
}

// Event listener to add function to existing HTML DOM element
/* Function called by event listener */
document.getElementById('generate').addEventListener('click', performAction);

function performAction() {
  const zip = document.getElementById('zip').value;
  const feelings = document.getElementById('feelings').value;

  getAPIData(baseURL, zip, API_KEY)
    .then(function(data) {
      // Add data
      console.log('AllData from api: ', data);
      postWeatherData('/addWeatherData', {
        temperature: data.main.temp,
        date: convertDate(data.dt),
        userResponse: feelings
      });
    })
    .then(() => updateUI());
}

// Async GET
/* Function to GET Web API Data*/
const getAPIData = async (baseURL, zip, API_KEY) => {
  if (zip.toString().length !== 5) {
    alert('zip should be of length 5!');
  } else {
    /* Please note as country is not specified so, the search works for USA as a default. */
    const url = `${baseURL}${zip}${API_KEY}`;

    const request = await fetch(url);
    try {
      // Transform into JSON
      const allData = await request.json();
      if (allData.message) {
        alert(allData.message);
      } else {
        return allData;
      }
    } catch (error) {
      console.log('error', error);
      // appropriately handle the error
    }
  }
};

// Async POST
/* Function to POST data */
// Async POST
const postWeatherData = async (url = '', data = {}) => {
  console.log('post weather data: ', data);
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });

  try {
    const newData = await response.json();
    console.log('post res: ', newData);
  } catch (error) {
    console.log('error', error);
  }
};

/* Function to update UI */
const updateUI = async () => {
  const request = await fetch('/all');
  try {
    const data = await request.json();
    console.log('updateUI: ', data);
    document.getElementById('date').innerHTML = `Date: ${data.date}`;
    document.getElementById(
      'temp'
    ).innerHTML = `Temperature(°C): ${data.temperature}`;
    document.getElementById(
      'content'
    ).innerHTML = `Feelings: ${data.userResponse}`;
  } catch (error) {
    console.log('error', error);
  }
};