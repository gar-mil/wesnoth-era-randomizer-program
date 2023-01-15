// rando.js - Create randomized factions
import * as NameGen from './name.js'; // Functions to create random faction names

export class Unit
{
    /*
    *    @class Unit - Defines an individual unit
    *
    *    @param {string} id - String that references "unit_type.id". Used to populate "multiplayer_side.leader", "multiplayer_side.random_leader", and "multiplayer_side.recruit". Unit's internal id. Example: "Drake Fighter"
    *    @param {array] terrain - Array of strings used to populate "multiplayer_side.terrain_liked" when creating a side. Unit's preferred terrain. Example: ["Hh","Ha","Ds","Ss"]
    *    @param {number} level - Number that references "unit_type.level". Unit's level. Example: 1
    *   @param {string} usage - String that references "unit_type.usage". Used to populate "multiplayer_side.ai.recruitment_pattern". Defines the unit's combat role for the ai. Example: "fighter"
    */
    constructor(id,terrain_liked,level,usage)
    {
        this.id = id;
        this.terrain_liked = terrain_liked;
        this.level = level;
        this.usage = usage;
    }
}

export class Multiplayer_side
{
    /*
        @class Multiplayer_side - Defines one of the factions within the era

        @param {string} id - String that populates "multiplayer_side.id". Faction's internal id. Example: "Drakes"
        @param {string} name - String that populates "multiplayer_side.name". Shown to the player as the faction's name. Example: "New Drakes"
        @param {array} leader - Array of strings that populate "multiplayer_side.leader". Strings reference "unit_type.id". Example: ["Drake Flare","Thief","Footpad"]
        @param {array} random_leader - Array of strings that populate "multiplayer_side.random_leader". Strings reference "unit_type.id". Example: ["Drake Flare","Thief","Footpad"]
        @param {array} recruit - Array of strings that populate "multiplayer_side.recruit". Strings reference "unit_type.id". Example: ["Saurian Augur","Drake Glider","Gryphon Rider"]
        @param {string} description: String that populates "multiplayer_side.description". Shown to the player to describe the faction. Example: "This is a randomly generated faction."
    */
    constructor(id,name,leader,random_leader,recruit,description)
    {
        this.id = id;
        this.name = name;
        this.leader = this.genUnitString(leader);
        this.random_leader = this.genUnitString(random_leader);
        this.recruit = this.genUnitString(recruit);
        this.terrain_liked = this.genTerrainLiked(recruit);
        this.description = description;
        this.recruitment_pattern = this.genRecruitmentPattern(recruit);
        this.icon;

        var iconNumber = Math.floor(Math.random() * [120 + 1]);
        var canvas = document.getElementById("iconCanvas");
        var ctx = canvas.getContext("2d");
        var img = new Image();
        img.src = './image/viscious-speed/abstract-'+iconNumber.toString().padStart(3,'0')+'.png';
    
        var self = this;
        img.onload = function() 
        {
            let rF = Math.floor(Math.random() * [125]), gF = Math.floor(Math.random() * [256]), bF = Math.floor(Math.random() * [256]),rB = Math.floor(Math.random() * [256]), gB = Math.floor(Math.random() * [256]), bB = Math.floor(Math.random() * [256]);
            canvas.width = 75;
            canvas.height = 75;
            ctx.drawImage(img,0,0,75,75);
            var imgd = ctx.getImageData(0, 0, 128, 128), pix = imgd.data, uniqueColor = [rF,gF,bF], uniqueBackground = [rB,gB,bB];
            uniqueBackground = self.shuffleArray(uniqueBackground);
            uniqueColor = self.shuffleArray(uniqueColor);

            // Loops through all of the pixels and modifies the components.
            for (var i = 0, n = pix.length; i <n; i += 4) {
                if(pix[i+3] < 255)
                {
                    pix[i] = uniqueBackground[0];   // Red component
                    pix[i+1] = uniqueBackground[1]; // Blue component
                    pix[i+2] = uniqueBackground[2]; // Green component
                    pix[i+3] = 255;
                }
                else
                {
                    pix[i] = uniqueColor[0];   // Red component
                    pix[i+1] = uniqueColor[1]; // Blue component
                    pix[i+2] = uniqueColor[2]; // Green component
                    //pix[i+3] is the transparency.
                }
            }
    
            ctx.putImageData(imgd, 0, 0);
            canvas.toBlob(function (blob) { self.icon = blob; });
        }
    }

