const searchInput = document.getElementById("searchInput");
const relocateBtn = document.getElementById("relocateBtn");
const runToggleBtn = document.getElementById("runToggleBtn");
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
let autoComplete = null;
let placeSearch = null;
let walking = null;

let currentPosition = null;
let fakeStartPosition = null;
let currentAddress = "Simulated location";
let currentMarker = null;
let destinationMarker = null;
let buddyMarkers = [];
let currentRoute = null;

let isRunning = false;
let isMatchingBuddy = false;

let runTimer = null;
let movementTimer = null;
let runElapsedSeconds = 0;
let simulatedDistance = 0;
let simulatedHeartRate = 98;
let simulatedPaceSeconds = 378;
let musicAuto = true;

let currentPathPoints = [];
let currentPathIndex = 0;
let freeRunTargetIndex = 0;

const DEFAULT_OVERVIEW_ZOOM = 17;
const BUDDY_CLOSEUP_ZOOM = 19;

const FAKE_START_KEYWORD = "西交利物浦大学 仁爱路";
const FAKE_START_FALLBACK = {
    lng: 120.744250,
    lat: 31.274620,
    name: "Xi'an Jiaotong-Liverpool University · Ren'ai Road"
};

const RUN_PROFILE = {
    peakHeartRate: 158,
    settleHeartRate: 145,
    riseSeconds: 36,
    settleSeconds: 24
};

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

const autoMusicLibrary = {
    recovery: {
        title: "Soft Sunrise",
        file: "audio/recovery-1.mp3"
    },
    easy: {
        title: "City Light Run",
        file: "audio/easy-1.mp3"
    },
    tempo: {
        title: "Pace Driver",
        file: "audio/tempo-1.mp3"
    },
    sprint: {
        title: "Redline Burst",
        file: "audio/sprint-1.mp3"
    }
};

initMap();

