export default`
mixin intro
    synz
        syn
            | #[+value(place.name)] saw England’s

mixin firstSen(i)
    | #[+value(place.name)] 
    if (subDomain[i].hlRankType=="Rank")
        | has England's
        | #[+value(subDomain[i].hlRank, {'ORDINAL_TEXTUAL':true})] 
        if (subDomain[i].pos=="improvement")
            | highest score for
        else
            | lowest score for
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
    if (place.data[subDomain[i].Domain].subdomains[subDomain[i].Measure].total[yr].Rank<76)
        | top 
        | #[+value(place.data[subDomain[i].Domain].subdomains[subDomain[i].Measure].total[yr].Rank/149, {'FORMAT': '0%'})]
    else
        | bottom
        | #[+value((150-place.data[subDomain[i].Domain].subdomains[subDomain[i].Measure].total[yr].Rank)/149, {'FORMAT': '0%'})]

mixin secondSen(i)
    if (subDomain[i].hlRankType=="Change1year Rank")
        | From 2017 to 2018,
        | #[+value(place.name)] went from 
        | #[+topBot(i, 2017)]
        | (#[+value(place.data[subDomain[i].Domain].subdomains[subDomain[i].Measure].total[2017].value, {'FORMAT': '0.0'})]) 
    else
        | From 2015 to 2018,
        | #[+value(place.name)] went from 
        | #[+topBot(i, 2015)]
        | (#[+value(place.data[subDomain[i].Domain].subdomains[subDomain[i].Measure].total[2015].value, {'FORMAT': '0.0'})])
    | to 
    | #[+topBot(i, 2018)]  
    | (#[+value(place.data[subDomain[i].Domain].subdomains[subDomain[i].Measure].total[2018].value, {'FORMAT': '0.0'})])
    | for 
    | #[+value(subDomain[i].Measure.toLowerCase())]
    if !(subDomain[i].hlRankType=="Rank")
        | , giving it England’s 
        if (place.data[subDomain[i].Domain].subdomains[subDomain[i].Measure].total[2018].Rank<76)
            | #[+value(place.data[subDomain[i].Domain].subdomains[subDomain[i].Measure].total[2018].Rank, {'ORDINAL_TEXTUAL':true})] 
            | highest score
        else
            | #[+value(150-place.data[subDomain[i].Domain].subdomains[subDomain[i].Measure].total[2018].Rank, {'ORDINAL_TEXTUAL':true})] 
            | lowest score
    | .

mixin declineImp(i, change, index, impDec)
    if (impDec=="improvement")
        if (negs.includes((indicators[i][index].indi).toLowerCase()))
            | a decline in 
            | #[+value((indicators[i][index].indi).toLowerCase())] 
            | (index improved by #[+value(indicators[i][index][2018][change])])
        else
            | improvements in 
            | #[+value((indicators[i][index].indi).toLowerCase())] 
            | (#[+value(indicators[i][index][2018][change], {'FORMAT': '+0.0'})])
    else
        if (negs.includes((indicators[i][indicators[i].length-1-index].indi).toLowerCase()))
            | an increase in 
            | #[+value((indicators[i][indicators[i].length-1-index].indi).toLowerCase())] 
            | (index went down by #[+value(indicators[i][indicators[i].length-1-index][2018][change], {'FORMAT': '+0.0'})])
        else
            | a decline in 
            | #[+value((indicators[i][indicators[i].length-1-index].indi).toLowerCase())] 
            | (#[+value(indicators[i][indicators[i].length-1-index][2018][change], {'FORMAT': '+0.0'})])

mixin however(i, change, impDec)
    if (impDec=="improvement")
        if (indicators[i][indicators[i].length-1][2018][change]<0)
            if (negs.includes((indicators[i][indicators[i].length-1].indi).toLowerCase()))
                | , however there was also an increase in
                | #[+value((indicators[i][indicators[i].length-1].indi).toLowerCase())]
                | (index moved down #[+value(Math.abs(indicators[i][indicators[i].length-1][2018][change]))])
            else
                | , however there was a decline in
                | #[+value((indicators[i][indicators[i].length-1].indi).toLowerCase())]
                | (#[+value(indicators[i][indicators[i].length-1][2018][change], {'FORMAT': '+0.0'})])
    else
        if (indicators[i][indicators[i].length-1][2018][change]>0)
            if (negs.includes((indicators[i][indicators[i].length-1].indi).toLowerCase()))
                | , however there was an improvement in
                | #[+value((indicators[i][0].indi).toLowerCase())]
                | (#[+value(indicators[i][0][2018][change], {'FORMAT': '+0.0'})])
            else
                | , however there was an decrease in
                | #[+value((indicators[i][0].indi).toLowerCase())]
                | (#[+value(indicators[i][0][2018][change], {'FORMAT': '+0.0'})])

mixin driven(i, change, impDec)
    | #[+declineImp(i, change, 0, impDec)] and
    | #[+declineImp(i, change, 1, impDec)]
    | #[+however(i, change, impDec)]
    | .

mixin lastSen(i)
    | This change was largely driven by 
    if (subDomain[i].hlRankType=="Change1year Rank")
        | #[+driven(i, "Change1year", imprDecl[i])]
    else
        | #[+driven(i, "Change3year", imprDecl[i])]

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