    shuffleArray(inputArray) 
    {
        for (let i = inputArray.length - 1; i > 0; i--) 
        {
            const j = Math.floor(Math.random() * (i + 1));
            [inputArray[i], inputArray[j]] = [inputArray[j], inputArray[i]];
        }
        return inputArray;
    }

    blobCallback(blob)
    {
        this.icon = blob;
    }

    genUnitString(units)
    {
        var unitIDs = [];
        for (let i = 0; i < units.length; i++)
        {
            let iUnit = units[i];
            unitIDs.push(iUnit['id']);
        }
        var unitString = unitIDs.join();
        return unitString;
    }

    genRecruitmentPattern(recruit)
    {
        var usageList = [];
        for (let i = 0; i < recruit.length; i++)
        {
            let iRecruit = recruit[i];
            usageList.push(iRecruit['usage']);
        }

        let uniqueUsage = [...new Set(usageList)];
        uniqueUsage.unshift('fighter');
        var usageString = uniqueUsage.join();
        return usageString;
    }

    genTerrainLiked(recruit)
    {
        var terrainList = []
        for (let i = 0; i < recruit.length; i++)
        {
            let iRecruit = recruit[i];
            let iRecruitTerrain = iRecruit['terrain_liked'];
            for (let iT = 0; iT < iRecruitTerrain.length; iT++)
            {
                terrainList.push(iRecruitTerrain[iT]);
            }
        }

        let uniqueTerrain = [...new Set(terrainList)];
        var terrainString = uniqueTerrain.join();
        return terrainString;
    }
}

export async function generateFactions(unitSet, numFactions, pickStyle, styleOptions = [])
{
    var path = '../unitSets/'+unitSet+'.json';
    let setList;
    setList = await fetch(path)
    .then((response) => response.json());

    var factions;
    switch(pickStyle)
    {
        case 'draft':
            factions = styleDraft(setList, numFactions, styleOptions);
            break;
        case 'repeat':
            //
            break;
        case 'levelDraft':
            //
            break;
        default:
            factions = styleDraft(setList, numFactions, styleOptions);
    }

    return factions;
}

export async function styleDraft(setList, numFactions, styleOptions = [])
{
    var factions = [];
    var numLeaders = styleOptions['numLeaders'] ?? 4;
    var numUnits = styleOptions['numUnits'] ?? 7;

    var leaderList = setList['units'].filter(function (uL) { return uL.level >= 2 });
    var unitList = setList['units'].filter(function (uL) { return uL.level <= 1 });
    for (let iF = 0; iF < numFactions; iF++)
    {
        let leaders = [];
        for (let iL = 0; iL < numLeaders; iL++)
        {
            let leadersElement = Math.floor(Math.random() * [leaderList.length - 1]);
            leaders.push(leaderList[leadersElement]);
            leaderList.splice(leadersElement,1);
        }
        
        let units = [];
        for (let iU = 0; iU < numUnits; iU++)
        {
            let unitsElement = Math.floor(Math.random() * [unitList.length - 1]);
            units.push(unitList[unitsElement]);
            unitList.splice(unitsElement,1);
        }
        
        let facName = await NameGen.nameGen('default',1);
        let newFaction = new Multiplayer_side('WERPfaction'+iF,facName[0],leaders,leaders,units,'A randomly generated faction.');
        factions.push(newFaction);
    }

    return factions;
}
