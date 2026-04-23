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

const sosOverlay = document.getElementById("sosOverlay");
const sosConfirmBtn = document.getElementById("sosConfirmBtn");
const sosCancelBtn = document.getElementById("sosCancelBtn");
const sosDialogText = document.getElementById("sosDialogText");

const musicPanel = document.getElementById("musicPanel");
const musicPanelBackdrop = document.getElementById("musicPanelBackdrop");
const closeMusicPanel = document.getElementById("closeMusicPanel");
const categoryTabs = document.getElementById("categoryTabs");
const nowPlayingTitle = document.getElementById("nowPlayingTitle");
const nowPlayingMeta = document.getElementById("nowPlayingMeta");
const trackSectionTitle = document.getElementById("trackSectionTitle");
const trackCountText = document.getElementById("trackCountText");
const trackList = document.getElementById("trackList");
const playPauseBtn = document.getElementById("playPauseBtn");
const playPauseIcon = document.getElementById("playPauseIcon");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const runMusicPlayer = document.getElementById("runMusicPlayer");

const adaptiveToggle = document.getElementById("adaptiveToggle");
const playbackSegmented = document.getElementById("playbackSegmented");

let playMode = "cross-list";
const PLAY_MODE_ORDER = ["single-loop", "list-loop", "cross-list"];

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
let buddyOrbitTimer = null;

let runElapsedSeconds = 0;
let simulatedDistance = 0;
let simulatedHeartRate = 98;
let simulatedPaceSeconds = 378;
let musicAuto = true;

let currentPathPoints = [];
let currentPathIndex = 0;
let freeRunTargetIndex = 0;

let currentTrackId = "";
let currentTrackIndex = -1;
let currentCategory = "recovery";
let recommendedCategory = "recovery";

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
    "#d36a44",
    "#7eb2cc"
];

const musicLibrary = {
    recovery: [
        { id: "recovery-1", title: "Beneath the Mask", artist: "Atlas Sound Team", file: "audio/Beneath_the_Mask.mp3" },
        { id: "recovery-2", title: "Don't Forget Me", artist: "Little End", file: "audio/Don't_Forget_Me.ogg" },
        { id: "recovery-3", title: "Kiss Me", artist: "Nai Br.XX/Celeina Ann", file: "audio/Kiss_Me.ogg" },
        { id: "recovery-4", title: "Am I Dreaming", artist: "Metro Boomin/A$AP Rocky/Roisee", file: "audio/Am_I_Dreaming.ogg" }
    ],
    easy: [
        { id: "easy-1", title: "IROHA's Dancing All Night", artist: "Conisch", file: "audio/IROHA's_Dancing_All_Night.ogg" },
        { id: "easy-2", title: "CHEERS", artist: "Mrs. GREEN APPLE", file: "audio/CHEERS.ogg" },
        { id: "easy-3", title: "Ignite", artist: "K-391/Alan Walker/Julie Bergan/승리", file: "audio/Ignite.ogg" },
        { id: "easy-4", title: "Endless War", artist: "Within Temptation", file: "audio/Endless_War.ogg" }
    ],
    tempo: [
        { id: "tempo-1", title: "Distortion‼", artist: "Kessoku Band", file: "audio/Distortion‼.ogg" },
        { id: "tempo-2", title: "ADAMAS", artist: "LiSA", file: "audio/ADAMAS.ogg" },
        { id: "tempo-3", title: "Never Going Back", artist: "The Score", file: "audio/Never_Going_Back.ogg" },
        { id: "tempo-4", title: "Inferno", artist: "Hiroyuki Sawano/mpi/Benjamin", file: "audio/Inferno.ogg" }
    ],
    sprint: [
        { id: "sprint-1", title: "MEGALOVANIA", artist: "Toby Fox", file: "audio/MEGALOVANIA.ogg" },
        { id: "sprint-2", title: "Power (In Your Soul)", artist: "Interupt/Luna LePage", file: "audio/Power (In Your Soul).ogg" },
        { id: "sprint-3", title: "Re:make", artist: "ONE OK ROCK", file: "audio/Re_make.mp3" },
        { id: "sprint-4", title: "Zoo", artist: "Disney/Shakira", file: "audio/Zoo.ogg" }
    ]
};

initMap();
initMusicPanel();

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
            startBuddyOrbit();
        }
    );
}

