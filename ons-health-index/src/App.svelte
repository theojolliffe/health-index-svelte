<script>
	import { getData, suffixer } from "./utils";
	import { urls, types, codes, mapSources, mapLayers, mapPaint } from "./config";
	import Select from "./ui/Select.svelte";
	import Warning from "./ui/Warning.svelte";
	import Map from "./map/Map.svelte";
	import MapSource from "./map/MapSource.svelte";
	import MapLayer from "./map/MapLayer.svelte";
	import { sentGenerator, sentGenerator2 } from './robo_utils.js';

	
	let options, selected, placeHealth, place, ew, quartiles, quartilesHealth;
	let map = null;
	let active = {
		selected: null,
		type: null,
		childType: null,
		highlighted: [],
		hovered:  null
	};
	
	getData(urls.options)
	.then(res => {
		res.forEach(d => {
			d.typepl = types[d.type].pl;
			d.typenm = types[d.type].name;
		});
		options = res.sort((a, b) => a.name.localeCompare(b.name));
		selected = options.find(d => d.name == 'Barnet');
		loadEW();
		loadArea(selected.code);
		loadAreaHealth(selected.code);
	});
	
	function loadArea(code) {
		fetch(urls.places + code + '.json')
		.then(res => res.json())
		.then(json => {
			json.children = options.filter(d => d.parent == code);
			
			if (json.count > 20) {
				fetch(urls.quantiles + json.type + '.json')
				.then(res => res.json())
				.then(quart => {
					quartiles = quart;
					place = json;
					updateActive(place);
					fitMap(place.bounds);
				});
			} else {
				quartiles = null;
				place = json;
				updateActive(place);
				fitMap(place.bounds);
			}
		});
	}

	function loadAreaHealth(code) {

		fetch(urls.healthplaces + code + '.json')
		.then(res => res.json())
		.then(json => {
		 	quartilesHealth = null;
			placeHealth = json; 
			console.log("Place Health", placeHealth) 
		 });
	}

	function loadEW() {
		const code = 'K04000001';
		fetch(urls.places + code + '.json')
		.then(res => res.json())
		.then(json => {
			json.children = options.filter(d => d.parent == code);
			ew = json;
		});
	}
	
	function makeData(props) {
		let code = props[0];
		let val = props[1];
		let year = props[2];
		
		let source = place.data[code][val][year];
		let sourceEW = ew.data[code][val][year];

		let keys = codes[code].map(d => d.code);
		let labels = codes[code].map(d => d.label ? d.label : d.code);
		let data = keys.map((key, i) => {
			return {x: labels[i], y: source[key], ew: sourceEW[key]};
		});
		return data;
	}

	function updateActive(place)  {
		let prev = JSON.parse(JSON.stringify(active));
		let code = place.code;
		let type = place.type;
		let siblings = options.filter(d => d.type == type && d.code != code).map(d => d.code);
		let children = place.children[0] ? place.children.map(d => d.code) : [];
		let childType = children[0] ? place.children[0].type : null;

		active.selected = code;
		active.type = type;
		active.childType = childType;
		active.highlighted = [...siblings, ...children];

		let keys = Object.keys(mapLayers);
		let fillProps = ['fill-color', 'fill-opacity'];
		let lineProps = ['line-color', 'line-width', 'line-opacity'];

		// Change layer visibility and paint properties if geography level changes
		if (map && active.type != prev.type) {
			// Reset map layer visibility properties
			keys.forEach(key => {
				map.setLayoutProperty(key + '-fill', 'visibility', 'none');
				map.setLayoutProperty(key + '-bounds', 'visibility', 'none');
				map.setLayoutProperty(key + '-self', 'visibility', 'none');
			});

			// Set new visibility and paint properties
			map.setLayoutProperty(type + '-fill', 'visibility', 'visible');
			map.setLayoutProperty(type + '-bounds', 'visibility', 'visible');
			map.setLayoutProperty(type + '-self', 'visibility', 'visible');
			lineProps.forEach(prop => map.setPaintProperty(type + '-self', prop, mapPaint['line-self'][prop]));
				
			if (place.parents[0]) {
				fillProps.forEach(prop => map.setPaintProperty(type + '-fill', prop, mapPaint[children[0] ? 'fill-active' : 'fill-self'][prop]));
				lineProps.forEach(prop => map.setPaintProperty(type + '-bounds', prop, mapPaint['line-active'][prop]));
			}
			if (childType) {
				map.setLayoutProperty(childType + '-fill', 'visibility', 'visible');
				map.setLayoutProperty(childType + '-bounds', 'visibility', 'visible');
				fillProps.forEach(prop => map.setPaintProperty(childType + '-fill', prop, mapPaint['fill-child'][prop]));
				lineProps.forEach(prop => map.setPaintProperty(childType + '-bounds', prop, mapPaint['line-child'][prop]));
			}
		}
	}
	function fitMap(bounds) {
		if (map) {
			map.fitBounds(bounds, {padding: 20});
		}
	}
	function mapSelect(ev) {
		selected = options.find(d => d.code == ev.detail.code);
		loadArea(selected.code);
	}
</script>

<Warning/>