function initMap() {
    map = new AMap.Map("mapContainer", {
        zoom: DEFAULT_OVERVIEW_ZOOM,
        viewMode: "2D",
        resizeEnable: true
    });

    AMap.plugin(
        ["AMap.AutoComplete", "AMap.PlaceSearch", "AMap.Walking", "AMap.Scale"],
        function () {
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

            bindEvents();
            getCurrentLocation();
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
                    location: toPlainLngLat(tip.location)
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

    if (finishBtn) {
        finishBtn.addEventListener("click", finishRun);
    }

    if (musicBtn) {
        musicBtn.addEventListener("click", function () {
            window.location.href = "music.html?hr=" + Math.round(simulatedHeartRate);
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
    routeTitle.textContent = "Loading simulated location";
    routeNote.textContent = "Starting point will be placed at Xi'an Jiaotong-Liverpool University · Ren'ai Road.";

    placeSearch.search(FAKE_START_KEYWORD, function (status, result) {
        if (status === "complete" && result.poiList && result.poiList.pois && result.poiList.pois.length) {
            const poi = result.poiList.pois[0];
            const fakePosition = toPlainLngLat(poi.location);

            applyFakeLocation(fakePosition, poi.name || FAKE_START_FALLBACK.name);
            return;
        }

        applyFakeLocation(
            {
                lng: FAKE_START_FALLBACK.lng,
                lat: FAKE_START_FALLBACK.lat
            },
            FAKE_START_FALLBACK.name
        );
    });
}

function applyFakeLocation(position, name) {
    currentPosition = {
        lng: position.lng,
        lat: position.lat
    };

    fakeStartPosition = {
        lng: position.lng,
        lat: position.lat
    };

    currentAddress = name || FAKE_START_FALLBACK.name;

    if (currentMarker) {
        currentMarker.setMap(null);
    }

    currentMarker = new AMap.Marker({
        position: [currentPosition.lng, currentPosition.lat],
        map: map,
        title: "Current location",
        zIndex: 200
    });

    map.setZoomAndCenter(DEFAULT_OVERVIEW_ZOOM, [currentPosition.lng, currentPosition.lat], true);

    routeStatus.textContent = "Ready";
    routeTitle.textContent = "Simulated start is ready";
    routeNote.textContent = currentAddress;
    routeMetaText.textContent = buddyMarkers.length > 0 ? getBuddyCountText() : "Campus fake run is ready";
    panelRouteText.textContent = buddyMarkers.length > 0 ? "Free Run · Buddy" : "Free Run";
    modePill.textContent = "Free Run";

    if (walking) {
        walking.clear();
    }

    if (destinationMarker) {
        destinationMarker.setMap(null);
        destinationMarker = null;
    }

    currentRoute = null;
    currentPathPoints = [];
    currentPathIndex = 0;
    freeRunTargetIndex = 0;

    if (buddyMarkers.length > 0) {
        layoutBuddyMarkers(true);
    }

    updateAdaptiveMusicStatus();
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
            location: toPlainLngLat(poi.location)
        });
    });
}

function useDestination(destination) {
    if (!currentPosition) {
        alert("Please wait for the simulated start point to load first.");
        return;
    }

    routeTitle.textContent = destination.name;
    routeStatus.textContent = "Planning";
    routeNote.textContent = "Generating a fake run route from the campus start point.";

    if (destinationMarker) {
        destinationMarker.setMap(null);
    }

    destinationMarker = new AMap.Marker({
        position: [destination.location.lng, destination.location.lat],
        map: map,
        title: destination.name,
        zIndex: 100
    });

    walking.clear();

    walking.search(
        [currentPosition.lng, currentPosition.lat],
        [destination.location.lng, destination.location.lat],
        function (status, result) {
            if (status !== "complete" || !result.routes || !result.routes.length) {
                routeStatus.textContent = "Failed";
                routeNote.textContent = "Route generation failed. Please choose another destination.";
                alert("Route generation failed. Please choose another destination.");
                return;
            }

            const route = result.routes[0];
            const distanceKm = (route.distance / 1000).toFixed(2);
            const timeMin = Math.ceil(route.time / 60);
            const path = normalizePath(extractPathFromRoute(route), 70);

            currentRoute = {
                startName: currentAddress,
                destinationName: destination.name,
                distanceKm: distanceKm,
                timeMin: timeMin,
                destination: {
                    lng: destination.location.lng,
                    lat: destination.location.lat
                },
                path: path,
                isFreeRun: false
            };

            routeStatus.textContent = "Ready";
            routeNote.textContent = "Estimated " + distanceKm + " km · " + timeMin + " min";
            routeMetaText.textContent = buddyMarkers.length > 0
                ? distanceKm + " km · " + timeMin + " min · " + getBuddyCountText()
                : distanceKm + " km · " + timeMin + " min";
            panelRouteText.textContent = buddyMarkers.length > 0 ? "Route Run · Buddy" : "Route Run";
            modePill.textContent = "Route Run";

            if (buddyMarkers.length > 0) {
                layoutBuddyMarkers(true);
            }
        }
    );
}

function startRun() {
    if (!currentPosition) {
        alert("Please wait for the simulated start point to load first.");
        return;
    }

    isRunning = true;
    runToggleBtn.classList.add("running");
    runToggleLabel.textContent = "Running";
    runToggleSub.textContent = currentRoute ? "Fake route run in progress" : "Campus fake run in progress";
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
        runElapsedSeconds += 1.2;
        updateHeartRateProfile();
        updatePaceProfile();

        heartRateValue.textContent = String(Math.round(simulatedHeartRate));
        paceValue.textContent = formatPace(Math.round(simulatedPaceSeconds));

        updateAdaptiveMusicStatus();
    }, 1200);

    if (currentRoute && currentRoute.destination && !currentRoute.isFreeRun) {
        planRouteSegmentToDestination(currentRoute.destination);
    } else {
        planNextFreeRunSegment();
    }
}

function pauseRun() {
    if (!isRunning) {
        return;
    }

    isRunning = false;
    runToggleBtn.classList.remove("running");
    runToggleLabel.textContent = "Resume Run";
    runToggleSub.textContent = currentRoute ? "Fake route run paused" : "Campus fake run paused";
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

    if (movementTimer) {
        clearInterval(movementTimer);
        movementTimer = null;
    }
}