function initMusicPanel() {
    musicAuto = true;
    playMode = "cross-list";
    currentCategory = getHeartRateCategory(simulatedHeartRate);

    if (adaptiveToggle) {
        adaptiveToggle.checked = true;
    }

    renderRecommendation();
    renderTabs();
    renderTrackList();
    updatePlaybackModeUI();
    updatePlayPauseButton();
    updateNowPlayingCard();
    updateAdaptiveMusicStatus();
}

function bindEvents() {
    if (adaptiveToggle) {
        adaptiveToggle.addEventListener("change", function () {
            musicAuto = adaptiveToggle.checked;
            recommendedCategory = getHeartRateCategory(simulatedHeartRate);

            renderRecommendation();
            updateAdaptiveMusicStatus();
        });
    }

    if (playbackSegmented) {
        playbackSegmented.addEventListener("click", function (event) {
            const chip = event.target.closest(".playback-chip");
            if (!chip) {
                return;
            }

            playMode = chip.dataset.mode;
            updatePlaybackModeUI();
            updateAdaptiveMusicStatus();
        });
    }

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
            openMusicPanel();
        });
    }

    if (musicPanelBackdrop) {
        musicPanelBackdrop.addEventListener("click", closeMusicPanelView);
    }

    if (closeMusicPanel) {
        closeMusicPanel.addEventListener("click", closeMusicPanelView);
    }

    if (categoryTabs) {
        categoryTabs.addEventListener("click", function (event) {
            const tab = event.target.closest(".category-tab");
            if (!tab) {
                return;
            }

            currentCategory = tab.dataset.category;
            renderRecommendation();
            renderTabs();
            renderTrackList();
            updateAdaptiveMusicStatus();
        });
    }

    if (playPauseBtn) {
        playPauseBtn.addEventListener("click", function () {
            if (!currentTrackId) {
                const tracks = musicLibrary[currentCategory] || [];
                if (tracks.length) {
                    playTrack(tracks[0], 0);
                }
                return;
            }

            if (runMusicPlayer.paused) {
                runMusicPlayer.play().catch(function () {
                    console.log("Audio file is not ready yet.");
                });
            } else {
                runMusicPlayer.pause();
            }

            updatePlayPauseButton();
            updateAdaptiveMusicStatus();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", playPreviousByMode);
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", playNextByMode);
    }

    if (runMusicPlayer) {
        runMusicPlayer.addEventListener("play", function () {
            updatePlayPauseButton();
            updateAdaptiveMusicStatus();
        });

        runMusicPlayer.addEventListener("pause", function () {
            updatePlayPauseButton();
            updateAdaptiveMusicStatus();
        });

        runMusicPlayer.addEventListener("ended", playNextByMode);
    }

    if (sosBtn) {
        sosBtn.addEventListener("click", function () {
            openSosDialog();
        });
    }

    if (sosCancelBtn) {
        sosCancelBtn.addEventListener("click", function () {
            closeSosDialog();
        });
    }

    if (sosConfirmBtn) {
        sosConfirmBtn.addEventListener("click", function () {
            confirmSosAlert();
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

    renderRecommendation();
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

        if (musicAuto) {
            syncAdaptiveMusicByHeartRate();
        } else {
            renderRecommendation();
            updateAdaptiveMusicStatus();
        }
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

    if (walking) {
        walking.clear();
    }

    if (destinationMarker) {
        destinationMarker.setMap(null);
        destinationMarker = null;
    }

    buddyMarkers.forEach(function (marker) {
        marker.setMap(null);
    });
    buddyMarkers = [];

    if (touchBtn) {
        touchBtn.classList.remove("paired");
    }

    simulatedDistance = 0;
    simulatedHeartRate = 98;
    simulatedPaceSeconds = 378;
    runElapsedSeconds = 0;

    distanceValue.textContent = "0.00";
    heartRateValue.textContent = "98";
    paceValue.textContent = "--";
    runToggleLabel.textContent = "Start Run";
    runToggleSub.textContent = "Free Run / Route Run";
    routeStatus.textContent = "Ready";
    routeTitle.textContent = "Simulated start is ready";
    routeNote.textContent = currentAddress || "Xi'an Jiaotong-Liverpool University · Ren'ai Road";
    routeMetaText.textContent = "Campus fake run is ready";
    panelRouteText.textContent = "Free Run";
    modePill.textContent = "Free Run";

    currentRoute = null;
    currentPathPoints = [];
    currentPathIndex = 0;
    freeRunTargetIndex = 0;

    if (runMusicPlayer) {
        runMusicPlayer.pause();
        runMusicPlayer.currentTime = 0;
    }

    currentTrackId = "";
    currentTrackIndex = -1;
    currentCategory = getHeartRateCategory(simulatedHeartRate);

    if (fakeStartPosition) {
        updateCurrentPosition(fakeStartPosition, true);
    }

    renderRecommendation();
    renderTabs();
    renderTrackList();
    updateNowPlayingCard();
    updatePlayPauseButton();
    updateAdaptiveMusicStatus();
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
        simulatedPaceSeconds + (targetPace - simulatedPaceSeconds) * 0.28 + randomBetween(-2.8, 2.8),
        300,
        420
    );
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
    if (category === "recovery") return "Recovery";
    if (category === "easy") return "Easy Flow";
    if (category === "tempo") return "Tempo Push";
    return "Sprint Mode";
}

function renderRecommendation() {
    recommendedCategory = getHeartRateCategory(simulatedHeartRate);

    const label = getCategoryLabel(currentCategory);

    if (trackSectionTitle) {
        trackSectionTitle.textContent = label + " Playlist";
    }

    const tracks = musicLibrary[currentCategory] || [];
    if (trackCountText) {
        trackCountText.textContent = tracks.length + " tracks";
    }
}

function renderTabs() {
    const tabs = document.querySelectorAll(".category-tab");
    tabs.forEach(function (tab) {
        tab.classList.toggle("active", tab.dataset.category === currentCategory);
    });
}

function renderTrackList() {
    const tracks = musicLibrary[currentCategory] || [];

    trackList.innerHTML = tracks.map(function (track, index) {
        const isActive = track.id === currentTrackId;
        const isPlayingThisTrack = isActive && runMusicPlayer && !runMusicPlayer.paused;

        return `
            <article class="track-item ${isActive ? "is-active" : ""}">
                <div class="track-index">${String(index + 1).padStart(2, "0")}</div>

                <div class="track-main">
                    <strong>${track.title}</strong>
                    <p>${track.artist}</p>
                </div>

                <button class="track-action" type="button" data-track-id="${track.id}" data-track-index="${index}">
                    ${
                        isPlayingThisTrack
                            ? `
                                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <path d="M9 6V18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
                                    <path d="M15 6V18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
                                </svg>
                              `
                            : `
                                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <path d="M8 6.5V17.5L17 12L8 6.5Z"></path>
                                </svg>
                              `
                    }
                </button>
            </article>
        `;
    }).join("");

    const buttons = trackList.querySelectorAll(".track-action");
    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            const trackId = button.dataset.trackId;
            const trackIndex = Number(button.dataset.trackIndex);
            const selectedTrack = tracks.find(function (track) {
                return track.id === trackId;
            });

            if (!selectedTrack) {
                return;
            }

            const isCurrentTrack = selectedTrack.id === currentTrackId;

            if (isCurrentTrack) {
                if (runMusicPlayer.paused) {
                    runMusicPlayer.play().catch(function () {
                        console.log("Audio file is not ready yet.");
                    });
                } else {
                    runMusicPlayer.pause();
                }

                updatePlayPauseButton();
                updateAdaptiveMusicStatus();
                renderTrackList();
                return;
            }

            playTrack(selectedTrack, trackIndex);
        });
    });
}

