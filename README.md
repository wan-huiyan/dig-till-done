# dig-till-done + client-stand-ins

Two Claude Code skills for client deliverables (decks, results pages, reports), meant to be used together:

- **`/dig-till-done`**: did we answer what the client asked? It turns their asks into a checklist and loops until every
  ask is met or waits on a person, the client or a date.
- **`/client-stand-ins`**: will it land? AI stand-ins for the client's own people read the rendered deliverable and
  score every slide on clarity, trust and happiness. You fix, re-interview and repeat.

[![license](https://img.shields.io/github/license/wan-huiyan/dig-till-done)](LICENSE)
[![last commit](https://img.shields.io/github/last-commit/wan-huiyan/dig-till-done)](https://github.com/wan-huiyan/dig-till-done/commits)
[![Tests](https://github.com/wan-huiyan/dig-till-done/actions/workflows/test.yml/badge.svg)](https://github.com/wan-huiyan/dig-till-done/actions/workflows/test.yml)
[![Claude Code](https://img.shields.io/badge/Claude_Code-skills-orange)](https://claude.com/claude-code)

![The two loops in 84 seconds](docs/promo.gif)

The full 84-second film (silent, words on screen): [docs/promo.mp4](docs/promo.mp4).

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

```text
You:    Here are the transcripts of our last two client calls. List every ask and check our draft against them.
        Keep digging until the checklist is met.          ← /dig-till-done
...
You:    Now interview the client stand-ins on the rendered deck.   ← /client-stand-ins
```

## How `/dig-till-done` works

**Step 0, once:** read every transcript and email in full and write `checklist.md`: one row per ask, each with the
client's own words and the call date. Asks without a quote are marked as inferred.

**Each round:**

| Step | Who | What |
|---|---|---|
| Dig | strongest model, one per unmet ask | the analysis that would answer it, in the client's terms |
| Blind-verify | cheaper model | recompute every figure from source, never from the dig's own tables |
| Build | strongest model | the next draft, from the last round's problems |
| Number check | cheaper model | trace every figure to a file, recompute every percentage |
| Strict re-score | strongest model, **never the builder** | score each ask against what the client will SEE |
| Defaults | you | one default per open question, so the next round can run; the human can overrule each |

**Stop** when the re-score's "closable now" list comes back **None**: everything left waits on a person, the client
or a date. Do not stop on a met count.

On its first client run: 84 asks from two calls, five rounds in one evening, met went 38 → 62 → 65 → 67, and the loop
stopped itself.

## How `/client-stand-ins` works

1. **Build a profile per client person** from their own words: call transcripts, call notes, email. Every claim carries
   a dated quote; anything else is marked inferred. Usually two: the decision-maker and the data-minded sceptic.
   Profiles live in `~/.claude/client-personas/`, **never in a repo**.
2. **Render the deliverable** as the client will see it.
3. **One top-tier agent per stand-in** reads only the profile and the rendered slides, and scores each slide 1–5 on
   understanding, happiness and trust, with the exact words it did not understand and what it would check against its
   own data.
4. **You write the fix plan**, rebuild, re-check every number, and re-interview with the same prompt.
5. **Stop** when every main slide scores 4 or more on understanding and trust, or after 4 rounds. Report which: happy
   at the round cap is not the same as passed.

## Why together

`/dig-till-done` makes sure the deliverable answers what was asked. `/client-stand-ins` makes sure the client can read
it, believes it and knows what to do. Run the dig loop to its stop, then the stand-in rounds. Any stand-in fix that
changes a number goes back through the number check.

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
- It is token-heavy: a `/dig-till-done` round ran 5–6 agents and 55–90 minutes; two stand-ins over four rounds is up
  to eight top-tier agents.
- Built and tested on slide decks and results pages for one analytics client. Other deliverable types should work, but
  have not been run.

## Version history

- **1.0.0** (2026-11-24): first public release. `dig-till-done` 1.3.1 and `client-stand-ins` 1.0.0, both made generic
  from a client project, with every client name and figure removed.

## License

MIT
