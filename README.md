# HerRun

HerRun is a mobile-first running web app prototype designed for the CPT208 Human-Centric Computing group project. The project belongs to the **C1 Go Runners** topic and focuses on creating a more supportive, playful, and body-aware running experience, especially for women runners and student communities.

Instead of treating running only as a performance activity, HerRun combines mood, menstrual cycle awareness, safety support, adaptive music, and wearable-style health feedback. The aim is to help users build a healthier and more sustainable running habit without pressure or body-shaming.

---

## Live Demo

Final hosted prototype:

https://gravelli.github.io/cpt208/

---

## Source Code Repository

GitHub repository:

https://github.com/GravelLi/cpt208

---

## Project Overview

HerRun is designed as a mobile-first web app. The prototype demonstrates the main user journey of a supportive running experience:

1. The user checks today’s personalised running goal.
2. The system gives mood, health, and cycle-aware suggestions.
3. The user can start a run through the running map page.
4. During the run, the user can use music, buddy matching, and SOS support.
5. The user can review health data and wearable-style metrics.
6. The user can record cycle status and receive gentle reminders.
7. The user can view profile, device connection, and safety-related settings.

The prototype is implemented as a front-end web application using HTML, CSS, and JavaScript.

---

## Main Features

### 1. Mood-based Flexible Goal

The home page provides a personalised daily goal. The goal is designed to feel flexible and low-pressure rather than performance-driven.

The system presents:

- Today’s running goal
- Current mood feedback
- Health signal
- Cycle reminder
- Low-pressure running plan
- Mood Star reward feedback

This feature supports users who may feel tired, anxious, or physically uncomfortable but still want a gentle way to stay active.

---

### 2. Cycle-aware Running Adjustment

The Cycle Calendar allows users to view and record cycle-related information. The interface includes:

- Monthly cycle calendar
- Period days
- Predicted period days
- Selected date status
- Cycle summary
- Smart reminder
- Symptom or condition-based feedback

The saved cycle record can influence the home page text, including the daily goal, health suggestion, mood message, and cycle reminder.

This feature is designed to support body-aware running and avoid forcing users into inappropriate exercise intensity.

---

### 3. Running Map and Route Interaction

The running page simulates a real outdoor running experience. It includes:

- Destination search
- Current location status
- Route status
- Start / pause / finish running controls
- Running timer
- Simulated distance
- Simulated pace
- Simulated heart rate
- Map-based visual feedback

The running page uses AMap-related map interaction to demonstrate location-based running support.

---

### 4. Safety Support

HerRun includes safety-related interaction for users who may feel uncertain about running alone.

Safety features include:

- SOS button
- SOS confirmation overlay
- Route awareness
- Running status feedback
- Buddy matching interaction

The SOS flow is designed with confirmation before action, reducing accidental triggering while still keeping the emergency feature visible and easy to access.

---

### 5. Buddy Matching

The Match feature provides a playful and supportive social layer. Users can tap the Match button to simulate finding a nearby running buddy.

This feature supports the project goal of making running feel less isolated and more socially reassuring.

---

### 6. Adaptive Music

The running page includes a music panel with different music categories:

- Recovery
- Easy
- Tempo
- Sprint

The prototype uses simulated heart rate and running intensity to demonstrate how adaptive music could support different exercise states.

The music system includes:

- Music category tabs
- Track list
- Play / pause controls
- Previous / next controls
- Playback mode selection
- Adaptive music toggle

---

### 7. Health Data Dashboard

The Health Data page presents wearable-style health feedback. It includes:

- Average heart rate
- Resting heart rate
- Recovery score
- Average pace
- Body fat rate
- Sleep duration
- Calories burned
- 7-day trend visualisation
- AI-style health interpretation

This page focuses on making health data easier to understand. Instead of only showing raw numbers, it gives short and supportive explanations.

---

### 8. Profile and Device Settings

The Profile page presents user identity, running records, wearable connection, and safety-related settings.

It includes:

- User avatar
- Monthly distance
- Running streak
- Total runs
- Wearable device connection
- Safety and protection settings

---

## Technology Stack

The prototype uses free and accessible web technologies:

- HTML
- CSS
- JavaScript
- GitHub Pages
- AMap map service
- LocalStorage
- Local image and audio assets

---

## Deployment

The project is deployed using **GitHub Pages**.

The live prototype can be accessed here:

https://gravelli.github.io/cpt208/

GitHub Pages was chosen because it is free, lightweight, and suitable for hosting a static front-end prototype.

---

## How to Run Locally

To run the project locally:

1. Clone the repository:

