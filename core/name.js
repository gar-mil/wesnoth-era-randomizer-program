// name.js - Faction name creator

export async function nameGen(nameSet,nameAmount = 1)
{
    var path = '../nameSets/'+nameSet+'/';
    let config;
    config = await fetch(path+'config.json')
    .then((response) => response.json());

    let prefix;
    prefix = await fetch(path+'prefix.json')
    .then((response) => response.json());

    let suffix;
    suffix = await fetch(path+'suffix.json')
    .then((response) => response.json());

    let primary;
    primary = await fetch(path+'primary.json')
    .then((response) => response.json());

    var weights = config.weight;
    var facNames = [];
    for (let i = 0; i < nameAmount; i++)
    {
        var style = weighted_random(weights);
        facNames.push(facName(style,prefix,suffix,primary));
    }

    return facNames;
}

function weighted_random(options) {
    var i;

    var weights = [];

    for (i = 0; i < options.length; i++)
        weights[i] = options[i].weight + (weights[i - 1] || 0);
    
    var random = Math.random() * weights[weights.length - 1];
    
    for (i = 0; i < weights.length; i++)
        if (weights[i] > random)
            break;
    
    return options[i].nameStyle;
}

function facName(style,prefix,suffix,primary)
{
    var prefixElement = Math.floor(Math.random() * [prefix.length - 1]);
    var suffixElement = Math.floor(Math.random() * [suffix.length - 1]);
    var primaryElement = Math.floor(Math.random() * [primary.length - 1]);
    var facName;

    switch(style)
    {
        case 'solo':
            facName = primary[primaryElement];
            break;
        case 'prefix':
            facName = prefix[prefixElement]+primary[primaryElement];
            break;
        case 'suffix':
            facName = primary[primaryElement]+suffix[suffixElement];
            break;
        case 'both':
            facName = prefix[prefixElement]+primary[primaryElement]+suffix[suffixElement];
            break;
    }

    return facName;
}

export async function eraName(nameSet = 'default')
{
    var path = '../nameSets/'+nameSet+'/';

    let prefix;
    prefix = await fetch(path+'prefix.json')
    .then((response) => response.json());

    let primary;
    primary = await fetch(path+'primary.json')
    .then((response) => response.json());

    var eraName = facName('prefix',prefix,'',primary);

    return eraName;
}