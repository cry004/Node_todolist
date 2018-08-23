// Client ID and API key from the Developer Console
var CLIENT_ID =
  'client-id'
var API_KEY = 'api-key'

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
]

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = 'https://www.googleapis.com/auth/calendar.readonly'

var authorizeButton = document.getElementById('authorize_button')
let timerange = []

const fp = flatpickr('.flatpickr', {
  minDate: 'today',
  enableTime: true,
  mode: 'range',
  onClose: function (selectedDates) {
    timerange = selectedDates
    console.log(ISODateString(timerange[0]), ISODateString(timerange[1]))
  }
})
function ISODateString (d) {
  function pad (n) {
    return n < 10 ? '0' + n : n
  }
  return (
    d.getFullYear() +
    '-' +
    pad(d.getMonth() + 1) +
    '-' +
    pad(d.getDate()) +
    'T' +
    pad(d.getHours()) +
    ':' +
    pad(d.getMinutes()) +
    ':' +
    pad(d.getSeconds())
  )
}

handleClientLoad()
/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad () {
  gapi.load('client:auth2', initClient)
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient () {
  gapi.client
    .init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    })
    .then(function () {
      // Listen for sign-in state changes.
      // Handle the initial sign-in state.
      authorizeButton.onclick = handleAuthClick
    })
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick (event) {
  if (timerange.length == 0) {
    alert('請選取時間！')
  } else {
    if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
      gapi.auth2.getAuthInstance().signIn()
    }
    addEvents()
  }
}

function addEvents () {
  console.log(timerange)
  var event = {
    summary: document.querySelector('.title').value,
    description: document.querySelector('.content').value,
    start: {
      dateTime: ISODateString(timerange[0]),
      timeZone: 'Taiwan'
    },
    end: {
      dateTime: ISODateString(timerange[1]),
      timeZone: 'Taiwan'
    },
    recurrence: ['RRULE:FREQ=DAILY;COUNT=2'],
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 },
        { method: 'popup', minutes: 10 }
      ]
    }
  }

  var request = gapi.client.calendar.events.insert({
    calendarId: 'primary',
    resource: event
  })
}