function playTrack(track, index) {
    currentTrackId = track.id;
    currentTrackIndex = index;

    runMusicPlayer.src = track.file;
    runMusicPlayer.play().catch(function () {
        console.log("Audio file is not ready yet.");
    });

    if (nowPlayingTitle) {
        nowPlayingTitle.textContent = track.title;
    }

    if (nowPlayingMeta) {
        nowPlayingMeta.textContent = track.artist + " · " + getCategoryLabel(currentCategory);
    }

    renderTrackList();
    updatePlayPauseButton();
    updateAdaptiveMusicStatus();
}

function playPreviousTrack() {
    const tracks = musicLibrary[currentCategory] || [];
    if (!tracks.length) {
        return;
    }

    if (currentTrackIndex === -1) {
        playTrack(tracks[0], 0);
        return;
    }

    const nextIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    playTrack(tracks[nextIndex], nextIndex);
}

function playNextTrack() {
    const tracks = musicLibrary[currentCategory] || [];
    if (!tracks.length) {
        return;
    }

    if (currentTrackIndex === -1) {
        playTrack(tracks[0], 0);
        return;
    }

    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    playTrack(tracks[nextIndex], nextIndex);
}

function updatePlayPauseButton() {
    if (!playPauseIcon) {
        return;
    }

    if (!currentTrackId || runMusicPlayer.paused) {
        playPauseIcon.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 6.5V17.5L17 12L8 6.5Z"/>
            </svg>
        `;
    } else {
        playPauseIcon.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 6V18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
                <path d="M15 6V18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
            </svg>
        `;
    }
}

