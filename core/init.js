// init.js - Read settings from the GUI. Load data from unitSets and nameSets. Route logic.

import * as Rando from './rando.js'; // Functions to randomize factions
import * as Generate from './generate.js'; // Functions that generate and output the Wesnoth Add-on

export async function oneClickBuild()
{
    var factions = await Rando.generateFactions('1.16dune',6,'draft');
    var era = await Generate.buildEra('default',factions,1,1,1);
    Generate.buildAddon(era);
}