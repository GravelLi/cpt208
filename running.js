const searchInput = document.getElementById("searchInput");
const relocateBtn = document.getElementById("relocateBtn");
const runToggleBtn = document.getElementById("runToggleBtn");
const pauseBtn = document.getElementById("pauseBtn");
const finishBtn = document.getElementById("finishBtn");
const musicBtn = document.getElementById("musicBtn");
const sosBtn = document.getElementById("sosBtn");
const touchBtn = document.getElementById("touchBtn");
const touchOverlay = document.getElementById("touchOverlay");
const touchStatusTitle = document.getElementById("touchStatusTitle");
const touchStatusText = document.getElementById("touchStatusText");

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
let buddyMarkers = [];
let currentRoute = null;
let isRunning = false;
let runTimer = null;
let simulatedDistance = 0;
let simulatedHeartRate = 98;
let simulatedPaceSeconds = 378;
let musicAuto = true;
let isMatchingBuddy = false;

const DEFAULT_OVERVIEW_ZOOM = 17;
const BUDDY_CLOSEUP_ZOOM = 20;

const buddyNamePool = [
    "Ava", "Mia", "Luna", "Zoe", "Ella", "Nora",
    "Ivy", "Ruby", "Coco", "Emma", "Lily", "Lucy",
    "Milo", "Leo", "Noah", "Owen", "Evan", "Alex"
];

const buddyColorPool = [
    "#ff8a80",
    "#ffb74d",
    "#81c784",
    "#4db6ac",
    "#64b5f6",
    "#7986cb",
    "#ba68c8",
    "#f06292",
    "#a1887f",
    "#90a4ae"
];

initMap();

function initMap() {
    map = new AMap.Map("mapContainer", {
        zoom: DEFAULT_OVERVIEW_ZOOM,
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
                zoomToAccuracy: false
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
    if (relocateBtn) {
        relocateBtn.addEventListener("click", getCurrentLocation);
    }

    if (autoComplete) {
        autoComplete.on("select", function (event) {
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
    }

    if (runToggleBtn) {
        runToggleBtn.addEventListener("click", function () {
            if (isRunning) {
                pauseRun();
            } else {
                startRun();
            }
        });
    }

    if (pauseBtn) {
        pauseBtn.addEventListener("click", pauseRun);
    }

    if (finishBtn) {
        finishBtn.addEventListener("click", finishRun);
    }

    if (musicBtn) {
        musicBtn.addEventListener("click", function () {
            window.location.href = "music.html?hr=" + simulatedHeartRate;
        });
    }

    if (sosBtn) {
        sosBtn.addEventListener("click", function () {
            const locationText = currentAddress || "Current location";
            alert("SOS demo: your current location will be sent to your emergency contact.\n" + locationText);
        });
    }

    if (touchBtn) {
        touchBtn.addEventListener("click", function () {
            startBuddyMatch();
        });
    }
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
                title: "Current location",
                zIndex: 200
            });

            map.setZoomAndCenter(DEFAULT_OVERVIEW_ZOOM, currentPosition, true);

            routeStatus.textContent = "Located";
            routeTitle.textContent = "Current location is ready";
            routeNote.textContent = currentAddress;
            routeMetaText.textContent = buddyMarkers.length > 0 ? getBuddyCountText() : "No route planned";
            panelRouteText.textContent = buddyMarkers.length > 0 ? "Free Run · Buddy" : "Free Run";
            modePill.textContent = "Free Run";

            if (buddyMarkers.length > 0) {
                layoutBuddyMarkers(true);
            }
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
        title: destination.name,
        zIndex: 100
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
        routeMetaText.textContent = buddyMarkers.length > 0
            ? distanceKm + " km · " + timeMin + " min · " + getBuddyCountText()
            : distanceKm + " km · " + timeMin + " min";
        panelRouteText.textContent = buddyMarkers.length > 0 ? "Route Run · Buddy" : "Route Run";

        if (buddyMarkers.length > 0) {
            layoutBuddyMarkers(true);
        }
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

    if (runTimer) {
        clearInterval(runTimer);
    }

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
                musicStatusText.textContent = buddyMarkers.length > 0
                    ? "Shared rhythm mode is on"
                    : "Music adapts to heart rate and pace";
            }
        }
    }, 3000);
}

function pauseRun() {
    if (!isRunning) {
        return;
    }

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

    routeMetaText.textContent = buddyMarkers.length > 0
        ? (
            currentRoute
                ? currentRoute.distanceKm + " km · " + currentRoute.timeMin + " min · " + getBuddyCountText()
                : getBuddyCountText()
        )
        : (
            currentRoute
                ? currentRoute.distanceKm + " km · " + currentRoute.timeMin + " min"
                : "No route planned"
        );

    musicStatusText.textContent = musicAuto
        ? (buddyMarkers.length > 0 ? "Shared run mode ready" : "Music sync ready")
        : "Music sync paused";
}