{#if place && ew}
<div class="grid">
	<div class="text-small">
		{#if place.parents[0]}
		{#each place.parents.reverse() as parent, i}
		<a href="#{parent.code}" on:click="{() => loadArea(parent.code)}">{parent.name}</a>{@html ' &gt; '}
		{/each}
		{/if}
		{place.name}
	</div>
</div>
	
<div class="grid-2">
	<div>
		<span class="text-big">Health Index:  {place.name}</span><br/>
		{#if place.parents[0]}
		{types[place.type].name} in {place.parents[place.parents.length - 1].name}
		{/if}
	</div>
	<div>
		<div style="width: 240px; float: right;">
		<Select {options} bind:selected group="typenm" search={true} on:select="{() => { if (selected) { loadAreaHealth(selected.code) }}}"/>
		</div>
	</div>
</div>

<div class="profile-grid mt">

	<br/>
	
	<div>
		<h3>
			Health index: {placeHealth.data["Overall"].total[2018].value}
		</h3>
	</div>
	<div>
		<p>{sentGenerator(placeHealth, "Domain", ["data", "Overall", "total", "2018"], 0)}</p>
	</div>

	<div>
		<h4>
			Healthy Lives: {placeHealth.data["Healthy Lives"].total[2018].value}
		</h4>
	</div>
	<div>
		<p>{sentGenerator(placeHealth, "Domain", ["data", "Healthy Lives", "total", "2018"], 1)}</p>
	</div>

	<div>
		<h4>
			Healthy People: {placeHealth.data["Healthy People"].total[2018].value}
		</h4>
	</div>
	<div>
		<p>{sentGenerator(placeHealth, "Domain", ["data", "Healthy People", "total", "2018"], 2)}</p>
	</div>

	<div>
		<h4>
			Healthy Places: {placeHealth.data["Healthy Places"].total[2018].value}
		</h4>
	</div>
	<div>
		<p>{sentGenerator(placeHealth, "Domain", ["data", "Healthy Places", "total", "2018"], 3)}</p>
	</div>

	<hr>

	<div>
		<p>{sentGenerator(placeHealth, "Ranks",  ["priority2018", "Highest", 0], 0)}</p>
	</div>
	<div>
		<p>{sentGenerator(placeHealth, "Ranks",  ["priority2018", "Highest", 1], 1)}</p>
	</div>
	<div>
		<p>{sentGenerator(placeHealth, "Ranks",  ["priority2018", "Highest", 2], 2)}</p>
	</div>
	<div>
		<p>{sentGenerator(placeHealth, "Ranks",  ["priority2018", "Lowest", 3], 3)}</p>
	</div>
	<div>
		<p>{sentGenerator(placeHealth, "Ranks",  ["priority2018", "Lowest", 4], 4)}</p>
	</div>
	<div>
		<p>{sentGenerator(placeHealth, "Ranks",  ["priority2018", "Lowest", 5], 5)}</p>
	</div>


</div>

{#if place.children[0]}
<div class="grid mt">
	<div>
		<span class="text-label">{place.children[0].typepl} within {place.name}</span><br/>
		<span class="text-small">
		{#each place.children as child, i}
		<a href="#{child.code}" on:click="{() => loadArea(child.code)}">{child.name}</a>{ i < place.children.length - 1 ? ', ' : ''}
		{/each}
		</span>
	</div>
</div>
{/if}

<div class="grid-2 mt">
	<div>
		<img src="https://onsvisual.github.io/svelte-scrolly/img/ons-logo-pos-en.svg" alt="Office for National Statistics"/>
	</div>
	<div class="right">
		<span class="text-small">Source: Census 2011, with change +/- from Census 2001.</span>
	</div>
</div>
{/if}

<style>
	@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap');
	:global(body) {
		font-family: 'Open Sans', sans-serif;
		padding: 20px;
	}
	a {
		color: rgb(0, 60, 87);
	}
	img {
		width: 200px;
	}
	.text-big {
		font-size: 2em;
		font-weight: bold;
	}
	.text-small {
		font-size: 0.85em;
	}
	.text-label {
		font-weight: bold;
	}
	.text-change {
		color: red;
	}
	.muted {
		color: grey;
	}
	.increase {
		color: green;
	}
	.increase::before {
		content: "+";
	}
	.right {
		text-align: right;
	}
	.mt {
		margin-top: 20px;
	}
	.grid {
		display: grid;
		width: 100%;
		grid-gap: 20px;
		grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
		justify-content: stretch;
		grid-auto-flow: row dense;
	}
	.grid-2 {
		display: grid;
		width: 100%;
		grid-gap: 10px;
		grid-template-columns: auto auto;
	}
	.chart {
		width: 100%;
	}
	.map {
		grid-column: span 2;
		grid-row: span 2;
		min-height: 350px;
	}
	@media screen and (max-width:575px){
		.map {
			grid-column: span 1;
		}
	}

	.profile-grid {
		width: 70%;
		justify-content: stretch;
		margin-left: auto;
	    margin-right: auto;
	}
	ul {
		list-style-image: url('data:image/svg+xml;base64,PHN2ZyBjbGFzcz0ibGF5ZXJjYWtlLWxheW91dC1zdmcgc3ZlbHRlLXU4NGQ4ZCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiA8Y2lyY2xlIGN4PSI4IiBjeT0iOCIgcj0iOCIgZmlsbD0iIzIwNjA5NSIgc3Ryb2tlLXdpZHRoPSIwIi8+Cjwvc3ZnPgo=');
		vertical-align: middle;
	}
	.profile-grid > div > p {
		font-size: small;
		text-align: justify;
		padding: 5%;
	}
	h4, h3 {
		padding-left: 5%;
		font-size: xx-large;
	}
	p {
		font-size: x-large !important;
	}
	</style>