function finishRun() {
    pauseRun();

    simulatedDistance = 0;
    simulatedHeartRate = 98;
    simulatedPaceSeconds = 378;
    runElapsedSeconds = 0;

    distanceValue.textContent = "0.00";
    heartRateValue.textContent = "98";
    paceValue.textContent = "--";
    runToggleLabel.textContent = "Start Run";
    runToggleSub.textContent = "Free Run / Route Run";
    routeStatus.textContent = currentRoute ? "Route Ready" : "Ready";
    routeMetaText.textContent = currentRoute
        ? currentRoute.distanceKm + " km · " + currentRoute.timeMin + " min"
        : "Campus fake run is ready";
    musicStatusText.textContent = musicAuto ? "Music sync ready" : "Music sync paused";

    if (fakeStartPosition) {
        updateCurrentPosition(fakeStartPosition, true);
    }

    if (currentRoute && currentRoute.isFreeRun) {
        currentRoute = null;
    }

    currentPathPoints = [];
    currentPathIndex = 0;
}

function startBuddyMatch() {
    if (!currentPosition) {
        alert("Please wait for the simulated start point to load first.");
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
        routeNote.textContent = "Nearby runners joined after tap-to-match. They now follow your simulated run.";
        updateAdaptiveMusicStatus();
    }, 2800);
}

function planRouteSegmentToDestination(destination) {
    if (!isRunning || !destination) {
        return;
    }

    walking.clear();

    walking.search(
        [currentPosition.lng, currentPosition.lat],
        [destination.lng, destination.lat],
        function (status, result) {
            if (status === "complete" && result.routes && result.routes.length) {
                const route = result.routes[0];
                const path = normalizePath(extractPathFromRoute(route), 70);

                currentPathPoints = path;
                currentPathIndex = 0;
                startMovementAlongCurrentPath(function () {
                    if (isRunning) {
                        currentRoute.isFreeRun = true;
                        planNextFreeRunSegment();
                    }
                });
                return;
            }

            const fallbackPath = buildFallbackPath(
                [currentPosition.lng, currentPosition.lat],
                [destination.lng, destination.lat],
                40
            );

            currentPathPoints = fallbackPath;
            currentPathIndex = 0;
            startMovementAlongCurrentPath(function () {
                if (isRunning) {
                    currentRoute.isFreeRun = true;
                    planNextFreeRunSegment();
                }
            });
        }
    );
}

function planNextFreeRunSegment() {
    if (!isRunning || !fakeStartPosition) {
        return;
    }

    const targets = buildFakeLoopTargets(fakeStartPosition);
    const target = targets[freeRunTargetIndex % targets.length];
    freeRunTargetIndex += 1;

    routeTitle.textContent = "Campus loop";
    routeStatus.textContent = "Planning";
    routeNote.textContent = "Fake run is following nearby roads around XJTLU.";

    currentRoute = {
        isFreeRun: true,
        destination: {
            lng: target.lng,
            lat: target.lat
        }
    };

    walking.clear();

    walking.search(
        [currentPosition.lng, currentPosition.lat],
        [target.lng, target.lat],
        function (status, result) {
            let path = [];

            if (status === "complete" && result.routes && result.routes.length) {
                path = normalizePath(extractPathFromRoute(result.routes[0]), 55);
            } else {
                path = buildFallbackPath(
                    [currentPosition.lng, currentPosition.lat],
                    [target.lng, target.lat],
                    36
                );
            }

            currentPathPoints = path;
            currentPathIndex = 0;

            routeStatus.textContent = "Running";
            routeMetaText.textContent = buddyMarkers.length > 0
                ? "Campus fake run · " + getBuddyCountText()
                : "Campus fake run";

            startMovementAlongCurrentPath(function () {
                if (isRunning) {
                    planNextFreeRunSegment();
                }
            });
        }
    );
}