function updateNowPlayingCard() {
    if (!nowPlayingTitle || !nowPlayingMeta) {
        return;
    }

    if (!currentTrackId) {
        nowPlayingTitle.textContent = "Not playing";
        nowPlayingMeta.textContent = "Select a track below";
        return;
    }

    const trackInfo = findTrackByIdAnywhere(currentTrackId);

    if (!trackInfo || !trackInfo.track) {
        nowPlayingTitle.textContent = "Not playing";
        nowPlayingMeta.textContent = "Select a track below";
        return;
    }

    nowPlayingTitle.textContent = trackInfo.track.title;
    nowPlayingMeta.textContent = trackInfo.track.artist + " · " + getCategoryLabel(trackInfo.category);
}

function toggleRunMusic() {
    if (!currentTrackId) {
        const recommendedCategory = getHeartRateCategory(simulatedHeartRate);
        currentCategory = recommendedCategory;
        renderRecommendation();
        renderTabs();
        renderTrackList();

        const tracks = musicLibrary[currentCategory] || [];
        if (!tracks.length) {
            return;
        }

        playTrack(tracks[0], 0);
        musicAuto = true;
        return;
    }

    if (runMusicPlayer.paused) {
        runMusicPlayer.play().catch(function () {
            console.log("Audio file is not ready yet.");
        });
    } else {
        runMusicPlayer.pause();
    }

    updatePlayPauseButton();
    updateAdaptiveMusicStatus();
}

function syncAdaptiveMusicByHeartRate() {
    recommendedCategory = getHeartRateCategory(simulatedHeartRate);
    renderRecommendation();

    if (!musicAuto) {
        updateAdaptiveMusicStatus();
        return;
    }

    if (!currentTrackId) {
        updateAdaptiveMusicStatus();
        return;
    }

    const playingInfo = findTrackByIdAnywhere(currentTrackId);
    if (!playingInfo) {
        updateAdaptiveMusicStatus();
        return;
    }

    if (playingInfo.category === recommendedCategory) {
        updateAdaptiveMusicStatus();
        return;
    }

    const shouldKeepPlaying = !runMusicPlayer.paused;
    const targetTracks = musicLibrary[recommendedCategory] || [];

    if (!targetTracks.length) {
        updateAdaptiveMusicStatus();
        return;
    }

    if (shouldKeepPlaying) {
        const previousManualCategory = currentCategory;

        currentCategory = recommendedCategory;
        playTrack(targetTracks[0], 0);

        currentCategory = previousManualCategory;
        renderTabs();
        renderTrackList();
    } else {
        updateAdaptiveMusicStatus();
    }
}

function updateAdaptiveMusicStatus() {
    const syncLabel = musicAuto ? "Heart Rate Sync On" : "Heart Rate Sync Off";
    const modeLabel = getPlayModeLabel(playMode);
    const recLabel = getCategoryLabel(recommendedCategory);

    if (!currentTrackId) {
        musicStatusText.textContent = syncLabel + " · " + modeLabel + " · Recommended " + recLabel;
        return;
    }

    const trackInfo = findTrackByIdAnywhere(currentTrackId);

    if (!trackInfo || !trackInfo.track) {
        musicStatusText.textContent = syncLabel + " · " + modeLabel + " · Recommended " + recLabel;
        return;
    }

    const playState = runMusicPlayer.paused ? "Paused" : "Playing";
    musicStatusText.textContent = playState + " · " + trackInfo.track.title + " · Recommended " + recLabel;
}

function openMusicPanel() {
    musicPanel.classList.add("active");
    musicPanel.setAttribute("aria-hidden", "false");
}

function closeMusicPanelView() {
    musicPanel.classList.remove("active");
    musicPanel.setAttribute("aria-hidden", "true");
}

