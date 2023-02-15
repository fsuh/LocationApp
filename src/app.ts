import axios from "axios";

type GoogleGeoCodingResponse = {
  results: { geometry: { location: { lat: number; lng: number } } }[];
  status: "OK" | "ZERO_RESULTS";
};

//declare let google: any;

const form = document.querySelector<HTMLFormElement>("form")!;
const addressInput = document.getElementById("address")! as HTMLInputElement;

const GOOGLE_API_KEY = "xxxxxx";

function searchLocationHandler(event: Event) {
  event.preventDefault(); //this is to prevent it from refreshing

  const enteredAddress = addressInput.value;

  // send this enteredAddress to Google
  axios
    .get<GoogleGeoCodingResponse>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
        enteredAddress
      )}en&key=${GOOGLE_API_KEY}
`
    )
    .then((response) => {
      //console.log(response);
      if (response.data.status !== "OK") {
        throw new Error("Could not fetch location");
      }
      const coordinates = response.data.results[0].geometry.location;
      const map = new google.maps.Map(
        document.getElementById("map")! as HTMLElement,
        {
          center: coordinates,
          zoom: 16,
        }
      );
      new google.maps.Marker({ position: coordinates, map: map });
    })
    .catch((err) => {
      alert(err.message);
    });
}

form.addEventListener("submit", searchLocationHandler);