function startMovementAlongCurrentPath(onComplete) {
    if (movementTimer) {
        clearInterval(movementTimer);
    }

    if (!currentPathPoints || currentPathPoints.length < 2) {
        if (typeof onComplete === "function") {
            onComplete();
        }
        return;
    }

    let previousPoint = currentPathPoints[currentPathIndex] || currentPathPoints[0];

    updateCurrentPosition(
        {
            lng: previousPoint[0],
            lat: previousPoint[1]
        },
        true
    );

    movementTimer = setInterval(function () {
        if (!isRunning) {
            clearInterval(movementTimer);
            movementTimer = null;
            return;
        }

        currentPathIndex += 1;

        if (currentPathIndex >= currentPathPoints.length) {
            clearInterval(movementTimer);
            movementTimer = null;

            if (typeof onComplete === "function") {
                onComplete();
            }
            return;
        }

        const nextPoint = currentPathPoints[currentPathIndex];

        simulatedDistance += distanceBetweenPoints(previousPoint, nextPoint) / 1000;
        distanceValue.textContent = simulatedDistance.toFixed(2);

        updateCurrentPosition(
            {
                lng: nextPoint[0],
                lat: nextPoint[1]
            },
            true
        );

        previousPoint = nextPoint;
    }, 900);
}

function updateCurrentPosition(position, moveMap) {
    currentPosition = {
        lng: position.lng,
        lat: position.lat
    };

    if (currentMarker) {
        currentMarker.setPosition([currentPosition.lng, currentPosition.lat]);
    }

    if (buddyMarkers.length > 0) {
        layoutBuddyMarkers(false);
    }

    if (moveMap) {
        if (buddyMarkers.length > 0) {
            map.setZoomAndCenter(BUDDY_CLOSEUP_ZOOM, [currentPosition.lng, currentPosition.lat], true);
        } else {
            map.setCenter([currentPosition.lng, currentPosition.lat]);
        }
    }
}

function updateHeartRateProfile() {
    const t = runElapsedSeconds;
    let targetHeartRate = RUN_PROFILE.settleHeartRate;

    if (t <= RUN_PROFILE.riseSeconds) {
        const progress = t / RUN_PROFILE.riseSeconds;
        targetHeartRate = 98 + (RUN_PROFILE.peakHeartRate - 98) * progress;
    } else if (t <= RUN_PROFILE.riseSeconds + RUN_PROFILE.settleSeconds) {
        const settleProgress = (t - RUN_PROFILE.riseSeconds) / RUN_PROFILE.settleSeconds;
        targetHeartRate = RUN_PROFILE.peakHeartRate - (RUN_PROFILE.peakHeartRate - RUN_PROFILE.settleHeartRate) * settleProgress;
    } else {
        targetHeartRate = RUN_PROFILE.settleHeartRate + randomBetween(-4, 4);
    }

    simulatedHeartRate = clamp(
        simulatedHeartRate + (targetHeartRate - simulatedHeartRate) * 0.38 + randomBetween(-1.2, 1.2),
        92,
        160
    );
}

function updatePaceProfile() {
    let targetPace = 340;

    if (runElapsedSeconds <= RUN_PROFILE.riseSeconds) {
        targetPace = 375 - (35 * (runElapsedSeconds / RUN_PROFILE.riseSeconds));
    } else if (runElapsedSeconds <= RUN_PROFILE.riseSeconds + RUN_PROFILE.settleSeconds) {
        const settleProgress = (runElapsedSeconds - RUN_PROFILE.riseSeconds) / RUN_PROFILE.settleSeconds;
        targetPace = 340 + (20 * settleProgress);
    } else {
        targetPace = 356 + randomBetween(-10, 10);
    }

    simulatedPaceSeconds = clamp(
        simulatedPaceSeconds + (targetPace - simulatedPaceSeconds) * 0.28,
        320,
        410
    );
}

function updateAdaptiveMusicStatus() {
    if (!musicAuto) {
        musicStatusText.textContent = "Music sync paused";
        return;
    }

    const category = getHeartRateCategory(simulatedHeartRate);
    const music = autoMusicLibrary[category];
    musicStatusText.textContent = getCategoryLabel(category) + " · " + music.title;
}