function createBuddyMarker() {
    if (!currentPosition) {
        return;
    }

    const index = buddyMarkers.length;
    const angle = (index / Math.max(1, 4)) * Math.PI * 2;
    const radius = 0.00018 + (index % 3) * 0.00004;

    const marker = new AMap.Marker({
        position: [
            currentPosition.lng + Math.cos(angle) * radius,
            currentPosition.lat + Math.sin(angle) * radius
        ],
        map: map,
        zIndex: 180,
        offset: new AMap.Pixel(0, 0),
        content: buildBuddyMarkerHTML(
            buddyNamePool[index % buddyNamePool.length],
            buddyColorPool[index % buddyColorPool.length]
        )
    });

    marker.__orbitAngle = angle;
    marker.__orbitRadius = radius;

    buddyMarkers.push(marker);
    layoutBuddyMarkers(true);
}

function buildBuddyMarkerHTML(name, color) {
    return `
        <div class="buddy-marker">
            <div class="buddy-pin" style="background:${color}">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="8.2" r="3.2" fill="currentColor"></circle>
                    <path d="M6.8 18.5C7.8 15.9 9.6 14.7 12 14.7C14.4 14.7 16.2 15.9 17.2 18.5" fill="currentColor"></path>
                </svg>
            </div>
            <div class="buddy-label">${name}</div>
        </div>
    `;
}

function layoutBuddyMarkers(shouldFitView) {
    if (!currentPosition || !buddyMarkers.length) {
        return;
    }

    buddyMarkers.forEach(function (marker) {
        const angle = marker.__orbitAngle || 0;
        const radius = marker.__orbitRadius || 0.00018;

        marker.setPosition([
            currentPosition.lng + Math.cos(angle) * radius,
            currentPosition.lat + Math.sin(angle) * radius
        ]);
    });

    if (shouldFitView) {
        if (currentMarker) {
            map.setZoomAndCenter(BUDDY_CLOSEUP_ZOOM, [currentPosition.lng, currentPosition.lat], true);
        }
    }
}

function startBuddyOrbit() {
    if (buddyOrbitTimer) {
        clearInterval(buddyOrbitTimer);
    }

    buddyOrbitTimer = setInterval(function () {
        if (!buddyMarkers.length || !currentPosition) {
            return;
        }

        buddyMarkers.forEach(function (marker, index) {
            marker.__orbitAngle = (marker.__orbitAngle || 0) + 0.08 + index * 0.002;
        });

        layoutBuddyMarkers(false);
    }, 900);
}

function getBuddyCountText() {
    if (buddyMarkers.length === 1) {
        return "1 buddy nearby";
    }

    return buddyMarkers.length + " buddies nearby";
}

function extractPathFromRoute(route) {
    if (!route) {
        return [];
    }

    const path = [];

    if (route.steps && route.steps.length) {
        route.steps.forEach(function (step) {
            if (step.path && step.path.length) {
                step.path.forEach(function (point) {
                    const plain = toPlainLngLat(point);
                    path.push([plain.lng, plain.lat]);
                });
            }
        });
    }

    return path;
}

