export default`
mixin intro
    synz
        syn
            | #[+value(place.name)] saw England’s

mixin firstSen(i)
    | #[+value(place.name)] 
    if (subDomain[i].hlRankType=="Rank")
        | has England's
        | #[+value(subDomain[i].hlRank, {'ORDINAL_TEXTUAL':true})] highest score for
    else
        | saw England’s
        | #[+value(subDomain[i].hlRank, {'ORDINAL_TEXTUAL':true})] greatest #[+value(subDomain[i].pos)] in 
    i #[+value((subDomain[i].Measure).toLowerCase())] 
    i 
    if (subDomain[i].hlRankType=="Change1year Rank")
        | between 2017 and 2018 
    else if (subDomain[i].hlRankType=="Change3year Rank")
        | in the three years between 2015 and 2018
    | .

mixin subd(i)
    | #[+value(subDomain[i].Measure)] 
    | is a subdomain of 
    | #[+value(subDomain[i].Domain)]
    | which looks at
    eachz indic in Object.keys(place.data[subDomain[i].Domain].subdomains[subDomain[i].Measure].indicators) with { separator:',', last_separator:'and' }
        i #[+value(indic.toLowerCase())]
        i
    | .

mixin topBot(i, yr)
    | top 
    | #[+value(place.data[subDomain[i].Domain].subdomains[subDomain[i].Measure].total[yr].Rank/149, {'FORMAT': '0%'})]

mixin secondSen(i)
    if (subDomain[i].hlRankType=="Change1year Rank")
        | From 2017 to 2018,
        | #[+value(place.name)] went from 
        | #[+topBot(i, 2017)]
        | (index 107.9) 
    else
        | From 2015 to 2018,
        | #[+value(place.name)] went from 
        | #[+topBot(i, 2015)]
        | (index 107.9) 
    | to 
    | #[+topBot(i, 2018)]  
    | (112.7) 
    | for 
    | #[+value(subDomain[i].Measure.toLowerCase())]
    if !(subDomain[i].hlRankType=="Rank")
        | , giving it England’s 
        | #[+value(place.data[subDomain[i].Domain].subdomains[subDomain[i].Measure].total[2018].Rank, {'ORDINAL_TEXTUAL':true})] 
        | highest score
    | .

mixin lastSen(i)
    | This change was largely driven by 
    if (subDomain[i].hlRankType=="Change1year Rank")
        if (negs.includes((indicators[i][0].indi).toLowerCase()))
            | decline in the rate of 
            | #[+value((indicators[i][0].indi).toLowerCase())] 
            | (index improved by #[+value(indicators[i][0][2018].Change1year)]) and 
        else
            | improvements in 
            | #[+value((indicators[i][0].indi).toLowerCase())] 
            | (#[+value(indicators[i][0][2018].Change1year, {'FORMAT': '+0.0'})]) and 
        if (negs.includes((indicators[i][1].indi).toLowerCase()))
            | a decline in the rate of 
            | #[+value((indicators[i][1].indi).toLowerCase())] 
            | (index improved by #[+value(indicators[i][1][2018].Change1year)] points), 
        else
            | improvements in 
            | #[+value((indicators[i][1].indi).toLowerCase())] 
            | (#[+value(indicators[i][1][2018].Change1year, {'FORMAT': '+0.0'})]), 
        if (indicators[i][indicators[i].length-1][2018].Change1year<0)
            | however there was also a decline in 
            | #[+value((indicators[i][indicators[i].length-1].indi).toLowerCase())]
            | (#[+value(indicators[i][indicators[i].length-1][2018].Change1year, {'FORMAT': '+0.0'})]).
    else
        if (negs.includes((indicators[i][0].indi).toLowerCase()))
            | decline in the rate of 
            | #[+value((indicators[i][0].indi).toLowerCase())] 
            | (index improved by #[+value(indicators[i][0][2018].Change3year)]) and 
        else
            | improvements in 
            | #[+value((indicators[i][0].indi).toLowerCase())] 
            | (#[+value(indicators[i][0][2018].Change3year, {'FORMAT': '+0.0'})]) and 
        if (negs.includes((indicators[i][1].indi).toLowerCase()))
            | a decline in the rate of 
            | #[+value((indicators[i][1].indi).toLowerCase())] 
            | (index improved by #[+value(indicators[i][1][2018].Change3year)] points), 
        else
            | improvements in 
            | #[+value((indicators[i][1].indi).toLowerCase())] 
            | (#[+value(indicators[i][1][2018].Change3year, {'FORMAT': '+0.0'})]), 
        if (indicators[i][indicators[i].length-1][2018].Change3year<0)
            | however there was also a decline in 
            | #[+value((indicators[i][indicators[i].length-1].indi).toLowerCase())]
            | (#[+value(indicators[i][indicators[i].length-1][2018].Change3year, {'FORMAT': '+0.0'})]).

mixin para(i)
    p #[+firstSen(i)]
    p #[+subd(i)]
    p #[+secondSen(i)] 
    p #[+lastSen(i)]

hr
p < MAIN INDEX GRAPHS >
hr
p #[+para(0)]
hr
p < CHART >
hr
p #[+para(1)]
hr
p < CHART >
hr
p #[+para(2)]
hr
p < CHART >
hr
p #[+para(3)]
hr
p < CHART >
`