# AI-assisted Coding Logs

This file records the main prompts we used when developing the HerRun prototype with ChatGPT. ChatGPT was mainly used to help with coding, debugging, layout changes, and small wording changes in the app. We checked and edited the results before adding them to the final project.

## Prompt 1: Homepage layout

Create a mobile homepage for a running app called HerRun. The page should look like a real phone app. It needs today's goal, current mood, health signal, cycle reminder, a simple running plan, and a reward area. Use warm red, peach, cream, and orange colours. Make the cards rounded and clean.

## Prompt 2: Homepage goal card

Help me improve the Today's Goal card on the homepage. I want the goal to feel friendly and flexible, not like a strict fitness task. The card should include a goal title, short description, and a Start button that goes to the running page.

## Prompt 3: Mood and health text

Rewrite the Current Mood and Health Signal text. Make the wording shorter and more natural. It should sound like a friendly running app, not a medical app. If the user feels tired, the text should suggest a lighter goal.

## Prompt 4: Cycle reminder on homepage

Help me write the Cycle Reminder text on the homepage. It should change depending on the user's cycle record. If there are no symptoms, the text can say today is suitable for an easy run. If there are symptoms, it should suggest walking, stretching, or rest.

## Prompt 5: Today's Goal logic

Help me create JavaScript logic for the Today's Goal section. The goal title, goal description, mood text, health text, and cycle reminder should change based on the user's saved cycle record. Keep the code simple because this is only a front-end prototype.

## Prompt 6: Cycle Calendar page

Create a mobile Cycle Calendar page for HerRun. It should have a monthly calendar, period days, predicted period days, selected date area, cycle summary, and smart reminder. The style should match the homepage.

## Prompt 7: Cycle record options

Add record options to the Cycle Calendar page. The user should be able to choose today's condition, such as no symptoms, tired, cramps, heavy flow, or low mood. The selected option should look active after clicking.

## Prompt 8: Save cycle record

Help me save the selected cycle option with LocalStorage. After the user clicks Save, the option should still be saved when they leave the page and come back later.

## Prompt 9: Homepage reads cycle record

Help me make the homepage read the saved cycle record from LocalStorage. If the user saved a tired or painful condition, the homepage goal should become easier. If the saved record is normal, the homepage can show a longer but still gentle running goal.

## Prompt 10: Fix cycle save bug

The selected cycle option is not saved after I go to another page and come back. Please help me check the JavaScript logic and fix it. Do not change the page style.

## Prompt 11: Running page layout

Create a mobile running page for HerRun. It should include a destination search bar, route status card, map area, Music button, Match button, SOS button, and running controls. Keep everything inside the phone frame.

## Prompt 12: Running page CSS

The running page is overflowing at the bottom. Please fix the CSS so the content stays inside the phone frame. Check height, overflow, flex layout, and scroll settings. Do not change the existing functions.

## Prompt 13: Start and pause run

Help me implement Start and Pause logic for the running page. When the user clicks Start, the timer, distance, pace, and heart rate should start changing. When the user clicks Pause, they should stop changing.

## Prompt 14: Finish run

Help me implement the Finish button. After clicking Finish, the run should stop, the timer should stop, and the page should show a finished state. The buddy and route display should also reset properly.

## Prompt 15: Route status text

Help me improve the route status text on the running page. Before starting, it should say the current location is ready. During running, it should show that the run is in progress. After finishing, it should show a short completion message.

## Prompt 16: AMap search

Help me connect the destination search bar with AMap. When the user selects a destination, the page should update the route information and show that the route is ready. Keep the code simple and suitable for a prototype.

## Prompt 17: Simulated running data

Help me create simulated running data for the prototype. Distance, pace, and heart rate should change while running. The numbers do not need to be real, but they should look reasonable for a running app.

## Prompt 18: SOS button

Help me improve the SOS button. When the user clicks it, show a confirmation overlay first. The overlay should have Confirm and Cancel buttons. It should be clear, but it should still match the HerRun style.

## Prompt 19: SOS overlay CSS

The SOS overlay does not look good on the phone frame. Please improve the CSS. It should be centered, readable, and not cover the layout in a messy way.

## Prompt 20: Match buddy button

Create a Match button interaction. When the user clicks Match, the app should simulate finding a running buddy nearby. The button or overlay should change to show that a buddy has been matched.

## Prompt 21: Buddy should disappear after finish

After the user clicks Finish, the buddy display should disappear or reset. Please fix the JavaScript so the matched buddy state does not stay after the run is finished.

## Prompt 22: Music panel layout

Create a music panel for the running page. It should include music categories, track list, play / pause, previous / next, and playback mode buttons. The panel should look like part of the app and open when the user taps Music.