function normalizePath(path, targetCount) {
    if (!Array.isArray(path) || !path.length) {
        return [];
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

function buildFakeLoopTargets(origin) {
    return [
        { lng: origin.lng + 0.0012, lat: origin.lat + 0.0002 },
        { lng: origin.lng + 0.0008, lat: origin.lat + 0.0011 },
        { lng: origin.lng - 0.0002, lat: origin.lat + 0.0012 },
        { lng: origin.lng - 0.0010, lat: origin.lat + 0.0005 },
        { lng: origin.lng - 0.0011, lat: origin.lat - 0.0004 },
        { lng: origin.lng - 0.0002, lat: origin.lat - 0.0012 },
        { lng: origin.lng + 0.0009, lat: origin.lat - 0.0010 },
        { lng: origin.lng + 0.0012, lat: origin.lat - 0.0001 }
    ];
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

function openSosDialog() {
    if (sosDialogText) {
        sosDialogText.textContent = "Are you sure you want to send an emergency alert with your current location to your emergency contact?";
    }

    if (sosOverlay) {
        sosOverlay.classList.add("active");
        sosOverlay.setAttribute("aria-hidden", "false");
    }
}

function closeSosDialog() {
    if (sosOverlay) {
        sosOverlay.classList.remove("active");
        sosOverlay.setAttribute("aria-hidden", "true");
    }
}

function confirmSosAlert() {
    if (sosDialogText) {
        sosDialogText.textContent = "Emergency alert sent successfully. Your trusted contact has received your live location.";
    }

    setTimeout(function () {
        closeSosDialog();
        if (sosDialogText) {
            sosDialogText.textContent = "Are you sure you want to send an emergency alert with your current location to your emergency contact?";
        }
    }, 1200);
}

function getAllCategoryKeys() {
    return ["recovery", "easy", "tempo", "sprint"];
}

function findTrackByIdAnywhere(trackId) {
    const categoryKeys = getAllCategoryKeys();

    for (let i = 0; i < categoryKeys.length; i += 1) {
        const category = categoryKeys[i];
        const tracks = musicLibrary[category] || [];
        const index = tracks.findIndex(function (track) {
            return track.id === trackId;
        });

        if (index !== -1) {
            return {
                category: category,
                index: index,
                track: tracks[index]
            };
        }
    }

    return null;
}

function playTrackInCategory(category, index) {
    const tracks = musicLibrary[category] || [];
    if (!tracks.length || index < 0 || index >= tracks.length) {
        return;
    }

    currentCategory = category;
    renderRecommendation();
    renderTabs();
    playTrack(tracks[index], index);
}

function playNextByMode() {
    if (playMode === "single-loop") {
        if (currentTrackId && runMusicPlayer) {
            runMusicPlayer.currentTime = 0;
            runMusicPlayer.play().catch(function () {
                console.log("Audio file is not ready yet.");
            });
        }
        return;
    }

    const tracks = musicLibrary[currentCategory] || [];
    if (!tracks.length) {
        return;
    }

    if (currentTrackIndex < tracks.length - 1) {
        playTrack(tracks[currentTrackIndex + 1], currentTrackIndex + 1);
        return;
    }

    if (playMode === "list-loop") {
        playTrack(tracks[0], 0);
        return;
    }

    if (playMode === "cross-list") {
        const categoryKeys = getAllCategoryKeys();
        const currentCategoryIndex = categoryKeys.indexOf(currentCategory);
        const nextCategory = categoryKeys[(currentCategoryIndex + 1) % categoryKeys.length];
        playTrackInCategory(nextCategory, 0);
    }
}

function playPreviousByMode() {
    const tracks = musicLibrary[currentCategory] || [];
    if (!tracks.length) {
        return;
    }

    if (playMode === "single-loop") {
        if (currentTrackId && runMusicPlayer) {
            runMusicPlayer.currentTime = 0;
            runMusicPlayer.play().catch(function () {
                console.log("Audio file is not ready yet.");
            });
        }
        return;
    }

    if (currentTrackIndex > 0) {
        playTrack(tracks[currentTrackIndex - 1], currentTrackIndex - 1);
        return;
    }

    if (playMode === "list-loop") {
        playTrack(tracks[tracks.length - 1], tracks.length - 1);
        return;
    }

    if (playMode === "cross-list") {
        const categoryKeys = getAllCategoryKeys();
        const currentCategoryIndex = categoryKeys.indexOf(currentCategory);
        const prevCategory = categoryKeys[(currentCategoryIndex - 1 + categoryKeys.length) % categoryKeys.length];
        const prevTracks = musicLibrary[prevCategory] || [];
        if (prevTracks.length) {
            playTrackInCategory(prevCategory, prevTracks.length - 1);
        }
    }
}

function updateNowPlayingCard() {
    if (!nowPlayingTitle || !nowPlayingMeta) {
        return;
    }

    if (!currentTrackId) {
        nowPlayingTitle.textContent = "Not playing";
        nowPlayingMeta.textContent = "Select a track below";
        return;
    }

    const trackInfo = findTrackByIdAnywhere(currentTrackId);

    if (!trackInfo || !trackInfo.track) {
        nowPlayingTitle.textContent = "Not playing";
        nowPlayingMeta.textContent = "Select a track below";
        return;
    }

    nowPlayingTitle.textContent = trackInfo.track.title;
    nowPlayingMeta.textContent = trackInfo.track.artist + " · " + getCategoryLabel(trackInfo.category);
}

function getPlayModeLabel(mode) {
    if (mode === "single-loop") return "Single Loop";
    if (mode === "cross-list") return "Cross-list";
    return "List Loop";
}

function updatePlaybackModeUI() {
    const chips = document.querySelectorAll(".playback-chip");

    chips.forEach(function (chip) {
        chip.classList.remove("active");

        if (chip.dataset.mode === playMode) {
            chip.classList.add("active");
        }
    });
}