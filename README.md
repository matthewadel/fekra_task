using zustand instead of redux and context
fonts
lang is only from zustand
absolute import
json server to mock the api request instead of using promise.resolve
benefits of scrollview
1- scroll if there is a keyboard in the screen
2- in small mobile phones, if the content exceeded the height of the screen, it will be scrollable and no data will be missed of the screen

Smooth, lightweight animations for correct/incorrect and completion
Accessible labels for buttons/inputs (accessibilityLabel); proper focus/announce after submit.

testing
Testing Requirements (Automated)
Unit/Component — Jest + React Native Testing Library
• Renders LessonStart and begins lesson on tap.
• MCQ: selecting correct marks correct; wrong subtracts a heart.
• Type Answer: trims/case-normalizes input and validates.
• Word Bank: ordering enforced; correct sequence passes.
• Persistence: progress restored from AsyncStorage (mocked).
E2E — Detox (or Maestro)
• Complete full 6-exercise flow: make one mistake → lose 1 heart → finish → see XP & streak.
• Accessibility smoke checks: buttons have discernible names; tab/next actions usable.
• Responsive: small-screen device (e.g., 360×800) renders without horizontal scroll.
(These test goals reflect the original web assessment’s intent, translated to RN.)
