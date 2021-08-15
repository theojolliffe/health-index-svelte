export default`
mixin intro
    synz
        syn
            | Barnet saw England’s

mixin firstSen(i)
    | Barnet saw England’s
    | #[+value(subDomain[i].hlRank, {'ORDINAL_TEXTUAL':true})] greatest #[+value(subDomain[i].pos)]
    | in #[+value((subDomain[i].Measure).toLowerCase())]
    | in the three years between 2015 and 2018. 

mixin secondSen(i)
    | During this period, the subdomain increased from #[+value(subDomain[i].value - subDomain[i].Change3year)] to #[+value(subDomain[i].value)] giving this area England's fifth highest score.

mixin lastSen(i)
    | This change was largely driven by improvements in #[+value((indicators[i][0].indi).toLowerCase())] 
    | (index increased by #[+value(indicators[i][0][2018].Change3year)]) and 
    | #[+value((indicators[i][1].indi).toLowerCase())] 
    | (#[+value(indicators[i][1][2018].Change3year, {'FORMAT': '+0.0'})]), 
    | however there was a decline in #[+value((indicators[i][indicators[i].length-1].indi).toLowerCase())]
    | (#[+value(indicators[i][indicators[i].length-1][2018].Change3year, {'FORMAT': '+0.0'})]).

mixin para(i)
    p #[+firstSen(i)]
    p #[+secondSen(i)] 
    p #[+lastSen(i)]

p #[+para(0)]
p #[+para(1)]
p #[+para(2)]
p #[+para(3)]
`