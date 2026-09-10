# KennelCoach

Clickable mobile-web MVP for **animal-only long-haul pet transport** (pet travels without the owner). Crate assumed by default. Pay later — no payment UI. Map stubs only.

**Brand:** KennelCoach (not PetRide / ShowHaul / Pawlyft).

## Run locally

```bash
npm i && npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

Production build:

```bash
npm run build
npm run preview
```

## Stack

- React + Vite + TypeScript
- React Router
- Mobile-first (~390px phone frame)
- Mock local state; happy-path navigation only

## Screens

### Owner

1. **Home** — CTA “Book a haul”, upcoming events  
2. **Trip setup** — event type (Dog show / Trial / Other), origin, destination, date  
3. **Pet + crate** — name, breed/size, crate required (default ON), special notes  
4. **Pickup window** — choose window; distance/duration stub  
5. **Matching** — “Finding a transporter…” (auto-advance or skip)  
6. **Live haul** — map stub, transporter card, status chips  
7. **Delivered** — summary + star rating; no pay  

### Transporter

1. **Go online** — long-haul availability, max distance, crate sizes OK  
2. **Incoming job** — origin→venue, miles stub, pet/crate/event, Accept/Decline  
3. **Active haul** — same status chips; nav stub  
4. **Complete** — venue handoff confirm + simple tally  

Switch **Owner / Transporter** with the tab bar at the top of the phone frame.

## Out of scope

Payments, auth, real maps, owner-in-car, chat.
