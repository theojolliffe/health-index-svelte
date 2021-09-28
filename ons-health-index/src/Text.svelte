<script>
    import strings from './rosae-strings.js';
    import introStrings from './intro-strings.js';

    export let place;

    let load = false
    const onRosaeNlgLoad = () => { load = true }
    function results(place) {
        let pos = place.priority2018.Highest.map(e => { e['pos'] = 'improvement'; return e });
        let neg = place.priority2018.Lowest.map(e => { e['pos'] = 'decline'; return e });
        let priorities = pos.concat(neg)
        let subDomains = priorities.filter(e => { return (e['Index level']=="Subdomain") }); 
        subDomains.sort(function(a, b) { return a.hlRank - b.hlRank })
        console.log('place', place)
        console.log('subDomains', subDomains)

        function indicatorRank(obj) {
            let indis = []
            for (let i = 0; i < subDomains.length; i++) { 
                let objTemp = obj[subDomains[i].Domain].subdomains[subDomains[i].Subdomain].indicators
                let objArr = []; for (const [key, value] of Object.entries(objTemp)) {
                    value['indi'] = key
                    objArr.push({}); objArr[objArr.length-1] = value }
                objArr.sort(function(a, b) { return b[2018].Change3year - a[2018].Change3year })
                indis.push(objArr) }
            return indis }

        let res = rosaenlg_en_US.render(strings, {
            language: 'en_UK',
            place: place,
            subDomain: subDomains,
            negs: ['smoking', 'anxiety'],
            indicators: indicatorRank(place.data)
        });
        return res 
    }
    function intro(place) {
        let res = rosaenlg_en_US.render(introStrings, {
            language: 'en_UK',
            place: place
        });
        return res
    }
</script>

<svelte:head>
	<script src="https://unpkg.com/rosaenlg@3.0.1/dist/rollup/rosaenlg_tiny_en_US_3.0.1_comp.js" on:load="{onRosaeNlgLoad}"></script>
</svelte:head>


{#if load}
    <div style="font-weight: 600;">{@html intro(place)}</div>
    <div>{@html results(place)}</div>
{/if}