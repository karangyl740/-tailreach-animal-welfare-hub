# TailReach — One-page case study

## Challenge
The Front-End Development internship description emphasizes responsive website work, user testing, social-media integration, and animal-welfare awareness. A focused prototype can demonstrate these capabilities in a single user journey without assuming access to the foundation's internal systems.

## Evidence and boundaries
The foundation's public site describes feeding drives, rescue/rehabilitation, medical care, and community awareness. Those public descriptions informed the demo's sample campaign categories. TailReach is an independent concept project; it is not official, commissioned, or affiliated with the foundation. All campaign data is fictional.

## Proposed user journey
1. A visitor lands on the home page from a shared link.
2. They browse sample campaigns and use a category filter or search.
3. They open a campaign to understand its purpose, sample goal, and updates.
4. They share it through WhatsApp or copy a link.
5. They preview the volunteer-interest form and receive immediate validation feedback.

## Design decisions
- Mobile-first layout and obvious primary actions.
- Cards and a detail dialog keep the campaign list scannable while preserving detail.
- Sample status labels reduce the chance that illustrative numbers are mistaken for real impact statistics.
- The form clearly states that nothing is transmitted or saved.
- Plain HTML/CSS/JavaScript keeps setup simple and matches the listing's explicit HTML requirement.

## Validation plan
Run the tasks in `USER_TEST_PLAN.md` with 3–5 participants. Record the completion result, places where they hesitate, and the exact change made. Do not claim improvements or metrics until measured. Use browser device emulation and accessibility checks before writing final results.

## Limitations and next steps
- No backend, persistence, authentication, analytics, payments, or real campaign data.
- Campaign details are static sample data in JavaScript.
- A real organization would need to approve content, imagery, volunteer handling, privacy practices, and any integration before live use.