## Prompt 23: Music panel mobile CSS

The music panel is too large on the phone screen. Please adjust the CSS so it fits better. Make the buttons and track list clear, but do not let the panel overflow.

## Prompt 24: Adaptive music toggle

Add an adaptive music toggle to the music panel. It should be turned off by default. When it is on, the app can recommend music based on the simulated heart rate.

## Prompt 25: Music categories

Help me organize the music categories into recovery, easy, tempo, and sprint. Each category should have several tracks. The selected category should be highlighted.

## Prompt 26: Play mode buttons

Add playback mode buttons for the music panel, such as single loop, list loop, and cross-list play. The selected mode should look active.

## Prompt 27: OGG audio issue

Some OGG audio files are not playing correctly in the browser. Please explain what might cause this and how to handle it in a front-end prototype.

## Prompt 28: Health Data page

Create a mobile Health Data page for HerRun. It should show average heart rate, resting heart rate, recovery score, average pace, body fat rate, sleep, calories, and a 7-day trend. Make it look like data from a wearable device.

## Prompt 29: Health Data wording

Help me write short explanations for the Health Data page. The text should explain the numbers in a friendly way. It should not sound too serious or too medical.

## Prompt 30: Health trend card

Create a 7-day trend card for the Health Data page. It can use simple visual lines or cards. It does not need real chart data, but it should look like a high-fidelity prototype.

## Prompt 31: Profile page

Create a mobile Profile page for HerRun. It should include avatar, username, monthly distance, streak, total runs, wearable device connection, and safety settings. Keep the style the same as the other pages.

## Prompt 32: Profile page CSS

Help me improve the Profile page CSS. The cards should be rounded, spacing should be clean, and the page should stay inside the phone frame.

## Prompt 33: Keep app style consistent

Help me make all HerRun app pages look consistent. The pages include homepage, running page, cycle calendar, health data, and profile. Use similar colours, cards, buttons, spacing, and rounded corners.

## Prompt 34: Phone frame layout

Help me build a phone-frame layout for all pages. The frame should be around 390px wide and should fit inside the browser window. The content should scroll inside the phone frame when needed.

## Prompt 35: Bottom overflow fix

Some pages go beyond the bottom of the phone frame. Please help me fix this with CSS. I want the main content to scroll inside the frame instead of overflowing outside.

## Prompt 36: Button alignment

Some buttons are not aligned properly. Please help me use flexbox to align them. Do not change the current page functions.

## Prompt 37: Shorter mobile text

Some text is too long for the mobile cards. Please shorten it while keeping the meaning. The text should sound casual and friendly.

## Prompt 38: Replace strict fitness wording

Some parts sound too much like a normal fitness app. Please rewrite them to feel softer and more supportive. The app should make users feel okay even if they only walk, stretch, or rest.

## Prompt 39: Debug JavaScript event listeners

Some buttons do not respond after I change the HTML. Please help me check whether the element IDs and JavaScript event listeners match correctly.

## Prompt 40: Clean up repeated code

Help me check if there is repeated or messy JavaScript in the running page. Please suggest how to make it cleaner without changing the current functions.

## Prompt 41: Make interaction smoother

Help me make the interactions feel smoother. For example, opening the music panel, SOS overlay, and Match overlay should feel natural. Please suggest simple CSS transitions.

## Prompt 42: Check app before submission

Please check the HerRun prototype pages before submission. Focus on whether the main functions work: homepage goal update, cycle record saving, running Start/Pause/Finish, SOS overlay, Match feature, music panel, health data page, and profile page.

## Prompt 43: Homepage card spacing

The homepage cards feel too close together in some places and too loose in others. Please help me adjust the CSS spacing between the hero card, running plan card, cycle calendar card, and mood star card. Keep the page inside the phone frame and do not change the existing functions.

## Prompt 44: Today's Goal button position

The Start button in the Today's Goal card does not look balanced with the goal text. Please help me adjust the layout so the goal title, description, and Start button are aligned better. The button should be easy to see but not too large.

## Prompt 45: Current Mood and Health Signal layout

The Current Mood and Health Signal sections look a bit crowded. Please help me improve the layout so the icon, title, and text are aligned neatly. The text should stay readable on a small mobile screen.

## Prompt 46: Cycle Calendar card size

The Cycle Calendar page has too much vertical space in some cards. Please help me reduce unnecessary padding and make the selected date, cycle summary, and smart reminder cards more compact.

## Prompt 47: Cycle option button style

The cycle record option buttons do not look active enough after clicking. Please help me improve the selected state. The selected option should have a clear background, border, or colour change, but still match the warm HerRun style.

## Prompt 48: Save button placement on Cycle Calendar

