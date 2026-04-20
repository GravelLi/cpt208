const searchInput = document.getElementById("searchInput");
const relocateBtn = document.getElementById("relocateBtn");
const runToggleBtn = document.getElementById("runToggleBtn");
const pauseBtn = document.getElementById("pauseBtn");
const finishBtn = document.getElementById("finishBtn");
const musicBtn = document.getElementById("musicBtn");
const sosBtn = document.getElementById("sosBtn");

const routeTitle = document.getElementById("routeTitle");
const routeStatus = document.getElementById("routeStatus");
const routeNote = document.getElementById("routeNote");
const routeMetaText = document.getElementById("routeMetaText");
const panelRouteText = document.getElementById("panelRouteText");
const modePill = document.getElementById("modePill");
const musicStatusText = document.getElementById("musicStatusText");

const heartRateValue = document.getElementById("heartRateValue");
const distanceValue = document.getElementById("distanceValue");
const paceValue = document.getElementById("paceValue");
const runToggleLabel = document.getElementById("runToggleLabel");
const runToggleSub = document.getElementById("runToggleSub");
const runToggleIcon = document.getElementById("runToggleIcon");

let map = null;
let geolocation = null;
let autoComplete = null;
let placeSearch = null;
let walking = null;

let currentPosition = null;
let currentAddress = "Locating...";
let currentMarker = null;
let destinationMarker = null;
let currentRoute = null;
let isRunning = false;
let runTimer = null;
let simulatedDistance = 0;
let simulatedHeartRate = 98;
let simulatedPaceSeconds = 378;
let musicAuto = true;

initMap();

function initMap() {
    map = new AMap.Map("mapContainer", {
        zoom: 15,
        viewMode: "2D",
        resizeEnable: true,
    });

    AMap.plugin(
        ["AMap.Geolocation", "AMap.AutoComplete", "AMap.PlaceSearch", "AMap.Walking", "AMap.Scale"],
        function () {
            geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,
                timeout: 10000,
                position: "RB",
                offset: [10, 20],
                zoomToAccuracy: true
            });

            autoComplete = new AMap.AutoComplete({
                input: "searchInput"
            });

            placeSearch = new AMap.PlaceSearch({
                map: map,
                pageSize: 1,
                autoFitView: false
            });

            walking = new AMap.Walking({
                map: map,
                hideMarkers: true,
                autoFitView: true
            });

            map.addControl(new AMap.Scale());

            getCurrentLocation();
            bindEvents();
        }
    );
}

function bindEvents() {
    relocateBtn.addEventListener("click", getCurrentLocation);

    AMap.event.addListener(autoComplete, "select", function (event) {
        const tip = event.tip;

        if (tip && tip.location) {
            useDestination({
                name: tip.name,
                location: tip.location
            });
            return;
        }

        if (tip && tip.name) {
            searchPlaceByKeyword(tip.name);
        }
    });

    runToggleBtn.addEventListener("click", function () {
        if (isRunning) {
            pauseRun();
        } else {
            startRun();
        }
    });

    pauseBtn.addEventListener("click", pauseRun);
    finishBtn.addEventListener("click", finishRun);

    musicBtn.addEventListener("click", function () {
        musicAuto = !musicAuto;
        musicStatusText.textContent = musicAuto
            ? "Music adapts to heart rate and pace"
            : "Music sync paused";
    });

    sosBtn.addEventListener("click", function () {
        const locationText = currentAddress || "Current location";
        alert("SOS demo: your current location will be sent to your emergency contact.\n" + locationText);
    });
}

function getCurrentLocation() {
    routeStatus.textContent = "Locating";
    routeTitle.textContent = "Getting your current location";
    routeNote.textContent = "Once located, you can start a free run directly or enter a destination to generate a route.";

    geolocation.getCurrentPosition(function (status, result) {
        if (status === "complete" && result.position) {
            currentPosition = result.position;
            currentAddress = result.formattedAddress || "Current location";

            if (currentMarker) {
                currentMarker.setMap(null);
            }

            currentMarker = new AMap.Marker({
                position: currentPosition,
                map: map,
                title: "Current location"
            });

            map.setCenter(currentPosition);
            routeStatus.textContent = "Located";
            routeTitle.textContent = "Current location is ready";
            routeNote.textContent = currentAddress;
            routeMetaText.textContent = "No route planned";
            panelRouteText.textContent = "Free Run";
            modePill.textContent = "Free Run";
        } else {
            routeStatus.textContent = "Location Failed";
            routeTitle.textContent = "Unable to get location";
            routeNote.textContent = "Please check your browser location permission and try again.";
            alert("Failed to get current location. Please check your browser location permission.");
        }
    });
}

