
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35731/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }
    class HtmlTag {
        constructor(anchor = null) {
            this.a = anchor;
            this.e = this.n = null;
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.h(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.38.2' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var EOL = {},
        EOF = {},
        QUOTE = 34,
        NEWLINE = 10,
        RETURN = 13;

    function objectConverter(columns) {
      return new Function("d", "return {" + columns.map(function(name, i) {
        return JSON.stringify(name) + ": d[" + i + "] || \"\"";
      }).join(",") + "}");
    }

    function customConverter(columns, f) {
      var object = objectConverter(columns);
      return function(row, i) {
        return f(object(row), i, columns);
      };
    }

    // Compute unique columns in order of discovery.
    function inferColumns(rows) {
      var columnSet = Object.create(null),
          columns = [];

      rows.forEach(function(row) {
        for (var column in row) {
          if (!(column in columnSet)) {
            columns.push(columnSet[column] = column);
          }
        }
      });

      return columns;
    }

    function pad(value, width) {
      var s = value + "", length = s.length;
      return length < width ? new Array(width - length + 1).join(0) + s : s;
    }

    function formatYear(year) {
      return year < 0 ? "-" + pad(-year, 6)
        : year > 9999 ? "+" + pad(year, 6)
        : pad(year, 4);
    }

    function formatDate(date) {
      var hours = date.getUTCHours(),
          minutes = date.getUTCMinutes(),
          seconds = date.getUTCSeconds(),
          milliseconds = date.getUTCMilliseconds();
      return isNaN(date) ? "Invalid Date"
          : formatYear(date.getUTCFullYear()) + "-" + pad(date.getUTCMonth() + 1, 2) + "-" + pad(date.getUTCDate(), 2)
          + (milliseconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "." + pad(milliseconds, 3) + "Z"
          : seconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "Z"
          : minutes || hours ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + "Z"
          : "");
    }

    function dsv(delimiter) {
      var reFormat = new RegExp("[\"" + delimiter + "\n\r]"),
          DELIMITER = delimiter.charCodeAt(0);

      function parse(text, f) {
        var convert, columns, rows = parseRows(text, function(row, i) {
          if (convert) return convert(row, i - 1);
          columns = row, convert = f ? customConverter(row, f) : objectConverter(row);
        });
        rows.columns = columns || [];
        return rows;
      }

      function parseRows(text, f) {
        var rows = [], // output rows
            N = text.length,
            I = 0, // current character index
            n = 0, // current line number
            t, // current token
            eof = N <= 0, // current token followed by EOF?
            eol = false; // current token followed by EOL?

        // Strip the trailing newline.
        if (text.charCodeAt(N - 1) === NEWLINE) --N;
        if (text.charCodeAt(N - 1) === RETURN) --N;

        function token() {
          if (eof) return EOF;
          if (eol) return eol = false, EOL;

          // Unescape quotes.
          var i, j = I, c;
          if (text.charCodeAt(j) === QUOTE) {
            while (I++ < N && text.charCodeAt(I) !== QUOTE || text.charCodeAt(++I) === QUOTE);
            if ((i = I) >= N) eof = true;
            else if ((c = text.charCodeAt(I++)) === NEWLINE) eol = true;
            else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
            return text.slice(j + 1, i - 1).replace(/""/g, "\"");
          }

          // Find next delimiter or newline.
          while (I < N) {
            if ((c = text.charCodeAt(i = I++)) === NEWLINE) eol = true;
            else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
            else if (c !== DELIMITER) continue;
            return text.slice(j, i);
          }

          // Return last token before EOF.
          return eof = true, text.slice(j, N);
        }

        while ((t = token()) !== EOF) {
          var row = [];
          while (t !== EOL && t !== EOF) row.push(t), t = token();
          if (f && (row = f(row, n++)) == null) continue;
          rows.push(row);
        }

        return rows;
      }

      function preformatBody(rows, columns) {
        return rows.map(function(row) {
          return columns.map(function(column) {
            return formatValue(row[column]);
          }).join(delimiter);
        });
      }

      function format(rows, columns) {
        if (columns == null) columns = inferColumns(rows);
        return [columns.map(formatValue).join(delimiter)].concat(preformatBody(rows, columns)).join("\n");
      }

      function formatBody(rows, columns) {
        if (columns == null) columns = inferColumns(rows);
        return preformatBody(rows, columns).join("\n");
      }

      function formatRows(rows) {
        return rows.map(formatRow).join("\n");
      }

      function formatRow(row) {
        return row.map(formatValue).join(delimiter);
      }

      function formatValue(value) {
        return value == null ? ""
            : value instanceof Date ? formatDate(value)
            : reFormat.test(value += "") ? "\"" + value.replace(/"/g, "\"\"") + "\""
            : value;
      }

      return {
        parse: parse,
        parseRows: parseRows,
        format: format,
        formatBody: formatBody,
        formatRows: formatRows,
        formatRow: formatRow,
        formatValue: formatValue
      };
    }

    var csv = dsv(",");

    var csvParse = csv.parse;

    function autoType(object) {
      for (var key in object) {
        var value = object[key].trim(), number, m;
        if (!value) value = null;
        else if (value === "true") value = true;
        else if (value === "false") value = false;
        else if (value === "NaN") value = NaN;
        else if (!isNaN(number = +value)) value = number;
        else if (m = value.match(/^([-+]\d{2})?\d{4}(-\d{2}(-\d{2})?)?(T\d{2}:\d{2}(:\d{2}(\.\d{3})?)?(Z|[-+]\d{2}:\d{2})?)?$/)) {
          if (fixtz && !!m[4] && !m[7]) value = value.replace(/-/g, "/").replace(/T/, " ");
          value = new Date(value);
        }
        else continue;
        object[key] = value;
      }
      return object;
    }

    // https://github.com/d3/d3-dsv/issues/45
    const fixtz = new Date("2019-01-01T00:00").getHours() || new Date("2019-07-01T00:00").getHours();

    async function getData(url) {
      let response = await fetch(url);
      let string = await response.text();
    	let data = await csvParse(string, autoType);
      return data;
    }

    function suffixer(int) {
      let mod = Math.round(int) % 10;
      return mod == 1 ? 'st' : mod == 2 ? 'nd' : mod == 3 ? 'rd' : 'th';
    }

    const urls = {
    		options: 'https://raw.githubusercontent.com/theojolliffe/healthindexlads/main/csv/includedHealthAreas.csv',
    		places: 'https://raw.githubusercontent.com/ONSvisual/census-data/main/json/place/',
    		healthplaces: 'https://raw.githubusercontent.com/theojolliffe/healthindexlads/main/',
    		quantiles: 'https://raw.githubusercontent.com/ONSvisual/census-data/main/json/quantiles/quartiles_'
    };

    const types = {
    	ew: {name: '', pl: ''},
    	wd: {name: 'Ward', pl: 'Wards'},
    	lad: {name: 'District', pl: 'Districts'},
    	"Upper Tier Local Authority": {name: 'Local Authority', pl: 'Local Authorities'},
    	rgn: {name: 'Region', pl: 'Regions'},
    	ctry: {name: 'Country', pl: 'Countries'}
    };

    const codes = {
    	age10yr: [
    		{code: '0-9'},
    		{code: '10-19'},
    		{code: '20-29'},
    		{code: '30-39'},
    		{code: '40-49'},
    		{code: '50-59'},
    		{code: '60-69'},
    		{code: '70plus', label: '70+'}
    	],
    	economic: [
    		{code: 'employee'},
    		{code: 'self-employed'},
    		{code: 'student', label: 'student (employed)'},
    		{code: 'unemployed'},
    		{code: 'inactive'}
    	],
    	ethnicity: [
    		{code: 'white'},
    		{code: 'asian'},
    		{code: 'black'},
    		{code: 'mixed'},
    		{code: 'other'}
    	],
    	population: [
    		{code: 'female'},
    		{code: 'male'}
    	],
    	health: [
    		{code: 'good'},
    		{code: 'fair'},
    		{code: 'bad'}
    	]
    };

    const mapSources = {
    	crd: {
    		id: 'crd',
    		promoteId: 'areacd',
    		type: 'vector',
    		url: 'https://cdn.ons.gov.uk/maptiles/administrative/authorities/v1/boundaries/{z}/{x}/{y}.pbf',
    		maxzoom: 12
    	},
    	wd: {
    		id: 'wd',
    		promoteId: 'areacd',
    		type: 'vector',
    		url: 'https://cdn.ons.gov.uk/maptiles/administrative/wards/v1/boundaries/{z}/{x}/{y}.pbf',
    		minzoom: 6,
    		maxzoom: 12
    	}
    };

    const mapLayers = {
    	ctry: {
    		source: 'crd',
    		sourceLayer: 'region',
    		code: 'areacd',
    		name: 'areanm',
    		filter: [
    			"all",
    			["==", "nation", "true"],
    			["in", "country", "E", "W"]
    		]
    	},
    	rgn: {
    		source: 'crd',
    		sourceLayer: 'region',
    		code: 'areacd',
    		name: 'areanm',
    		filter: [
    			"all",
    			["==", "region", "true"],
    			["==", "country", "E"]
    		]
    	},
    	lad: {
    		source: 'crd',
    		sourceLayer: 'authority',
    		code: 'areacd',
    		name: 'areanm',
    		filter: [
    			"all",
    			["==", "lower", "true"],
    			["in", "country", "E", "W"]
    		]
    	},
    	wd: {
    		source: 'wd',
    		sourceLayer: 'ward',
    		code: 'areacd',
    		name: 'areanm',
    		filter: ["in", "country", "E", "W"]
    	}
    };

    const mapPaint = {
    	fill: {
    		'fill-color': 'rgba(255,255,255,0)',
    		'fill-opacity': 0
    	},
    	line: {
    		'line-color': 'rgba(255,255,255,0)',
    		'line-width': 1,
    		'line-opacity': 0
    	},
    	'fill-active': {
    		'fill-color': [
    			'case',
    			['==', ['feature-state', 'selected'], true], 'rgba(255,255,255,0)',
    			'grey'
    		],
    		'fill-opacity': [
    			'case',
    			['==', ['feature-state', 'hovered'], true], 0.3,
    			['==', ['feature-state', 'highlighted'], true], 0.1,
    			0
    		]
    	},
    	'fill-self': {
    		'fill-color': [
    			'case',
    			['==', ['feature-state', 'selected'], true], 'rgb(17,140,123)',
    			'grey'
    		],
    		'fill-opacity': [
    			'case',
    			['==', ['feature-state', 'hovered'], true], 0.3,
    			0.1
    		]
    	},
    	'fill-child': {
    		'fill-color': [
    			'case',
    			['==', ['feature-state', 'highlighted'], true], 'rgb(17,140,123)',
    			'rgba(255,255,255,0)'
    		],
    		'fill-opacity': [
    			'case',
    			['==', ['feature-state', 'hovered'], true], 0.3,
    			['==', ['feature-state', 'highlighted'], true], 0.1,
    			0
    		]
    	},
    	'line-active': {
    		'line-color': [
    			'case',
    			['==', ['feature-state', 'selected'], true], 'rgb(17,140,123)',
    			'grey'
    		],
    		'line-width': 2,
    		'line-opacity': 1
    	},
    	'line-self': {
    		'line-color': 'rgb(17,140,123)',
    		'line-width': 2,
    		'line-opacity': [
    			'case',
    			['==', ['feature-state', 'selected'], true], 1,
    			0
    		]
    	},
    	'line-child': {
    		'line-color': 'rgb(17,140,123)',
    		'line-width': 1,
    		'line-opacity': [
    			'case',
    			['==', ['feature-state', 'highlighted'], true], 1,
    			0
    		]
    	}
    };

    /* src/ui/Select.svelte generated by Svelte v3.38.2 */
    const file$3 = "src/ui/Select.svelte";

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	child_ctx[35] = list;
    	child_ctx[34] = i;
    	return child_ctx;
    }

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	child_ctx[33] = list;
    	child_ctx[34] = i;
    	return child_ctx;
    }

    // (225:1) {:else}
    function create_else_block_1(ctx) {
    	let a;
    	let span0;

    	let t0_value = (/*placeholder*/ ctx[0]
    	? /*placeholder*/ ctx[0]
    	: "Select one") + "";

    	let t0;
    	let t1;
    	let span1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			a = element("a");
    			span0 = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			span1 = element("span");
    			span1.textContent = " ";
    			attr_dev(span0, "class", "svelte-qdzmwx");
    			add_location(span0, file$3, 226, 2, 4757);
    			attr_dev(span1, "class", "button svelte-qdzmwx");
    			toggle_class(span1, "search", /*search*/ ctx[3]);
    			toggle_class(span1, "down", !/*search*/ ctx[3]);
    			add_location(span1, file$3, 227, 2, 4815);
    			attr_dev(a, "id", "toggle");
    			attr_dev(a, "class", "svelte-qdzmwx");
    			add_location(a, file$3, 225, 1, 4721);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, span0);
    			append_dev(span0, t0);
    			append_dev(a, t1);
    			append_dev(a, span1);

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*toggle*/ ctx[12], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*placeholder*/ 1 && t0_value !== (t0_value = (/*placeholder*/ ctx[0]
    			? /*placeholder*/ ctx[0]
    			: "Select one") + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*search*/ 8) {
    				toggle_class(span1, "search", /*search*/ ctx[3]);
    			}

    			if (dirty[0] & /*search*/ 8) {
    				toggle_class(span1, "down", !/*search*/ ctx[3]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(225:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (220:1) {#if selectedItem && !search}
    function create_if_block_4(ctx) {
    	let a;
    	let span0;
    	let t0_value = /*selectedItem*/ ctx[6][/*label*/ ctx[1]] + "";
    	let t0;
    	let t1;
    	let t2;
    	let span1;
    	let mounted;
    	let dispose;
    	let if_block = /*group*/ ctx[2] && create_if_block_5(ctx);

    	const block = {
    		c: function create() {
    			a = element("a");
    			span0 = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			span1 = element("span");
    			span1.textContent = " ";
    			attr_dev(span0, "class", "selection svelte-qdzmwx");
    			add_location(span0, file$3, 221, 2, 4536);
    			attr_dev(span1, "class", "button close svelte-qdzmwx");
    			add_location(span1, file$3, 222, 2, 4644);
    			attr_dev(a, "id", "toggle");
    			attr_dev(a, "class", "selected svelte-qdzmwx");
    			add_location(a, file$3, 220, 1, 4483);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, span0);
    			append_dev(span0, t0);
    			append_dev(span0, t1);
    			if (if_block) if_block.m(span0, null);
    			append_dev(a, t2);
    			append_dev(a, span1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(span1, "click", /*unSelect*/ ctx[14], false, false, false),
    					listen_dev(a, "click", /*toggle*/ ctx[12], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*selectedItem, label*/ 66 && t0_value !== (t0_value = /*selectedItem*/ ctx[6][/*label*/ ctx[1]] + "")) set_data_dev(t0, t0_value);

    			if (/*group*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_5(ctx);
    					if_block.c();
    					if_block.m(span0, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(220:1) {#if selectedItem && !search}",
    		ctx
    	});

    	return block;
    }

    // (222:48) {#if group}
    function create_if_block_5(ctx) {
    	let small;
    	let t_value = /*selectedItem*/ ctx[6][/*group*/ ctx[2]] + "";
    	let t;

    	const block = {
    		c: function create() {
    			small = element("small");
    			t = text(t_value);
    			attr_dev(small, "class", "svelte-qdzmwx");
    			add_location(small, file$3, 221, 59, 4593);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, small, anchor);
    			append_dev(small, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*selectedItem, group*/ 68 && t_value !== (t_value = /*selectedItem*/ ctx[6][/*group*/ ctx[2]] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(small);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(222:48) {#if group}",
    		ctx
    	});

    	return block;
    }

    // (231:1) {#if expanded}
    function create_if_block$2(ctx) {
    	let div;
    	let input_1;
    	let t;
    	let ul;
    	let mounted;
    	let dispose;

    	function select_block_type_1(ctx, dirty) {
    		if (/*filter*/ ctx[4].length < 3) return create_if_block_1$1;
    		if (/*filtered*/ ctx[9][0] && /*group*/ ctx[2]) return create_if_block_2$1;
    		if (/*filtered*/ ctx[9][0]) return create_if_block_3$1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			input_1 = element("input");
    			t = space();
    			ul = element("ul");
    			if_block.c();
    			attr_dev(input_1, "type", "text");
    			attr_dev(input_1, "placeholder", "");
    			attr_dev(input_1, "autocomplete", "false");
    			attr_dev(input_1, "class", "svelte-qdzmwx");
    			add_location(input_1, file$3, 232, 2, 4967);
    			attr_dev(ul, "class", "svelte-qdzmwx");
    			add_location(ul, file$3, 233, 2, 5084);
    			attr_dev(div, "id", "dropdown");
    			set_style(div, "top", "0");
    			attr_dev(div, "class", "svelte-qdzmwx");
    			add_location(div, file$3, 231, 1, 4914);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input_1);
    			set_input_value(input_1, /*filter*/ ctx[4]);
    			/*input_1_binding*/ ctx[23](input_1);
    			append_dev(div, t);
    			append_dev(div, ul);
    			if_block.m(ul, null);
    			/*div_binding*/ ctx[30](div);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input_1, "input", /*input_1_input_handler*/ ctx[22]),
    					listen_dev(input_1, "keyup", /*doKeyup*/ ctx[16], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filter*/ 16 && input_1.value !== /*filter*/ ctx[4]) {
    				set_input_value(input_1, /*filter*/ ctx[4]);
    			}

    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(ul, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*input_1_binding*/ ctx[23](null);
    			if_block.d();
    			/*div_binding*/ ctx[30](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(231:1) {#if expanded}",
    		ctx
    	});

    	return block;
    }

    // (249:3) {:else}
    function create_else_block(ctx) {
    	let li;

    	const block = {
    		c: function create() {
    			li = element("li");
    			li.textContent = "No results";
    			attr_dev(li, "class", "svelte-qdzmwx");
    			add_location(li, file$3, 249, 3, 5657);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(249:3) {:else}",
    		ctx
    	});

    	return block;
    }

    // (243:25) 
    function create_if_block_3$1(ctx) {
    	let each_1_anchor;
    	let each_value_1 = /*filtered*/ ctx[9];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*items, active, select, filtered, label*/ 11010) {
    				each_value_1 = /*filtered*/ ctx[9];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(243:25) ",
    		ctx
    	});

    	return block;
    }

    // (237:34) 
    function create_if_block_2$1(ctx) {
    	let each_1_anchor;
    	let each_value = /*filtered*/ ctx[9];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*items, active, select, filtered, group, label*/ 11014) {
    				each_value = /*filtered*/ ctx[9];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(237:34) ",
    		ctx
    	});

    	return block;
    }

    // (235:3) {#if filter.length < 3}
    function create_if_block_1$1(ctx) {
    	let li;

    	const block = {
    		c: function create() {
    			li = element("li");
    			li.textContent = "Type a name...";
    			attr_dev(li, "class", "svelte-qdzmwx");
    			add_location(li, file$3, 235, 3, 5119);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(235:3) {#if filter.length < 3}",
    		ctx
    	});

    	return block;
    }

    // (244:3) {#each filtered as option, i}
    function create_each_block_1$1(ctx) {
    	let li;
    	let t0_value = /*option*/ ctx[32][/*label*/ ctx[1]] + "";
    	let t0;
    	let t1;
    	let i = /*i*/ ctx[34];
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[27](/*option*/ ctx[32]);
    	}

    	function mouseover_handler_1() {
    		return /*mouseover_handler_1*/ ctx[28](/*i*/ ctx[34]);
    	}

    	const assign_li = () => /*li_binding_1*/ ctx[29](li, i);
    	const unassign_li = () => /*li_binding_1*/ ctx[29](null, i);

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(li, "class", "svelte-qdzmwx");
    			toggle_class(li, "highlight", /*active*/ ctx[8] == /*i*/ ctx[34]);
    			add_location(li, file$3, 244, 3, 5475);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    			assign_li();

    			if (!mounted) {
    				dispose = [
    					listen_dev(li, "click", click_handler_1, false, false, false),
    					listen_dev(li, "mouseover", mouseover_handler_1, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*filtered, label*/ 514 && t0_value !== (t0_value = /*option*/ ctx[32][/*label*/ ctx[1]] + "")) set_data_dev(t0, t0_value);

    			if (i !== /*i*/ ctx[34]) {
    				unassign_li();
    				i = /*i*/ ctx[34];
    				assign_li();
    			}

    			if (dirty[0] & /*active*/ 256) {
    				toggle_class(li, "highlight", /*active*/ ctx[8] == /*i*/ ctx[34]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			unassign_li();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(244:3) {#each filtered as option, i}",
    		ctx
    	});

    	return block;
    }

    // (238:3) {#each filtered as option, i}
    function create_each_block$1(ctx) {
    	let li;
    	let t0_value = /*option*/ ctx[32][/*label*/ ctx[1]] + "";
    	let t0;
    	let t1;
    	let small;
    	let t2_value = /*option*/ ctx[32][/*group*/ ctx[2]] + "";
    	let t2;
    	let t3;
    	let i = /*i*/ ctx[34];
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[24](/*option*/ ctx[32]);
    	}

    	function mouseover_handler() {
    		return /*mouseover_handler*/ ctx[25](/*i*/ ctx[34]);
    	}

    	const assign_li = () => /*li_binding*/ ctx[26](li, i);
    	const unassign_li = () => /*li_binding*/ ctx[26](null, i);

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text(t0_value);
    			t1 = space();
    			small = element("small");
    			t2 = text(t2_value);
    			t3 = space();
    			attr_dev(small, "class", "svelte-qdzmwx");
    			add_location(small, file$3, 239, 20, 5362);
    			attr_dev(li, "class", "svelte-qdzmwx");
    			toggle_class(li, "highlight", /*active*/ ctx[8] == /*i*/ ctx[34]);
    			add_location(li, file$3, 238, 3, 5214);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    			append_dev(li, small);
    			append_dev(small, t2);
    			append_dev(li, t3);
    			assign_li();

    			if (!mounted) {
    				dispose = [
    					listen_dev(li, "click", click_handler, false, false, false),
    					listen_dev(li, "mouseover", mouseover_handler, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*filtered, label*/ 514 && t0_value !== (t0_value = /*option*/ ctx[32][/*label*/ ctx[1]] + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*filtered, group*/ 516 && t2_value !== (t2_value = /*option*/ ctx[32][/*group*/ ctx[2]] + "")) set_data_dev(t2, t2_value);

    			if (i !== /*i*/ ctx[34]) {
    				unassign_li();
    				i = /*i*/ ctx[34];
    				assign_li();
    			}

    			if (dirty[0] & /*active*/ 256) {
    				toggle_class(li, "highlight", /*active*/ ctx[8] == /*i*/ ctx[34]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			unassign_li();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(238:3) {#each filtered as option, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let t;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*selectedItem*/ ctx[6] && !/*search*/ ctx[3]) return create_if_block_4;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*expanded*/ ctx[7] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			attr_dev(div, "id", "select");
    			attr_dev(div, "class", "svelte-qdzmwx");
    			toggle_class(div, "active", /*expanded*/ ctx[7]);
    			add_location(div, file$3, 218, 0, 4386);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block0.m(div, null);
    			append_dev(div, t);
    			if (if_block1) if_block1.m(div, null);

    			if (!mounted) {
    				dispose = listen_dev(div, "keydown", /*doKeydown*/ ctx[15], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div, t);
    				}
    			}

    			if (/*expanded*/ ctx[7]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$2(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty[0] & /*expanded*/ 128) {
    				toggle_class(div, "active", /*expanded*/ ctx[7]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function sleep(ms) {
    	return new Promise(resolve => setTimeout(resolve, ms));
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let regex;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Select", slots, []);
    	const dispatch = createEventDispatcher();
    	let { options } = $$props;
    	let { selected = null } = $$props;
    	let { placeholder = "Find an area..." } = $$props;
    	let { value = "code" } = $$props;
    	let { label = "name" } = $$props;
    	let { group = null } = $$props;
    	let { search = false } = $$props;
    	let selectedPrev = selected;

    	let selectedItem = selected
    	? options.find(d => {
    			d[value] == selected[value];
    		})
    	: null;

    	let expanded = false;
    	let filter = "";
    	let active = null;
    	let filtered;
    	let el;
    	let input;
    	let items = [];

    	function toggle(ev) {
    		ev.stopPropagation();
    		$$invalidate(4, filter = "");
    		$$invalidate(7, expanded = !expanded);

    		sleep(10).then(() => {
    			if (input && expanded) {
    				input.focus();
    			}
    		});
    	}

    	function select(option) {
    		$$invalidate(17, selected = option);
    		$$invalidate(7, expanded = false);
    		dispatch("select", { selected: option, value: option[value] });
    	}

    	function unSelect(ev) {
    		ev.stopPropagation();
    		$$invalidate(17, selected = null);
    		$$invalidate(20, selectedPrev = null);
    		$$invalidate(6, selectedItem = null);
    		dispatch("select", { selected: null, value: null });
    	}

    	function doKeydown(ev) {
    		if (expanded && filtered[0] && Number.isInteger(active)) {
    			if (ev.keyCode === 38) {
    				$$invalidate(8, active -= active > 0 ? 1 : 0);
    				items[active].scrollIntoView({ block: "nearest", inline: "start" });
    			} else if (ev.keyCode === 40) {
    				$$invalidate(8, active += active < filtered.length - 1 ? 1 : 0);
    				items[active].scrollIntoView({ block: "nearest", inline: "end" });
    			}
    		}
    	}

    	function doKeyup(ev) {
    		if (filtered[0] && Number.isInteger(active)) {
    			if (ev.keyCode === 13) {
    				select(filtered[active]);
    			}
    		}
    	}

    	const writable_props = ["options", "selected", "placeholder", "value", "label", "group", "search"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Select> was created with unknown prop '${key}'`);
    	});

    	function input_1_input_handler() {
    		filter = this.value;
    		$$invalidate(4, filter);
    	}

    	function input_1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			input = $$value;
    			$$invalidate(10, input);
    		});
    	}

    	const click_handler = option => select(option);
    	const mouseover_handler = i => $$invalidate(8, active = i);

    	function li_binding($$value, i) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			items[i] = $$value;
    			$$invalidate(11, items);
    		});
    	}

    	const click_handler_1 = option => select(option);
    	const mouseover_handler_1 = i => $$invalidate(8, active = i);

    	function li_binding_1($$value, i) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			items[i] = $$value;
    			$$invalidate(11, items);
    		});
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			el = $$value;
    			$$invalidate(5, el);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("options" in $$props) $$invalidate(18, options = $$props.options);
    		if ("selected" in $$props) $$invalidate(17, selected = $$props.selected);
    		if ("placeholder" in $$props) $$invalidate(0, placeholder = $$props.placeholder);
    		if ("value" in $$props) $$invalidate(19, value = $$props.value);
    		if ("label" in $$props) $$invalidate(1, label = $$props.label);
    		if ("group" in $$props) $$invalidate(2, group = $$props.group);
    		if ("search" in $$props) $$invalidate(3, search = $$props.search);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		options,
    		selected,
    		placeholder,
    		value,
    		label,
    		group,
    		search,
    		selectedPrev,
    		selectedItem,
    		expanded,
    		filter,
    		active,
    		filtered,
    		el,
    		input,
    		items,
    		sleep,
    		toggle,
    		select,
    		unSelect,
    		doKeydown,
    		doKeyup,
    		regex
    	});

    	$$self.$inject_state = $$props => {
    		if ("options" in $$props) $$invalidate(18, options = $$props.options);
    		if ("selected" in $$props) $$invalidate(17, selected = $$props.selected);
    		if ("placeholder" in $$props) $$invalidate(0, placeholder = $$props.placeholder);
    		if ("value" in $$props) $$invalidate(19, value = $$props.value);
    		if ("label" in $$props) $$invalidate(1, label = $$props.label);
    		if ("group" in $$props) $$invalidate(2, group = $$props.group);
    		if ("search" in $$props) $$invalidate(3, search = $$props.search);
    		if ("selectedPrev" in $$props) $$invalidate(20, selectedPrev = $$props.selectedPrev);
    		if ("selectedItem" in $$props) $$invalidate(6, selectedItem = $$props.selectedItem);
    		if ("expanded" in $$props) $$invalidate(7, expanded = $$props.expanded);
    		if ("filter" in $$props) $$invalidate(4, filter = $$props.filter);
    		if ("active" in $$props) $$invalidate(8, active = $$props.active);
    		if ("filtered" in $$props) $$invalidate(9, filtered = $$props.filtered);
    		if ("el" in $$props) $$invalidate(5, el = $$props.el);
    		if ("input" in $$props) $$invalidate(10, input = $$props.input);
    		if ("items" in $$props) $$invalidate(11, items = $$props.items);
    		if ("regex" in $$props) $$invalidate(21, regex = $$props.regex);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*filter*/ 16) {
    			$$invalidate(21, regex = filter ? new RegExp(filter, "i") : null);
    		}

    		if ($$self.$$.dirty[0] & /*regex, options, label*/ 2359298) {
    			{
    				$$invalidate(9, filtered = regex
    				? options.filter(option => regex.test(option[label]))
    				: options);

    				$$invalidate(8, active = 0);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*el*/ 32) {
    			document.onclick = function (e) {
    				if (e.target !== el) {
    					$$invalidate(7, expanded = false);
    					$$invalidate(8, active = 0);
    				}
    			};
    		}

    		if ($$self.$$.dirty[0] & /*selectedPrev, selected, options, value*/ 1966080) {
    			if (selectedPrev != selected) {
    				$$invalidate(6, selectedItem = options.find(d => d[value] == selected[value]));
    				$$invalidate(20, selectedPrev = selected);
    			}
    		}
    	};

    	return [
    		placeholder,
    		label,
    		group,
    		search,
    		filter,
    		el,
    		selectedItem,
    		expanded,
    		active,
    		filtered,
    		input,
    		items,
    		toggle,
    		select,
    		unSelect,
    		doKeydown,
    		doKeyup,
    		selected,
    		options,
    		value,
    		selectedPrev,
    		regex,
    		input_1_input_handler,
    		input_1_binding,
    		click_handler,
    		mouseover_handler,
    		li_binding,
    		click_handler_1,
    		mouseover_handler_1,
    		li_binding_1,
    		div_binding
    	];
    }

    class Select extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$3,
    			create_fragment$3,
    			safe_not_equal,
    			{
    				options: 18,
    				selected: 17,
    				placeholder: 0,
    				value: 19,
    				label: 1,
    				group: 2,
    				search: 3
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Select",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*options*/ ctx[18] === undefined && !("options" in props)) {
    			console.warn("<Select> was created without expected prop 'options'");
    		}
    	}

    	get options() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get group() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set group(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get search() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set search(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/ui/Warning.svelte generated by Svelte v3.38.2 */

    const file$2 = "src/ui/Warning.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let strong;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			strong = element("strong");
    			strong.textContent = "Warning!";
    			t1 = text(" This is a prototype. Data likely to contain inaccuracies.");
    			add_location(strong, file$2, 1, 2, 24);
    			attr_dev(div, "class", "warning svelte-srzfvi");
    			add_location(div, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, strong);
    			append_dev(div, t1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Warning", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Warning> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Warning extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Warning",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    var strings = `
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
        if (subDomain[i].hlRank>1)
            | #[+value(subDomain[i].hlRank, {'ORDINAL_TEXTUAL':true})] 
        | greatest #[+value(subDomain[i].pos)] in 
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
`;

    var introStrings = `
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
`;

    /* src/Text.svelte generated by Svelte v3.38.2 */

    const { Object: Object_1, console: console_1$1 } = globals;
    const file$1 = "src/Text.svelte";

    // (71:0) {#if load}
    function create_if_block$1(ctx) {
    	let div0;
    	let raw0_value = /*intro*/ ctx[4](/*place*/ ctx[0]) + "";
    	let t;
    	let div1;
    	let raw1_value = /*results*/ ctx[3](/*place*/ ctx[0]) + "";

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t = space();
    			div1 = element("div");
    			set_style(div0, "font-weight", "600");
    			add_location(div0, file$1, 71, 4, 2775);
    			add_location(div1, file$1, 72, 4, 2837);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			div0.innerHTML = raw0_value;
    			insert_dev(target, t, anchor);
    			insert_dev(target, div1, anchor);
    			div1.innerHTML = raw1_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*place*/ 1 && raw0_value !== (raw0_value = /*intro*/ ctx[4](/*place*/ ctx[0]) + "")) div0.innerHTML = raw0_value;			if (dirty & /*place*/ 1 && raw1_value !== (raw1_value = /*results*/ ctx[3](/*place*/ ctx[0]) + "")) div1.innerHTML = raw1_value;		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(71:0) {#if load}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let script;
    	let script_src_value;
    	let t;
    	let if_block_anchor;
    	let mounted;
    	let dispose;
    	let if_block = /*load*/ ctx[1] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			script = element("script");
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			if (script.src !== (script_src_value = "https://unpkg.com/rosaenlg@3.0.1/dist/rollup/rosaenlg_tiny_en_US_3.0.1_comp.js")) attr_dev(script, "src", script_src_value);
    			add_location(script, file$1, 66, 1, 2613);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);

    			if (!mounted) {
    				dispose = listen_dev(script, "load", /*onRosaeNlgLoad*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*load*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			detach_dev(script);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Text", slots, []);
    	let { place } = $$props;
    	let load = false;

    	const onRosaeNlgLoad = () => {
    		$$invalidate(1, load = true);
    	};

    	function results(place) {
    		let pos = place.priority2018.Highest.map(e => {
    			e["pos"] = "improvement";
    			return e;
    		});

    		let neg = place.priority2018.Lowest.map(e => {
    			e["pos"] = "decline";
    			return e;
    		});

    		let priorities = pos.concat(neg);

    		let subDomains = priorities.filter(e => {
    			return e["Index level"] == "Subdomain" & e["Measure"] != "Crime" & e["Measure"] != "Unemployment";
    		});

    		let imprDecl = [];

    		subDomains.sort(function (a, b) {
    			return a.hlRank - b.hlRank;
    		});

    		console.log("place", place);
    		console.log("subDomains", subDomains);

    		for (const s of subDomains) {
    			if (s.hlRankType == "Rank") {
    				if (s.Change3year < 0) {
    					imprDecl.push("decline");
    				} else {
    					imprDecl.push("improvement");
    				}
    			} else {
    				imprDecl.push(s.pos);
    			}
    		}

    		console.log("imprDecl", imprDecl);

    		function indicatorRank(obj) {
    			let indis = [];

    			for (let i = 0; i < subDomains.length; i++) {
    				let objTemp = obj[subDomains[i].Domain].subdomains[subDomains[i].Subdomain].indicators;
    				let objArr = [];

    				for (const [key, value] of Object.entries(objTemp)) {
    					value["indi"] = key;
    					objArr.push({});
    					objArr[objArr.length - 1] = value;
    				}

    				objArr.sort(function (a, b) {
    					if (subDomains[i].hlRankType == "Change1year Rank") {
    						return b[2018].Change1year - a[2018].Change1year;
    					} else {
    						return b[2018].Change3year - a[2018].Change3year;
    					}
    				});

    				indis.push(objArr);
    			}

    			return indis;
    		}

    		console.log("indicatorRank", indicatorRank(place.data));

    		let res = rosaenlg_en_US.render(strings, {
    			language: "en_UK",
    			place,
    			subDomain: subDomains,
    			negs: [
    				"smoking",
    				"anxiety",
    				"alcohol misuse",
    				"neighbourhood noise",
    				"air pollution",
    				"depression",
    				"self-harm",
    				"suicides"
    			],
    			imprDecl,
    			indicators: indicatorRank(place.data)
    		});

    		return res;
    	}

    	function intro(place) {
    		let res = rosaenlg_en_US.render(introStrings, { language: "en_UK", place });
    		return res;
    	}

    	const writable_props = ["place"];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<Text> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("place" in $$props) $$invalidate(0, place = $$props.place);
    	};

    	$$self.$capture_state = () => ({
    		strings,
    		introStrings,
    		place,
    		load,
    		onRosaeNlgLoad,
    		results,
    		intro
    	});

    	$$self.$inject_state = $$props => {
    		if ("place" in $$props) $$invalidate(0, place = $$props.place);
    		if ("load" in $$props) $$invalidate(1, load = $$props.load);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [place, load, onRosaeNlgLoad, results, intro];
    }

    class Text extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { place: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Text",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*place*/ ctx[0] === undefined && !("place" in props)) {
    			console_1$1.warn("<Text> was created without expected prop 'place'");
    		}
    	}

    	get place() {
    		throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set place(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const ordinal = i => {
    	if (i < 10) {
    		return [
    			'',
    			'first',
    			'second',
    			'third',
    			'fourth',
    			'fifth',
    			'sixth',
    			'seventh',
    			'eighth',
    			'ninth'
    		][i];
    	}

    	const j = i % 10;
    	const k = i % 100;
    	if (j === 1 && k !== 11) {
    		return i + 'st';
    	}

    	if (j === 2 && k !== 12) {
    		return i + 'nd';
    	}

    	if (j === 3 && k !== 13) {
    		return i + 'rd';
    	}

    	return i + 'th';
    };

    const createText = (template, dict) => {
    	//
    	// TODO: < and >
    	//

    	// This is based on Douglas Crockford's old json_parse https://github.com/douglascrockford/JSON-js/blob/03157639c7a7cddd2e9f032537f346f1a87c0f6d/json_parse.js

    	if (typeof template !== 'string') {
    		throw new TypeError(`Expected a string, got ${typeof template}`);
    	}

    	let at = 1;
    	let ch = template.charAt(0);

    	const getCh = function () {
    		// Just to keep xo happy
    		return ch;
    	};

    	const error = function (m) {
    		throw JSON.stringify({
    			name: 'Robo-journalist error',
    			message: m,
    			at,
    			text: template
    		});
    	};

    	const next = function (c) {
    		// If a c parameter is provided, verify that it matches the current character.
    		if (c && c !== ch) {
    			error('Expected \'' + c + '\' instead of \'' + ch + '\'');
    		}

    		// Get the next character. When there are no more characters,
    		// return the empty string.
    		ch = template.charAt(at);
    		at += 1;
    		return ch;
    	};

    	const getValue = function (key) {
    		if (!(key in dict)) {
    			error(`${key} is not a key of the data dictionary.`);
    		}

    		return dict[key];
    	};

    	const rpn = function (key) {
    		const tokens = key.split(' ');
    		const operators = {
    			'+': (a, b) => a + b,
    			'-': (a, b) => a - b,
    			'*': (a, b) => a * b,
    			'/': (a, b) => a / b,
    			'<': (a, b) => a < b,
    			'>': (a, b) => a > b,
    			'<=': (a, b) => a <= b,
    			'>=': (a, b) => a >= b
    		};
    		const stack = [];
    		for (const token of tokens) {
    			if (/^-?\d+$/.test(token)) {
    				// An integer literal
    				stack.push(Number(token));
    			} else if (token in operators) {
    				const b = Number(stack.pop());
    				const a = Number(stack.pop());
    				stack.push(operators[token](a, b));
    			} else if (token === '~abs') {
    				stack[stack.length - 1] = Math.abs(stack[stack.length - 1]);
    			} else if (token === '~ord') {
    				stack[stack.length - 1] = ordinal(Number(stack[stack.length - 1]));
    			} else if (token === '~ord\'') {
    				let result = ordinal(Number(stack.pop()));
    				if (result === 'first') {
    					result = '';
    				} else {
    					result += ' ';
    				}

    				stack.push(result);
    			} else if (token.charAt(0) === '^') {
    				stack[stack.length - 1] = getValue(token.slice(1))(stack[stack.length - 1]);
    			} else {
    				stack.push(getValue(token));
    			}
    		}

    		if (stack.length !== 1) {
    			error('Invalid RPN');
    		}

    		return stack[0];
    	};

    	const eitherOr = function (which) {
    		next('?');
    		const first = parse();
    		next(':');
    		const second = parse();
    		next('}');
    		return which ? first : second;
    	};

    	const braced = function () {
    		next('{');
    		if (ch === ':') {
    			// {:} adds a colon to the output
    			next(':');
    			next('}');
    			return ':';
    		}

    		let varName = '';
    		while (getCh()) {
    			if (ch === '}') {
    				next('}');
    				return rpn(varName);
    			}

    			if (ch === '?') {
    				return eitherOr(rpn(varName));
    			}

    			varName += ch;
    			next();
    		}

    		error('Braces not closed');
    	};

    	const parse = function () {
    		let result = '';
    		while (getCh()) {
    			if (ch === ':' || ch === '}') {
    				return result;
    			}

    			if (ch === '{') {
    				result += braced();
    				continue;
    			}

    			result += ch;
    			next();
    		}

    		return result;
    	};

    	const result = parse();
    	if (ch !== '') {
    		error(`Didn't expect '${ch}'`);
    	}

    	return result;
    };

    function ordinal_suffix_of(i) {
        if (i < 10) {
            return [
                "",
                "",
                "second",
                "third",
                "fourth",
                "fifth",
                "sixth",
                "seventh",
                "eighth",
                "ninth"
            ][i];
        }
        // TODO: check if the remainder of this function is correct
        var j = i % 10,
            k = i % 100;
        if (j == 1 && k != 11) {
            return i + "st";
        }
        if (j == 2 && k != 12) {
            return i + "nd";
        }
        if (j == 3 && k != 13) {
            return i + "rd";
        }
        return i + "th";
    }

    var healthStrings = [ { varCode:"ranking_1_sent",
        comment:"TOTAL POPULATION",
        template:"{Current?:{Change1year?Between 2017 and 2018,:In the three years from 2015 to 2018,}}{firstPara? {ladName}:{Current?This area: this area}} {Current?has:saw} England's {ordinalSuffix} {Current?highest score for:{rankIsNegative?greatest decline:greatest improvement in}} {measure}." },
      { varCode:"domain_1_sent",
        comment:"POPULATION CHANGE",
        template:"Barnet has a health index score of 100, the 32nd healthiest district in England." },
      { varCode:"domain_2_sent",
        comment:"PROPORTION OVER 65",
        template:"Barnet's overall health has improved since scoring 99 in 2015." } ];

    let healthRoboStrings = {};
    healthStrings.forEach(d => {healthRoboStrings[d.varCode] = d.template;});

    // A variable to keep track of previous sentence
    let intro = true;


    function sentGenerator(place, section, topics, pNum) {

        let dataSelect = place;
        for (let i = 0; i < topics.length; i++)  {
            dataSelect = dataSelect[topics[i]];
        }

        let measure = topicify(dataSelect, topics);

        let roboString = healthRoboStrings["ranking_1_sent"];
        let roboSentence = createText(roboString, {
            Change1year: isXYearChange(dataSelect, topics, "Change1year"),
            Change3year: isXYearChange(dataSelect, topics, "Change3year"),
            Current: isXYearChange(dataSelect, topics, "Current"),
            firstPara: ((pNum==0)|(pNum==3)),
            ladName: place.name,
            ordinalSuffix: ordinal_suffix_of(topics[0]=="data"?dataSelect["Rank"]:dataSelect["hlRank"]),
            rankIsNegative: (topics[1]=="Lowest"),
            regionName: "London",
            londonOrWales: false,
            measure: measure,
            intro: intro,
        });

        return roboSentence;
    }

    function isXYearChange(dataSelect, topics, change) {
        let trueFalse;

        if (topics[0]=="priority2018") {
            if (change=="Current") {
                if (!dataSelect["hlRankType"].includes("Change")) {
                    intro = !(intro==true);
                    trueFalse = true;
                }
            }
            if (dataSelect["hlRankType"].includes(change)) {
                intro = !(intro==true);
                trueFalse = true;
            }
            else {
                trueFalse = false;
            }
        }
        if (topics[0]=="data") {
            if (change=="Current") {
                intro = !(intro==true);
                trueFalse = true;
            }
            else {
                trueFalse = false;
            }
        }
        return trueFalse
    }

    function sentGenerator2(place, pNum, topics) {
        // console.log("Health topic", topics)

        let dataSelect = place["data"];
        for (let i = 0; i < topics.length; i++)  {
            dataSelect = dataSelect[topics[i]];
        }

        // determine if current or change is higher rank
        let currentChange = currentOrChange(place, topics);


        let highLowRank;
        let highLowRankType;
        let highLow;
        if (dataSelect["Rank"]<76) {
            highLowRank = "highestRank";
            highLowRankType = "highestRankType";
            highLow = "Highest";
        }
        if (dataSelect["Rank"]>75) {
            highLowRank = "lowestRank";
            highLowRankType = "lowestRankType";
            highLow = "Lowest";
        }

        let roboString3 = healthRoboStrings["domain_1_sent"];
        createText(roboString3, {
            Change1yearRank: place['priority2018'][highLow][pNum][highLowRankType].includes("Change1year"),
            Change3yearRank: place['priority2018'][highLow][pNum][highLowRankType].includes("Change3year"),
            Current: !place['priority2018'][highLow][pNum][highLowRankType].includes("Change"),
            firstPara: ((pNum==0)|(pNum==3)),
            ladName: place.name,
            ordinalSuffix: ordinal_suffix_of(place['priority2018'][highLow][pNum][highLowRank]),
            rankIsNegative: (highLow=="Lowest"),
            regionName: "London",
            londonOrWales: false,
            measure: place['priority2018'][highLow][pNum]['Measure'].toLowerCase(),
        });

        let roboString4 = healthRoboStrings["domain_2_sent"];
        createText(roboString4, {
            Change1yearRank: place['priority2018'][highLow][pNum][highLowRankType].includes("Change1year"),
            Change3yearRank: place['priority2018'][highLow][pNum][highLowRankType].includes("Change3year"),
            Rank: !place['priority2018'][highLow][pNum][highLowRankType].includes("Change"),
            firstPara: ((pNum==0)|(pNum==3)),
            ladName: place.name,
            ordinalSuffix: ordinal_suffix_of(place['priority2018'][highLow][pNum][highLowRank]),
            rankIsNegative: (highLow=="Lowest"),
            regionName: "London",
            londonOrWales: false,
            measure: place['priority2018'][highLow][pNum]['Measure'].toLowerCase(),
        });

        place.name + " has seen the UK's " + rankify(place, topics, currentChange, dataSelect) +  " " + changify(currentChange) + " in "  + topicify(place, topics) + ".";

        return  " ";
    }

    function currentOrChange(place, topics) {

        let dataSelect = place["data"];
        for (let i = 0; i < topics.length; i++)  {
            dataSelect = dataSelect[topics[i]];
        }

        let currentChangeTmp = dataSelect["Change3year Rank"]>dataSelect["Rank"]?(dataSelect["Change1year Rank"]>dataSelect["Rank"]?"current":"oneYear"):(dataSelect["Change1year Rank"]>dataSelect["Change3year Rank"]?"threeYear":"oneYear");

        return currentChangeTmp;
    }

    function topicify(dataSelect, topics) {
        let topicExpanded;
        if (topics[0]=="data") {
            if (topics[1] == "Overall") {
                topicExpanded = "overall health";
            }
            else if (topics[1] == "Healthy Places") {
                topicExpanded = "environmental factors associated with health";
            }
            else if (topics[1] == "Healthy Lives") {
                topicExpanded = "health-related behaviours";
            }
            else if (topics[1] == "Healthy People") {
                topicExpanded = "health outcomes";
            }
        }
        if (topics[0]=="priority2018") {
            topicExpanded = dataSelect['Measure'].toLowerCase();
        }
        return topicExpanded
    }

    function changify(currentChange) {
        let adjective;
        if (currentChange=="threeYear" | currentChange=="oneYear")  {
            adjective = "greatest improvement";
        }
        else if (currentChange=="current") {
            adjective = "highest";
        }
        return adjective;
    }

    function rankify(place, topic, currentChange, dataSelect) {

        let rank;
        if (currentChange=="threeYear")  {
            rank = dataSelect["Change3year Rank"];
        }
        else if (currentChange=="oneYear") {
            rank = dataSelect["Change1year Rank"];
        }
        else if (currentChange=="current") {
            rank = dataSelect["Rank"];
        }
        return rank;
    }

    /* src/App.svelte generated by Svelte v3.38.2 */

    const { console: console_1 } = globals;
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	child_ctx[16] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	child_ctx[16] = i;
    	return child_ctx;
    }

    // (68:0) {#if place && ew}
    function create_if_block(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let t1_value = /*place*/ ctx[3].name + "";
    	let t1;
    	let t2;
    	let div5;
    	let div2;
    	let span0;
    	let t3;
    	let t4_value = /*placeHealth*/ ctx[2].name + "";
    	let t4;
    	let br0;
    	let t5;
    	let t6;
    	let div4;
    	let div3;
    	let select;
    	let updating_selected;
    	let t7;
    	let div6;
    	let br1;
    	let t8;
    	let text_1;
    	let t9;
    	let hr;
    	let t10;
    	let t11;
    	let div9;
    	let div7;
    	let img;
    	let img_src_value;
    	let t12;
    	let div8;
    	let span1;
    	let current;
    	let if_block0 = /*place*/ ctx[3].parents[0] && create_if_block_3(ctx);
    	let if_block1 = /*place*/ ctx[3].parents[0] && create_if_block_2(ctx);

    	function select_selected_binding(value) {
    		/*select_selected_binding*/ ctx[8](value);
    	}

    	let select_props = {
    		options: /*options*/ ctx[0],
    		group: "typenm",
    		search: true
    	};

    	if (/*selected*/ ctx[1] !== void 0) {
    		select_props.selected = /*selected*/ ctx[1];
    	}

    	select = new Select({ props: select_props, $$inline: true });
    	binding_callbacks.push(() => bind(select, "selected", select_selected_binding));
    	select.$on("select", /*select_handler*/ ctx[9]);

    	text_1 = new Text({
    			props: { place: /*placeHealth*/ ctx[2] },
    			$$inline: true
    		});

    	let if_block2 = /*place*/ ctx[3].children[0] && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = space();
    			div5 = element("div");
    			div2 = element("div");
    			span0 = element("span");
    			t3 = text("Health Index:  ");
    			t4 = text(t4_value);
    			br0 = element("br");
    			t5 = space();
    			if (if_block1) if_block1.c();
    			t6 = space();
    			div4 = element("div");
    			div3 = element("div");
    			create_component(select.$$.fragment);
    			t7 = space();
    			div6 = element("div");
    			br1 = element("br");
    			t8 = space();
    			create_component(text_1.$$.fragment);
    			t9 = space();
    			hr = element("hr");
    			t10 = space();
    			if (if_block2) if_block2.c();
    			t11 = space();
    			div9 = element("div");
    			div7 = element("div");
    			img = element("img");
    			t12 = space();
    			div8 = element("div");
    			span1 = element("span");
    			span1.textContent = "Source: Census 2011, with change +/- from Census 2001.";
    			attr_dev(div0, "class", "text-small svelte-1nsx7bh");
    			add_location(div0, file, 69, 1, 1645);
    			attr_dev(div1, "class", "grid svelte-1nsx7bh");
    			add_location(div1, file, 68, 0, 1625);
    			attr_dev(span0, "class", "text-big svelte-1nsx7bh");
    			add_location(span0, file, 81, 2, 1924);
    			add_location(br0, file, 81, 65, 1987);
    			add_location(div2, file, 80, 1, 1916);
    			set_style(div3, "width", "240px");
    			set_style(div3, "float", "right");
    			add_location(div3, file, 87, 2, 2120);
    			add_location(div4, file, 86, 1, 2112);
    			attr_dev(div5, "class", "grid-2 svelte-1nsx7bh");
    			add_location(div5, file, 79, 0, 1894);
    			add_location(br1, file, 96, 1, 2356);
    			add_location(hr, file, 99, 1, 2399);
    			attr_dev(div6, "class", "profile-grid mt svelte-1nsx7bh");
    			add_location(div6, file, 94, 0, 2324);
    			if (img.src !== (img_src_value = "https://onsvisual.github.io/svelte-scrolly/img/ons-logo-pos-en.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Office for National Statistics");
    			attr_dev(img, "class", "svelte-1nsx7bh");
    			add_location(img, file, 118, 2, 2820);
    			add_location(div7, file, 117, 1, 2812);
    			attr_dev(span1, "class", "text-small svelte-1nsx7bh");
    			add_location(span1, file, 121, 2, 2968);
    			attr_dev(div8, "class", "right svelte-1nsx7bh");
    			add_location(div8, file, 120, 1, 2946);
    			attr_dev(div9, "class", "grid-2 mt svelte-1nsx7bh");
    			add_location(div9, file, 116, 0, 2787);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div2);
    			append_dev(div2, span0);
    			append_dev(span0, t3);
    			append_dev(span0, t4);
    			append_dev(div2, br0);
    			append_dev(div2, t5);
    			if (if_block1) if_block1.m(div2, null);
    			append_dev(div5, t6);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			mount_component(select, div3, null);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, div6, anchor);
    			append_dev(div6, br1);
    			append_dev(div6, t8);
    			mount_component(text_1, div6, null);
    			append_dev(div6, t9);
    			append_dev(div6, hr);
    			insert_dev(target, t10, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div7);
    			append_dev(div7, img);
    			append_dev(div9, t12);
    			append_dev(div9, div8);
    			append_dev(div8, span1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*place*/ ctx[3].parents[0]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_3(ctx);
    					if_block0.c();
    					if_block0.m(div0, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if ((!current || dirty & /*place*/ 8) && t1_value !== (t1_value = /*place*/ ctx[3].name + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*placeHealth*/ 4) && t4_value !== (t4_value = /*placeHealth*/ ctx[2].name + "")) set_data_dev(t4, t4_value);

    			if (/*place*/ ctx[3].parents[0]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_2(ctx);
    					if_block1.c();
    					if_block1.m(div2, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			const select_changes = {};
    			if (dirty & /*options*/ 1) select_changes.options = /*options*/ ctx[0];

    			if (!updating_selected && dirty & /*selected*/ 2) {
    				updating_selected = true;
    				select_changes.selected = /*selected*/ ctx[1];
    				add_flush_callback(() => updating_selected = false);
    			}

    			select.$set(select_changes);
    			const text_1_changes = {};
    			if (dirty & /*placeHealth*/ 4) text_1_changes.place = /*placeHealth*/ ctx[2];
    			text_1.$set(text_1_changes);

    			if (/*place*/ ctx[3].children[0]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_1(ctx);
    					if_block2.c();
    					if_block2.m(t11.parentNode, t11);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(select.$$.fragment, local);
    			transition_in(text_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(select.$$.fragment, local);
    			transition_out(text_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div5);
    			if (if_block1) if_block1.d();
    			destroy_component(select);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(div6);
    			destroy_component(text_1);
    			if (detaching) detach_dev(t10);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(div9);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(68:0) {#if place && ew}",
    		ctx
    	});

    	return block;
    }

    // (71:2) {#if place.parents[0]}
    function create_if_block_3(ctx) {
    	let each_1_anchor;
    	let each_value_1 = /*place*/ ctx[3].parents.reverse();
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*place, loadArea*/ 40) {
    				each_value_1 = /*place*/ ctx[3].parents.reverse();
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(71:2) {#if place.parents[0]}",
    		ctx
    	});

    	return block;
    }

    // (72:2) {#each place.parents.reverse() as parent, i}
    function create_each_block_1(ctx) {
    	let a;
    	let t_value = /*parent*/ ctx[17].name + "";
    	let t;
    	let a_href_value;
    	let html_tag;
    	let raw_value = " &gt; " + "";
    	let html_anchor;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[7](/*parent*/ ctx[17]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			html_anchor = empty();
    			attr_dev(a, "href", a_href_value = "#" + /*parent*/ ctx[17].code);
    			attr_dev(a, "class", "svelte-1nsx7bh");
    			add_location(a, file, 72, 2, 1744);
    			html_tag = new HtmlTag(html_anchor);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);

    			if (!mounted) {
    				dispose = listen_dev(a, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*place*/ 8 && t_value !== (t_value = /*parent*/ ctx[17].name + "")) set_data_dev(t, t_value);

    			if (dirty & /*place*/ 8 && a_href_value !== (a_href_value = "#" + /*parent*/ ctx[17].code)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(72:2) {#each place.parents.reverse() as parent, i}",
    		ctx
    	});

    	return block;
    }

    // (83:2) {#if place.parents[0]}
    function create_if_block_2(ctx) {
    	let t0_value = types[/*place*/ ctx[3].type].name + "";
    	let t0;
    	let t1;
    	let t2_value = /*place*/ ctx[3].parents[/*place*/ ctx[3].parents.length - 1].name + "";
    	let t2;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = text(" in ");
    			t2 = text(t2_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*place*/ 8 && t0_value !== (t0_value = types[/*place*/ ctx[3].type].name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*place*/ 8 && t2_value !== (t2_value = /*place*/ ctx[3].parents[/*place*/ ctx[3].parents.length - 1].name + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(83:2) {#if place.parents[0]}",
    		ctx
    	});

    	return block;
    }

    // (104:0) {#if place.children[0]}
    function create_if_block_1(ctx) {
    	let div1;
    	let div0;
    	let span0;
    	let t0_value = /*place*/ ctx[3].children[0].typepl + "";
    	let t0;
    	let t1;
    	let t2_value = /*place*/ ctx[3].name + "";
    	let t2;
    	let br;
    	let t3;
    	let span1;
    	let each_value = /*place*/ ctx[3].children;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			span0 = element("span");
    			t0 = text(t0_value);
    			t1 = text(" within ");
    			t2 = text(t2_value);
    			br = element("br");
    			t3 = space();
    			span1 = element("span");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(span0, "class", "text-label svelte-1nsx7bh");
    			add_location(span0, file, 106, 2, 2469);
    			add_location(br, file, 106, 80, 2547);
    			attr_dev(span1, "class", "text-small svelte-1nsx7bh");
    			add_location(span1, file, 107, 2, 2555);
    			add_location(div0, file, 105, 1, 2461);
    			attr_dev(div1, "class", "grid mt svelte-1nsx7bh");
    			add_location(div1, file, 104, 0, 2438);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, span0);
    			append_dev(span0, t0);
    			append_dev(span0, t1);
    			append_dev(span0, t2);
    			append_dev(div0, br);
    			append_dev(div0, t3);
    			append_dev(div0, span1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(span1, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*place*/ 8 && t0_value !== (t0_value = /*place*/ ctx[3].children[0].typepl + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*place*/ 8 && t2_value !== (t2_value = /*place*/ ctx[3].name + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*place, loadArea*/ 40) {
    				each_value = /*place*/ ctx[3].children;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(span1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(104:0) {#if place.children[0]}",
    		ctx
    	});

    	return block;
    }

    // (109:2) {#each place.children as child, i}
    function create_each_block(ctx) {
    	let a;
    	let t0_value = /*child*/ ctx[14].name + "";
    	let t0;
    	let a_href_value;

    	let t1_value = (/*i*/ ctx[16] < /*place*/ ctx[3].children.length - 1
    	? ", "
    	: "") + "";

    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[10](/*child*/ ctx[14]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = text(t1_value);
    			attr_dev(a, "href", a_href_value = "#" + /*child*/ ctx[14].code);
    			attr_dev(a, "class", "svelte-1nsx7bh");
    			add_location(a, file, 109, 2, 2620);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t0);
    			insert_dev(target, t1, anchor);

    			if (!mounted) {
    				dispose = listen_dev(a, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*place*/ 8 && t0_value !== (t0_value = /*child*/ ctx[14].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*place*/ 8 && a_href_value !== (a_href_value = "#" + /*child*/ ctx[14].code)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*place*/ 8 && t1_value !== (t1_value = (/*i*/ ctx[16] < /*place*/ ctx[3].children.length - 1
    			? ", "
    			: "") + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (detaching) detach_dev(t1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(109:2) {#each place.children as child, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let warning;
    	let t;
    	let if_block_anchor;
    	let current;
    	warning = new Warning({ $$inline: true });
    	let if_block = /*place*/ ctx[3] && /*ew*/ ctx[4] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			create_component(warning.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(warning, target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*place*/ ctx[3] && /*ew*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*place, ew*/ 24) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(warning.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(warning.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(warning, detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let options, selected, placeHealth, place, ew, quartiles, quartilesHealth;

    	getData(urls.options).then(res => {
    		res.forEach(d => {
    			d.typepl = types[d.type].pl;
    			d.typenm = types[d.type].name;
    		});

    		$$invalidate(0, options = res.sort((a, b) => a.name.localeCompare(b.name)));
    		$$invalidate(1, selected = options.find(d => d.name == "Barnet"));
    		loadEW();
    		loadArea(selected.code);
    		loadAreaHealth(selected.code);
    	});

    	function loadArea(code) {
    		fetch(urls.places + code + ".json").then(res => res.json()).then(json => {
    			json.children = options.filter(d => d.parent == code);

    			if (json.count > 20) {
    				fetch(urls.quantiles + json.type + ".json").then(res => res.json()).then(quart => {
    					quartiles = quart;
    					$$invalidate(3, place = json);
    				});
    			} else {
    				quartiles = null;
    				$$invalidate(3, place = json);
    			}
    		});
    	}

    	function loadAreaHealth(code) {
    		fetch(urls.healthplaces + code + ".json").then(res => res.json()).then(json => {
    			quartilesHealth = null;
    			$$invalidate(2, placeHealth = json);
    			console.log("Place Health", placeHealth);
    		});
    	}

    	function loadEW() {
    		const code = "K04000001";

    		fetch(urls.places + code + ".json").then(res => res.json()).then(json => {
    			json.children = options.filter(d => d.parent == code);
    			$$invalidate(4, ew = json);
    		});
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = parent => loadArea(parent.code);

    	function select_selected_binding(value) {
    		selected = value;
    		$$invalidate(1, selected);
    	}

    	const select_handler = () => {
    		if (selected) {
    			loadAreaHealth(selected.code);
    		}
    	};

    	const click_handler_1 = child => loadArea(child.code);

    	$$self.$capture_state = () => ({
    		getData,
    		suffixer,
    		urls,
    		types,
    		codes,
    		mapSources,
    		mapLayers,
    		mapPaint,
    		Select,
    		Warning,
    		Text,
    		sentGenerator,
    		sentGenerator2,
    		options,
    		selected,
    		placeHealth,
    		place,
    		ew,
    		quartiles,
    		quartilesHealth,
    		loadArea,
    		loadAreaHealth,
    		loadEW
    	});

    	$$self.$inject_state = $$props => {
    		if ("options" in $$props) $$invalidate(0, options = $$props.options);
    		if ("selected" in $$props) $$invalidate(1, selected = $$props.selected);
    		if ("placeHealth" in $$props) $$invalidate(2, placeHealth = $$props.placeHealth);
    		if ("place" in $$props) $$invalidate(3, place = $$props.place);
    		if ("ew" in $$props) $$invalidate(4, ew = $$props.ew);
    		if ("quartiles" in $$props) quartiles = $$props.quartiles;
    		if ("quartilesHealth" in $$props) quartilesHealth = $$props.quartilesHealth;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		options,
    		selected,
    		placeHealth,
    		place,
    		ew,
    		loadArea,
    		loadAreaHealth,
    		click_handler,
    		select_selected_binding,
    		select_handler,
    		click_handler_1
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    var app = new App({
    	target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