```bash
git clone https://github.com/GravelLi/cpt208_C1_6.git
````

2. Enter the project folder:

```bash
cd cpt208_C1_6
```

3. Open the main page in a browser:

```text
index.html
```

You can also open the folder in VS Code and use a local preview extension such as Live Server.

---

## Project Structure

```text
cpt208_C1_6/
│
├── index.html              Home page of the HerRun app
├── index.css               Home page and cycle page styling
│
├── running.html            Running map, SOS, Match, and music page
├── running.css             Running page styling
├── running.js              Running page interaction logic
│
├── cycle-log.html          Cycle Calendar and cycle record page
│
├── activity.html           Health Data dashboard page
├── activity.css            Health Data page styling
│
├── profile.html            Profile, wearable, and safety settings page
├── profile.css             Profile page styling
│
├── images/                 Image assets and icons
├── audio/                  Local music files
│
└── README.md               Project documentation
```

Depending on the submitted version, some portfolio pages may also be included, such as:

```text
motivation.html
requirements.html
ideation.html
technical.html
evaluation.html
style.css
```

These files belong to the process portfolio and document the design process, research, requirements, technical implementation, and evaluation.

---

## System Architecture

HerRun is implemented as a front-end web application.

The main data flow is:

```text
User Input
↓
Front-end JavaScript State Logic
↓
Personalisation / Safety / Running / Health Modules
↓
LocalStorage or Simulated Data
↓
Updated User Interface Feedback
```

### User Input Layer

The system receives user interaction from:

* Mood-related choices
* Cycle status and symptom records
* Destination search
* Start / pause / finish running actions
* SOS button
* Match button
* Music controls
* Profile and device-related settings

### Front-end State Logic

JavaScript is used to update interface states, including:

* Running status
* Route status
* Timer
* Distance
* Pace
* Heart rate
* Music category
* Buddy matching status
* SOS overlay state
* Cycle-based home page text

### Personalised Feedback

The system provides personalised feedback through:

* Today’s Goal
* Current Mood text
* Health Signal
* Cycle Reminder
* Smart Reminder
* Mood Star reward
* Health Data interpretation

### Local Data Handling

The prototype uses LocalStorage to save selected cycle records locally.

This allows the home page to read saved cycle information and update its content accordingly.

### Simulated Data

Since this is a high-fidelity prototype, the following data is simulated:

* Heart rate
* Pace
* Distance
* Recovery score
* Body fat rate
* Sleep data
* Calories
* Running location
* Buddy matching
* Wearable sync

This allows the prototype to demonstrate the intended interaction logic without collecting real sensitive data.

---

## Data Handling and Privacy

HerRun involves sensitive topics such as mood, menstrual cycle, health, location, and safety. Therefore, the prototype avoids collecting real personal or medical data.

The current prototype uses:

* LocalStorage for local cycle record demonstration
* Simulated wearable data
* Simulated running data
* Simulated buddy matching
* Simulated location feedback

The prototype does not provide medical diagnosis or professional health advice. Its language is designed to be supportive, gentle, and non-judgmental.

---

## Responsive Design

HerRun is designed as a mobile-first web app because running support is most likely to be used on a mobile device.

The interface uses:

* Phone-frame layout
* Scrollable mobile content
* Large rounded cards
* Touch-friendly buttons
* Clear text labels
* SVG icons
* Readable spacing
* Soft colour contrast
* Mobile-sized interaction areas

The design aims to support one-handed use and quick understanding during everyday running contexts.

---

## Accessibility Considerations

The prototype includes several accessibility-related considerations:

* Key icons are supported with text labels.
* Main actions such as Start, Match, SOS, Save, and View are visually clear.
* Buttons are large enough for mobile interaction.
* Feedback text avoids judgmental or body-shaming language.
* Cycle and health suggestions are written as gentle guidance.
* Rest, walking, stretching, and light movement are treated as valid progress.
* The interface avoids relying only on raw health numbers.

Further accessibility improvements could include keyboard navigation testing, stronger colour contrast checking, screen reader testing, and reduced-motion support.

---

## AI-assisted Development Disclosure

AI tools were used as coding and writing support during the development process.

### Tool Used

* ChatGPT

### How AI Was Used

ChatGPT was used to help with:

* HTML structure suggestions
* CSS layout refinement
* Mobile card design
* JavaScript debugging support
* Interaction logic explanation
* Portfolio wording improvement
* README drafting
* Technical reflection drafting
* Responsive design suggestions

### Example Prompt Types

Examples of prompts used during development included:

```text
Help me improve the Technical Implementation page based on my running app features.
```

```text
Generate a mobile-first HTML/CSS section for explaining system architecture.
```

```text
Help me debug why the saved cycle option does not persist after leaving the page.
```

```text
Rewrite the home page text so it changes according to today’s selected mood and cycle condition.
```

```text
Create a README for a mobile-first running web app prototype with mood, cycle, safety, music, and health data features.
```

### Verification

AI-assisted code was not used directly without checking. The team manually reviewed and tested the generated or modified code.

We checked:

* Whether navigation links worked correctly
* Whether the cycle record could be saved and reflected on the home page
* Whether the running page buttons updated the correct visual state
* Whether SOS and Match overlays appeared as expected
* Whether the music panel could open and update
* Whether the layout remained usable in a mobile-sized screen
* Whether the wording matched the project’s human-centred design goals

### Ethical Considerations

Because HerRun involves sensitive contexts such as menstrual cycle, mood, safety, and health data, the team considered the following issues:

* The prototype should not claim to provide medical advice.
* Cycle and health data should be treated carefully.
* Simulated data should be clearly understood as prototype data.
* Feedback should be supportive rather than judgmental.
* The design should avoid body-shaming language.
* AI-generated code should be reviewed by humans before being included.
* AI should not replace the team’s own research, design logic, or user-centred reasoning.

The final design decisions and project direction remained human-led.

---

## Testing and Evaluation

The prototype was checked through manual testing and user-focused evaluation.

The testing focused on:

* Whether the main user journey was understandable
* Whether the running page was easy to operate
* Whether safety features were visible
* Whether the cycle-related feedback felt supportive
* Whether users could understand the health data page
* Whether the mobile layout was visually consistent
* Whether the playful elements improved motivation

Feedback from testing was used to refine the wording, visual layout, and interaction flow.

---

## Team Contributions

### Leyi Li

Role: Front-end Developer / Portfolio Developer

Main contributions:

* Built the high-fidelity web prototype pages
* Implemented the home page
* Implemented the running page
* Implemented the cycle calendar page
* Implemented the health data page
* Implemented the profile page
* Developed responsive CSS layouts
* Built the mobile phone-frame interface
* Implemented LocalStorage-based cycle record logic
* Implemented running map controls
* Implemented music panel interaction
* Implemented SOS overlay
* Implemented buddy matching interaction
* Developed the Technical Implementation portfolio page

### Nuoqian Xu

Role: User Researcher / Concept Designer

Main contributions:

* Researched target users and pain points
* Supported persona and requirement development
* Contributed early sketches and ideation
* Helped define women-centred running needs
* Helped translate user needs into mood-aware, safety-aware, and low-pressure design directions

### Jinlong Huang

Role: Requirement Analyst / Content Organizer

Main contributions:

* Collected and organized user data
* Supported academic literature comparison
* Supported commercial product comparison
* Organized user requirements
* Refined portfolio writing
* Supported poster layout and presentation content

### Shuheng Hu

Role: Poster Developer / Tester

Main contributions:

* Developed poster content
* Supported presentation material preparation
* Helped conduct testing and collect feedback
* Supported A/B testing and product evaluation
* Helped identify usability issues for later refinement

---

## References and Tools

The project used the following tools:

1. GitHub Pages
   Used for hosting the live web app prototype.
   [https://pages.github.com/](https://pages.github.com/)

2. GitHub
   Used for source code repository and version control.
   [https://github.com/](https://github.com/)

3. Visual Studio Code
   Used for front-end development and code editing.
   [https://code.visualstudio.com/](https://code.visualstudio.com/)

4. ChatGPT
   Used for AI-assisted coding support, debugging suggestions, wording refinement, and README drafting.
   [https://chat.openai.com/](https://chat.openai.com/)

5. AMap
   Used for map-based running interaction and route simulation.
   [https://lbs.amap.com/](https://lbs.amap.com/)

6. CapCut
   Used or considered for video editing and demo video production.
   [https://www.capcut.com/](https://www.capcut.com/)

---

## Limitations

The current version is a high-fidelity prototype rather than a fully deployed commercial system.

Current limitations include:

* Health data is simulated.
* Wearable connection is simulated.
* Buddy matching is simulated.
* SOS does not connect to a real emergency contact.
* Location and route functions are prototype-level demonstrations.
* The system does not include a real backend database.
* User accounts and authentication are not fully implemented.
* The prototype does not provide medical or professional safety advice.

---

## Future Improvements

Future versions of HerRun could include:

* Real wearable device integration
* Real user account system
* Secure backend database
* Real emergency contact setup
* Real location sharing with consent
* More advanced route safety analysis
* More personalised music recommendation
* More inclusive accessibility testing
* Screen reader support
* Stronger privacy controls
* More detailed user evaluation with a larger participant group

---

## License

This project was developed for CPT208 Human-Centric Computing coursework. It is intended for educational and assessment purposes.

```
```
