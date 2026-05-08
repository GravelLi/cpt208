# HerRun

HerRun is a mobile-first running web app prototype for the CPT208 Human-Centric Computing group project. It belongs to the **C1 Go Runners** topic and focuses on creating a supportive, playful, and body-aware running experience for student runners, especially women runners.

The prototype combines mood-aware goals, cycle-aware running suggestions, safety support, adaptive music, and wearable-style health feedback.

## Live Demo

https://gravelli.github.io/cpt208/

## Source Code

https://github.com/GravelLi/cpt208

## Main Features

- Mood-based daily running goal
- Cycle Calendar and cycle-aware running reminder
- Running map with destination search and simulated running state
- SOS confirmation and buddy matching
- Adaptive music panel
- Health Data dashboard with wearable-style metrics
- Profile page with device and safety settings

## Technology Stack

- HTML
- CSS
- JavaScript
- GitHub Pages
- AMap map service
- LocalStorage
- Local image and audio assets

## How to Run Locally

1. Clone the repository:

```bash
git clone https://github.com/GravelLi/cpt208.git
````

2. Enter the project folder:

```bash
cd cpt208
```

3. Open `index.html` in a browser.

For a better preview, open the folder in VS Code and use a local server extension such as Live Server.

## Project Structure

```text
index.html          Home page
index.css           Home page and cycle page styling

running.html        Running map, SOS, Match, and music page
running.css         Running page styling
running.js          Running page interaction logic

cycle-log.html      Cycle Calendar and daily body-aware log

activity.html       Health Data dashboard
activity.css        Health Data page styling

profile.html        Profile, wearable, and safety settings page
profile.css         Profile page styling

images/             Image assets and icons
audio/              Local music files
README.md           Project documentation
```

## Data Handling

This is a high-fidelity front-end prototype. It does not collect real medical, safety, or wearable data.

* Cycle records are stored locally using LocalStorage.
* Heart rate, pace, distance, recovery, sleep, calories, and wearable sync are simulated.
* SOS and buddy matching are prototype interactions and do not connect to real emergency services or real users.

## AI-assisted Development Disclosure

ChatGPT was used as coding and writing support during development.

It helped with:

* HTML and CSS layout suggestions
* JavaScript debugging support
* Responsive design refinement
* README drafting

All AI-assisted code and text were reviewed and edited by the team. The project motivation, user requirements, design logic, and final design decisions remained human-led.

## Team Contributions

* **Leyi Li**: Front-end implementation, responsive CSS, interaction logic, running page, cycle page, health data page and profile page.
* **Nuoqian Xu**: User research, concept design, early sketches, persona and requirement development.
* **Jinlong Huang**: Requirement analysis, research and product comparison, portfolio content organization, and poster support.
* **Shuheng Hu**: Poster development, testing support, A/B testing, evaluation feedback, and presentation preparation.

## Tools Used

* GitHub Pages
* GitHub
* Visual Studio Code
* ChatGPT
* AMap

## License

This project was developed for CPT208 Human-Centric Computing coursework and is intended for educational use.
