# BuildHub take-home task

Hi, thanks for your interest in joining the team.

BuildHub is a cut-down version of something we actually run: an internal service
that distributes game builds to teams and logs what people do with them
(downloads, uploads, metadata lookups, share links). A product owner uses the
download stats to see which games are actually being used.

It works, mostly. Three bug reports came in this week and someone asked for a
small feature. That's your task.

A heads up on why it's shaped like this. Most of our work is reading code
somebody else wrote, figuring out why it misbehaves, and changing it without
breaking anything around it. So the code here is deliberately not yours, and
there's more of it than you can read line by line. That's on purpose.

## Setup

You need Node 18 or newer. There's nothing to install, no dependencies.

```bash
npm run seed      # generates data/events.json (40k events), run this once
npm start         # http://localhost:3000
npm test          # runs the example test
```

Open http://localhost:3000 and you'll get a small page with downloads per game.

The endpoints:

```
GET  /api/games
GET  /api/builds
GET  /api/stats/downloads?from=2026-06-01&to=2026-07-31
POST /api/events            body: { "type": "download", "buildId": 900001, "createdAt": "2026-06-15T10:00:00Z" }
```

## Bug reports

### BUG-1: invalid events are accepted and then crash

> From: backend on-call
>
> Our frontend had a typo and sent "downlaod" instead of "download". The API
> answered 500 instead of rejecting it with a 400, and the log says
> `Cannot read properties of undefined (reading 'label')`. A bad request from a
> client shouldn't be able to do that.

To reproduce:

```bash
curl -s -X POST localhost:3000/api/events \
  -H 'content-type: application/json' \
  -d '{"type":"downlaod","buildId":900001,"createdAt":"2026-06-15T10:00:00Z"}'
```

### BUG-2: a whole day goes missing from the stats

> From: product owner
>
> I asked for one single day and got zero downloads, which can't be right. When
> I ask for a full month, the last day looks like it's missing too. If I type a
> date I expect it to be included.

To reproduce:

```bash
curl -s 'localhost:3000/api/stats/downloads?from=2026-06-15&to=2026-06-15'
```

### BUG-3: there's a made-up game called "unknown" at the top

> From: product owner
>
> The table shows a game called "unknown" in first place with thousands of
> downloads. That's not one of our games. At the same time
> "Disney Magic Kingdoms (QA)" and "My Little Pony (AA)" show way fewer
> downloads than I'd expect. Where are those downloads going?

## Feature request

### FEAT-1: downloads per day

The product owner wants a time series so he can see trends instead of just
totals:

```
GET /api/stats/downloads?from=2026-06-01&to=2026-06-30&by=day
```

It should return the download count for each day in the range, oldest first.
Days with no downloads should still show up with 0. Without `by=day` the
endpoint has to keep behaving exactly as it does today.

If you feel like showing it on the page too, go ahead, but it's not required.

## What to send back

A zip of this folder with:

1. Your fixes for BUG-1, BUG-2, BUG-3, and your FEAT-1 implementation.
2. Tests. At least one per bug, and it should fail before your fix and pass
   after. `npm test` should be green. There's an example in `test/` so you can
   see the runner. You don't need a test library.
3. A `WRITEUP.md`. Half a page is plenty:
   - For each bug, what the actual cause was. One or two sentences each.
   - Anything else you noticed that looks wrong or risky. We didn't report
     everything that's wrong in here, and spotting things nobody asked you about
     is a big part of the job.
   - What you'd do next with another day.
   - Roughly how long you spent.
4. If you used git, please leave the `.git` folder in. We like seeing how work
   progressed.

If you used AI tools anywhere that's completely fine, we don't mind. Just say so
in the writeup, and make sure you can explain every change you're submitting,
because we'll ask you about them.

## Ground rules

Please don't spend more than 4 hours on this. We mean it. If you run out of
time, send what you have and write down what was left. Knowing when to stop and
saying so clearly matters more to us than a finished task.

No need to make it pretty, reorganise the project or add a framework. Small
clear changes we can read beat a rewrite.

If something's ambiguous, make a call and write down what you assumed. Don't
wait for us to clarify it.

Good luck, we're looking forward to reading it.
