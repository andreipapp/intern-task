## BUG-1

Invalid events were accepted because the isValidEvent function was not properly checking that all conditions are valid. By having || in the return statement only one condition needed to be true in order for the event to pass the check

## BUG-2

The Date object gives us the start of the day so Date(day) means day at 12am. In order for the owner to actually see a full day of downloads we needed to add one more day to the to param, so basically to will be the next day at 12 am and that way from and to won't clash

## BUG-3

The cause of this bug was actually how to path of the game was showing up. Whenever the path was encoded with %20 and we didnt decode it the download for that game wasnt actually added in the right place
Here i used a bit of ai because i couldn't figure out how to add the 0 downloads days into the array

## What looked wrong or risky?

- authentication for the POST route
- check if handle return null and then throw an error message saying invalid json body
- in mergeDownloadSources we should actually add the downloads together and get the total

## What I would do next?

- add filters for each route
- add pagination for each route to improve performance and save bandwidth
- try to find a way to call eventsInRange fewer times because as the number of events and games grow we will lose a lot by calling the function for every game multiple times

## Time spent on task

roughly 2 hours, it was pretty straight forward but being my first time solving this kind of assignment and not knowing how to write native nodejs tests (used a little bit of ai to get a grasp on how to write them) i needed a little bit of time to get used to this kind of tasks but it was pretty fun, i really liked it
