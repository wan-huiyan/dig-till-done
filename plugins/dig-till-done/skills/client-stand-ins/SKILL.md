---
name: client-stand-ins
description: |
  Review a client deliverable (slide deck, results page, dashboard, report, email) before the client sees it, by
  interviewing AI stand-ins for the client's own people. Each stand-in is built from an evidence profile of one real
  client person: their dated words from call transcripts, call notes and email. The stand-in reads only the rendered
  deliverable and scores every slide on understanding, trust and happiness. You fix, re-interview and repeat until
  every main slide scores 4 or more, or 4 rounds are done. Use when someone asks "would the client understand this?",
  "impersonate the client", "interview the client", "run the stand-ins", "would they trust this?", or before any deck
  goes out. Pairs with /dig-till-done: that skill checks we answered what they asked; this one checks it lands.
author: "Huiyan Wan, built with Claude (Anthropic)"
version: 1.0.0
date: 2026-11-24
---

# Client stand-ins

## The pain this fixes

We review our own deliverables, and we already know the data, the definitions and what we meant. The client does not.
So the first honest reaction to a deck used to arrive on the call: "I don't understand exactly what this is", "does
this match my numbers?", "what do I do with this on Monday?". A stand-in brings that reaction forward, to a point where
it is still cheap to fix.

## Where profiles live: never in a repo

Profiles describe how named client staff read, what they distrust and what wins them over. That must never be pushed
anywhere the client or anyone else can read it. Client repos are often mirrored to the client, and internal repos get
shared.

- Generic home: `~/.claude/client-personas/<client>/<person>.md`, one file per person, or one file for a pair who
  review together.
- If a workflow writes a profile inside a repo, move it out and delete the repo copy before any commit.

## Step 1: build a profile (once per person, refreshed after each call)

Usually two profiles are enough: **the decision-maker** (can I act on this this month, does each slide stand alone?) and
**the data-minded sceptic** (does it match my own numbers, can I trust the source?).

Sections (one heading each):

1. Who they are, and what they do with our work (forward it to a boss? present it?).
2. What they asked us for, as **dated verbatim quotes**, newest first.
3. How they read results: what they look at first, what makes them stop.
4. What makes them trust or distrust a figure, and what they would check it against.
5. Their beliefs about their own process that our results could confirm or contradict.
6. Tone and vocabulary: the words they use, and the jargon that loses them.
7. **Impersonation brief:** numbered rules for an actor agent playing them.
8. Known gaps: what we do not know about them.

Rules:
- Every claim carries a dated quote with its source (transcript timestamp, email date). Anything else is marked
  **(inferred)**.
- Read the raw transcript where you can. An AI meeting summary repeats its own transcription errors, and a figure that
  differs from the slide is usually a mishearing, not the client's mistake.
- After each new call, **add** quotes and keep the old ones. Back up the file first (`<file>.bak-YYYY-MM-DD`).

## Step 2: run an interview round

1. **Render the deliverable** the way the client will see it: screenshots per slide at 1440x900, plus the HTML or PDF.
   A stand-in judges pictures, not source files.
2. **One agent per stand-in, top tier.** Impersonation is judgement work. State the agent count and tier before
   launching: 2 stand-ins × 4 rounds = 8 top-tier agents at most.
3. **The prompt is the full profile file + the rendered slides, and nothing else.** Tell the agent to stay in
   character, to judge only what is ON the slide, and never to open repo files, probe folders or notes. Ask it to
   answer for each slide:
   - **understand alone (1–5)**, and the exact words it did not understand;
   - **happy to see this result (1–5)**, and why;
   - **trust the figure (1–5)**, and what it would check against its own data;
   - one concrete improvement.

   Then overall: happy? impressed? the three things it would ask on the call.
4. **You, not the stand-in, write the fix plan.** Check each wish against the standing rules for the project (data
   limits, wording rules, what the client has already ruled). A stand-in's wish never overrides a standing rule or a
   number.
5. **Rebuild, re-check every number, then re-interview with the SAME prompt.** Changing the prompt between rounds makes
   the scores incomparable.

## Step 3: when to stop, and how to report it

Stop when every main slide scores **4 or more on understanding and trust** and every stand-in says it is happy, **or
after 4 rounds**.

Report honestly which of the two happened. "Happy at the 4-round cap" is not "passed". List every slide still below 4,
with the stand-in's reason. A trust score of 3 that means "I would check it against my own data" usually cannot be
fixed with wording. Say so instead of rewording until it goes away.

## Traps (each one happened)

- **A stand-in that has read the repo** "understands" jargon the client never saw. Give it only the profile and the
  render.
- **Stand-ins ask for more content.** Real clients mostly complain about clarity and about what to do. Weigh "add X"
  against the slide's word budget.
- **"I trust it" is not verification.** Numbers still go through the number check.
- **Text checks cannot see pictures.** An animated clip or chart image showed an old draft's numbers under a new
  heading, and every text check passed. Re-render and look at every image and clip after a fix.
- **Fix it, never drop it.** An overnight fix "solved" stale clips by deleting 14 of 16 of them. A fix that removes the
  thing the stand-in liked is a regression, even when the scores hold.

## With /dig-till-done

The two skills answer different questions:
- `/dig-till-done`: **did we answer what they asked?** It turns their asks into a checklist and loops dig, verify,
  build, check and strict re-score until nothing is closable.
- `client-stand-ins`: **will it land?** It finds what confuses them, what they would distrust and what they would ask.

Run `/dig-till-done` to its stop first, then the stand-in rounds. Any stand-in fix that changes a number or a claim goes
back through `/dig-till-done`'s number check before the next interview round.

## Changelog

- 1.0.0, 2026-11-24: made generic from a single-client version, so the method works on any client. The steps, the
  stop rule and the traps come from that client's interview rounds of 19 and 23 Nov 2026.