function startBuddyMatch() {
    if (!currentPosition) {
        alert("Please locate your current position first.");
        return;
    }

    if (isMatchingBuddy) {
        return;
    }

    isMatchingBuddy = true;

    touchStatusTitle.textContent = "Finding nearby runners...";
    touchStatusText.textContent = "Tap-to-match prototype is searching for a companion.";
    touchOverlay.classList.add("active");

    setTimeout(function () {
        touchStatusTitle.textContent = "Matched successfully";
        touchStatusText.textContent = "A nearby runner has joined your session.";
    }, 1500);

    setTimeout(function () {
        touchOverlay.classList.remove("active");

        createBuddyMarker();

        isMatchingBuddy = false;

        touchBtn.classList.add("paired");
        routeMetaText.textContent = currentRoute
            ? currentRoute.distanceKm + " km · " + currentRoute.timeMin + " min · " + getBuddyCountText()
            : getBuddyCountText();
        panelRouteText.textContent = currentRoute ? "Route Run · Buddy" : "Free Run · Buddy";
        routeNote.textContent = "Nearby runners joined after tap-to-match. They are gathered around your position.";
        musicStatusText.textContent = "Shared run mode ready";
    }, 2800);
}

function getBuddyCountText() {
    if (buddyMarkers.length === 0) {
        return "No buddy nearby";
    }

    if (buddyMarkers.length === 1) {
        return "1 buddy joined";
    }

    return buddyMarkers.length + " buddies joined";
}

function getRandomBuddyName() {
    const usedNames = buddyMarkers.map(function (marker) {
        return marker.__buddyName;
    }).filter(Boolean);

    const availableNames = buddyNamePool.filter(function (name) {
        return !usedNames.includes(name);
    });

    if (availableNames.length === 0) {
        return "Buddy-" + String(buddyMarkers.length + 1);
    }

    const randomIndex = Math.floor(Math.random() * availableNames.length);
    return availableNames[randomIndex];
}

function getRandomBuddyColor() {
    const randomIndex = Math.floor(Math.random() * buddyColorPool.length);
    return buddyColorPool[randomIndex];
}

function layoutBuddyMarkers(keepCloseView) {
    if (!currentPosition || buddyMarkers.length === 0) {
        return;
    }

    const lat = currentPosition.lat;
    const lng = currentPosition.lng;
    const total = buddyMarkers.length;

    const centerOffsetLat = -0.000050;
    const circleCenterLat = lat + centerOffsetLat;
    const circleCenterLng = lng;

    let radiusLat;
    if (total <= 2) {
        radiusLat = 0.00004;
    } else if (total <= 4) {
        radiusLat = 0.00005;
    } else if (total <= 6) {
        radiusLat = 0.00006;
    } else {
        radiusLat = 0.00007;
    }

    const radiusLng = radiusLat / Math.max(Math.cos(lat * Math.PI / 180), 0.2);

    buddyMarkers.forEach(function (marker, index) {
        const angle = (-Math.PI / 2) + (Math.PI * 2 * index / total);

        const offsetLng = Math.cos(angle) * radiusLng;
        const offsetLat = Math.sin(angle) * radiusLat;

        marker.setPosition([circleCenterLng + offsetLng, circleCenterLat + offsetLat]);
    });

    if (keepCloseView) {
        map.setZoomAndCenter(BUDDY_CLOSEUP_ZOOM, currentPosition, true);
    }
}

function createBuddyMarker() {
    if (!currentPosition) {
        return;
    }

    const buddyNumber = buddyMarkers.length + 1;
    const buddyName = getRandomBuddyName();
    const buddyColor = getRandomBuddyColor();

    const buddyContent = `
        <div class="buddy-marker">
            <div class="buddy-pin" style="--buddy-color: ${buddyColor};">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="7" r="3" fill="currentColor"></circle>
                    <path d="M12 11.5C9.5 11.5 7.5 13.4 7.2 16L6.9 18H17.1L16.8 16C16.5 13.4 14.5 11.5 12 11.5Z" fill="currentColor"></path>
                </svg>
            </div>
            <div class="buddy-label">${buddyName}</div>
        </div>
    `;

    const marker = new AMap.Marker({
        position: [currentPosition.lng, currentPosition.lat],
        map: map,
        offset: new AMap.Pixel(0, 0),
        content: buddyContent,
        title: buddyName + " · Buddy " + buddyNumber,
        zIndex: 120
    });

    marker.__buddyName = buddyName;
    buddyMarkers.push(marker);
    layoutBuddyMarkers(true);
}

function formatPace(totalSeconds) {
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    return min + "'" + String(sec).padStart(2, "0") + '"';
}