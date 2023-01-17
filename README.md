# Wesnoth Era Randomizer Program
WERP is a JavaScript application that generates randomized add-on eras for Battle for Wesnoth.

WERP creates a complete Wesnoth add-on that contains a randomly generated multiplayer era. The era uses the game's standard units, but organizes them into new factions.

## Features
* One-click era randomizer that generates a complete Wesnoth add-on.
* Barebones GUI.
* Random icon generation for each faction.
* Random name generation for the era and the factions.
* Three unit sets:
   * Default - Generates an era using the units and leaders from the standard "Default" era.
   * Default+Dune - Generates an era using the units and leaders from the standard "Default+Dune" era.
   * Expanded - Generates an era using units and leaders that may or may not appear in vanilla multiplayer. Only units with an advancement class are used in the recruitment pool.
* Each era has 6 factions, with 7 recruitable units and 4 leaders each.
* Terrain preferences are generated for each faction and work decently for random maps.
* Recruitment patterns are generated for each faction and, while currently sub-optimal, work for the AI.
* All generation is performed locally on the client web browser.
* WERP can be easily setup on a local or private webserver.

# License
Wesnoth Era Randomizer Program is licensed under the MIT License. Please see the [attached license file](https://github.com/gar-mil/wesnoth-era-randomizer-program/blob/main/LICENSE) for more information.

# Attributions

* JSZip v3.10.1 - A JavaScript class for generating and reading zip files - Licensed under the MIT License.
  * See [core\libraries\jszip.LICENSE.md](https://github.com/gar-mil/wesnoth-era-randomizer-program/blob/main/core/libraries/jszip.LICENSE.md) for more information.

* Viscious Speed's game-icons.net icon set - Licensed under [CC0](https://creativecommons.org/publicdomain/zero/1.0/).
   * [http://viscious-speed.deviantart.com](http://viscious-speed.deviantart.com)