function getHeartRateCategory(heartRate) {
    if (heartRate <= 105) {
        return "recovery";
    }

    if (heartRate <= 125) {
        return "easy";
    }

    if (heartRate <= 150) {
        return "tempo";
    }

    return "sprint";
}

function getCategoryLabel(category) {
    if (category === "recovery") {
        return "Recovery";
    }

    if (category === "easy") {
        return "Easy Flow";
    }

    if (category === "tempo") {
        return "Tempo Push";
    }

    return "Sprint Mode";
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
        map.setZoomAndCenter(BUDDY_CLOSEUP_ZOOM, [currentPosition.lng, currentPosition.lat], true);
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

function buildFakeLoopTargets(startPosition) {
    const lng = startPosition.lng;
    const lat = startPosition.lat;

    return [
        { lng: lng + 0.00155, lat: lat - 0.00012 },
        { lng: lng + 0.00115, lat: lat - 0.00110 },
        { lng: lng + 0.00010, lat: lat - 0.00155 },
        { lng: lng - 0.00105, lat: lat - 0.00100 },
        { lng: lng - 0.00125, lat: lat + 0.00010 },
        { lng: lng - 0.00010, lat: lat + 0.00072 },
        { lng: lng + 0.00100, lat: lat + 0.00045 }
    ];
}

function extractPathFromRoute(route) {
    const points = [];

    if (!route || !route.steps) {
        return points;
    }

    route.steps.forEach(function (step) {
        if (!step.path || !step.path.length) {
            return;
        }

        step.path.forEach(function (point) {
            const plainPoint = toPlainLngLat(point);
            const lastPoint = points[points.length - 1];

            if (!lastPoint || lastPoint[0] !== plainPoint.lng || lastPoint[1] !== plainPoint.lat) {
                points.push([plainPoint.lng, plainPoint.lat]);
            }
        });
    });

    return points;
}

function normalizePath(path, targetCount) {
    if (!path || path.length <= 2) {
        return path || [];
    }

    if (path.length <= targetCount) {
        return path;
    }

    const normalized = [];
    const step = (path.length - 1) / (targetCount - 1);

    for (let i = 0; i < targetCount; i += 1) {
        const index = Math.round(i * step);
        normalized.push(path[index]);
    }

    return normalized;
}

function buildFallbackPath(start, end, segments) {
    const path = [];

    for (let i = 0; i <= segments; i += 1) {
        const ratio = i / segments;
        path.push([
            start[0] + (end[0] - start[0]) * ratio,
            start[1] + (end[1] - start[1]) * ratio
        ]);
    }

    return path;
}

function toPlainLngLat(point) {
    if (!point) {
        return {
            lng: FAKE_START_FALLBACK.lng,
            lat: FAKE_START_FALLBACK.lat
        };
    }

    if (typeof point.getLng === "function" && typeof point.getLat === "function") {
        return {
            lng: point.getLng(),
            lat: point.getLat()
        };
    }

    if (typeof point.lng === "number" && typeof point.lat === "number") {
        return {
            lng: point.lng,
            lat: point.lat
        };
    }

    if (Array.isArray(point) && point.length >= 2) {
        return {
            lng: Number(point[0]),
            lat: Number(point[1])
        };
    }

    return {
        lng: FAKE_START_FALLBACK.lng,
        lat: FAKE_START_FALLBACK.lat
    };
}

function distanceBetweenPoints(pointA, pointB) {
    const lng1 = pointA[0] * Math.PI / 180;
    const lat1 = pointA[1] * Math.PI / 180;
    const lng2 = pointB[0] * Math.PI / 180;
    const lat2 = pointB[1] * Math.PI / 180;

    const dLng = lng2 - lng1;
    const dLat = lat2 - lat1;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
        + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return 6371000 * c;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function randomBetween(min, max) {
    return min + Math.random() * (max - min);
}

function formatPace(totalSeconds) {
    const min = Math.floor(totalSeconds / 60);
    const sec = Math.round(totalSeconds % 60);
    return min + "'" + String(sec).padStart(2, "0") + '"';
}