---
name: dig-till-done
description: "Use when a client deliverable (an analysis, a results page, a deck, a report) has to answer what the client actually asked for across one or more calls or emails, and the work should keep going until it does. Turns the client's asks into a durable numbered checklist from the transcripts, then loops: dig into what is not met, blind-verify the figures, rebuild the draft, check every number, re-score the checklist strictly, take a default on each open question, and go again, until the only items left need a human ruling, the client's own answer, or a date that has not come. Triggers: 'list his asks and check we met them', 'keep digging until his checklist is met', 'have we met the client's expectation?', 'run this in a loop with the client's asks as goals', 'review our output against what they asked'."
metadata:
  author: "Huiyan Wan, built with Claude (Anthropic)"
  version: "1.3.1"
  created: "2026-11-17"
---

# Dig till done

A loop whose goal list is the client's own asks, written down once, scored strictly after every draft, and chased
until every item is either met or needs someone else. It works because the goal list is a FILE that outlives any one
session or agent, and because the scoring is done by an agent that did not build the draft.

**First built on a client's first-results page, Nov 2026:** 84 asks from two calls, five rounds, met went
38 → 62 → 65 → 67, and the loop stopped when the re-score's "closable now" list came back empty.

## Step 0: the checklist (once)

Read every transcript and email in full (subagents for long ones; tell them to quote, never paraphrase). Write
`checklist.md`, one row per ask:

| Column | What goes in it |
|---|---|
| ID | A prefix per source, numbered: `M01` the main client contact's asks and facts, `B01` other client staff, `P01` process asks (dates, calls, sends) |
| Ask | The ask in plain words |
| Quote | Verbatim, with call date and timestamp. An ask without a quote is your inference: mark it so |
| Status | One of the fixed statuses below. The ONLY column the loop edits |
| Evidence | Where on the deliverable it is met (slide, sentence) |

Put a glossary at the top for the transcript's mishearings (names, product names). Statuses, fixed vocabulary:

`met` · `met (under default N)` · `not met: analysis done, not on page` · `not met: not done` · `needs ruling` ·
`not yet due` · `client's side` · `superseded` · `out of scope (other deliverable)`

⚠️ If a script builds the checklist, run it ONCE. Re-running it resets every status the loop has written.

## The loop (one round)

Each step is a separate agent, except where noted. State agent count and tier before launching (≤10 per round).

1. **Dig** (only for `not met: not done` items that need analysis; strongest model, one dig per ask). Each dig writes
   its SQL, outputs and a `results.md`. This is where the brainstorm happens: for each unmet ask, what analysis would
   answer it in the client's own terms?
2. **Blind-verify** the figures the draft will publish (cheaper model, one per topic, own query budget stated in the
   prompt, dry-run first). The verifier writes its own SQL from source tables, never the dig's scratch tables, and
   reproduces the anchor cohort FIRST. Output: claimed / mine / MATCH, MISMATCH (likely reason), UNVERIFIED.
3. **Build draft vN** (strongest model) from the previous draft plus: the last number check's problems, the last
   re-score's "closable now" list, the defaults files, and the verifier results. Unverified figures get a removable
   marker ("still being re-checked"), keyed by name so it can come off cleanly. Earlier drafts stay untouched.
4. **Number check** (cheaper model): trace every figure to a saved file, recompute every percentage, check wording
   rules, cross-references and weekdays. Lists every figure that lost a marker without a matching blind check.
5. **Strict re-score** (strongest model, NOT the builder): every checklist row against what the client will SEE on the
   draft, never against what exists in a file. Writes three sections: (1) counts by status with the change from the
   last round, (2) items closable now, each with a concrete spec, or "None", (3) rulings needed, merged across every
   defaults file, each with what flips if overruled. Updates only the Status column.
6. **Defaults file** (you, inline): for every open question the round raised, take ONE default so the next round
   can run, numbered continuously across rounds (`13-round3-defaults.md`, `16-round4-defaults.md`, …). Each is the
   human's to overrule.
7. **Commit** the round by named paths. **Look at the changed screens yourself.**

What each unmet status turns into next round:

| Status | Next action |
|---|---|
| not met: not done | A dig (step 1) |
| not met: analysis done, not on page | A page edit in the build (step 3) |
| needs ruling | A default in the defaults file, and a line in the final rulings table |
| client's side | A chase line on the page, or a line in the human's cover note |
| not yet due | Nothing until its date |

## Stop rule

Stop when the re-score's section 2 says "None": every remaining item is a ruling, the client's side, not yet due,
superseded or out of scope. Do not stop on a met count. Report "met only under an unconfirmed default" separately,
so defaults never pass for agreement.

Expect diminishing returns: on the first run round 1 moved the most (38 → 62), later rounds were verification and polish
(+3, +2). One round there cost 5–6 agents, about 1.4M subagent tokens and 55–70 minutes.

## After the stop: freeze one final draft, then derive from it

The last number check and re-score still list small fixes (a wrong sentence, a polish item). Apply them as one final
draft (vN+1) with no new content, look at the changed screens, and only then build anything derived from the draft
(slide decks, a one-page summary, an email). Point every derived artefact's own checks at that final draft (on the first run
the decks' number checker still compared against draft v2 until it was repointed). Back up the old derived files
before overwriting them.

**Fix derived content; never drop it.** When an animation, chart or picture no longer agrees with the final draft,
re-make it with the draft's figures and words (re-render the clip, redraw the chart), in the same style the human
picked. Dropping it, or moving it somewhere the reader will not see it (out of the main run, into a collapsed detail
or an appendix), is not a fix: it throws away work the human chose and leaves the slide poorer. So:

- Every derived asset carries the list of figures and words it draws; a mismatch puts it on the **re-make list**, not
  the drop list.
- Plan the re-make inside the loop, as soon as the draft's figures settle, not after the final freeze: on the first run one
  clip took an agent about 45 to 75 minutes (edit the scene, re-render, loop and text checks, stills looked at).
- Removing or hiding content is a ruling for the human, never a default. If time runs out, ship the asset's static
  picture in its place for that one build, put "re-make clip N" on the next round's list, and name every asset
  shown static, hidden or moved in the report to the human, with where it went.
- The same holds for figures moved out of the main run "to save space": name each one in the report, so the human
  can pull it back.

## The report to the human

Lead with the next action. Then: met count and the trend; the rulings table (question, default taken, what flips if
overruled), open ones first; items on the client's side and what to send them; what was not verified. Ask for
rulings on a promptback page if there are more than three, each question carrying its own context.

## Traps, each one hit at least once

- **The re-scorer's fix can break a standing rule.** It suggested dropping per-month columns to make two slides
  readable; the standing rule was per month with the pooled row beside. Read every suggested fix against the standing
  rules before it goes to the builder; here the answer was to split each slide in two.
- **A default must name one choice.** "Keep it as built; website record alone" read as two choices, and the builder had
  to pick between them. Write the value, not a description of it.
- **"Exactly this graphic" means the artefact's form.** The first twin of a slide was built as tables and scored not
  met; the client had pointed at a timeline bar. Find the original artefact and name its form in the build prompt.
  If which artefact was on screen is read from a transcript, say so to the human.
- **A marker can be dropped without a match.** The builder took a marker off a sentence whose support was never
  checked. Step 4 must list every figure that lost a marker, with the check that cleared it.
- **Matching counts can still carry wrong words.** A verifier matched the count but found it included contact records
  the sentence did not name; the sentence was reworded. Ask verifiers to check the sentence, not only the number.
- **Verifiers slip too; anchor them.** One dropped an `Attended` filter and inflated two counts. It caught itself by
  comparing against the dig's published intermediate counts before comparing claims. Put "reproduce the anchors and
  the dig's intermediate counts first" in every verifier prompt.
- **A claim about what the client said needs a quotable source.** "As your team expects" rested on a garbled transcript
  line and came off.
- **An agent's "I looked at the screenshots" is not you looking.** A chart reported as checked had labels too small to
  read. Open the changed screens yourself every round.
- **A derived artefact can freeze an old draft into its pictures.** The deck's animated clips were recorded
  from draft v10; by v14 four of them showed numbers their own slide headings no longer said (an old pair of figures
  under a title quoting the new pair). The text checkers passed, because they cannot read video. Give every recorded asset a list of
  the figures it draws, and when any is missing from its section, **re-make it** (see "Fix derived content; never
  drop it" above). Client stand-in reviewers reading the rendered pages (`client-stand-ins`) caught the mismatch; no
  render check did. The first fix was wrong: an overnight default dropped every mismatched clip, and by the final
  draft 14 of 16 were gone, the human's chosen favourite video among them, while two time-series charts the
  story rested on had been folded into an appendix by another default. Nothing was lost on disk, but the deck the
  client would see had lost its best pictures, and the human had to ask where they went.
- **Committing a list of paths from zsh:** `$files` does not word-split in zsh, so `git add $files` fails as one long
  path. Write the list to a file and use `git add --pathspec-from-file` / `git commit --pathspec-from-file`. Scan the
  list for account emails and dry-run dumps before staging.

## Keep this skill current

This skill is meant to be edited, not just used. At the end of every round, and when the loop stops, ask: what would
I do differently next time? Then:

- If the lesson changes a step, **edit the step**, not just the log below.
- Add a dated line to the changelog with what happened and what changed in the skill.
- Bump `version`: patch for wording, minor for a new step or trap, major if the loop's shape changes.
- If a trap here stops being true, delete it and say so in the changelog.

## Changelog

- **1.0.0, 2026-11-17.** Written while the first client loop was running: five rounds, 84 asks, met 38 → 67, stopped on an
  empty "closable now" list. The traps above are the ones that cost a round or a correction there.
- **1.1.0, 2026-11-17.** Added "After the stop: freeze one final draft". Round 5 left five small fixes, one of them a
  false sentence on a main slide, and the decks' number checker was still pointed at a draft four versions old.
- **1.1.1, 2026-11-17.** Renamed from `chase-that-ask` to `dig-till-done` (author's pick).
- **1.2.0, 2026-11-19.** Added the trap about derived artefacts freezing an old draft (stale clips). The overnight
  loop ran four rounds with client stand-in interviews after each deck build; each round's must-fix list came from the
  stand-ins, not the checkers, and cheap text slips (restarted list numbering, a heading over the wrong content, a
  self-contradicting sentence) were the items they said would embarrass them most.
- **1.3.0, 2026-11-19.** The author: "instead of dropping content, we should be fixing them." Added "Fix derived content;
  never drop it" to the freeze step and rewrote the stale-clip trap: a mismatched clip or chart goes on a re-make
  list, hiding or removing content is a ruling for the human and never a default, and the report names every asset
  shown static, hidden or moved. On the first run the drop rule had removed 14 of 16 clips and hidden two key charts.
- **1.3.1, 2026-11-24.** Made shareable: client names, repo paths and the client's real figures removed. The worked
  example's location moved to the private client skill.