function searchPlaceByKeyword(keyword) {
    placeSearch.search(keyword, function (status, result) {
        if (status !== "complete" || !result.poiList || !result.poiList.pois.length) {
            alert("Destination not found. Please try another keyword.");
            return;
        }

        const poi = result.poiList.pois[0];

        useDestination({
            name: poi.name,
            location: poi.location
        });
    });
}

function useDestination(destination) {
    if (!currentPosition) {
        alert("Please finish locating your current position first.");
        return;
    }

    routeTitle.textContent = destination.name;
    routeStatus.textContent = "Planning";
    routeNote.textContent = "Generating the best route from your current location.";
    modePill.textContent = "Route Run";

    if (destinationMarker) {
        destinationMarker.setMap(null);
    }

    destinationMarker = new AMap.Marker({
        position: destination.location,
        map: map,
        title: destination.name
    });

    walking.clear();

    walking.search(currentPosition, destination.location, function (status, result) {
        if (status !== "complete" || !result.routes || !result.routes.length) {
            routeStatus.textContent = "Failed";
            routeNote.textContent = "Route generation failed. Please choose another destination.";
            alert("Route generation failed. Please choose another destination.");
            return;
        }

        const route = result.routes[0];
        const distanceKm = (route.distance / 1000).toFixed(2);
        const timeMin = Math.ceil(route.time / 60);

        currentRoute = {
            startName: currentAddress,
            destinationName: destination.name,
            distanceKm: distanceKm,
            timeMin: timeMin,
            origin: [currentPosition.lng, currentPosition.lat],
            destination: [destination.location.lng, destination.location.lat]
        };

        routeStatus.textContent = "Ready";
        routeNote.textContent = "Estimated " + distanceKm + " km · " + timeMin + " min";
        routeMetaText.textContent = distanceKm + " km · " + timeMin + " min";
        panelRouteText.textContent = "Route Run";
    });
}

function startRun() {
    isRunning = true;
    runToggleBtn.classList.add("running");
    runToggleLabel.textContent = "Running";
    runToggleSub.textContent = currentRoute ? "Route navigation in progress" : "Free run in progress";
    runToggleIcon.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 6V18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
            <path d="M15 6V18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
        </svg>
    `;
    routeStatus.textContent = "Running";

    if (runTimer) clearInterval(runTimer);

    runTimer = setInterval(function () {
        simulatedDistance += currentRoute ? 0.04 : 0.03;
        simulatedHeartRate = Math.min(168, simulatedHeartRate + Math.floor(Math.random() * 4 - 1));
        simulatedPaceSeconds = Math.max(320, Math.min(450, simulatedPaceSeconds + Math.floor(Math.random() * 9 - 4)));

        distanceValue.textContent = simulatedDistance.toFixed(2);
        heartRateValue.textContent = String(simulatedHeartRate);
        paceValue.textContent = formatPace(simulatedPaceSeconds);

        if (musicAuto) {
            if (simulatedHeartRate > 150) {
                musicStatusText.textContent = "Music softened for high heart rate";
            } else if (simulatedPaceSeconds < 350) {
                musicStatusText.textContent = "Music boosted with your pace";
            } else {
                musicStatusText.textContent = "Music adapts to heart rate and pace";
            }
        }
    }, 3000);
}

function pauseRun() {
    if (!isRunning) return;

    isRunning = false;
    runToggleBtn.classList.remove("running");
    runToggleLabel.textContent = "Resume Run";
    runToggleSub.textContent = currentRoute ? "Route run paused" : "Free run paused";
    runToggleIcon.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 6.5V17.5L17 12L8 6.5Z"/>
        </svg>
    `;
    routeStatus.textContent = "Paused";

    if (runTimer) {
        clearInterval(runTimer);
        runTimer = null;
    }
}

function finishRun() {
    pauseRun();
    simulatedDistance = 0;
    simulatedHeartRate = 98;
    simulatedPaceSeconds = 378;

    distanceValue.textContent = "0.00";
    heartRateValue.textContent = "98";
    paceValue.textContent = "--";
    runToggleLabel.textContent = "Tap to Run";
    runToggleSub.textContent = "Free Run / Route Run";
    routeStatus.textContent = currentRoute ? "Route Ready" : "Located";
    musicStatusText.textContent = musicAuto ? "Music sync ready" : "Music sync paused";
}

function formatPace(totalSeconds) {
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    return min + "'" + String(sec).padStart(2, "0") + '"';
}