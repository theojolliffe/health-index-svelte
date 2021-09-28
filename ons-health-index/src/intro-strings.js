export default`
mixin updown
    if (place.data.Overall.total[2018].Change1year > 0)
        | up
    else if (place.data.Overall.total[2018].Change1year < 0)
        | down

mixin sidDiff
    // This needs to be replaced with a calculation for significant difference when we reieve the data, -0.4 was the national ave change
    if (Math.abs(place.data.Overall.total[2018].Change1year-(-0.4))<0.3)
        | a decline inline with the average across England.
    else if (place.data.Overall.total[2018].Change1year-(-0.4)<-0.3)
        | a slightly greater decline than the average across England.

p
    | #[+value(place.name)] 
    | has an overall health index of 
    | #[+value(place.data.Overall.total[2018].value)].
    | This is determined by scores for three domains; 
    | Healthy Lives (#[+value(place.data['Healthy Lives'].total[2018].value)]), 
    | Healthy People (#[+value(place.data['Healthy People'].total[2018].value)]) and 
    | Healthy Places (#[+value(place.data['Healthy Places'].total[2018].value)]).

p 
    | #[+value(place.name)] 
    | was ranked 
    | #[+value(place.data.Overall.total[2018].Rank, {'ORDINAL_NUMBER':true })] 
    | healthiest out of 149 districts in England. It's index score was 
    | #[+updown] 
    | #[+value(Math.abs(place.data.Overall.total[2018].Change1year/100), {'FORMAT': '0.0%'})]
    | on last year;
    | #[+sidDiff]

p
    | A score of 100 equates to the average across England when the index was first calculated in 2015.
`