The Save button on the Cycle Calendar page does not feel obvious enough. Please help me adjust its position and style. It should be easy to find after the user selects a condition, but it should not make the page look crowded.

## Prompt 49: Running floating buttons placement

The Music, Match, and SOS buttons on the running page need better placement. Please help me adjust the floating button positions so they do not cover important map information and still remain easy to tap.

## Prompt 50: SOS button size and visual weight

The SOS button should look important but not too scary. Please help me adjust its size, colour, icon alignment, and text label. It should be visible during running but still match the overall app style.

## Prompt 51: Match button icon alignment

The Match button icon and text are not vertically balanced. Please help me adjust the CSS so the icon and label are centered inside the button. Keep the button size consistent with the Music and SOS buttons.

## Prompt 52: Music button style

The Music button looks a bit different from the other running page buttons. Please help me adjust its colour, border radius, icon size, and label position so it fits better with the Match and SOS buttons.

## Prompt 53: Bottom running control card

The bottom running control area feels too crowded. Please help me adjust the spacing between Start, Finish, distance, pace, and heart rate. The controls should be clear and easy to use inside the phone frame.

## Prompt 54: Finish button after running

After the user clicks Finish, some running elements still stay on the page. Please help me adjust the JavaScript and UI state so the route line, buddy state, and running feedback are reset properly.

## Prompt 55: Music panel button layout

The buttons inside the music panel are too close together on small screens. Please help me adjust the play, pause, previous, next, and playback mode buttons so they are easier to tap.

## Prompt 56: Music track list spacing

The track list in the music panel looks too long and crowded. Please help me reduce the spacing and make each track item cleaner. The title and artist should still be readable.

## Prompt 57: Profile card alignment

The Profile page cards are not aligned consistently. Please help me adjust the avatar area, running record strip, device card, and safety setting card so the spacing and card widths look unified.

## Prompt 58: Health Data card hierarchy

The Health Data page has many numbers, so the visual hierarchy is not clear enough. Please help me adjust the card sizes, title weights, number sizes, and spacing so the most important data is easier to notice.

## Prompt 59: Health trend chart spacing

The 7-day trend chart takes too much space. Please help me make the trend card more compact while keeping the chart readable. Do not change the page's warm colour style.

## Prompt 60: Navigation bar spacing

The navigation bar and bottom area sometimes cover or squeeze the page content. Please help me adjust the page height, padding, and scroll area so the content does not hide behind the navigation.

## Prompt 61: Button hover and active states

Some buttons do not have clear hover or active states. Please help me add simple CSS hover and active effects for the main buttons, such as Start, Save, View, Match, Music, and SOS.

## Prompt 62: Rounded card consistency

Some cards have different border radius values and look inconsistent. Please help me check the CSS and make the rounded card style more unified across homepage, running page, cycle page, health page, and profile page.

## Prompt 63: Text too long in mobile cards

Some mobile card text is too long and makes the layout look heavy. Please help me shorten the text while keeping the meaning. The wording should sound casual and friendly.

## Prompt 64: Reduce empty space

Some sections have too much empty space, especially between card title, description, and button. Please help me reduce padding and margins to make the mobile pages look more compact.

## Prompt 65: Improve visual balance

The page looks functional but not visually balanced. Please help me adjust font sizes, card padding, button sizes, and spacing so the page looks more polished without changing the functions.

## Prompt 66: Keep button text on one line

Some button text wraps to a second line. Please help me adjust the CSS so important button labels stay on one line, especially URL buttons, Save buttons, and running control buttons.

## Prompt 67: Align cards in two-column portfolio sections

In the portfolio technical page, two cards are side by side but their buttons are not on the same horizontal level. Please help me use flexbox so both cards have equal height and the buttons align at the bottom.

## Prompt 68: Make AI logs page less loose

The AI logs page looks too loose and the cards are too tall. Please help me reduce the card padding, adjust font sizes, and make the prompt blocks more compact while still readable.

## Prompt 69: AI logs prompt title alignment

On the AI logs page, I want the "Prompt 1" label and the prompt title to appear on the same line. Please help me adjust the HTML and CSS so they are aligned neatly.

## Prompt 70: AI logs bottom card layout

The "More Prompts" and "Checking" cards on the AI logs page look too empty. Please help me make them more compact. The View Full Prompt Log button should appear after the explanation text and should not be too large.

## Verification

We manually checked the generated code before using it. We tested page navigation, cycle record saving, homepage text updates, running buttons, SOS overlay, Match interaction, music panel, mobile layout, and visual consistency.

## Notes

ChatGPT was used to help with coding and debugging. We edited the generated code ourselves and only kept the parts that worked for our prototype.