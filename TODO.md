# Focus Tree App - To-Do List

## 🔒 1. Lock App Feature (Focus Mode)
- [ ] Install/configure app blocking plugin (e.g., `@capacitor-community/app-launcher` or native app blocking solution)
- [ ] Create focus mode toggle/state management
- [ ] Implement app blocking logic when focus session starts
- [ ] Block social media apps (Instagram, Facebook, Twitter/X, TikTok, etc.)
- [ ] Block distracting apps (games, entertainment, etc.)
- [ ] Allow user to configure which apps to block
- [ ] Unblock apps when focus session ends or is stopped
- [ ] Handle edge cases (app crashes, force close, etc.)
- [ ] Test on both iOS and Android

## 🔥 2. Streak System
- [ ] Add streak calculation logic (daily basis)
- [ ] Track streak in storage (extend `Session` schema or add `Streak` table)
- [ ] Calculate streak: increment if session completed on same day, reset if missed a day
- [ ] Update streak on session completion
- [ ] Display current streak in TopStatsBar (replace hardcoded value)
- [ ] Create visual streak progression drawer/component
- [ ] Show streak history/calendar view
- [ ] Add streak milestones/achievements
- [ ] Prepare for sprite unlock system based on streak (future feature)

## 🎯 3. Onboarding
- [ ] Design onboarding flow (welcome screens, feature introduction)
- [ ] Create onboarding component/screens
- [ ] Track onboarding completion state (localStorage/Storage)
- [ ] Show onboarding only on first app launch
- [ ] Add skip/next navigation
- [ ] Include: app purpose, timer usage, grid interaction, streak explanation

## ⚙️ 4. Settings
- [ ] Create Settings screen/component
- [ ] Add navigation to Settings (from timer screen Settings button)
- [ ] Settings sections:
  - [ ] App blocking configuration (select apps to block)
  - [ ] Notification preferences
  - [ ] Theme preferences (if applicable)
  - [ ] Data/reset options
  - [ ] About/version info
- [ ] Persist settings in storage
- [ ] Integrate with existing Settings icon in PomodoroTimer

## ⏱️ 5. Pomodoro Timer Settings
- [ ] Create timer settings component/screen
- [ ] Allow user to configure session lengths (replace hardcoded presets)
- [ ] Add custom duration input
- [ ] Save user preferences
- [ ] Update presets dynamically based on user settings
- [ ] Restore production timer values (currently using 5/10/15 seconds for testing)

## ☕ 6. Break Sessions
- [ ] Add break session logic (short break, long break)
- [ ] Configure break durations (5 min short, 15 min long, etc.)
- [ ] Track focus sessions vs break sessions separately
- [ ] Show break timer UI (different from focus timer)
- [ ] Auto-start break after focus session completion (optional)
- [ ] Allow skipping breaks
- [ ] Update session storage to distinguish focus vs break sessions

## 📱 7. Keep-Awake Functionality
- [ ] Install `@capacitor-community/keep-awake` plugin
- [ ] Implement keep-awake functionality in `PomodoroTimer.tsx`:
  - [ ] Enable keep-awake when timer starts (`isRunning === true`)
  - [ ] Disable keep-awake when timer stops/pauses
  - [ ] Handle app lifecycle events (pause/resume) to maintain state
- [ ] Test on both iOS and Android devices
- [ ] Ensure battery impact is acceptable
- [ ] Add proper cleanup on component unmount

**Purpose:** Keep the screen awake while the timer is running so the animated GIF background and timer remain visible, preventing the phone from locking during focus sessions.

---

## Notes
- All features should work on both iOS and Android
- Consider user privacy and permissions for app blocking
- Test thoroughly on mobile devices
- Keep existing functionality intact while adding new features

