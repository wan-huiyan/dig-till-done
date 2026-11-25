# dig-till-done + client-stand-ins

Two Claude Code skills for client deliverables (decks, results pages, reports). They run as **one loop**, and either
one can start it:

- **`/dig-till-done`**: did we answer what the client asked? It turns their asks into a checklist and keeps going in
  rounds until every ask is met or waits on a person, the client or a date.
- **`/client-stand-ins`**: will it land? AI stand-ins for the client's own people read the rendered deliverable and
  score every slide on understanding, trust and happiness.

[![license](https://img.shields.io/github/license/wan-huiyan/dig-till-done)](LICENSE)
[![last commit](https://img.shields.io/github/last-commit/wan-huiyan/dig-till-done)](https://github.com/wan-huiyan/dig-till-done/commits)
[![Tests](https://github.com/wan-huiyan/dig-till-done/actions/workflows/test.yml/badge.svg)](https://github.com/wan-huiyan/dig-till-done/actions/workflows/test.yml)
[![Claude Code](https://img.shields.io/badge/Claude_Code-skills-orange)](https://claude.com/claude-code)

![One loop, two skills](docs/promo.gif)

The full 101-second film (silent, words on screen): [docs/promo.mp4](docs/promo.mp4).

## The pain

Two things kept going wrong with client work:

1. **The draft answered a different question.** The asks were spread across hour-long calls, and "have we covered
   everything?" was answered from memory. Some asks never made it onto any list.
2. **We were the only reviewers, and we already knew the data.** The client's honest reaction ("I don't understand
   exactly what this is", "does this match my numbers?", "what do I do on Monday?") only arrived on the call.

## Install

Claude Code:

```bash
/plugin marketplace add wan-huiyan/dig-till-done
/plugin install dig-till-done@wan-huiyan-dig-till-done
```

Without the plugin system, copy the two skill folders:

```bash
git clone https://github.com/wan-huiyan/dig-till-done.git /tmp/dig-till-done
cp -R /tmp/dig-till-done/plugins/dig-till-done/skills/dig-till-done ~/.claude/skills/
cp -R /tmp/dig-till-done/plugins/dig-till-done/skills/client-stand-ins ~/.claude/skills/
```

Other agents (Cursor, Codex): the two `SKILL.md` files are plain Markdown instructions. Ask your agent to follow them.

## Quick start

Start from the asks:

```text
You:    Here are the transcripts of our last two client calls. List every ask, build the stand-ins,
        and keep going until the checklist is met.                       ← /dig-till-done
```

Or start from a draft you already have:

```text
You:    Interview the client stand-ins on this rendered deck.            ← /client-stand-ins
        (every question the deck cannot answer becomes a checklist row, and the loop carries on)
```

## The loop

| Step | What goes in | What comes out | Detail lives in |
|---|---|---|---|
| **1. List requirements** (once) | call transcripts, call notes, emails | `checklist.md`: one row per ask, in the client's own words, with the call it came from; one stand-in profile per client person, from the same sources | both |
| **2. Brainstorm** | the open rows, plus the stand-ins' must-fixes from the last interview | one line per item: what would close it in the client's terms, and whether it needs a new analysis or only a page edit | `/dig-till-done` |
| **3. Dig** | the brainstorm lines | the analyses, the next draft, and every figure on it traced to a saved file | `/dig-till-done` |
| **4. Verify, against the list** | the new draft | each new finding redone by another agent without seeing the answer; every row re-scored by an agent that did not build the draft, against what the client will see | `/dig-till-done` |
| **4. Verify, with the interview** | the rendered draft only | each slide scored 1–5 on understanding, trust and happiness, plus what each stand-in would ask on the call | `/client-stand-ins` |
| **5. Back to brainstorm** | unmet rows, must-fixes, new stand-in questions | the next round's input; each new question becomes a checklist row (`S01`, …) with the stand-in as its source; one default per open question, which the human can overrule | `/dig-till-done` |

**Stop when both hold:**
- the re-score's "closable now" list is None: everything left waits on a person, the client or a date;
- every main slide scores 4 or more on understanding and trust, or 4 interview rounds have run.

Say which one stopped it. Happy at the round cap is not the same as passed. Do not stop on a met count.

On its first client run (before the two skills were joined), the checklist loop took 84 asks from two calls through
five rounds in one evening; met went 38 → 62 → 65 → 67 over four strict re-scores, and the loop stopped itself.

## Who does what in a round

| Step | Who |
|---|---|
| Brainstorm | you, or the strongest model |
| Dig | strongest model, one per open ask that needs analysis |
| Build the draft | strongest model |
| Number check | cheaper model: trace every figure to a file, recompute every percentage |
| Blind verify | cheaper model: its own query from source, never the dig's tables |
| Strict re-score | strongest model, **never the builder** |
| Stand-in interview | one top-tier agent per stand-in, given only its profile and the rendered slides |
| Defaults | you |

Stand-in profiles are built from each person's own dated words; anything else is marked inferred. They live in
`~/.claude/client-personas/`, **never in a repo**.

## Traps both skills guard against

- **The builder marking its own work.** The re-score is always a different agent.
- **Checks passed, picture wrong.** Text checks cannot read charts or video: a clip showed an old draft's numbers under
  a new heading and every text check passed. A stand-in reading the rendered page caught it.
- **Fix it, never drop it.** An overnight fix "solved" stale clips by deleting 14 of 16. Removing content is a ruling
  for the human, never a default.
- **A stand-in that has read the repo** understands jargon the client never saw. Give it only the profile and the
  render.
- **"I trust it" is not verification.** Numbers still go through the number check.

## Limitations

- Stand-ins are only as good as their profiles. With one short call behind a profile, expect guesses marked inferred.
- A stand-in is not the client. It brings likely reactions forward; it does not replace showing the client.
- It is token-heavy: a checklist round ran 5–6 agents and 55–90 minutes; two stand-ins over four rounds is up to eight
  top-tier agents.
- The joined loop (brainstorm step, stand-in questions as checklist rows, one stop rule) is the method as now written;
  the two halves were first run separately. Built and tested on slide decks and results pages for one analytics
  client. Other deliverable types should work, but have not been run.

## Version history

- **1.1.0** (2026-11-25): the two skills become one loop that either can start. `dig-till-done` 2.0.0 adds a
  brainstorm step and puts the stand-in interview inside verify; `client-stand-ins` 1.1.0 turns every question the
  draft cannot answer into a checklist row. One shared stop rule. New 101-second film.
- **1.0.0** (2026-11-24): first public release. `dig-till-done` 1.3.1 and `client-stand-ins` 1.0.0, both made generic
  from a client project, with every client name and figure removed.

## License

MIT
