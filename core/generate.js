// generate.js - Create the Wesnoth add-on and serve it
import * as NameGen from './name.js'; // Functions to create random faction names

export const RANDOM_SIDE = 
`
#define RANDOM_SIDE
[multiplayer_side]
    id=Random
    name= _"Random"
    image="units/random-dice.png"
    random_faction=yes
[/multiplayer_side]
#enddef
`;

export const QUICK_4MP_LEADERS =
`
#define QUICK_4MP_LEADERS
    # This makes all leaders with 4 MP receive the quick trait, except ones with
    # unit.variables.dont_make_me_quick=yes (boolean)

    [event]
        name=prestart
        [lua]
            code = << wesnoth.require("multiplayer/eras.lua").quick_4mp_leaders(...) >>
            [args]
                {TRAIT_QUICK}
            [/args]
        [/lua]
    [/event]
#enddef
`;

export const TURNS_OVER_ADVANTAGE = 
`
#define TURNS_OVER_ADVANTAGE
    [event]
        name=time over
        [lua]
            code = << wesnoth.require("multiplayer/eras.lua").turns_over_advantage() >>
        [/lua]
    [/event]
#enddef
`;

export class Era
{
    /*
        @class Era - Defines the era

        @param {boolean} random_side - Boolean that determines if the era uses the RANDOM_SIDE macro. Example: 1
        @param {boolean} quick - Boolean that determines if the era uses the QUICK_4MP_LEADERS macro. Example: 1
        @param {boolean} turns_over_advantage - Boolean that determines if the era uses the TURNS_OVER_ADVANTAGE macro. Example: 1
        @param {string} id - String that populates "era.id". Example: "era_werp"
        @param {string} name - String that populates "era.name". Shown to the player as the era's name. Example: "WERP Rando"
        @param {string} description - String that populates "era.description". Shown to the player to describe the era. Example: "This is a randomly generated era."
        @param {array} sides - Array of objects that populate the "era.multiplayer_sides" tags.
    */
    constructor(random_side,quick,turns_over_advantage,eraName,description,sides)
    {
        this.random_side = random_side;
        this.quick = quick ;
        this.turns_over_advantage = turns_over_advantage;
        this.eraName = '[WERP] '+eraName;
        this.id = 'WERP_'+eraName.replace(' ','_');
        this.description = description;
        this.sides = sides;
        this.icons = [];
    }

    generateSidesCfg()
    {
        var sideText = '';
        for(let i = 0; i < this.sides.length; i++)
        {
            let iSideText = 
            `
            [multiplayer_side]
                id=${this.sides[i].id}
                name= _"${this.sides[i].name}"
                image="factions/${this.sides[i].id}.png"
                leader=${this.sides[i].leader}
                random_leader=${this.sides[i].random_leader}
                recruit=${this.sides[i].recruit}
                terrain_liked=${this.sides[i].terrain_liked}
                description="${this.sides[i].description}"
                [ai]
                    recruitment_pattern=${this.sides[i].recruitment_pattern}
                [/ai]
            [/multiplayer_side]
            `;
            sideText = sideText+iSideText;
            this.icons.push(this.sides[i].icon);
        }
        return sideText;
    }

    generateErasCfg()
    {
        var eraText = 
        `
        #textdomain wesnoth-multiplayer
        ${this.random_side ? RANDOM_SIDE : ''}

        ${this.quick ? QUICK_4MP_LEADERS : ''}

        ${this.turns_over_advantage ? TURNS_OVER_ADVANTAGE : ''}

        [era]
            id=${this.id}
            name= _ "${this.eraName}"
            description="${this.description}"
            require_era=no

            ${this.random_side ? '{RANDOM_SIDE}' : ''}
            ${this.generateSidesCfg()}

            ${this.quick ? '{QUICK_4MP_LEADERS}' : ''}
            ${this.turns_over_advantage ? '{TURNS_OVER_ADVANTAGE}' : ''}
        [/era]
        `;
        return eraText;
    }

    generateMainCfg()
    {
        var mainText = 
        `
        #textdomain wesnoth-multiplayer

        #ifdef MULTIPLAYER
            [binary_path]
                path="data/add-ons/${this.id}/"
            [/binary_path]
        #endif

        {~add-ons/${this.id}/era.cfg}
        {~add-ons/${this.id}/images}
        `;
        return mainText;
    }
}

export async function buildEra(nameSet,factions,random_side = 1,quick = 1,turns_over_advantage = 1)
{
    var eraName = await NameGen.eraName(nameSet);
    var generateEra = new Era(random_side,quick,turns_over_advantage,eraName,'A randomly generated era.',factions);
    return generateEra;
}

export const saveAs = (blob, name) => {
    // Namespace is used to prevent conflict w/ Chrome Poper Blocker extension (Issue https://github.com/eligrey/FileSaver.js/issues/561)
    const a = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
    a.download = name
    a.rel = 'noopener'
    a.href = URL.createObjectURL(blob)

    setTimeout(() => URL.revokeObjectURL(a.href), 40 /* sec */ * 1000)
    setTimeout(() => a.click(), 0)
}

export async function buildAddon(eraObj)
{
    var zip = new JSZip();
    var mainCfg = await eraObj.generateMainCfg();
    var eraCfg = await eraObj.generateErasCfg();
    zip.folder(eraObj.id).file('_main.cfg',mainCfg);
    zip.folder(eraObj.id).file('era.cfg',eraCfg);
    for (let i = 0; i < eraObj.icons.length; i++)
    {
        zip.folder(eraObj.id).folder('images').folder('factions').file('WERPfaction'+[i]+'.png',eraObj.icons[i], {binary: true});
    }
    zip.generateAsync({type:"blob"})
.then(function(content) {
    saveAs(content, eraObj.id+".zip");
});
}