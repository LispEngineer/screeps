# Screeps

[Screeps](https://screeps.com/) is a great game I'm playing with my son to help him learn to program.
It's all programmed in JavaScript (running in [Node 6.6](https://nodejs.org/en/) [`vm`](https://nodejs.org/api/vm.html), 
using [V8 JavaScript engine](https://github.com/v8/v8), 
[implementing most of ECMAScript 2015/6](http://node.green/) [or here](https://kangax.github.io/compat-table/es6/), 
with the [Lodash](https://lodash.com/) library available as `_`), 
and has a reasonably well [documented API](http://support.screeps.com/hc/en-us/articles/203084991-API-Reference).

Here are some modules I'm happy to share with the world and him. If I take a hiatus from playing, I'll share my
entire code base.

# Disclaimer

Note that I don't pretend to be a JavaScript engineer nor a game AI programmer. Indeed, I learned ECMAScript 2015
just for this game; the last thing I had read about JavaScript was almost a decade ago,
[*JavaScript, the Good Parts*](http://shop.oreilly.com/product/9780596517748.do), and I have done almost no
production coding in JavaScript.

# Modules

* `callback.js` - A simple JavaScript "class" for registering callback functions and firing
  events to them.

* `resources.js` - A module that analyzes all the rooms and summarizes the data about each
  of them for later use. I call this at the top of my main loop each tick.

* `screepsplus.js` - A module that creates a `Memory.stats` object that can be used to
  import data into [ScreepsPl.us](https://screepspl.us/)'s Grafana tracking system. You
  can register callbacks to add data to this without changing this code. Be sure to add
  this in your main loop and also add as the final thing you do the record of your CPU used.

* `pebble.js` - A module that formats things for display on my Pebble Time Round watch,
  using [ScreepsTime](https://github.com/bthaase/ScreepsTime) watch face. I display
  three things: Percentage to next GCL, Percentage to next RCL (for the closest room),
  and if there have been any enemies in the last 300 ticks, including the current number
  of enemies and the time (in NYC) the enemies were last seen.

* `grafana.json` - An exported Grafana module that graphs the stats from my above
  `screepsplus.js`, as well as some data (e.g., my "ratchet" mechanism) that I haven't
  exported but which is tied in via the above-mentioned callbacks.


# How To Use WebStorm

* Install Steam Client using Steam for Mac
* Let it download your source code to local filesystem.
  * Location: `~/Library/Application Support/Screeps/scripts/screeps.com/default`
  * Seems like each "branch" has its own directory
* `brew install node` (use v6.6.0 [which is what Screeps uses](http://support.screeps.com/hc/en-us/articles/205960931-Server-side-architecture-overview))
* `git clone https://github.com/Garethp/ScreepsAutocomplete.git` somewhere
* Install WebStorm

## Configuring WebStorm Project

* Import the Screeps source code directory as a new, empty project in WebStorm
* Settings -> Languages & Frameworks -> Node.js and NPM -> Node.js Core Library *ENABLE*
  * Now statements like `require` and variables like `global` will work
* Settings -> Languages & Frameworks -> JavaScript
  * JavaScript Language Version *ECMAScript 6*
  * Prefer Strict Mode
  * -> Libraries: Enable ECMAScript 6 library
* Settings -> Languages & Frameworks -> JavaScript Libraries
  * Add: ScreepsAutocomplete [per instructions](https://github.com/Garethp/ScreepsAutocomplete)
* Set up `.gitignore` using [JetBrains template](https://raw.githubusercontent.com/github/gitignore/master/Global/JetBrains.gitignore)
* Configure loDash
  * `console.log(_.VERSION)` in Screeps console => `3.10.1`
  * Clone it from git somewhere outside your project
  * `git checkout -b refs/tags/3.10.1`
  * Set up in WebStorm:
     * Settings -> Languages & Frameworks -> JavaScript -> Libraries
     * Click `Add`, and then in the `Edit Library` window:
     * Name: lodash
     * Framework type: custom
     * Visibility: Global
     * Version (it doesn't seem to save this, so leave blank)
     * Click `+` and add your cloned, checked out GitHub repo of lodash
     * Click `+` for docs and add `https://lodash.com/docs/3.10.1`
     * Click `OK` a few times and you're done
  * Don't do this:
     * Settings -> Languages & Frameworks -> Node.js and NPM "for current project"
     * Click `+` on the bottom
     * Search for `lodash` in the "Available Packages" window that pops up
     * Check "Specify Version" and put in 3.10.1 and click `Install Package`
     * It loads into a "node_modules". Unless, of course, that's what you want (I don't)

# Using WebStrorm and Screeps

* Any time you save a file in WebStorm *and then swap foreground program back to Screeps Steam Client*,
  the Screeps client automatically pushes it to the server. However, the italicized part doesn't
  always seem to be true.

