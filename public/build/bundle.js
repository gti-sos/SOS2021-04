
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop$1() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
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
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop$1;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop$1;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    // Track which nodes are claimed during hydration. Unclaimed nodes can then be removed from the DOM
    // at the end of hydration without touching the remaining nodes.
    let is_hydrating = false;
    const nodes_to_detach = new Set();
    function start_hydrating() {
        is_hydrating = true;
    }
    function end_hydrating() {
        is_hydrating = false;
        for (const node of nodes_to_detach) {
            node.parentNode.removeChild(node);
        }
        nodes_to_detach.clear();
    }
    function append(target, node) {
        if (is_hydrating) {
            nodes_to_detach.delete(node);
        }
        if (node.parentNode !== target) {
            target.appendChild(node);
        }
    }
    function insert(target, node, anchor) {
        if (is_hydrating) {
            nodes_to_detach.delete(node);
        }
        if (node.parentNode !== target || (anchor && node.nextSibling !== anchor)) {
            target.insertBefore(node, anchor || null);
        }
    }
    function detach(node) {
        if (is_hydrating) {
            nodes_to_detach.add(node);
        }
        else if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
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
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function to_number(value) {
        return value === '' ? null : +value;
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
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
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
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
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
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
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
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
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

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
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
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = program.b - t;
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop$1, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function each(items, fn) {
        let str = '';
        for (let i = 0; i < items.length; i += 1) {
            str += fn(items[i], i);
        }
        return str;
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
            update: noop$1,
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
                start_hydrating();
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
            end_hydrating();
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
            this.$destroy = noop$1;
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.38.0' }, detail)));
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

    /**
     * @typedef {Object} WrappedComponent Object returned by the `wrap` method
     * @property {SvelteComponent} component - Component to load (this is always asynchronous)
     * @property {RoutePrecondition[]} [conditions] - Route pre-conditions to validate
     * @property {Object} [props] - Optional dictionary of static props
     * @property {Object} [userData] - Optional user data dictionary
     * @property {bool} _sveltesparouter - Internal flag; always set to true
     */

    /**
     * @callback AsyncSvelteComponent
     * @returns {Promise<SvelteComponent>} Returns a Promise that resolves with a Svelte component
     */

    /**
     * @callback RoutePrecondition
     * @param {RouteDetail} detail - Route detail object
     * @returns {boolean|Promise<boolean>} If the callback returns a false-y value, it's interpreted as the precondition failed, so it aborts loading the component (and won't process other pre-condition callbacks)
     */

    /**
     * @typedef {Object} WrapOptions Options object for the call to `wrap`
     * @property {SvelteComponent} [component] - Svelte component to load (this is incompatible with `asyncComponent`)
     * @property {AsyncSvelteComponent} [asyncComponent] - Function that returns a Promise that fulfills with a Svelte component (e.g. `{asyncComponent: () => import('Foo.svelte')}`)
     * @property {SvelteComponent} [loadingComponent] - Svelte component to be displayed while the async route is loading (as a placeholder); when unset or false-y, no component is shown while component
     * @property {object} [loadingParams] - Optional dictionary passed to the `loadingComponent` component as params (for an exported prop called `params`)
     * @property {object} [userData] - Optional object that will be passed to events such as `routeLoading`, `routeLoaded`, `conditionsFailed`
     * @property {object} [props] - Optional key-value dictionary of static props that will be passed to the component. The props are expanded with {...props}, so the key in the dictionary becomes the name of the prop.
     * @property {RoutePrecondition[]|RoutePrecondition} [conditions] - Route pre-conditions to add, which will be executed in order
     */

    /**
     * Wraps a component to enable multiple capabilities:
     * 1. Using dynamically-imported component, with (e.g. `{asyncComponent: () => import('Foo.svelte')}`), which also allows bundlers to do code-splitting.
     * 2. Adding route pre-conditions (e.g. `{conditions: [...]}`)
     * 3. Adding static props that are passed to the component
     * 4. Adding custom userData, which is passed to route events (e.g. route loaded events) or to route pre-conditions (e.g. `{userData: {foo: 'bar}}`)
     * 
     * @param {WrapOptions} args - Arguments object
     * @returns {WrappedComponent} Wrapped component
     */
    function wrap$1(args) {
        if (!args) {
            throw Error('Parameter args is required')
        }

        // We need to have one and only one of component and asyncComponent
        // This does a "XNOR"
        if (!args.component == !args.asyncComponent) {
            throw Error('One and only one of component and asyncComponent is required')
        }

        // If the component is not async, wrap it into a function returning a Promise
        if (args.component) {
            args.asyncComponent = () => Promise.resolve(args.component);
        }

        // Parameter asyncComponent and each item of conditions must be functions
        if (typeof args.asyncComponent != 'function') {
            throw Error('Parameter asyncComponent must be a function')
        }
        if (args.conditions) {
            // Ensure it's an array
            if (!Array.isArray(args.conditions)) {
                args.conditions = [args.conditions];
            }
            for (let i = 0; i < args.conditions.length; i++) {
                if (!args.conditions[i] || typeof args.conditions[i] != 'function') {
                    throw Error('Invalid parameter conditions[' + i + ']')
                }
            }
        }

        // Check if we have a placeholder component
        if (args.loadingComponent) {
            args.asyncComponent.loading = args.loadingComponent;
            args.asyncComponent.loadingParams = args.loadingParams || undefined;
        }

        // Returns an object that contains all the functions to execute too
        // The _sveltesparouter flag is to confirm the object was created by this router
        const obj = {
            component: args.asyncComponent,
            userData: args.userData,
            conditions: (args.conditions && args.conditions.length) ? args.conditions : undefined,
            props: (args.props && Object.keys(args.props).length) ? args.props : {},
            _sveltesparouter: true
        };

        return obj
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop$1) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop$1) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop$1;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop$1;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop$1;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    function regexparam (str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules\svelte-spa-router\Router.svelte generated by Svelte v3.38.0 */

    const { Error: Error_1, Object: Object_1$3, console: console_1$7 } = globals;

    // (209:0) {:else}
    function create_else_block$9(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*props*/ 4)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[2])])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$9.name,
    		type: "else",
    		source: "(209:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (202:0) {#if componentParams}
    function create_if_block$c(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ params: /*componentParams*/ ctx[1] }, /*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*componentParams, props*/ 6)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*componentParams*/ 2 && { params: /*componentParams*/ ctx[1] },
    					dirty & /*props*/ 4 && get_spread_object(/*props*/ ctx[2])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(202:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$D(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$c, create_else_block$9];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$D.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function wrap(component, userData, ...conditions) {
    	// Use the new wrap method and show a deprecation warning
    	// eslint-disable-next-line no-console
    	console.warn("Method `wrap` from `svelte-spa-router` is deprecated and will be removed in a future version. Please use `svelte-spa-router/wrap` instead. See http://bit.ly/svelte-spa-router-upgrading");

    	return wrap$1({ component, userData, conditions });
    }

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation() {
    	const hashPosition = window.location.href.indexOf("#/");

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: "/";

    	// Check if there's a querystring
    	const qsPosition = location.indexOf("?");

    	let querystring = "";

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(null, // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	set(getLocation());

    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener("hashchange", update, false);

    	return function stop() {
    		window.removeEventListener("hashchange", update, false);
    	};
    });

    const location = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);

    async function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != "/" && location.indexOf("#/") !== 0) {
    		throw Error("Invalid parameter location");
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	// Note: this will include scroll state in history even when restoreScrollState is false
    	history.replaceState(
    		{
    			scrollX: window.scrollX,
    			scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	window.location.hash = (location.charAt(0) == "#" ? "" : "#") + location;
    }

    async function pop() {
    	// Execute this code when the current call stack is complete
    	await tick();

    	window.history.back();
    }

    async function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != "/" && location.indexOf("#/") !== 0) {
    		throw Error("Invalid parameter location");
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	const dest = (location.charAt(0) == "#" ? "" : "#") + location;

    	try {
    		window.history.replaceState(undefined, undefined, dest);
    	} catch(e) {
    		// eslint-disable-next-line no-console
    		console.warn("Caught exception while replacing the current page. If you're running this in the Svelte REPL, please note that the `replace` method might not work in this environment.");
    	}

    	// The method above doesn't trigger the hashchange event, so let's do that manually
    	window.dispatchEvent(new Event("hashchange"));
    }

    function link(node, hrefVar) {
    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != "a") {
    		throw Error("Action \"link\" can only be used with <a> tags");
    	}

    	updateLink(node, hrefVar || node.getAttribute("href"));

    	return {
    		update(updated) {
    			updateLink(node, updated);
    		}
    	};
    }

    // Internal function used by the link function
    function updateLink(node, href) {
    	// Destination must start with '/'
    	if (!href || href.length < 1 || href.charAt(0) != "/") {
    		throw Error("Invalid value for \"href\" attribute: " + href);
    	}

    	// Add # to the href attribute
    	node.setAttribute("href", "#" + href);

    	node.addEventListener("click", scrollstateHistoryHandler);
    }

    /**
     * The handler attached to an anchor tag responsible for updating the
     * current history state with the current scroll state
     *
     * @param {HTMLElementEventMap} event - an onclick event attached to an anchor tag
     */
    function scrollstateHistoryHandler(event) {
    	// Prevent default anchor onclick behaviour
    	event.preventDefault();

    	const href = event.currentTarget.getAttribute("href");

    	// Setting the url (3rd arg) to href will break clicking for reasons, so don't try to do that
    	history.replaceState(
    		{
    			scrollX: window.scrollX,
    			scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	// This will force an update as desired, but this time our scroll state will be attached
    	window.location.hash = href;
    }

    function instance$D($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Router", slots, []);
    	let { routes = {} } = $$props;
    	let { prefix = "" } = $$props;
    	let { restoreScrollState = false } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent|WrappedComponent} component - Svelte component for the route, optionally wrapped
     */
    		constructor(path, component) {
    			if (!component || typeof component != "function" && (typeof component != "object" || component._sveltesparouter !== true)) {
    				throw Error("Invalid component object");
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == "string" && (path.length < 1 || path.charAt(0) != "/" && path.charAt(0) != "*") || typeof path == "object" && !(path instanceof RegExp)) {
    				throw Error("Invalid value for \"path\" argument - strings must start with / or *");
    			}

    			const { pattern, keys } = regexparam(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == "object" && component._sveltesparouter === true) {
    				this.component = component.component;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    				this.props = component.props || {};
    			} else {
    				// Convert the component to a function that returns a Promise, to normalize it
    				this.component = () => Promise.resolve(component);

    				this.conditions = [];
    				this.props = {};
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, check if it matches the start of the path.
    			// If not, bail early, else remove it before we run the matching.
    			if (prefix) {
    				if (typeof prefix == "string") {
    					if (path.startsWith(prefix)) {
    						path = path.substr(prefix.length) || "/";
    					} else {
    						return null;
    					}
    				} else if (prefix instanceof RegExp) {
    					const match = path.match(prefix);

    					if (match && match[0]) {
    						path = path.substr(match[0].length) || "/";
    					} else {
    						return null;
    					}
    				}
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				// In the match parameters, URL-decode all values
    				try {
    					out[this._keys[i]] = decodeURIComponent(matches[i + 1] || "") || null;
    				} catch(e) {
    					out[this._keys[i]] = null;
    				}

    				i++;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoading`, `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {string|RegExp} route - Route matched as defined in the route definition (could be a string or a reguar expression object)
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {object} [userData] - Custom data passed by the user
     * @property {SvelteComponent} [component] - Svelte component (only in `routeLoaded` events)
     * @property {string} [name] - Name of the Svelte component (only in `routeLoaded` events)
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {bool} Returns true if all the conditions succeeded
     */
    		async checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!await this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;
    	let props = {};

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	async function dispatchNextTick(name, detail) {
    		// Execute this code when the current call stack is complete
    		await tick();

    		dispatch(name, detail);
    	}

    	// If this is set, then that means we have popped into this var the state of our last scroll position
    	let previousScrollState = null;

    	if (restoreScrollState) {
    		window.addEventListener("popstate", event => {
    			// If this event was from our history.replaceState, event.state will contain
    			// our scroll history. Otherwise, event.state will be null (like on forward
    			// navigation)
    			if (event.state && event.state.scrollY) {
    				previousScrollState = event.state;
    			} else {
    				previousScrollState = null;
    			}
    		});

    		afterUpdate(() => {
    			// If this exists, then this is a back navigation: restore the scroll position
    			if (previousScrollState) {
    				window.scrollTo(previousScrollState.scrollX, previousScrollState.scrollY);
    			} else {
    				// Otherwise this is a forward navigation: scroll to top
    				window.scrollTo(0, 0);
    			}
    		});
    	}

    	// Always have the latest value of loc
    	let lastLoc = null;

    	// Current object of the component loaded
    	let componentObj = null;

    	// Handle hash change events
    	// Listen to changes in the $loc store and update the page
    	// Do not use the $: syntax because it gets triggered by too many things
    	loc.subscribe(async newLoc => {
    		lastLoc = newLoc;

    		// Find a route matching the location
    		let i = 0;

    		while (i < routesList.length) {
    			const match = routesList[i].match(newLoc.location);

    			if (!match) {
    				i++;
    				continue;
    			}

    			const detail = {
    				route: routesList[i].path,
    				location: newLoc.location,
    				querystring: newLoc.querystring,
    				userData: routesList[i].userData
    			};

    			// Check if the route can be loaded - if all conditions succeed
    			if (!await routesList[i].checkConditions(detail)) {
    				// Don't display anything
    				$$invalidate(0, component = null);

    				componentObj = null;

    				// Trigger an event to notify the user, then exit
    				dispatchNextTick("conditionsFailed", detail);

    				return;
    			}

    			// Trigger an event to alert that we're loading the route
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick("routeLoading", Object.assign({}, detail));

    			// If there's a component to show while we're loading the route, display it
    			const obj = routesList[i].component;

    			// Do not replace the component if we're loading the same one as before, to avoid the route being unmounted and re-mounted
    			if (componentObj != obj) {
    				if (obj.loading) {
    					$$invalidate(0, component = obj.loading);
    					componentObj = obj;
    					$$invalidate(1, componentParams = obj.loadingParams);
    					$$invalidate(2, props = {});

    					// Trigger the routeLoaded event for the loading component
    					// Create a copy of detail so we don't modify the object for the dynamic route (and the dynamic route doesn't modify our object too)
    					dispatchNextTick("routeLoaded", Object.assign({}, detail, { component, name: component.name }));
    				} else {
    					$$invalidate(0, component = null);
    					componentObj = null;
    				}

    				// Invoke the Promise
    				const loaded = await obj();

    				// Now that we're here, after the promise resolved, check if we still want this component, as the user might have navigated to another page in the meanwhile
    				if (newLoc != lastLoc) {
    					// Don't update the component, just exit
    					return;
    				}

    				// If there is a "default" property, which is used by async routes, then pick that
    				$$invalidate(0, component = loaded && loaded.default || loaded);

    				componentObj = obj;
    			}

    			// Set componentParams only if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    			// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    			if (match && typeof match == "object" && Object.keys(match).length) {
    				$$invalidate(1, componentParams = match);
    			} else {
    				$$invalidate(1, componentParams = null);
    			}

    			// Set static props, if any
    			$$invalidate(2, props = routesList[i].props);

    			// Dispatch the routeLoaded event then exit
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick("routeLoaded", Object.assign({}, detail, { component, name: component.name }));

    			return;
    		}

    		// If we're still here, there was no match, so show the empty component
    		$$invalidate(0, component = null);

    		componentObj = null;
    	});

    	const writable_props = ["routes", "prefix", "restoreScrollState"];

    	Object_1$3.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$7.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	function routeEvent_handler(event) {
    		bubble($$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ("routes" in $$props) $$invalidate(3, routes = $$props.routes);
    		if ("prefix" in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ("restoreScrollState" in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    	};

    	$$self.$capture_state = () => ({
    		readable,
    		derived,
    		tick,
    		_wrap: wrap$1,
    		wrap,
    		getLocation,
    		loc,
    		location,
    		querystring,
    		push,
    		pop,
    		replace,
    		link,
    		updateLink,
    		scrollstateHistoryHandler,
    		createEventDispatcher,
    		afterUpdate,
    		regexparam,
    		routes,
    		prefix,
    		restoreScrollState,
    		RouteItem,
    		routesList,
    		component,
    		componentParams,
    		props,
    		dispatch,
    		dispatchNextTick,
    		previousScrollState,
    		lastLoc,
    		componentObj
    	});

    	$$self.$inject_state = $$props => {
    		if ("routes" in $$props) $$invalidate(3, routes = $$props.routes);
    		if ("prefix" in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ("restoreScrollState" in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    		if ("component" in $$props) $$invalidate(0, component = $$props.component);
    		if ("componentParams" in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    		if ("props" in $$props) $$invalidate(2, props = $$props.props);
    		if ("previousScrollState" in $$props) previousScrollState = $$props.previousScrollState;
    		if ("lastLoc" in $$props) lastLoc = $$props.lastLoc;
    		if ("componentObj" in $$props) componentObj = $$props.componentObj;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*restoreScrollState*/ 32) {
    			// Update history.scrollRestoration depending on restoreScrollState
    			history.scrollRestoration = restoreScrollState ? "manual" : "auto";
    		}
    	};

    	return [
    		component,
    		componentParams,
    		props,
    		routes,
    		prefix,
    		restoreScrollState,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$D, create_fragment$D, safe_not_equal, {
    			routes: 3,
    			prefix: 4,
    			restoreScrollState: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$D.name
    		});
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get restoreScrollState() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set restoreScrollState(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    function getOriginalBodyPadding() {
      const style = window ? window.getComputedStyle(document.body, null) : {};

      return parseInt((style && style.getPropertyValue('padding-right')) || 0, 10);
    }

    function getScrollbarWidth() {
      let scrollDiv = document.createElement('div');
      // .modal-scrollbar-measure styles // https://github.com/twbs/bootstrap/blob/v4.0.0-alpha.4/scss/_modal.scss#L106-L113
      scrollDiv.style.position = 'absolute';
      scrollDiv.style.top = '-9999px';
      scrollDiv.style.width = '50px';
      scrollDiv.style.height = '50px';
      scrollDiv.style.overflow = 'scroll';
      document.body.appendChild(scrollDiv);
      const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);
      return scrollbarWidth;
    }

    function setScrollbarWidth(padding) {
      document.body.style.paddingRight = padding > 0 ? `${padding}px` : null;
    }

    function isBodyOverflowing() {
      return window ? document.body.clientWidth < window.innerWidth : false;
    }

    function isObject(value) {
      const type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    function conditionallyUpdateScrollbar() {
      const scrollbarWidth = getScrollbarWidth();
      // https://github.com/twbs/bootstrap/blob/v4.0.0-alpha.6/js/src/modal.js#L433
      const fixedContent = document.querySelectorAll(
        '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top'
      )[0];
      const bodyPadding = fixedContent
        ? parseInt(fixedContent.style.paddingRight || 0, 10)
        : 0;

      if (isBodyOverflowing()) {
        setScrollbarWidth(bodyPadding + scrollbarWidth);
      }
    }

    function getColumnSizeClass(isXs, colWidth, colSize) {
      if (colSize === true || colSize === '') {
        return isXs ? 'col' : `col-${colWidth}`;
      } else if (colSize === 'auto') {
        return isXs ? 'col-auto' : `col-${colWidth}-auto`;
      }

      return isXs ? `col-${colSize}` : `col-${colWidth}-${colSize}`;
    }

    function browserEvent(target, ...args) {
      target.addEventListener(...args);

      return () => target.removeEventListener(...args);
    }

    function toClassName(value) {
      let result = '';

      if (typeof value === 'string' || typeof value === 'number') {
        result += value;
      } else if (typeof value === 'object') {
        if (Array.isArray(value)) {
          result = value.map(toClassName).filter(Boolean).join(' ');
        } else {
          for (let key in value) {
            if (value[key]) {
              result && (result += ' ');
              result += key;
            }
          }
        }
      }

      return result;
    }

    function classnames(...args) {
      return args.map(toClassName).filter(Boolean).join(' ');
    }

    /* node_modules\sveltestrap\src\Button.svelte generated by Svelte v3.38.0 */
    const file$C = "node_modules\\sveltestrap\\src\\Button.svelte";

    // (48:0) {:else}
    function create_else_block_1$1(ctx) {
    	let button;
    	let button_aria_label_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[16], null);
    	const default_slot_or_fallback = default_slot || fallback_block$2(ctx);

    	let button_levels = [
    		/*$$restProps*/ ctx[9],
    		{ class: /*classes*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[2] },
    		{ value: /*value*/ ctx[5] },
    		{
    			"aria-label": button_aria_label_value = /*ariaLabel*/ ctx[6] || /*defaultAriaLabel*/ ctx[8]
    		},
    		{ style: /*style*/ ctx[4] }
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			button = element("button");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(button, button_data);
    			add_location(button, file$C, 48, 2, 985);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(button, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[19], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 65536)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[16], dirty, null, null);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty & /*close, children, $$scope*/ 65539) {
    					default_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				(!current || dirty & /*classes*/ 128) && { class: /*classes*/ ctx[7] },
    				(!current || dirty & /*disabled*/ 4) && { disabled: /*disabled*/ ctx[2] },
    				(!current || dirty & /*value*/ 32) && { value: /*value*/ ctx[5] },
    				(!current || dirty & /*ariaLabel, defaultAriaLabel*/ 320 && button_aria_label_value !== (button_aria_label_value = /*ariaLabel*/ ctx[6] || /*defaultAriaLabel*/ ctx[8])) && { "aria-label": button_aria_label_value },
    				(!current || dirty & /*style*/ 16) && { style: /*style*/ ctx[4] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(48:0) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (33:0) {#if href}
    function create_if_block$b(ctx) {
    	let a;
    	let current_block_type_index;
    	let if_block;
    	let a_aria_label_value;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_1$7, create_else_block$8];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*children*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	let a_levels = [
    		/*$$restProps*/ ctx[9],
    		{ class: /*classes*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[2] },
    		{ href: /*href*/ ctx[3] },
    		{
    			"aria-label": a_aria_label_value = /*ariaLabel*/ ctx[6] || /*defaultAriaLabel*/ ctx[8]
    		},
    		{ style: /*style*/ ctx[4] }
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			a = element("a");
    			if_block.c();
    			set_attributes(a, a_data);
    			add_location(a, file$C, 33, 2, 752);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			if_blocks[current_block_type_index].m(a, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*click_handler*/ ctx[18], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(a, null);
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				(!current || dirty & /*classes*/ 128) && { class: /*classes*/ ctx[7] },
    				(!current || dirty & /*disabled*/ 4) && { disabled: /*disabled*/ ctx[2] },
    				(!current || dirty & /*href*/ 8) && { href: /*href*/ ctx[3] },
    				(!current || dirty & /*ariaLabel, defaultAriaLabel*/ 320 && a_aria_label_value !== (a_aria_label_value = /*ariaLabel*/ ctx[6] || /*defaultAriaLabel*/ ctx[8])) && { "aria-label": a_aria_label_value },
    				(!current || dirty & /*style*/ 16) && { style: /*style*/ ctx[4] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(33:0) {#if href}",
    		ctx
    	});

    	return block_1;
    }

    // (62:6) {:else}
    function create_else_block_2$1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[16], null);

    	const block_1 = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 65536)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[16], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block_2$1.name,
    		type: "else",
    		source: "(62:6) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (60:25) 
    function create_if_block_3$4(ctx) {
    	let t;

    	const block_1 = {
    		c: function create() {
    			t = text(/*children*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 1) set_data_dev(t, /*children*/ ctx[0]);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_3$4.name,
    		type: "if",
    		source: "(60:25) ",
    		ctx
    	});

    	return block_1;
    }

    // (58:6) {#if close}
    function create_if_block_2$5(ctx) {
    	let span;

    	const block_1 = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "×";
    			attr_dev(span, "aria-hidden", "true");
    			add_location(span, file$C, 58, 8, 1171);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_2$5.name,
    		type: "if",
    		source: "(58:6) {#if close}",
    		ctx
    	});

    	return block_1;
    }

    // (57:10)        
    function fallback_block$2(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2$5, create_if_block_3$4, create_else_block_2$1];
    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*close*/ ctx[1]) return 0;
    		if (/*children*/ ctx[0]) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type_2(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block_1 = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_2(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: fallback_block$2.name,
    		type: "fallback",
    		source: "(57:10)        ",
    		ctx
    	});

    	return block_1;
    }

    // (44:4) {:else}
    function create_else_block$8(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[16], null);

    	const block_1 = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 65536)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[16], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block$8.name,
    		type: "else",
    		source: "(44:4) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (42:4) {#if children}
    function create_if_block_1$7(ctx) {
    	let t;

    	const block_1 = {
    		c: function create() {
    			t = text(/*children*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 1) set_data_dev(t, /*children*/ ctx[0]);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(42:4) {#if children}",
    		ctx
    	});

    	return block_1;
    }

    function create_fragment$C(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$b, create_else_block_1$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*href*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block_1 = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_fragment$C.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    function instance$C($$self, $$props, $$invalidate) {
    	let ariaLabel;
    	let classes;
    	let defaultAriaLabel;

    	const omit_props_names = [
    		"class","active","block","children","close","color","disabled","href","outline","size","style","value"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Button", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { active = false } = $$props;
    	let { block = false } = $$props;
    	let { children = undefined } = $$props;
    	let { close = false } = $$props;
    	let { color = "secondary" } = $$props;
    	let { disabled = false } = $$props;
    	let { href = "" } = $$props;
    	let { outline = false } = $$props;
    	let { size = null } = $$props;
    	let { style = "" } = $$props;
    	let { value = "" } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function click_handler_1(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(20, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(9, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(10, className = $$new_props.class);
    		if ("active" in $$new_props) $$invalidate(11, active = $$new_props.active);
    		if ("block" in $$new_props) $$invalidate(12, block = $$new_props.block);
    		if ("children" in $$new_props) $$invalidate(0, children = $$new_props.children);
    		if ("close" in $$new_props) $$invalidate(1, close = $$new_props.close);
    		if ("color" in $$new_props) $$invalidate(13, color = $$new_props.color);
    		if ("disabled" in $$new_props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ("href" in $$new_props) $$invalidate(3, href = $$new_props.href);
    		if ("outline" in $$new_props) $$invalidate(14, outline = $$new_props.outline);
    		if ("size" in $$new_props) $$invalidate(15, size = $$new_props.size);
    		if ("style" in $$new_props) $$invalidate(4, style = $$new_props.style);
    		if ("value" in $$new_props) $$invalidate(5, value = $$new_props.value);
    		if ("$$scope" in $$new_props) $$invalidate(16, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		active,
    		block,
    		children,
    		close,
    		color,
    		disabled,
    		href,
    		outline,
    		size,
    		style,
    		value,
    		ariaLabel,
    		classes,
    		defaultAriaLabel
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(20, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(10, className = $$new_props.className);
    		if ("active" in $$props) $$invalidate(11, active = $$new_props.active);
    		if ("block" in $$props) $$invalidate(12, block = $$new_props.block);
    		if ("children" in $$props) $$invalidate(0, children = $$new_props.children);
    		if ("close" in $$props) $$invalidate(1, close = $$new_props.close);
    		if ("color" in $$props) $$invalidate(13, color = $$new_props.color);
    		if ("disabled" in $$props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ("href" in $$props) $$invalidate(3, href = $$new_props.href);
    		if ("outline" in $$props) $$invalidate(14, outline = $$new_props.outline);
    		if ("size" in $$props) $$invalidate(15, size = $$new_props.size);
    		if ("style" in $$props) $$invalidate(4, style = $$new_props.style);
    		if ("value" in $$props) $$invalidate(5, value = $$new_props.value);
    		if ("ariaLabel" in $$props) $$invalidate(6, ariaLabel = $$new_props.ariaLabel);
    		if ("classes" in $$props) $$invalidate(7, classes = $$new_props.classes);
    		if ("defaultAriaLabel" in $$props) $$invalidate(8, defaultAriaLabel = $$new_props.defaultAriaLabel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(6, ariaLabel = $$props["aria-label"]);

    		if ($$self.$$.dirty & /*className, close, outline, color, size, block, active*/ 64514) {
    			$$invalidate(7, classes = classnames(className, { close }, close || "btn", close || `btn${outline ? "-outline" : ""}-${color}`, size ? `btn-${size}` : false, block ? "btn-block" : false, { active }));
    		}

    		if ($$self.$$.dirty & /*close*/ 2) {
    			$$invalidate(8, defaultAriaLabel = close ? "Close" : null);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		children,
    		close,
    		disabled,
    		href,
    		style,
    		value,
    		ariaLabel,
    		classes,
    		defaultAriaLabel,
    		$$restProps,
    		className,
    		active,
    		block,
    		color,
    		outline,
    		size,
    		$$scope,
    		slots,
    		click_handler,
    		click_handler_1
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$C, create_fragment$C, safe_not_equal, {
    			class: 10,
    			active: 11,
    			block: 12,
    			children: 0,
    			close: 1,
    			color: 13,
    			disabled: 2,
    			href: 3,
    			outline: 14,
    			size: 15,
    			style: 4,
    			value: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$C.name
    		});
    	}

    	get class() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get block() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set block(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get children() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set children(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get close() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set close(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outline() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outline(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\Card.svelte generated by Svelte v3.38.0 */
    const file$B = "node_modules\\sveltestrap\\src\\Card.svelte";

    function create_fragment$B(ctx) {
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	let div_levels = [
    		/*$$restProps*/ ctx[2],
    		{ class: /*classes*/ ctx[1] },
    		{ style: /*style*/ ctx[0] }
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$B, 20, 0, 437);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler*/ ctx[10], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[8], dirty, null, null);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] },
    				(!current || dirty & /*style*/ 1) && { style: /*style*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$B.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$B($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","body","color","inverse","outline","style"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Card", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { body = false } = $$props;
    	let { color = "" } = $$props;
    	let { inverse = false } = $$props;
    	let { outline = false } = $$props;
    	let { style = "" } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(3, className = $$new_props.class);
    		if ("body" in $$new_props) $$invalidate(4, body = $$new_props.body);
    		if ("color" in $$new_props) $$invalidate(5, color = $$new_props.color);
    		if ("inverse" in $$new_props) $$invalidate(6, inverse = $$new_props.inverse);
    		if ("outline" in $$new_props) $$invalidate(7, outline = $$new_props.outline);
    		if ("style" in $$new_props) $$invalidate(0, style = $$new_props.style);
    		if ("$$scope" in $$new_props) $$invalidate(8, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		body,
    		color,
    		inverse,
    		outline,
    		style,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(3, className = $$new_props.className);
    		if ("body" in $$props) $$invalidate(4, body = $$new_props.body);
    		if ("color" in $$props) $$invalidate(5, color = $$new_props.color);
    		if ("inverse" in $$props) $$invalidate(6, inverse = $$new_props.inverse);
    		if ("outline" in $$props) $$invalidate(7, outline = $$new_props.outline);
    		if ("style" in $$props) $$invalidate(0, style = $$new_props.style);
    		if ("classes" in $$props) $$invalidate(1, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, inverse, body, color, outline*/ 248) {
    			$$invalidate(1, classes = classnames(className, "card", inverse ? "text-white" : false, body ? "card-body" : false, color ? `${outline ? "border" : "bg"}-${color}` : false));
    		}
    	};

    	return [
    		style,
    		classes,
    		$$restProps,
    		className,
    		body,
    		color,
    		inverse,
    		outline,
    		$$scope,
    		slots,
    		click_handler
    	];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$B, create_fragment$B, safe_not_equal, {
    			class: 3,
    			body: 4,
    			color: 5,
    			inverse: 6,
    			outline: 7,
    			style: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$B.name
    		});
    	}

    	get class() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get body() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set body(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inverse() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inverse(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outline() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outline(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\CardBody.svelte generated by Svelte v3.38.0 */
    const file$A = "node_modules\\sveltestrap\\src\\CardBody.svelte";

    function create_fragment$A(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);
    	let div_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$A, 9, 0, 164);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], dirty, null, null);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$A.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$A($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("CardBody", slots, ['default']);
    	let { class: className = "" } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("$$scope" in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classnames, className, classes });

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 4) {
    			$$invalidate(0, classes = classnames(className, "card-body"));
    		}
    	};

    	return [classes, $$restProps, className, $$scope, slots];
    }

    class CardBody extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$A, create_fragment$A, safe_not_equal, { class: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CardBody",
    			options,
    			id: create_fragment$A.name
    		});
    	}

    	get class() {
    		throw new Error("<CardBody>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<CardBody>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\CardFooter.svelte generated by Svelte v3.38.0 */
    const file$z = "node_modules\\sveltestrap\\src\\CardFooter.svelte";

    function create_fragment$z(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);
    	let div_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$z, 9, 0, 166);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], dirty, null, null);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$z.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$z($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("CardFooter", slots, ['default']);
    	let { class: className = "" } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("$$scope" in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classnames, className, classes });

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 4) {
    			$$invalidate(0, classes = classnames(className, "card-footer"));
    		}
    	};

    	return [classes, $$restProps, className, $$scope, slots];
    }

    class CardFooter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$z, create_fragment$z, safe_not_equal, { class: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CardFooter",
    			options,
    			id: create_fragment$z.name
    		});
    	}

    	get class() {
    		throw new Error("<CardFooter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<CardFooter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\CardHeader.svelte generated by Svelte v3.38.0 */
    const file$y = "node_modules\\sveltestrap\\src\\CardHeader.svelte";

    // (15:0) {:else}
    function create_else_block$7(ctx) {
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);
    	let div_levels = [/*$$restProps*/ ctx[2], { class: /*classes*/ ctx[1] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$y, 15, 2, 291);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler_1*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[4], dirty, null, null);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$7.name,
    		type: "else",
    		source: "(15:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (11:0) {#if tag === 'h3'}
    function create_if_block$a(ctx) {
    	let h3;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);
    	let h3_levels = [/*$$restProps*/ ctx[2], { class: /*classes*/ ctx[1] }];
    	let h3_data = {};

    	for (let i = 0; i < h3_levels.length; i += 1) {
    		h3_data = assign(h3_data, h3_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			if (default_slot) default_slot.c();
    			set_attributes(h3, h3_data);
    			add_location(h3, file$y, 11, 2, 213);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);

    			if (default_slot) {
    				default_slot.m(h3, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(h3, "click", /*click_handler*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[4], dirty, null, null);
    				}
    			}

    			set_attributes(h3, h3_data = get_spread_update(h3_levels, [
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(11:0) {#if tag === 'h3'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$y(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$a, create_else_block$7];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*tag*/ ctx[0] === "h3") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$y.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$y($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","tag"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("CardHeader", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { tag = "div" } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function click_handler_1(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(3, className = $$new_props.class);
    		if ("tag" in $$new_props) $$invalidate(0, tag = $$new_props.tag);
    		if ("$$scope" in $$new_props) $$invalidate(4, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classnames, className, tag, classes });

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(3, className = $$new_props.className);
    		if ("tag" in $$props) $$invalidate(0, tag = $$new_props.tag);
    		if ("classes" in $$props) $$invalidate(1, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 8) {
    			$$invalidate(1, classes = classnames(className, "card-header"));
    		}
    	};

    	return [
    		tag,
    		classes,
    		$$restProps,
    		className,
    		$$scope,
    		slots,
    		click_handler,
    		click_handler_1
    	];
    }

    class CardHeader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$y, create_fragment$y, safe_not_equal, { class: 3, tag: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CardHeader",
    			options,
    			id: create_fragment$y.name
    		});
    	}

    	get class() {
    		throw new Error("<CardHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<CardHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tag() {
    		throw new Error("<CardHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tag(value) {
    		throw new Error("<CardHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\CardSubtitle.svelte generated by Svelte v3.38.0 */
    const file$x = "node_modules\\sveltestrap\\src\\CardSubtitle.svelte";

    function create_fragment$x(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);
    	let div_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$x, 9, 0, 168);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], dirty, null, null);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$x.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$x($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("CardSubtitle", slots, ['default']);
    	let { class: className = "" } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("$$scope" in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classnames, className, classes });

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 4) {
    			$$invalidate(0, classes = classnames(className, "card-subtitle"));
    		}
    	};

    	return [classes, $$restProps, className, $$scope, slots];
    }

    class CardSubtitle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$x, create_fragment$x, safe_not_equal, { class: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CardSubtitle",
    			options,
    			id: create_fragment$x.name
    		});
    	}

    	get class() {
    		throw new Error("<CardSubtitle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<CardSubtitle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\CardText.svelte generated by Svelte v3.38.0 */
    const file$w = "node_modules\\sveltestrap\\src\\CardText.svelte";

    function create_fragment$w(ctx) {
    	let p;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);
    	let p_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let p_data = {};

    	for (let i = 0; i < p_levels.length; i += 1) {
    		p_data = assign(p_data, p_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			p = element("p");
    			if (default_slot) default_slot.c();
    			set_attributes(p, p_data);
    			add_location(p, file$w, 9, 0, 164);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);

    			if (default_slot) {
    				default_slot.m(p, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], dirty, null, null);
    				}
    			}

    			set_attributes(p, p_data = get_spread_update(p_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("CardText", slots, ['default']);
    	let { class: className = "" } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("$$scope" in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classnames, className, classes });

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 4) {
    			$$invalidate(0, classes = classnames(className, "card-text"));
    		}
    	};

    	return [classes, $$restProps, className, $$scope, slots];
    }

    class CardText extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$w, create_fragment$w, safe_not_equal, { class: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CardText",
    			options,
    			id: create_fragment$w.name
    		});
    	}

    	get class() {
    		throw new Error("<CardText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<CardText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\CardTitle.svelte generated by Svelte v3.38.0 */
    const file$v = "node_modules\\sveltestrap\\src\\CardTitle.svelte";

    function create_fragment$v(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);
    	let div_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$v, 9, 0, 165);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], dirty, null, null);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$v($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("CardTitle", slots, ['default']);
    	let { class: className = "" } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("$$scope" in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classnames, className, classes });

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 4) {
    			$$invalidate(0, classes = classnames(className, "card-title"));
    		}
    	};

    	return [classes, $$restProps, className, $$scope, slots];
    }

    class CardTitle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$v, create_fragment$v, safe_not_equal, { class: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CardTitle",
    			options,
    			id: create_fragment$v.name
    		});
    	}

    	get class() {
    		throw new Error("<CardTitle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<CardTitle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\Col.svelte generated by Svelte v3.38.0 */
    const file$u = "node_modules\\sveltestrap\\src\\Col.svelte";

    function create_fragment$u(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	let div_levels = [
    		/*$$restProps*/ ctx[1],
    		{
    			class: div_class_value = /*colClasses*/ ctx[0].join(" ")
    		}
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$u, 58, 0, 1388);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[8], dirty, null, null);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				{ class: div_class_value }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
    	const omit_props_names = ["class","xs","sm","md","lg","xl"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Col", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { xs = undefined } = $$props;
    	let { sm = undefined } = $$props;
    	let { md = undefined } = $$props;
    	let { lg = undefined } = $$props;
    	let { xl = undefined } = $$props;
    	const colClasses = [];
    	const lookup = { xs, sm, md, lg, xl };

    	Object.keys(lookup).forEach(colWidth => {
    		const columnProp = lookup[colWidth];

    		if (!columnProp && columnProp !== "") {
    			return; //no value for this width
    		}

    		const isXs = colWidth === "xs";

    		if (isObject(columnProp)) {
    			const colSizeInterfix = isXs ? "-" : `-${colWidth}-`;
    			const colClass = getColumnSizeClass(isXs, colWidth, columnProp.size);

    			if (columnProp.size || columnProp.size === "") {
    				colClasses.push(colClass);
    			}

    			if (columnProp.push) {
    				colClasses.push(`push${colSizeInterfix}${columnProp.push}`);
    			}

    			if (columnProp.pull) {
    				colClasses.push(`pull${colSizeInterfix}${columnProp.pull}`);
    			}

    			if (columnProp.offset) {
    				colClasses.push(`offset${colSizeInterfix}${columnProp.offset}`);
    			}
    		} else {
    			colClasses.push(getColumnSizeClass(isXs, colWidth, columnProp));
    		}
    	});

    	if (!colClasses.length) {
    		colClasses.push("col");
    	}

    	if (className) {
    		colClasses.push(className);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("xs" in $$new_props) $$invalidate(3, xs = $$new_props.xs);
    		if ("sm" in $$new_props) $$invalidate(4, sm = $$new_props.sm);
    		if ("md" in $$new_props) $$invalidate(5, md = $$new_props.md);
    		if ("lg" in $$new_props) $$invalidate(6, lg = $$new_props.lg);
    		if ("xl" in $$new_props) $$invalidate(7, xl = $$new_props.xl);
    		if ("$$scope" in $$new_props) $$invalidate(8, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getColumnSizeClass,
    		isObject,
    		className,
    		xs,
    		sm,
    		md,
    		lg,
    		xl,
    		colClasses,
    		lookup
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("xs" in $$props) $$invalidate(3, xs = $$new_props.xs);
    		if ("sm" in $$props) $$invalidate(4, sm = $$new_props.sm);
    		if ("md" in $$props) $$invalidate(5, md = $$new_props.md);
    		if ("lg" in $$props) $$invalidate(6, lg = $$new_props.lg);
    		if ("xl" in $$props) $$invalidate(7, xl = $$new_props.xl);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [colClasses, $$restProps, className, xs, sm, md, lg, xl, $$scope, slots];
    }

    class Col extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$u, create_fragment$u, safe_not_equal, {
    			class: 2,
    			xs: 3,
    			sm: 4,
    			md: 5,
    			lg: 6,
    			xl: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Col",
    			options,
    			id: create_fragment$u.name
    		});
    	}

    	get class() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xs() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xs(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sm() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sm(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get md() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set md(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lg() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lg(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xl() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xl(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\Container.svelte generated by Svelte v3.38.0 */
    const file$t = "node_modules\\sveltestrap\\src\\Container.svelte";

    function create_fragment$t(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);
    	let div_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$t, 10, 0, 220);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[4], dirty, null, null);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","fluid"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Container", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { fluid = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("fluid" in $$new_props) $$invalidate(3, fluid = $$new_props.fluid);
    		if ("$$scope" in $$new_props) $$invalidate(4, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classnames, className, fluid, classes });

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("fluid" in $$props) $$invalidate(3, fluid = $$new_props.fluid);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, fluid*/ 12) {
    			$$invalidate(0, classes = classnames(className, fluid ? "container-fluid" : "container"));
    		}
    	};

    	return [classes, $$restProps, className, fluid, $$scope, slots];
    }

    class Container extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, { class: 2, fluid: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Container",
    			options,
    			id: create_fragment$t.name
    		});
    	}

    	get class() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fluid() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fluid(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\Icon.svelte generated by Svelte v3.38.0 */
    const file$s = "node_modules\\sveltestrap\\src\\Icon.svelte";

    function create_fragment$s(ctx) {
    	let i;
    	let i_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let i_data = {};

    	for (let i = 0; i < i_levels.length; i += 1) {
    		i_data = assign(i_data, i_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			i = element("i");
    			set_attributes(i, i_data);
    			add_location(i, file$s, 10, 0, 189);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			set_attributes(i, i_data = get_spread_update(i_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				dirty & /*classes*/ 1 && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","name"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Icon", slots, []);
    	let { class: className = "" } = $$props;
    	let { name = "" } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("name" in $$new_props) $$invalidate(3, name = $$new_props.name);
    	};

    	$$self.$capture_state = () => ({ classnames, className, name, classes });

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("name" in $$props) $$invalidate(3, name = $$new_props.name);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, name*/ 12) {
    			$$invalidate(0, classes = classnames(className, `bi-${name}`));
    		}
    	};

    	return [classes, $$restProps, className, name];
    }

    class Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, { class: 2, name: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$s.name
    		});
    	}

    	get class() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\InlineContainer.svelte generated by Svelte v3.38.0 */

    const file$r = "node_modules\\sveltestrap\\src\\InlineContainer.svelte";

    function create_fragment$r(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			add_location(div, file$r, 0, 2, 2);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[0], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("InlineContainer", slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<InlineContainer> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class InlineContainer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InlineContainer",
    			options,
    			id: create_fragment$r.name
    		});
    	}
    }

    /* node_modules\sveltestrap\src\ModalBody.svelte generated by Svelte v3.38.0 */
    const file$q = "node_modules\\sveltestrap\\src\\ModalBody.svelte";

    function create_fragment$q(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);
    	let div_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$q, 9, 0, 165);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], dirty, null, null);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ModalBody", slots, ['default']);
    	let { class: className = "" } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("$$scope" in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classnames, className, classes });

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 4) {
    			$$invalidate(0, classes = classnames(className, "modal-body"));
    		}
    	};

    	return [classes, $$restProps, className, $$scope, slots];
    }

    class ModalBody extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, { class: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ModalBody",
    			options,
    			id: create_fragment$q.name
    		});
    	}

    	get class() {
    		throw new Error("<ModalBody>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ModalBody>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\Portal.svelte generated by Svelte v3.38.0 */
    const file$p = "node_modules\\sveltestrap\\src\\Portal.svelte";

    function create_fragment$p(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			add_location(div, file$p, 16, 0, 295);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[3](div);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[1], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[3](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Portal", slots, ['default']);
    	let ref;
    	let portal;

    	onMount(() => {
    		portal = document.createElement("div");
    		document.body.appendChild(portal);
    		portal.appendChild(ref);
    	});

    	onDestroy(() => {
    		document.body.removeChild(portal);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Portal> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			ref = $$value;
    			$$invalidate(0, ref);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ onMount, onDestroy, ref, portal });

    	$$self.$inject_state = $$props => {
    		if ("ref" in $$props) $$invalidate(0, ref = $$props.ref);
    		if ("portal" in $$props) portal = $$props.portal;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [ref, $$scope, slots, div_binding];
    }

    class Portal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Portal",
    			options,
    			id: create_fragment$p.name
    		});
    	}
    }

    /* node_modules\sveltestrap\src\Modal.svelte generated by Svelte v3.38.0 */

    const file$o = "node_modules\\sveltestrap\\src\\Modal.svelte";
    const get_external_slot_changes = dirty => ({});
    const get_external_slot_context = ctx => ({});

    // (223:0) {#if _isMounted}
    function create_if_block$9(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*outer*/ ctx[15];

    	function switch_props(ctx) {
    		return {
    			props: {
    				$$slots: { default: [create_default_slot$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};

    			if (dirty[0] & /*wrapClassName, $$restProps, backdropClassName, backdropDuration, backdrop, staticModal, labelledBy, modalClassName, isOpen, transitionOptions, classes, _dialog, contentClassName, body*/ 1076223 | dirty[1] & /*$$scope*/ 64) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*outer*/ ctx[15])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(223:0) {#if _isMounted}",
    		ctx
    	});

    	return block;
    }

    // (229:4) {#if isOpen}
    function create_if_block_1$6(ctx) {
    	let div2;
    	let t0;
    	let div1;
    	let div0;
    	let current_block_type_index;
    	let if_block0;
    	let div0_class_value;
    	let div2_class_value;
    	let div2_transition;
    	let t1;
    	let if_block1_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	const external_slot_template = /*#slots*/ ctx[35].external;
    	const external_slot = create_slot(external_slot_template, ctx, /*$$scope*/ ctx[37], get_external_slot_context);
    	const if_block_creators = [create_if_block_3$3, create_else_block$6];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*body*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let if_block1 = /*backdrop*/ ctx[4] && !/*staticModal*/ ctx[0] && create_if_block_2$4(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			if (external_slot) external_slot.c();
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			attr_dev(div0, "class", div0_class_value = classnames("modal-content", /*contentClassName*/ ctx[8]));
    			add_location(div0, file$o, 245, 10, 5693);
    			attr_dev(div1, "class", /*classes*/ ctx[14]);
    			attr_dev(div1, "role", "document");
    			add_location(div1, file$o, 244, 8, 5625);
    			attr_dev(div2, "arialabelledby", /*labelledBy*/ ctx[3]);

    			attr_dev(div2, "class", div2_class_value = classnames("modal", /*modalClassName*/ ctx[6], {
    				show: /*isOpen*/ ctx[1],
    				"d-block": /*isOpen*/ ctx[1],
    				"d-none": !/*isOpen*/ ctx[1],
    				"position-static": /*staticModal*/ ctx[0]
    			}));

    			attr_dev(div2, "role", "dialog");
    			add_location(div2, file$o, 229, 6, 5120);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);

    			if (external_slot) {
    				external_slot.m(div2, null);
    			}

    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			if_blocks[current_block_type_index].m(div0, null);
    			/*div1_binding*/ ctx[36](div1);
    			insert_dev(target, t1, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div2, "introend", /*onModalOpened*/ ctx[17], false, false, false),
    					listen_dev(div2, "outroend", /*onModalClosed*/ ctx[18], false, false, false),
    					listen_dev(div2, "click", /*handleBackdropClick*/ ctx[16], false, false, false),
    					listen_dev(div2, "mousedown", /*handleBackdropMouseDown*/ ctx[19], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (external_slot) {
    				if (external_slot.p && (!current || dirty[1] & /*$$scope*/ 64)) {
    					update_slot(external_slot, external_slot_template, ctx, /*$$scope*/ ctx[37], dirty, get_external_slot_changes, get_external_slot_context);
    				}
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(div0, null);
    			}

    			if (!current || dirty[0] & /*contentClassName*/ 256 && div0_class_value !== (div0_class_value = classnames("modal-content", /*contentClassName*/ ctx[8]))) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (!current || dirty[0] & /*classes*/ 16384) {
    				attr_dev(div1, "class", /*classes*/ ctx[14]);
    			}

    			if (!current || dirty[0] & /*labelledBy*/ 8) {
    				attr_dev(div2, "arialabelledby", /*labelledBy*/ ctx[3]);
    			}

    			if (!current || dirty[0] & /*modalClassName, isOpen, staticModal*/ 67 && div2_class_value !== (div2_class_value = classnames("modal", /*modalClassName*/ ctx[6], {
    				show: /*isOpen*/ ctx[1],
    				"d-block": /*isOpen*/ ctx[1],
    				"d-none": !/*isOpen*/ ctx[1],
    				"position-static": /*staticModal*/ ctx[0]
    			}))) {
    				attr_dev(div2, "class", div2_class_value);
    			}

    			if (/*backdrop*/ ctx[4] && !/*staticModal*/ ctx[0]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*backdrop, staticModal*/ 17) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_2$4(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(external_slot, local);
    			transition_in(if_block0);

    			add_render_callback(() => {
    				if (!div2_transition) div2_transition = create_bidirectional_transition(div2, /*transitionType*/ ctx[10], /*transitionOptions*/ ctx[11], true);
    				div2_transition.run(1);
    			});

    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(external_slot, local);
    			transition_out(if_block0);
    			if (!div2_transition) div2_transition = create_bidirectional_transition(div2, /*transitionType*/ ctx[10], /*transitionOptions*/ ctx[11], false);
    			div2_transition.run(0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (external_slot) external_slot.d(detaching);
    			if_blocks[current_block_type_index].d();
    			/*div1_binding*/ ctx[36](null);
    			if (detaching && div2_transition) div2_transition.end();
    			if (detaching) detach_dev(t1);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(229:4) {#if isOpen}",
    		ctx
    	});

    	return block;
    }

    // (251:12) {:else}
    function create_else_block$6(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[35].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[37], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 64)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[37], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(251:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (247:12) {#if body}
    function create_if_block_3$3(ctx) {
    	let modalbody;
    	let current;

    	modalbody = new ModalBody({
    			props: {
    				$$slots: { default: [create_default_slot_1$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modalbody.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(modalbody, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const modalbody_changes = {};

    			if (dirty[1] & /*$$scope*/ 64) {
    				modalbody_changes.$$scope = { dirty, ctx };
    			}

    			modalbody.$set(modalbody_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modalbody.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modalbody.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modalbody, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$3.name,
    		type: "if",
    		source: "(247:12) {#if body}",
    		ctx
    	});

    	return block;
    }

    // (248:14) <ModalBody>
    function create_default_slot_1$7(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[35].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[37], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 64)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[37], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$7.name,
    		type: "slot",
    		source: "(248:14) <ModalBody>",
    		ctx
    	});

    	return block;
    }

    // (257:6) {#if backdrop && !staticModal}
    function create_if_block_2$4(ctx) {
    	let div;
    	let div_class_value;
    	let div_transition;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", div_class_value = classnames("modal-backdrop", "show", /*backdropClassName*/ ctx[7]));
    			add_location(div, file$o, 257, 8, 6005);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (!current || dirty[0] & /*backdropClassName*/ 128 && div_class_value !== (div_class_value = classnames("modal-backdrop", "show", /*backdropClassName*/ ctx[7]))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, { duration: /*backdropDuration*/ ctx[9] }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, { duration: /*backdropDuration*/ ctx[9] }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(257:6) {#if backdrop && !staticModal}",
    		ctx
    	});

    	return block;
    }

    // (224:0) <svelte:component this={outer}>
    function create_default_slot$8(ctx) {
    	let div;
    	let current;
    	let if_block = /*isOpen*/ ctx[1] && create_if_block_1$6(ctx);

    	let div_levels = [
    		{ class: /*wrapClassName*/ ctx[5] },
    		{ tabindex: "-1" },
    		/*$$restProps*/ ctx[20]
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			set_attributes(div, div_data);
    			add_location(div, file$o, 224, 2, 5026);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*isOpen*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*isOpen*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$6(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				(!current || dirty[0] & /*wrapClassName*/ 32) && { class: /*wrapClassName*/ ctx[5] },
    				{ tabindex: "-1" },
    				dirty[0] & /*$$restProps*/ 1048576 && /*$$restProps*/ ctx[20]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(224:0) <svelte:component this={outer}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*_isMounted*/ ctx[12] && create_if_block$9(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*_isMounted*/ ctx[12]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*_isMounted*/ 4096) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$9(ctx);
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
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    let openCount = 0;
    const dialogBaseClass = "modal-dialog";

    function noop() {
    	
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let classes;
    	let outer;

    	const omit_props_names = [
    		"class","static","isOpen","autoFocus","body","centered","container","scrollable","size","toggle","labelledBy","backdrop","onEnter","onExit","onOpened","onClosed","wrapClassName","modalClassName","backdropClassName","contentClassName","fade","backdropDuration","unmountOnClose","returnFocusAfterClose","transitionType","transitionOptions"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Modal", slots, ['external','default']);
    	let { class: className = "" } = $$props;
    	let { static: staticModal = false } = $$props;
    	let { isOpen = false } = $$props;
    	let { autoFocus = true } = $$props;
    	let { body = false } = $$props;
    	let { centered = false } = $$props;
    	let { container = undefined } = $$props;
    	let { scrollable = false } = $$props;
    	let { size = "" } = $$props;
    	let { toggle = undefined } = $$props;
    	let { labelledBy = "" } = $$props;
    	let { backdrop = true } = $$props;
    	let { onEnter = undefined } = $$props;
    	let { onExit = undefined } = $$props;
    	let { onOpened = noop } = $$props;
    	let { onClosed = noop } = $$props;
    	let { wrapClassName = "" } = $$props;
    	let { modalClassName = "" } = $$props;
    	let { backdropClassName = "" } = $$props;
    	let { contentClassName = "" } = $$props;
    	let { fade: fade$1 = true } = $$props;
    	let { backdropDuration = fade$1 ? 150 : 0 } = $$props;
    	let { unmountOnClose = true } = $$props;
    	let { returnFocusAfterClose = true } = $$props;
    	let { transitionType = fade } = $$props;
    	let { transitionOptions = { duration: fade$1 ? 300 : 0 } } = $$props;
    	let hasOpened = false;
    	let _isMounted = false;
    	let _triggeringElement;
    	let _originalBodyPadding;
    	let _lastIsOpen = isOpen;
    	let _lastHasOpened = hasOpened;
    	let _dialog;
    	let _mouseDownElement;
    	let _removeEscListener;

    	onMount(() => {
    		if (isOpen) {
    			init();
    			hasOpened = true;
    		}

    		if (typeof onEnter === "function") {
    			onEnter();
    		}

    		if (hasOpened && autoFocus) {
    			setFocus();
    		}
    	});

    	onDestroy(() => {
    		if (typeof onExit === "function") {
    			onExit();
    		}

    		destroy();

    		if (hasOpened) {
    			close();
    		}
    	});

    	afterUpdate(() => {
    		if (isOpen && !_lastIsOpen) {
    			init();
    			hasOpened = true;
    		}

    		if (autoFocus && hasOpened && !_lastHasOpened) {
    			setFocus();
    		}

    		_lastIsOpen = isOpen;
    		_lastHasOpened = hasOpened;
    	});

    	function setFocus() {
    		if (_dialog && _dialog.parentNode && typeof _dialog.parentNode.focus === "function") {
    			_dialog.parentNode.focus();
    		}
    	}

    	function init() {
    		try {
    			_triggeringElement = document.activeElement;
    		} catch(err) {
    			_triggeringElement = null;
    		}

    		if (!staticModal) {
    			_originalBodyPadding = getOriginalBodyPadding();
    			conditionallyUpdateScrollbar();

    			if (openCount === 0) {
    				document.body.className = classnames(document.body.className, "modal-open");
    			}

    			++openCount;
    		}

    		$$invalidate(12, _isMounted = true);
    	}

    	function manageFocusAfterClose() {
    		if (_triggeringElement) {
    			if (typeof _triggeringElement.focus === "function" && returnFocusAfterClose) {
    				_triggeringElement.focus();
    			}

    			_triggeringElement = null;
    		}
    	}

    	function destroy() {
    		manageFocusAfterClose();
    	}

    	function close() {
    		if (openCount <= 1) {
    			const modalOpenClassName = "modal-open";
    			const modalOpenClassNameRegex = new RegExp(`(^| )${modalOpenClassName}( |$)`);
    			document.body.className = document.body.className.replace(modalOpenClassNameRegex, " ").trim();
    		}

    		manageFocusAfterClose();
    		openCount = Math.max(0, openCount - 1);
    		setScrollbarWidth(_originalBodyPadding);
    	}

    	function handleBackdropClick(e) {
    		if (e.target === _mouseDownElement) {
    			e.stopPropagation();

    			if (!isOpen || !backdrop) {
    				return;
    			}

    			const backdropElem = _dialog ? _dialog.parentNode : null;

    			if (backdropElem && e.target === backdropElem && toggle) {
    				toggle(e);
    			}
    		}
    	}

    	function onModalOpened() {
    		_removeEscListener = browserEvent(document, "keydown", event => {
    			if (event.key && event.key === "Escape") {
    				toggle(event);
    			}
    		});

    		onOpened();
    	}

    	function onModalClosed() {
    		onClosed();

    		if (_removeEscListener) {
    			_removeEscListener();
    		}

    		if (unmountOnClose) {
    			destroy();
    		}

    		close();

    		if (_isMounted) {
    			hasOpened = false;
    		}

    		$$invalidate(12, _isMounted = false);
    	}

    	function handleBackdropMouseDown(e) {
    		_mouseDownElement = e.target;
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			_dialog = $$value;
    			$$invalidate(13, _dialog);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(20, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(21, className = $$new_props.class);
    		if ("static" in $$new_props) $$invalidate(0, staticModal = $$new_props.static);
    		if ("isOpen" in $$new_props) $$invalidate(1, isOpen = $$new_props.isOpen);
    		if ("autoFocus" in $$new_props) $$invalidate(22, autoFocus = $$new_props.autoFocus);
    		if ("body" in $$new_props) $$invalidate(2, body = $$new_props.body);
    		if ("centered" in $$new_props) $$invalidate(23, centered = $$new_props.centered);
    		if ("container" in $$new_props) $$invalidate(24, container = $$new_props.container);
    		if ("scrollable" in $$new_props) $$invalidate(25, scrollable = $$new_props.scrollable);
    		if ("size" in $$new_props) $$invalidate(26, size = $$new_props.size);
    		if ("toggle" in $$new_props) $$invalidate(27, toggle = $$new_props.toggle);
    		if ("labelledBy" in $$new_props) $$invalidate(3, labelledBy = $$new_props.labelledBy);
    		if ("backdrop" in $$new_props) $$invalidate(4, backdrop = $$new_props.backdrop);
    		if ("onEnter" in $$new_props) $$invalidate(28, onEnter = $$new_props.onEnter);
    		if ("onExit" in $$new_props) $$invalidate(29, onExit = $$new_props.onExit);
    		if ("onOpened" in $$new_props) $$invalidate(30, onOpened = $$new_props.onOpened);
    		if ("onClosed" in $$new_props) $$invalidate(31, onClosed = $$new_props.onClosed);
    		if ("wrapClassName" in $$new_props) $$invalidate(5, wrapClassName = $$new_props.wrapClassName);
    		if ("modalClassName" in $$new_props) $$invalidate(6, modalClassName = $$new_props.modalClassName);
    		if ("backdropClassName" in $$new_props) $$invalidate(7, backdropClassName = $$new_props.backdropClassName);
    		if ("contentClassName" in $$new_props) $$invalidate(8, contentClassName = $$new_props.contentClassName);
    		if ("fade" in $$new_props) $$invalidate(32, fade$1 = $$new_props.fade);
    		if ("backdropDuration" in $$new_props) $$invalidate(9, backdropDuration = $$new_props.backdropDuration);
    		if ("unmountOnClose" in $$new_props) $$invalidate(33, unmountOnClose = $$new_props.unmountOnClose);
    		if ("returnFocusAfterClose" in $$new_props) $$invalidate(34, returnFocusAfterClose = $$new_props.returnFocusAfterClose);
    		if ("transitionType" in $$new_props) $$invalidate(10, transitionType = $$new_props.transitionType);
    		if ("transitionOptions" in $$new_props) $$invalidate(11, transitionOptions = $$new_props.transitionOptions);
    		if ("$$scope" in $$new_props) $$invalidate(37, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		openCount,
    		classnames,
    		browserEvent,
    		onDestroy,
    		onMount,
    		afterUpdate,
    		fadeTransition: fade,
    		InlineContainer,
    		ModalBody,
    		Portal,
    		conditionallyUpdateScrollbar,
    		getOriginalBodyPadding,
    		setScrollbarWidth,
    		noop,
    		className,
    		staticModal,
    		isOpen,
    		autoFocus,
    		body,
    		centered,
    		container,
    		scrollable,
    		size,
    		toggle,
    		labelledBy,
    		backdrop,
    		onEnter,
    		onExit,
    		onOpened,
    		onClosed,
    		wrapClassName,
    		modalClassName,
    		backdropClassName,
    		contentClassName,
    		fade: fade$1,
    		backdropDuration,
    		unmountOnClose,
    		returnFocusAfterClose,
    		transitionType,
    		transitionOptions,
    		hasOpened,
    		_isMounted,
    		_triggeringElement,
    		_originalBodyPadding,
    		_lastIsOpen,
    		_lastHasOpened,
    		_dialog,
    		_mouseDownElement,
    		_removeEscListener,
    		setFocus,
    		init,
    		manageFocusAfterClose,
    		destroy,
    		close,
    		handleBackdropClick,
    		onModalOpened,
    		onModalClosed,
    		handleBackdropMouseDown,
    		dialogBaseClass,
    		classes,
    		outer
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(21, className = $$new_props.className);
    		if ("staticModal" in $$props) $$invalidate(0, staticModal = $$new_props.staticModal);
    		if ("isOpen" in $$props) $$invalidate(1, isOpen = $$new_props.isOpen);
    		if ("autoFocus" in $$props) $$invalidate(22, autoFocus = $$new_props.autoFocus);
    		if ("body" in $$props) $$invalidate(2, body = $$new_props.body);
    		if ("centered" in $$props) $$invalidate(23, centered = $$new_props.centered);
    		if ("container" in $$props) $$invalidate(24, container = $$new_props.container);
    		if ("scrollable" in $$props) $$invalidate(25, scrollable = $$new_props.scrollable);
    		if ("size" in $$props) $$invalidate(26, size = $$new_props.size);
    		if ("toggle" in $$props) $$invalidate(27, toggle = $$new_props.toggle);
    		if ("labelledBy" in $$props) $$invalidate(3, labelledBy = $$new_props.labelledBy);
    		if ("backdrop" in $$props) $$invalidate(4, backdrop = $$new_props.backdrop);
    		if ("onEnter" in $$props) $$invalidate(28, onEnter = $$new_props.onEnter);
    		if ("onExit" in $$props) $$invalidate(29, onExit = $$new_props.onExit);
    		if ("onOpened" in $$props) $$invalidate(30, onOpened = $$new_props.onOpened);
    		if ("onClosed" in $$props) $$invalidate(31, onClosed = $$new_props.onClosed);
    		if ("wrapClassName" in $$props) $$invalidate(5, wrapClassName = $$new_props.wrapClassName);
    		if ("modalClassName" in $$props) $$invalidate(6, modalClassName = $$new_props.modalClassName);
    		if ("backdropClassName" in $$props) $$invalidate(7, backdropClassName = $$new_props.backdropClassName);
    		if ("contentClassName" in $$props) $$invalidate(8, contentClassName = $$new_props.contentClassName);
    		if ("fade" in $$props) $$invalidate(32, fade$1 = $$new_props.fade);
    		if ("backdropDuration" in $$props) $$invalidate(9, backdropDuration = $$new_props.backdropDuration);
    		if ("unmountOnClose" in $$props) $$invalidate(33, unmountOnClose = $$new_props.unmountOnClose);
    		if ("returnFocusAfterClose" in $$props) $$invalidate(34, returnFocusAfterClose = $$new_props.returnFocusAfterClose);
    		if ("transitionType" in $$props) $$invalidate(10, transitionType = $$new_props.transitionType);
    		if ("transitionOptions" in $$props) $$invalidate(11, transitionOptions = $$new_props.transitionOptions);
    		if ("hasOpened" in $$props) hasOpened = $$new_props.hasOpened;
    		if ("_isMounted" in $$props) $$invalidate(12, _isMounted = $$new_props._isMounted);
    		if ("_triggeringElement" in $$props) _triggeringElement = $$new_props._triggeringElement;
    		if ("_originalBodyPadding" in $$props) _originalBodyPadding = $$new_props._originalBodyPadding;
    		if ("_lastIsOpen" in $$props) _lastIsOpen = $$new_props._lastIsOpen;
    		if ("_lastHasOpened" in $$props) _lastHasOpened = $$new_props._lastHasOpened;
    		if ("_dialog" in $$props) $$invalidate(13, _dialog = $$new_props._dialog);
    		if ("_mouseDownElement" in $$props) _mouseDownElement = $$new_props._mouseDownElement;
    		if ("_removeEscListener" in $$props) _removeEscListener = $$new_props._removeEscListener;
    		if ("classes" in $$props) $$invalidate(14, classes = $$new_props.classes);
    		if ("outer" in $$props) $$invalidate(15, outer = $$new_props.outer);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*className, size, centered, scrollable*/ 111149056) {
    			$$invalidate(14, classes = classnames(dialogBaseClass, className, {
    				[`modal-${size}`]: size,
    				[`${dialogBaseClass}-centered`]: centered,
    				[`${dialogBaseClass}-scrollable`]: scrollable
    			}));
    		}

    		if ($$self.$$.dirty[0] & /*container, staticModal*/ 16777217) {
    			$$invalidate(15, outer = container === "inline" || staticModal
    			? InlineContainer
    			: Portal);
    		}
    	};

    	return [
    		staticModal,
    		isOpen,
    		body,
    		labelledBy,
    		backdrop,
    		wrapClassName,
    		modalClassName,
    		backdropClassName,
    		contentClassName,
    		backdropDuration,
    		transitionType,
    		transitionOptions,
    		_isMounted,
    		_dialog,
    		classes,
    		outer,
    		handleBackdropClick,
    		onModalOpened,
    		onModalClosed,
    		handleBackdropMouseDown,
    		$$restProps,
    		className,
    		autoFocus,
    		centered,
    		container,
    		scrollable,
    		size,
    		toggle,
    		onEnter,
    		onExit,
    		onOpened,
    		onClosed,
    		fade$1,
    		unmountOnClose,
    		returnFocusAfterClose,
    		slots,
    		div1_binding,
    		$$scope
    	];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$o,
    			create_fragment$o,
    			safe_not_equal,
    			{
    				class: 21,
    				static: 0,
    				isOpen: 1,
    				autoFocus: 22,
    				body: 2,
    				centered: 23,
    				container: 24,
    				scrollable: 25,
    				size: 26,
    				toggle: 27,
    				labelledBy: 3,
    				backdrop: 4,
    				onEnter: 28,
    				onExit: 29,
    				onOpened: 30,
    				onClosed: 31,
    				wrapClassName: 5,
    				modalClassName: 6,
    				backdropClassName: 7,
    				contentClassName: 8,
    				fade: 32,
    				backdropDuration: 9,
    				unmountOnClose: 33,
    				returnFocusAfterClose: 34,
    				transitionType: 10,
    				transitionOptions: 11
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$o.name
    		});
    	}

    	get class() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get static() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set static(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isOpen() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get autoFocus() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set autoFocus(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get body() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set body(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get centered() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set centered(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get container() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set container(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollable() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scrollable(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toggle() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toggle(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelledBy() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelledBy(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get backdrop() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set backdrop(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onEnter() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onEnter(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onExit() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onExit(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onOpened() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onOpened(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onClosed() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClosed(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get wrapClassName() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set wrapClassName(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get modalClassName() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set modalClassName(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get backdropClassName() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set backdropClassName(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get contentClassName() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set contentClassName(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fade() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fade(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get backdropDuration() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set backdropDuration(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unmountOnClose() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unmountOnClose(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get returnFocusAfterClose() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set returnFocusAfterClose(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionType() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionType(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionOptions() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionOptions(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\ModalFooter.svelte generated by Svelte v3.38.0 */
    const file$n = "node_modules\\sveltestrap\\src\\ModalFooter.svelte";

    function create_fragment$n(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);
    	let div_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$n, 9, 0, 167);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], dirty, null, null);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ModalFooter", slots, ['default']);
    	let { class: className = "" } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("$$scope" in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classnames, className, classes });

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 4) {
    			$$invalidate(0, classes = classnames(className, "modal-footer"));
    		}
    	};

    	return [classes, $$restProps, className, $$scope, slots];
    }

    class ModalFooter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, { class: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ModalFooter",
    			options,
    			id: create_fragment$n.name
    		});
    	}

    	get class() {
    		throw new Error("<ModalFooter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ModalFooter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\ModalHeader.svelte generated by Svelte v3.38.0 */
    const file$m = "node_modules\\sveltestrap\\src\\ModalHeader.svelte";
    const get_close_slot_changes = dirty => ({});
    const get_close_slot_context = ctx => ({});

    // (21:4) {:else}
    function create_else_block$5(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[8], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(21:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (19:4) {#if children}
    function create_if_block_1$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*children*/ ctx[2]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 4) set_data_dev(t, /*children*/ ctx[2]);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(19:4) {#if children}",
    		ctx
    	});

    	return block;
    }

    // (26:4) {#if typeof toggle === 'function'}
    function create_if_block$8(ctx) {
    	let button;
    	let span;
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			span = element("span");
    			t = text(/*closeIcon*/ ctx[3]);
    			attr_dev(span, "aria-hidden", "true");
    			add_location(span, file$m, 31, 8, 735);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "close");
    			attr_dev(button, "aria-label", /*closeAriaLabel*/ ctx[1]);
    			add_location(button, file$m, 26, 6, 612);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, span);
    			append_dev(span, t);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*toggle*/ ctx[0])) /*toggle*/ ctx[0].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*closeIcon*/ 8) set_data_dev(t, /*closeIcon*/ ctx[3]);

    			if (dirty & /*closeAriaLabel*/ 2) {
    				attr_dev(button, "aria-label", /*closeAriaLabel*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(26:4) {#if typeof toggle === 'function'}",
    		ctx
    	});

    	return block;
    }

    // (25:21)      
    function fallback_block$1(ctx) {
    	let if_block_anchor;
    	let if_block = typeof /*toggle*/ ctx[0] === "function" && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (typeof /*toggle*/ ctx[0] === "function") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$8(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$1.name,
    		type: "fallback",
    		source: "(25:21)      ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let div;
    	let h5;
    	let current_block_type_index;
    	let if_block;
    	let t;
    	let current;
    	const if_block_creators = [create_if_block_1$5, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*children*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	const close_slot_template = /*#slots*/ ctx[9].close;
    	const close_slot = create_slot(close_slot_template, ctx, /*$$scope*/ ctx[8], get_close_slot_context);
    	const close_slot_or_fallback = close_slot || fallback_block$1(ctx);
    	let div_levels = [/*$$restProps*/ ctx[5], { class: /*classes*/ ctx[4] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			h5 = element("h5");
    			if_block.c();
    			t = space();
    			if (close_slot_or_fallback) close_slot_or_fallback.c();
    			attr_dev(h5, "class", "modal-title");
    			add_location(h5, file$m, 17, 2, 439);
    			set_attributes(div, div_data);
    			add_location(div, file$m, 16, 0, 398);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h5);
    			if_blocks[current_block_type_index].m(h5, null);
    			append_dev(div, t);

    			if (close_slot_or_fallback) {
    				close_slot_or_fallback.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(h5, null);
    			}

    			if (close_slot) {
    				if (close_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot(close_slot, close_slot_template, ctx, /*$$scope*/ ctx[8], dirty, get_close_slot_changes, get_close_slot_context);
    				}
    			} else {
    				if (close_slot_or_fallback && close_slot_or_fallback.p && dirty & /*closeAriaLabel, toggle, closeIcon*/ 11) {
    					close_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 32 && /*$$restProps*/ ctx[5],
    				(!current || dirty & /*classes*/ 16) && { class: /*classes*/ ctx[4] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(close_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(close_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    			if (close_slot_or_fallback) close_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let closeIcon;
    	let classes;
    	const omit_props_names = ["class","toggle","closeAriaLabel","charCode","children"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ModalHeader", slots, ['default','close']);
    	let { class: className = "" } = $$props;
    	let { toggle = undefined } = $$props;
    	let { closeAriaLabel = "Close" } = $$props;
    	let { charCode = 215 } = $$props;
    	let { children = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(5, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(6, className = $$new_props.class);
    		if ("toggle" in $$new_props) $$invalidate(0, toggle = $$new_props.toggle);
    		if ("closeAriaLabel" in $$new_props) $$invalidate(1, closeAriaLabel = $$new_props.closeAriaLabel);
    		if ("charCode" in $$new_props) $$invalidate(7, charCode = $$new_props.charCode);
    		if ("children" in $$new_props) $$invalidate(2, children = $$new_props.children);
    		if ("$$scope" in $$new_props) $$invalidate(8, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		toggle,
    		closeAriaLabel,
    		charCode,
    		children,
    		closeIcon,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(6, className = $$new_props.className);
    		if ("toggle" in $$props) $$invalidate(0, toggle = $$new_props.toggle);
    		if ("closeAriaLabel" in $$props) $$invalidate(1, closeAriaLabel = $$new_props.closeAriaLabel);
    		if ("charCode" in $$props) $$invalidate(7, charCode = $$new_props.charCode);
    		if ("children" in $$props) $$invalidate(2, children = $$new_props.children);
    		if ("closeIcon" in $$props) $$invalidate(3, closeIcon = $$new_props.closeIcon);
    		if ("classes" in $$props) $$invalidate(4, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*charCode*/ 128) {
    			$$invalidate(3, closeIcon = typeof charCode === "number"
    			? String.fromCharCode(charCode)
    			: charCode);
    		}

    		if ($$self.$$.dirty & /*className*/ 64) {
    			$$invalidate(4, classes = classnames(className, "modal-header"));
    		}
    	};

    	return [
    		toggle,
    		closeAriaLabel,
    		children,
    		closeIcon,
    		classes,
    		$$restProps,
    		className,
    		charCode,
    		$$scope,
    		slots
    	];
    }

    class ModalHeader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {
    			class: 6,
    			toggle: 0,
    			closeAriaLabel: 1,
    			charCode: 7,
    			children: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ModalHeader",
    			options,
    			id: create_fragment$m.name
    		});
    	}

    	get class() {
    		throw new Error("<ModalHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ModalHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toggle() {
    		throw new Error("<ModalHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toggle(value) {
    		throw new Error("<ModalHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeAriaLabel() {
    		throw new Error("<ModalHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeAriaLabel(value) {
    		throw new Error("<ModalHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get charCode() {
    		throw new Error("<ModalHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set charCode(value) {
    		throw new Error("<ModalHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get children() {
    		throw new Error("<ModalHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set children(value) {
    		throw new Error("<ModalHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\Nav.svelte generated by Svelte v3.38.0 */
    const file$l = "node_modules\\sveltestrap\\src\\Nav.svelte";

    function create_fragment$l(ctx) {
    	let ul;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);
    	let ul_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let ul_data = {};

    	for (let i = 0; i < ul_levels.length; i += 1) {
    		ul_data = assign(ul_data, ul_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			if (default_slot) default_slot.c();
    			set_attributes(ul, ul_data);
    			add_location(ul, file$l, 39, 0, 941);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			if (default_slot) {
    				default_slot.m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[11], dirty, null, null);
    				}
    			}

    			set_attributes(ul, ul_data = get_spread_update(ul_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function getVerticalClass(vertical) {
    	if (vertical === false) {
    		return false;
    	} else if (vertical === true || vertical === "xs") {
    		return "flex-column";
    	}

    	return `flex-${vertical}-column`;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let classes;

    	const omit_props_names = [
    		"class","tabs","pills","vertical","horizontal","justified","fill","navbar","card"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Nav", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { tabs = false } = $$props;
    	let { pills = false } = $$props;
    	let { vertical = false } = $$props;
    	let { horizontal = "" } = $$props;
    	let { justified = false } = $$props;
    	let { fill = false } = $$props;
    	let { navbar = false } = $$props;
    	let { card = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("tabs" in $$new_props) $$invalidate(3, tabs = $$new_props.tabs);
    		if ("pills" in $$new_props) $$invalidate(4, pills = $$new_props.pills);
    		if ("vertical" in $$new_props) $$invalidate(5, vertical = $$new_props.vertical);
    		if ("horizontal" in $$new_props) $$invalidate(6, horizontal = $$new_props.horizontal);
    		if ("justified" in $$new_props) $$invalidate(7, justified = $$new_props.justified);
    		if ("fill" in $$new_props) $$invalidate(8, fill = $$new_props.fill);
    		if ("navbar" in $$new_props) $$invalidate(9, navbar = $$new_props.navbar);
    		if ("card" in $$new_props) $$invalidate(10, card = $$new_props.card);
    		if ("$$scope" in $$new_props) $$invalidate(11, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		tabs,
    		pills,
    		vertical,
    		horizontal,
    		justified,
    		fill,
    		navbar,
    		card,
    		getVerticalClass,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("tabs" in $$props) $$invalidate(3, tabs = $$new_props.tabs);
    		if ("pills" in $$props) $$invalidate(4, pills = $$new_props.pills);
    		if ("vertical" in $$props) $$invalidate(5, vertical = $$new_props.vertical);
    		if ("horizontal" in $$props) $$invalidate(6, horizontal = $$new_props.horizontal);
    		if ("justified" in $$props) $$invalidate(7, justified = $$new_props.justified);
    		if ("fill" in $$props) $$invalidate(8, fill = $$new_props.fill);
    		if ("navbar" in $$props) $$invalidate(9, navbar = $$new_props.navbar);
    		if ("card" in $$props) $$invalidate(10, card = $$new_props.card);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, navbar, horizontal, vertical, tabs, card, pills, justified, fill*/ 2044) {
    			$$invalidate(0, classes = classnames(className, navbar ? "navbar-nav" : "nav", horizontal ? `justify-content-${horizontal}` : false, getVerticalClass(vertical), {
    				"nav-tabs": tabs,
    				"card-header-tabs": card && tabs,
    				"nav-pills": pills,
    				"card-header-pills": card && pills,
    				"nav-justified": justified,
    				"nav-fill": fill
    			}));
    		}
    	};

    	return [
    		classes,
    		$$restProps,
    		className,
    		tabs,
    		pills,
    		vertical,
    		horizontal,
    		justified,
    		fill,
    		navbar,
    		card,
    		$$scope,
    		slots
    	];
    }

    class Nav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {
    			class: 2,
    			tabs: 3,
    			pills: 4,
    			vertical: 5,
    			horizontal: 6,
    			justified: 7,
    			fill: 8,
    			navbar: 9,
    			card: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nav",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get class() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabs() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabs(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pills() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pills(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get vertical() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set vertical(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get horizontal() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set horizontal(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get justified() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set justified(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fill() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fill(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get navbar() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set navbar(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get card() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set card(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\NavItem.svelte generated by Svelte v3.38.0 */
    const file$k = "node_modules\\sveltestrap\\src\\NavItem.svelte";

    function create_fragment$k(ctx) {
    	let li;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);
    	let li_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let li_data = {};

    	for (let i = 0; i < li_levels.length; i += 1) {
    		li_data = assign(li_data, li_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			if (default_slot) default_slot.c();
    			set_attributes(li, li_data);
    			add_location(li, file$k, 10, 0, 219);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);

    			if (default_slot) {
    				default_slot.m(li, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[4], dirty, null, null);
    				}
    			}

    			set_attributes(li, li_data = get_spread_update(li_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","active"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("NavItem", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { active = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("active" in $$new_props) $$invalidate(3, active = $$new_props.active);
    		if ("$$scope" in $$new_props) $$invalidate(4, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classnames, className, active, classes });

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("active" in $$props) $$invalidate(3, active = $$new_props.active);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, active*/ 12) {
    			$$invalidate(0, classes = classnames(className, "nav-item", active ? "active" : false));
    		}
    	};

    	return [classes, $$restProps, className, active, $$scope, slots];
    }

    class NavItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, { class: 2, active: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavItem",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get class() {
    		throw new Error("<NavItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<NavItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<NavItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<NavItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\NavLink.svelte generated by Svelte v3.38.0 */
    const file$j = "node_modules\\sveltestrap\\src\\NavLink.svelte";

    function create_fragment$j(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);

    	let a_levels = [
    		/*$$restProps*/ ctx[3],
    		{ href: /*href*/ ctx[0] },
    		{ class: /*classes*/ ctx[1] }
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$j, 27, 0, 472);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(a, "click", /*click_handler*/ ctx[9], false, false, false),
    					listen_dev(a, "click", /*handleClick*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[7], dirty, null, null);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3],
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","disabled","active","href"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("NavLink", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { disabled = false } = $$props;
    	let { active = false } = $$props;
    	let { href = "#" } = $$props;

    	function handleClick(e) {
    		if (disabled) {
    			e.preventDefault();
    			e.stopImmediatePropagation();
    			return;
    		}

    		if (href === "#") {
    			e.preventDefault();
    		}
    	}

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(4, className = $$new_props.class);
    		if ("disabled" in $$new_props) $$invalidate(5, disabled = $$new_props.disabled);
    		if ("active" in $$new_props) $$invalidate(6, active = $$new_props.active);
    		if ("href" in $$new_props) $$invalidate(0, href = $$new_props.href);
    		if ("$$scope" in $$new_props) $$invalidate(7, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		disabled,
    		active,
    		href,
    		handleClick,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(4, className = $$new_props.className);
    		if ("disabled" in $$props) $$invalidate(5, disabled = $$new_props.disabled);
    		if ("active" in $$props) $$invalidate(6, active = $$new_props.active);
    		if ("href" in $$props) $$invalidate(0, href = $$new_props.href);
    		if ("classes" in $$props) $$invalidate(1, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, disabled, active*/ 112) {
    			$$invalidate(1, classes = classnames(className, "nav-link", { disabled, active }));
    		}
    	};

    	return [
    		href,
    		classes,
    		handleClick,
    		$$restProps,
    		className,
    		disabled,
    		active,
    		$$scope,
    		slots,
    		click_handler
    	];
    }

    class NavLink extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {
    			class: 4,
    			disabled: 5,
    			active: 6,
    			href: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavLink",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get class() {
    		throw new Error("<NavLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<NavLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<NavLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<NavLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<NavLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<NavLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<NavLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<NavLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\Pagination.svelte generated by Svelte v3.38.0 */
    const file$i = "node_modules\\sveltestrap\\src\\Pagination.svelte";

    function create_fragment$i(ctx) {
    	let nav;
    	let ul;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);

    	let nav_levels = [
    		/*$$restProps*/ ctx[3],
    		{ class: /*classes*/ ctx[1] },
    		{ "aria-label": /*ariaLabel*/ ctx[0] }
    	];

    	let nav_data = {};

    	for (let i = 0; i < nav_levels.length; i += 1) {
    		nav_data = assign(nav_data, nav_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			ul = element("ul");
    			if (default_slot) default_slot.c();
    			attr_dev(ul, "class", /*listClasses*/ ctx[2]);
    			add_location(ul, file$i, 17, 2, 414);
    			set_attributes(nav, nav_data);
    			add_location(nav, file$i, 16, 0, 350);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, ul);

    			if (default_slot) {
    				default_slot.m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[7], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*listClasses*/ 4) {
    				attr_dev(ul, "class", /*listClasses*/ ctx[2]);
    			}

    			set_attributes(nav, nav_data = get_spread_update(nav_levels, [
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] },
    				(!current || dirty & /*ariaLabel*/ 1) && { "aria-label": /*ariaLabel*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let classes;
    	let listClasses;
    	const omit_props_names = ["class","listClassName","size","ariaLabel"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Pagination", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { listClassName = "" } = $$props;
    	let { size = "" } = $$props;
    	let { ariaLabel = "pagination" } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(4, className = $$new_props.class);
    		if ("listClassName" in $$new_props) $$invalidate(5, listClassName = $$new_props.listClassName);
    		if ("size" in $$new_props) $$invalidate(6, size = $$new_props.size);
    		if ("ariaLabel" in $$new_props) $$invalidate(0, ariaLabel = $$new_props.ariaLabel);
    		if ("$$scope" in $$new_props) $$invalidate(7, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		listClassName,
    		size,
    		ariaLabel,
    		classes,
    		listClasses
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(4, className = $$new_props.className);
    		if ("listClassName" in $$props) $$invalidate(5, listClassName = $$new_props.listClassName);
    		if ("size" in $$props) $$invalidate(6, size = $$new_props.size);
    		if ("ariaLabel" in $$props) $$invalidate(0, ariaLabel = $$new_props.ariaLabel);
    		if ("classes" in $$props) $$invalidate(1, classes = $$new_props.classes);
    		if ("listClasses" in $$props) $$invalidate(2, listClasses = $$new_props.listClasses);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 16) {
    			$$invalidate(1, classes = classnames(className));
    		}

    		if ($$self.$$.dirty & /*listClassName, size*/ 96) {
    			$$invalidate(2, listClasses = classnames(listClassName, "pagination", { [`pagination-${size}`]: !!size }));
    		}
    	};

    	return [
    		ariaLabel,
    		classes,
    		listClasses,
    		$$restProps,
    		className,
    		listClassName,
    		size,
    		$$scope,
    		slots
    	];
    }

    class Pagination extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {
    			class: 4,
    			listClassName: 5,
    			size: 6,
    			ariaLabel: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pagination",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get class() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get listClassName() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set listClassName(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabel() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabel(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\PaginationItem.svelte generated by Svelte v3.38.0 */
    const file$h = "node_modules\\sveltestrap\\src\\PaginationItem.svelte";

    function create_fragment$h(ctx) {
    	let li;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
    	let li_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let li_data = {};

    	for (let i = 0; i < li_levels.length; i += 1) {
    		li_data = assign(li_data, li_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			if (default_slot) default_slot.c();
    			set_attributes(li, li_data);
    			add_location(li, file$h, 14, 0, 256);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);

    			if (default_slot) {
    				default_slot.m(li, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[5], dirty, null, null);
    				}
    			}

    			set_attributes(li, li_data = get_spread_update(li_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","active","disabled"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("PaginationItem", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { active = false } = $$props;
    	let { disabled = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("active" in $$new_props) $$invalidate(3, active = $$new_props.active);
    		if ("disabled" in $$new_props) $$invalidate(4, disabled = $$new_props.disabled);
    		if ("$$scope" in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		active,
    		disabled,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("active" in $$props) $$invalidate(3, active = $$new_props.active);
    		if ("disabled" in $$props) $$invalidate(4, disabled = $$new_props.disabled);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, active, disabled*/ 28) {
    			$$invalidate(0, classes = classnames(className, "page-item", { active, disabled }));
    		}
    	};

    	return [classes, $$restProps, className, active, disabled, $$scope, slots];
    }

    class PaginationItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { class: 2, active: 3, disabled: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PaginationItem",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get class() {
    		throw new Error("<PaginationItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<PaginationItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<PaginationItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<PaginationItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<PaginationItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<PaginationItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\PaginationLink.svelte generated by Svelte v3.38.0 */
    const file$g = "node_modules\\sveltestrap\\src\\PaginationLink.svelte";

    // (47:2) {:else}
    function create_else_block$4(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[12], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(47:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (42:2) {#if previous || next || first || last}
    function create_if_block$7(ctx) {
    	let span0;
    	let t0;
    	let span1;
    	let t1;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			span0 = element("span");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			t0 = space();
    			span1 = element("span");
    			t1 = text(/*realLabel*/ ctx[7]);
    			attr_dev(span0, "aria-hidden", "true");
    			add_location(span0, file$g, 42, 4, 948);
    			attr_dev(span1, "class", "sr-only");
    			add_location(span1, file$g, 45, 4, 1024);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span0, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(span0, null);
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, span1, anchor);
    			append_dev(span1, t1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[12], dirty, null, null);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty & /*defaultCaret*/ 32) {
    					default_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			if (!current || dirty & /*realLabel*/ 128) set_data_dev(t1, /*realLabel*/ ctx[7]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span0);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(span1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(42:2) {#if previous || next || first || last}",
    		ctx
    	});

    	return block;
    }

    // (44:12) {defaultCaret}
    function fallback_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*defaultCaret*/ ctx[5]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*defaultCaret*/ 32) set_data_dev(t, /*defaultCaret*/ ctx[5]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(44:12) {defaultCaret}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let a;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$7, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*previous*/ ctx[1] || /*next*/ ctx[0] || /*first*/ ctx[2] || /*last*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	let a_levels = [
    		/*$$restProps*/ ctx[8],
    		{ class: /*classes*/ ctx[6] },
    		{ href: /*href*/ ctx[4] }
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if_block.c();
    			set_attributes(a, a_data);
    			add_location(a, file$g, 40, 0, 849);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			if_blocks[current_block_type_index].m(a, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*click_handler*/ ctx[14], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(a, null);
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*$$restProps*/ 256 && /*$$restProps*/ ctx[8],
    				(!current || dirty & /*classes*/ 64) && { class: /*classes*/ ctx[6] },
    				(!current || dirty & /*href*/ 16) && { href: /*href*/ ctx[4] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let classes;
    	let realLabel;
    	const omit_props_names = ["class","next","previous","first","last","ariaLabel","href"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("PaginationLink", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { next = false } = $$props;
    	let { previous = false } = $$props;
    	let { first = false } = $$props;
    	let { last = false } = $$props;
    	let { ariaLabel = "" } = $$props;
    	let { href = "" } = $$props;
    	let defaultAriaLabel;
    	let defaultCaret;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(8, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(9, className = $$new_props.class);
    		if ("next" in $$new_props) $$invalidate(0, next = $$new_props.next);
    		if ("previous" in $$new_props) $$invalidate(1, previous = $$new_props.previous);
    		if ("first" in $$new_props) $$invalidate(2, first = $$new_props.first);
    		if ("last" in $$new_props) $$invalidate(3, last = $$new_props.last);
    		if ("ariaLabel" in $$new_props) $$invalidate(10, ariaLabel = $$new_props.ariaLabel);
    		if ("href" in $$new_props) $$invalidate(4, href = $$new_props.href);
    		if ("$$scope" in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		next,
    		previous,
    		first,
    		last,
    		ariaLabel,
    		href,
    		defaultAriaLabel,
    		defaultCaret,
    		classes,
    		realLabel
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(9, className = $$new_props.className);
    		if ("next" in $$props) $$invalidate(0, next = $$new_props.next);
    		if ("previous" in $$props) $$invalidate(1, previous = $$new_props.previous);
    		if ("first" in $$props) $$invalidate(2, first = $$new_props.first);
    		if ("last" in $$props) $$invalidate(3, last = $$new_props.last);
    		if ("ariaLabel" in $$props) $$invalidate(10, ariaLabel = $$new_props.ariaLabel);
    		if ("href" in $$props) $$invalidate(4, href = $$new_props.href);
    		if ("defaultAriaLabel" in $$props) $$invalidate(11, defaultAriaLabel = $$new_props.defaultAriaLabel);
    		if ("defaultCaret" in $$props) $$invalidate(5, defaultCaret = $$new_props.defaultCaret);
    		if ("classes" in $$props) $$invalidate(6, classes = $$new_props.classes);
    		if ("realLabel" in $$props) $$invalidate(7, realLabel = $$new_props.realLabel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 512) {
    			$$invalidate(6, classes = classnames(className, "page-link"));
    		}

    		if ($$self.$$.dirty & /*previous, next, first, last*/ 15) {
    			if (previous) {
    				$$invalidate(11, defaultAriaLabel = "Previous");
    			} else if (next) {
    				$$invalidate(11, defaultAriaLabel = "Next");
    			} else if (first) {
    				$$invalidate(11, defaultAriaLabel = "First");
    			} else if (last) {
    				$$invalidate(11, defaultAriaLabel = "Last");
    			}
    		}

    		if ($$self.$$.dirty & /*ariaLabel, defaultAriaLabel*/ 3072) {
    			$$invalidate(7, realLabel = ariaLabel || defaultAriaLabel);
    		}

    		if ($$self.$$.dirty & /*previous, next, first, last*/ 15) {
    			if (previous) {
    				$$invalidate(5, defaultCaret = "‹");
    			} else if (next) {
    				$$invalidate(5, defaultCaret = "›");
    			} else if (first) {
    				$$invalidate(5, defaultCaret = "«");
    			} else if (last) {
    				$$invalidate(5, defaultCaret = "»");
    			}
    		}
    	};

    	return [
    		next,
    		previous,
    		first,
    		last,
    		href,
    		defaultCaret,
    		classes,
    		realLabel,
    		$$restProps,
    		className,
    		ariaLabel,
    		defaultAriaLabel,
    		$$scope,
    		slots,
    		click_handler
    	];
    }

    class PaginationLink extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {
    			class: 9,
    			next: 0,
    			previous: 1,
    			first: 2,
    			last: 3,
    			ariaLabel: 10,
    			href: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PaginationLink",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get class() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get next() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set next(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get previous() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set previous(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get first() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set first(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get last() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set last(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabel() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabel(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\Row.svelte generated by Svelte v3.38.0 */
    const file$f = "node_modules\\sveltestrap\\src\\Row.svelte";

    function create_fragment$f(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);
    	let div_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$f, 38, 0, 957);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[6], dirty, null, null);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function getCols(cols) {
    	const colsValue = parseInt(cols);

    	if (!isNaN(colsValue)) {
    		if (colsValue > 0) {
    			return [`row-cols-${colsValue}`];
    		}
    	} else if (typeof cols === "object") {
    		return ["xs", "sm", "md", "lg", "xl"].map(colWidth => {
    			const isXs = colWidth === "xs";
    			const colSizeInterfix = isXs ? "-" : `-${colWidth}-`;
    			const value = cols[colWidth];

    			if (typeof value === "number" && value > 0) {
    				return `row-cols${colSizeInterfix}${value}`;
    			}

    			return null;
    		}).filter(value => !!value);
    	}

    	return [];
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","noGutters","form","cols"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Row", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { noGutters = false } = $$props;
    	let { form = false } = $$props;
    	let { cols = 0 } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("noGutters" in $$new_props) $$invalidate(3, noGutters = $$new_props.noGutters);
    		if ("form" in $$new_props) $$invalidate(4, form = $$new_props.form);
    		if ("cols" in $$new_props) $$invalidate(5, cols = $$new_props.cols);
    		if ("$$scope" in $$new_props) $$invalidate(6, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		noGutters,
    		form,
    		cols,
    		getCols,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("noGutters" in $$props) $$invalidate(3, noGutters = $$new_props.noGutters);
    		if ("form" in $$props) $$invalidate(4, form = $$new_props.form);
    		if ("cols" in $$props) $$invalidate(5, cols = $$new_props.cols);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, noGutters, form, cols*/ 60) {
    			$$invalidate(0, classes = classnames(className, noGutters ? "no-gutters" : null, form ? "form-row" : "row", ...getCols(cols)));
    		}
    	};

    	return [classes, $$restProps, className, noGutters, form, cols, $$scope, slots];
    }

    class Row extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { class: 2, noGutters: 3, form: 4, cols: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Row",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get class() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noGutters() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noGutters(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get form() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set form(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cols() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cols(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\Table.svelte generated by Svelte v3.38.0 */
    const file$e = "node_modules\\sveltestrap\\src\\Table.svelte";

    // (35:0) {:else}
    function create_else_block$3(ctx) {
    	let table;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);
    	let table_levels = [/*$$restProps*/ ctx[3], { class: /*classes*/ ctx[1] }];
    	let table_data = {};

    	for (let i = 0; i < table_levels.length; i += 1) {
    		table_data = assign(table_data, table_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			table = element("table");
    			if (default_slot) default_slot.c();
    			set_attributes(table, table_data);
    			add_location(table, file$e, 35, 2, 861);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);

    			if (default_slot) {
    				default_slot.m(table, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[11], dirty, null, null);
    				}
    			}

    			set_attributes(table, table_data = get_spread_update(table_levels, [
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(35:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (29:0) {#if responsive}
    function create_if_block$6(ctx) {
    	let div;
    	let table;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);
    	let table_levels = [/*$$restProps*/ ctx[3], { class: /*classes*/ ctx[1] }];
    	let table_data = {};

    	for (let i = 0; i < table_levels.length; i += 1) {
    		table_data = assign(table_data, table_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			table = element("table");
    			if (default_slot) default_slot.c();
    			set_attributes(table, table_data);
    			add_location(table, file$e, 30, 4, 773);
    			attr_dev(div, "class", /*responsiveClassName*/ ctx[2]);
    			add_location(div, file$e, 29, 2, 735);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, table);

    			if (default_slot) {
    				default_slot.m(table, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[11], dirty, null, null);
    				}
    			}

    			set_attributes(table, table_data = get_spread_update(table_levels, [
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] }
    			]));

    			if (!current || dirty & /*responsiveClassName*/ 4) {
    				attr_dev(div, "class", /*responsiveClassName*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(29:0) {#if responsive}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$6, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*responsive*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let classes;
    	let responsiveClassName;
    	const omit_props_names = ["class","size","bordered","borderless","striped","dark","hover","responsive"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Table", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { size = "" } = $$props;
    	let { bordered = false } = $$props;
    	let { borderless = false } = $$props;
    	let { striped = false } = $$props;
    	let { dark = false } = $$props;
    	let { hover = false } = $$props;
    	let { responsive = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(4, className = $$new_props.class);
    		if ("size" in $$new_props) $$invalidate(5, size = $$new_props.size);
    		if ("bordered" in $$new_props) $$invalidate(6, bordered = $$new_props.bordered);
    		if ("borderless" in $$new_props) $$invalidate(7, borderless = $$new_props.borderless);
    		if ("striped" in $$new_props) $$invalidate(8, striped = $$new_props.striped);
    		if ("dark" in $$new_props) $$invalidate(9, dark = $$new_props.dark);
    		if ("hover" in $$new_props) $$invalidate(10, hover = $$new_props.hover);
    		if ("responsive" in $$new_props) $$invalidate(0, responsive = $$new_props.responsive);
    		if ("$$scope" in $$new_props) $$invalidate(11, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		size,
    		bordered,
    		borderless,
    		striped,
    		dark,
    		hover,
    		responsive,
    		classes,
    		responsiveClassName
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(4, className = $$new_props.className);
    		if ("size" in $$props) $$invalidate(5, size = $$new_props.size);
    		if ("bordered" in $$props) $$invalidate(6, bordered = $$new_props.bordered);
    		if ("borderless" in $$props) $$invalidate(7, borderless = $$new_props.borderless);
    		if ("striped" in $$props) $$invalidate(8, striped = $$new_props.striped);
    		if ("dark" in $$props) $$invalidate(9, dark = $$new_props.dark);
    		if ("hover" in $$props) $$invalidate(10, hover = $$new_props.hover);
    		if ("responsive" in $$props) $$invalidate(0, responsive = $$new_props.responsive);
    		if ("classes" in $$props) $$invalidate(1, classes = $$new_props.classes);
    		if ("responsiveClassName" in $$props) $$invalidate(2, responsiveClassName = $$new_props.responsiveClassName);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, size, bordered, borderless, striped, dark, hover*/ 2032) {
    			$$invalidate(1, classes = classnames(className, "table", size ? "table-" + size : false, bordered ? "table-bordered" : false, borderless ? "table-borderless" : false, striped ? "table-striped" : false, dark ? "table-dark" : false, hover ? "table-hover" : false));
    		}

    		if ($$self.$$.dirty & /*responsive*/ 1) {
    			$$invalidate(2, responsiveClassName = responsive === true
    			? "table-responsive"
    			: `table-responsive-${responsive}`);
    		}
    	};

    	return [
    		responsive,
    		classes,
    		responsiveClassName,
    		$$restProps,
    		className,
    		size,
    		bordered,
    		borderless,
    		striped,
    		dark,
    		hover,
    		$$scope,
    		slots
    	];
    }

    class Table extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {
    			class: 4,
    			size: 5,
    			bordered: 6,
    			borderless: 7,
    			striped: 8,
    			dark: 9,
    			hover: 10,
    			responsive: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Table",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get class() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bordered() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bordered(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get borderless() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set borderless(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get striped() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set striped(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dark() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dark(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hover() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hover(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get responsive() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set responsive(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\NotFound.svelte generated by Svelte v3.38.0 */
    const file$d = "src\\pages\\NotFound.svelte";

    // (13:12) <Button color="success">
    function create_default_slot$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Volver a la página principal");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(13:12) <Button color=\\\"success\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let main;
    	let tr;
    	let td0;
    	let h1;
    	let t1;
    	let p;
    	let t3;
    	let a;
    	let button;
    	let t4;
    	let td1;
    	let img;
    	let img_src_value;
    	let current;

    	button = new Button({
    			props: {
    				color: "success",
    				$$slots: { default: [create_default_slot$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			tr = element("tr");
    			td0 = element("td");
    			h1 = element("h1");
    			h1.textContent = "404 - Not Found";
    			t1 = space();
    			p = element("p");
    			p.textContent = "La página que está buscando no está disponible";
    			t3 = space();
    			a = element("a");
    			create_component(button.$$.fragment);
    			t4 = space();
    			td1 = element("td");
    			img = element("img");
    			attr_dev(h1, "class", "svelte-108oe62");
    			add_location(h1, file$d, 9, 12, 138);
    			add_location(p, file$d, 10, 12, 176);
    			attr_dev(a, "href", "/");
    			add_location(a, file$d, 11, 12, 243);
    			add_location(td0, file$d, 8, 8, 120);
    			if (img.src !== (img_src_value = "images/notfoundtobot.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "not found image");
    			add_location(img, file$d, 16, 12, 436);
    			add_location(td1, file$d, 14, 8, 359);
    			add_location(tr, file$d, 7, 4, 106);
    			attr_dev(main, "class", "svelte-108oe62");
    			add_location(main, file$d, 6, 4, 94);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, tr);
    			append_dev(tr, td0);
    			append_dev(td0, h1);
    			append_dev(td0, t1);
    			append_dev(td0, p);
    			append_dev(td0, t3);
    			append_dev(td0, a);
    			mount_component(button, a, null);
    			append_dev(tr, t4);
    			append_dev(tr, td1);
    			append_dev(td1, img);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("NotFound", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<NotFound> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Button });
    	return [];
    }

    class NotFound extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NotFound",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src\pages\Home.svelte generated by Svelte v3.38.0 */

    const file$c = "src\\pages\\Home.svelte";

    // (23:6) <Col>
    function create_default_slot_39(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Manuel González Regadera";
    			attr_dev(a, "href", "https://github.com/mangonreg");
    			add_location(a, file$c, 23, 8, 365);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_39.name,
    		type: "slot",
    		source: "(23:6) <Col>",
    		ctx
    	});

    	return block;
    }

    // (26:6) <Col>
    function create_default_slot_38(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Javier Carmona Andrés";
    			attr_dev(a, "href", "https://github.com/JavierCarmona16");
    			add_location(a, file$c, 26, 8, 469);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_38.name,
    		type: "slot",
    		source: "(26:6) <Col>",
    		ctx
    	});

    	return block;
    }

    // (29:6) <Col>
    function create_default_slot_37(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Miguel Gómez Vázquez";
    			attr_dev(a, "href", "https://github.com/migueclon98");
    			add_location(a, file$c, 29, 8, 576);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_37.name,
    		type: "slot",
    		source: "(29:6) <Col>",
    		ctx
    	});

    	return block;
    }

    // (22:4) <Container>
    function create_default_slot_36(ctx) {
    	let col0;
    	let t0;
    	let col1;
    	let t1;
    	let col2;
    	let current;

    	col0 = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_39] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	col1 = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_38] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	col2 = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_37] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col0.$$.fragment);
    			t0 = space();
    			create_component(col1.$$.fragment);
    			t1 = space();
    			create_component(col2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(col1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(col2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col0_changes.$$scope = { dirty, ctx };
    			}

    			col0.$set(col0_changes);
    			const col1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col1_changes.$$scope = { dirty, ctx };
    			}

    			col1.$set(col1_changes);
    			const col2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col2_changes.$$scope = { dirty, ctx };
    			}

    			col2.$set(col2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col0.$$.fragment, local);
    			transition_in(col1.$$.fragment, local);
    			transition_in(col2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col0.$$.fragment, local);
    			transition_out(col1.$$.fragment, local);
    			transition_out(col2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(col1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(col2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_36.name,
    		type: "slot",
    		source: "(22:4) <Container>",
    		ctx
    	});

    	return block;
    }

    // (42:6) <Col>
    function create_default_slot_35(ctx) {
    	let a;
    	let b;
    	let t1;

    	const block = {
    		c: function create() {
    			a = element("a");
    			b = element("b");
    			b.textContent = "Repositorio: ";
    			t1 = text("http://github.com/gti-sos/SOS2021-04");
    			attr_dev(b, "class", "svelte-1c5583h");
    			add_location(b, file$c, 43, 11, 1163);
    			attr_dev(a, "href", "http://github.com/gti-sos/SOS2021-04");
    			add_location(a, file$c, 42, 8, 1104);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, b);
    			append_dev(a, t1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_35.name,
    		type: "slot",
    		source: "(42:6) <Col>",
    		ctx
    	});

    	return block;
    }

    // (47:6) <Col>
    function create_default_slot_34(ctx) {
    	let a;
    	let b;
    	let t1;

    	const block = {
    		c: function create() {
    			a = element("a");
    			b = element("b");
    			b.textContent = "Enlace: ";
    			t1 = text("http://sos2021-04.herokuapp.com");
    			attr_dev(b, "class", "svelte-1c5583h");
    			add_location(b, file$c, 48, 11, 1324);
    			attr_dev(a, "href", "http://sos2021-04.herokuapp.com");
    			add_location(a, file$c, 47, 8, 1270);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, b);
    			append_dev(a, t1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_34.name,
    		type: "slot",
    		source: "(47:6) <Col>",
    		ctx
    	});

    	return block;
    }

    // (41:4) <Container>
    function create_default_slot_33(ctx) {
    	let col0;
    	let t;
    	let col1;
    	let current;

    	col0 = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_35] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	col1 = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_34] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col0.$$.fragment);
    			t = space();
    			create_component(col1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(col1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col0_changes.$$scope = { dirty, ctx };
    			}

    			col0.$set(col0_changes);
    			const col1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col1_changes.$$scope = { dirty, ctx };
    			}

    			col1.$set(col1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col0.$$.fragment, local);
    			transition_in(col1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col0.$$.fragment, local);
    			transition_out(col1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(col1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_33.name,
    		type: "slot",
    		source: "(41:4) <Container>",
    		ctx
    	});

    	return block;
    }

    // (56:6) <Button color="primary">
    function create_default_slot_32(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Info");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_32.name,
    		type: "slot",
    		source: "(56:6) <Button color=\\\"primary\\\">",
    		ctx
    	});

    	return block;
    }

    // (66:12) <CardTitle>
    function create_default_slot_31(ctx) {
    	let h5;

    	const block = {
    		c: function create() {
    			h5 = element("h5");
    			h5.textContent = "Gastos en Educación";
    			add_location(h5, file$c, 65, 23, 1667);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h5, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_31.name,
    		type: "slot",
    		source: "(66:12) <CardTitle>",
    		ctx
    	});

    	return block;
    }

    // (65:10) <CardHeader>
    function create_default_slot_30(ctx) {
    	let cardtitle;
    	let current;

    	cardtitle = new CardTitle({
    			props: {
    				$$slots: { default: [create_default_slot_31] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cardtitle.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cardtitle, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cardtitle_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				cardtitle_changes.$$scope = { dirty, ctx };
    			}

    			cardtitle.$set(cardtitle_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cardtitle.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cardtitle.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cardtitle, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_30.name,
    		type: "slot",
    		source: "(65:10) <CardHeader>",
    		ctx
    	});

    	return block;
    }

    // (70:12) <CardText>
    function create_default_slot_29(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("El Gasto Público en Educación es aquel que destina el Gobierno a instituciones educativas, administración educativa y subsidios para estudiantes\r\n               y otras entidades privadas a lo largo de un año.");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_29.name,
    		type: "slot",
    		source: "(70:12) <CardText>",
    		ctx
    	});

    	return block;
    }

    // (76:14) <Button color="primary">
    function create_default_slot_28(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("API v1");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_28.name,
    		type: "slot",
    		source: "(76:14) <Button color=\\\"primary\\\">",
    		ctx
    	});

    	return block;
    }

    // (78:14) <Button color="primary">
    function create_default_slot_27(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Interfaz");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_27.name,
    		type: "slot",
    		source: "(78:14) <Button color=\\\"primary\\\">",
    		ctx
    	});

    	return block;
    }

    // (81:15) <Button color="info">
    function create_default_slot_26$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Documentación v1");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_26$2.name,
    		type: "slot",
    		source: "(81:15) <Button color=\\\"info\\\">",
    		ctx
    	});

    	return block;
    }

    // (83:16) <Button color="primary">
    function create_default_slot_25$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Graficas");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_25$2.name,
    		type: "slot",
    		source: "(83:16) <Button color=\\\"primary\\\">",
    		ctx
    	});

    	return block;
    }

    // (68:10) <CardBody>
    function create_default_slot_24$3(ctx) {
    	let cardsubtitle;
    	let t0;
    	let cardtext;
    	let t1;
    	let a0;
    	let button0;
    	let t2;
    	let a1;
    	let button1;
    	let t3;
    	let a2;
    	let button2;
    	let t4;
    	let a3;
    	let button3;
    	let current;
    	cardsubtitle = new CardSubtitle({ $$inline: true });

    	cardtext = new CardText({
    			props: {
    				$$slots: { default: [create_default_slot_29] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0 = new Button({
    			props: {
    				color: "primary",
    				$$slots: { default: [create_default_slot_28] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				color: "primary",
    				$$slots: { default: [create_default_slot_27] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2 = new Button({
    			props: {
    				color: "info",
    				$$slots: { default: [create_default_slot_26$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button3 = new Button({
    			props: {
    				color: "primary",
    				$$slots: { default: [create_default_slot_25$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cardsubtitle.$$.fragment);
    			t0 = space();
    			create_component(cardtext.$$.fragment);
    			t1 = space();
    			a0 = element("a");
    			create_component(button0.$$.fragment);
    			t2 = space();
    			a1 = element("a");
    			create_component(button1.$$.fragment);
    			t3 = space();
    			a2 = element("a");
    			create_component(button2.$$.fragment);
    			t4 = space();
    			a3 = element("a");
    			create_component(button3.$$.fragment);
    			attr_dev(a0, "href", "https://sos2021-04.herokuapp.com/api/v1/education_expenditures");
    			add_location(a0, file$c, 74, 12, 2078);
    			attr_dev(a1, "href", "/#/education_expenditures");
    			add_location(a1, file$c, 76, 12, 2224);
    			attr_dev(a2, "href", "https://documenter.getpostman.com/view/14947441/TzJsexSA");
    			add_location(a2, file$c, 79, 12, 2349);
    			attr_dev(a3, "href", "/#/edex_graphs");
    			add_location(a3, file$c, 81, 14, 2498);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cardsubtitle, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(cardtext, target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, a0, anchor);
    			mount_component(button0, a0, null);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, a1, anchor);
    			mount_component(button1, a1, null);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, a2, anchor);
    			mount_component(button2, a2, null);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, a3, anchor);
    			mount_component(button3, a3, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cardtext_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				cardtext_changes.$$scope = { dirty, ctx };
    			}

    			cardtext.$set(cardtext_changes);
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const button2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    			const button3_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button3_changes.$$scope = { dirty, ctx };
    			}

    			button3.$set(button3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cardsubtitle.$$.fragment, local);
    			transition_in(cardtext.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			transition_in(button3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cardsubtitle.$$.fragment, local);
    			transition_out(cardtext.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			transition_out(button3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cardsubtitle, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(cardtext, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(a0);
    			destroy_component(button0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(a1);
    			destroy_component(button1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(a2);
    			destroy_component(button2);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(a3);
    			destroy_component(button3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_24$3.name,
    		type: "slot",
    		source: "(68:10) <CardBody>",
    		ctx
    	});

    	return block;
    }

    // (89:10) <CardFooter              >
    function create_default_slot_23$3(ctx) {
    	let t0;
    	let a;

    	const block = {
    		c: function create() {
    			t0 = text("desarrollado por\r\n            ");
    			a = element("a");
    			a.textContent = "Manuel González Regadera";
    			attr_dev(a, "href", "https://github.com/mangonreg");
    			add_location(a, file$c, 90, 12, 2721);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_23$3.name,
    		type: "slot",
    		source: "(89:10) <CardFooter              >",
    		ctx
    	});

    	return block;
    }

    // (64:8) <Card class="mb-3">
    function create_default_slot_22$3(ctx) {
    	let cardheader;
    	let t0;
    	let cardbody;
    	let t1;
    	let cardfooter;
    	let current;

    	cardheader = new CardHeader({
    			props: {
    				$$slots: { default: [create_default_slot_30] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	cardbody = new CardBody({
    			props: {
    				$$slots: { default: [create_default_slot_24$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	cardfooter = new CardFooter({
    			props: {
    				$$slots: { default: [create_default_slot_23$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cardheader.$$.fragment);
    			t0 = space();
    			create_component(cardbody.$$.fragment);
    			t1 = space();
    			create_component(cardfooter.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cardheader, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(cardbody, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(cardfooter, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cardheader_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				cardheader_changes.$$scope = { dirty, ctx };
    			}

    			cardheader.$set(cardheader_changes);
    			const cardbody_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				cardbody_changes.$$scope = { dirty, ctx };
    			}

    			cardbody.$set(cardbody_changes);
    			const cardfooter_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				cardfooter_changes.$$scope = { dirty, ctx };
    			}

    			cardfooter.$set(cardfooter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cardheader.$$.fragment, local);
    			transition_in(cardbody.$$.fragment, local);
    			transition_in(cardfooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cardheader.$$.fragment, local);
    			transition_out(cardbody.$$.fragment, local);
    			transition_out(cardfooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cardheader, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(cardbody, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(cardfooter, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_22$3.name,
    		type: "slot",
    		source: "(64:8) <Card class=\\\"mb-3\\\">",
    		ctx
    	});

    	return block;
    }

    // (63:6) <Col xs="auto">
    function create_default_slot_21$3(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: {
    				class: "mb-3",
    				$$slots: { default: [create_default_slot_22$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const card_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				card_changes.$$scope = { dirty, ctx };
    			}

    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_21$3.name,
    		type: "slot",
    		source: "(63:6) <Col xs=\\\"auto\\\">",
    		ctx
    	});

    	return block;
    }

    // (99:12) <CardTitle>
    function create_default_slot_20$3(ctx) {
    	let h5;

    	const block = {
    		c: function create() {
    			h5 = element("h5");
    			h5.textContent = "Riegos de pobreza";
    			add_location(h5, file$c, 98, 23, 2947);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h5, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_20$3.name,
    		type: "slot",
    		source: "(99:12) <CardTitle>",
    		ctx
    	});

    	return block;
    }

    // (98:10) <CardHeader>
    function create_default_slot_19$3(ctx) {
    	let cardtitle;
    	let current;

    	cardtitle = new CardTitle({
    			props: {
    				$$slots: { default: [create_default_slot_20$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cardtitle.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cardtitle, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cardtitle_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				cardtitle_changes.$$scope = { dirty, ctx };
    			}

    			cardtitle.$set(cardtitle_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cardtitle.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cardtitle.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cardtitle, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_19$3.name,
    		type: "slot",
    		source: "(98:10) <CardHeader>",
    		ctx
    	});

    	return block;
    }

    // (103:12) <CardText>
    function create_default_slot_18$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("La tasa de riesgo de pobreza es el porcentaje de población\r\n               que se encuentra por debajo del umbral de riesgo de pobreza.\r\n               El umbral de la pobreza, son los ingresos por debajo de los cuales\r\n               se considera que una persona o familia está en riesgo de pobreza.");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_18$3.name,
    		type: "slot",
    		source: "(103:12) <CardText>",
    		ctx
    	});

    	return block;
    }

    // (110:14) <Button color="primary">
    function create_default_slot_17$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("API v1");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_17$3.name,
    		type: "slot",
    		source: "(110:14) <Button color=\\\"primary\\\">",
    		ctx
    	});

    	return block;
    }

    // (113:14) <Button color="primary">
    function create_default_slot_16$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Interfaz");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_16$3.name,
    		type: "slot",
    		source: "(113:14) <Button color=\\\"primary\\\">",
    		ctx
    	});

    	return block;
    }

    // (116:14) <Button color="info">
    function create_default_slot_15$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Documentación v1");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_15$3.name,
    		type: "slot",
    		source: "(116:14) <Button color=\\\"info\\\">",
    		ctx
    	});

    	return block;
    }

    // (101:10) <CardBody>
    function create_default_slot_14$3(ctx) {
    	let cardsubtitle;
    	let t0;
    	let cardtext;
    	let t1;
    	let a0;
    	let button0;
    	let t2;
    	let a1;
    	let button1;
    	let t3;
    	let a2;
    	let button2;
    	let current;
    	cardsubtitle = new CardSubtitle({ $$inline: true });

    	cardtext = new CardText({
    			props: {
    				$$slots: { default: [create_default_slot_18$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0 = new Button({
    			props: {
    				color: "primary",
    				$$slots: { default: [create_default_slot_17$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				color: "primary",
    				$$slots: { default: [create_default_slot_16$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2 = new Button({
    			props: {
    				color: "info",
    				$$slots: { default: [create_default_slot_15$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cardsubtitle.$$.fragment);
    			t0 = space();
    			create_component(cardtext.$$.fragment);
    			t1 = space();
    			a0 = element("a");
    			create_component(button0.$$.fragment);
    			t2 = space();
    			a1 = element("a");
    			create_component(button1.$$.fragment);
    			t3 = space();
    			a2 = element("a");
    			create_component(button2.$$.fragment);
    			attr_dev(a0, "href", "https://sos2021-04.herokuapp.com/api/v1/poverty_risks");
    			add_location(a0, file$c, 108, 12, 3430);
    			attr_dev(a1, "href", "/#/poverty_risks");
    			add_location(a1, file$c, 111, 12, 3581);
    			attr_dev(a2, "href", "https://documenter.getpostman.com/view/14968173/TzJu8we5");
    			add_location(a2, file$c, 114, 12, 3697);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cardsubtitle, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(cardtext, target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, a0, anchor);
    			mount_component(button0, a0, null);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, a1, anchor);
    			mount_component(button1, a1, null);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, a2, anchor);
    			mount_component(button2, a2, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cardtext_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				cardtext_changes.$$scope = { dirty, ctx };
    			}

    			cardtext.$set(cardtext_changes);
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const button2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cardsubtitle.$$.fragment, local);
    			transition_in(cardtext.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cardsubtitle.$$.fragment, local);
    			transition_out(cardtext.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cardsubtitle, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(cardtext, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(a0);
    			destroy_component(button0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(a1);
    			destroy_component(button1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(a2);
    			destroy_component(button2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14$3.name,
    		type: "slot",
    		source: "(101:10) <CardBody>",
    		ctx
    	});

    	return block;
    }

    // (119:10) <CardFooter              >
    function create_default_slot_13$3(ctx) {
    	let t0;
    	let a;

    	const block = {
    		c: function create() {
    			t0 = text("desarrollado por\r\n            ");
    			a = element("a");
    			a.textContent = "Javier Carmona Andrés";
    			attr_dev(a, "href", "https://github.com/JavierCarmona16");
    			add_location(a, file$c, 120, 12, 3935);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13$3.name,
    		type: "slot",
    		source: "(119:10) <CardFooter              >",
    		ctx
    	});

    	return block;
    }

    // (97:8) <Card class="mb-3">
    function create_default_slot_12$3(ctx) {
    	let cardheader;
    	let t0;
    	let cardbody;
    	let t1;
    	let cardfooter;
    	let current;

    	cardheader = new CardHeader({
    			props: {
    				$$slots: { default: [create_default_slot_19$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	cardbody = new CardBody({
    			props: {
    				$$slots: { default: [create_default_slot_14$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	cardfooter = new CardFooter({
    			props: {
    				$$slots: { default: [create_default_slot_13$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cardheader.$$.fragment);
    			t0 = space();
    			create_component(cardbody.$$.fragment);
    			t1 = space();
    			create_component(cardfooter.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cardheader, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(cardbody, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(cardfooter, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cardheader_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				cardheader_changes.$$scope = { dirty, ctx };
    			}

    			cardheader.$set(cardheader_changes);
    			const cardbody_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				cardbody_changes.$$scope = { dirty, ctx };
    			}

    			cardbody.$set(cardbody_changes);
    			const cardfooter_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				cardfooter_changes.$$scope = { dirty, ctx };
    			}

    			cardfooter.$set(cardfooter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cardheader.$$.fragment, local);
    			transition_in(cardbody.$$.fragment, local);
    			transition_in(cardfooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cardheader.$$.fragment, local);
    			transition_out(cardbody.$$.fragment, local);
    			transition_out(cardfooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cardheader, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(cardbody, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(cardfooter, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12$3.name,
    		type: "slot",
    		source: "(97:8) <Card class=\\\"mb-3\\\">",
    		ctx
    	});

    	return block;
    }

    // (96:6) <Col xs="auto">
    function create_default_slot_11$3(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: {
    				class: "mb-3",
    				$$slots: { default: [create_default_slot_12$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const card_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				card_changes.$$scope = { dirty, ctx };
    			}

    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11$3.name,
    		type: "slot",
    		source: "(96:6) <Col xs=\\\"auto\\\">",
    		ctx
    	});

    	return block;
    }

    // (129:12) <CardTitle>
    function create_default_slot_10$3(ctx) {
    	let h5;

    	const block = {
    		c: function create() {
    			h5 = element("h5");
    			h5.textContent = "Analfabetismo";
    			add_location(h5, file$c, 128, 23, 4164);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h5, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10$3.name,
    		type: "slot",
    		source: "(129:12) <CardTitle>",
    		ctx
    	});

    	return block;
    }

    // (128:10) <CardHeader>
    function create_default_slot_9$3(ctx) {
    	let cardtitle;
    	let current;

    	cardtitle = new CardTitle({
    			props: {
    				$$slots: { default: [create_default_slot_10$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cardtitle.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cardtitle, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cardtitle_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				cardtitle_changes.$$scope = { dirty, ctx };
    			}

    			cardtitle.$set(cardtitle_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cardtitle.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cardtitle.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cardtitle, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9$3.name,
    		type: "slot",
    		source: "(128:10) <CardHeader>",
    		ctx
    	});

    	return block;
    }

    // (133:12) <CardText>
    function create_default_slot_8$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Expresa la magnitud relativa de la población analfabeta.");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$3.name,
    		type: "slot",
    		source: "(133:12) <CardText>",
    		ctx
    	});

    	return block;
    }

    // (136:41) <Button color="primary">
    function create_default_slot_7$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("API v1");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$3.name,
    		type: "slot",
    		source: "(136:41) <Button color=\\\"primary\\\">",
    		ctx
    	});

    	return block;
    }

    // (138:36) <Button color="primary">
    function create_default_slot_6$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Interfaz");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$3.name,
    		type: "slot",
    		source: "(138:36) <Button color=\\\"primary\\\">",
    		ctx
    	});

    	return block;
    }

    // (140:79) <Button color="info">
    function create_default_slot_5$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Documentación v1");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$3.name,
    		type: "slot",
    		source: "(140:79) <Button color=\\\"info\\\">",
    		ctx
    	});

    	return block;
    }

    // (131:10) <CardBody>
    function create_default_slot_4$4(ctx) {
    	let cardsubtitle;
    	let t0;
    	let cardtext;
    	let t1;
    	let a0;
    	let button0;
    	let t2;
    	let a1;
    	let button1;
    	let t3;
    	let a2;
    	let button2;
    	let current;
    	cardsubtitle = new CardSubtitle({ $$inline: true });

    	cardtext = new CardText({
    			props: {
    				$$slots: { default: [create_default_slot_8$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0 = new Button({
    			props: {
    				color: "primary",
    				$$slots: { default: [create_default_slot_7$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				color: "primary",
    				$$slots: { default: [create_default_slot_6$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2 = new Button({
    			props: {
    				color: "info",
    				$$slots: { default: [create_default_slot_5$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cardsubtitle.$$.fragment);
    			t0 = space();
    			create_component(cardtext.$$.fragment);
    			t1 = space();
    			a0 = element("a");
    			create_component(button0.$$.fragment);
    			t2 = space();
    			a1 = element("a");
    			create_component(button1.$$.fragment);
    			t3 = space();
    			a2 = element("a");
    			create_component(button2.$$.fragment);
    			attr_dev(a0, "href", "/api/v1/illiteracy");
    			add_location(a0, file$c, 135, 12, 4410);
    			attr_dev(a1, "href", "/#/illiteracy");
    			add_location(a1, file$c, 137, 12, 4498);
    			attr_dev(a2, "href", "https://documenter.getpostman.com/view/14948423/TzJsfJT1");
    			add_location(a2, file$c, 139, 12, 4583);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cardsubtitle, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(cardtext, target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, a0, anchor);
    			mount_component(button0, a0, null);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, a1, anchor);
    			mount_component(button1, a1, null);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, a2, anchor);
    			mount_component(button2, a2, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cardtext_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				cardtext_changes.$$scope = { dirty, ctx };
    			}

    			cardtext.$set(cardtext_changes);
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const button2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cardsubtitle.$$.fragment, local);
    			transition_in(cardtext.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cardsubtitle.$$.fragment, local);
    			transition_out(cardtext.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cardsubtitle, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(cardtext, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(a0);
    			destroy_component(button0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(a1);
    			destroy_component(button1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(a2);
    			destroy_component(button2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$4.name,
    		type: "slot",
    		source: "(131:10) <CardBody>",
    		ctx
    	});

    	return block;
    }

    // (142:10) <CardFooter              >
    function create_default_slot_3$4(ctx) {
    	let t0;
    	let a;

    	const block = {
    		c: function create() {
    			t0 = text("Desarrollado por\r\n            ");
    			a = element("a");
    			a.textContent = "Miguel Gómez Vázquez";
    			attr_dev(a, "href", "https://github.com/migueclon98");
    			add_location(a, file$c, 143, 12, 4791);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$4.name,
    		type: "slot",
    		source: "(142:10) <CardFooter              >",
    		ctx
    	});

    	return block;
    }

    // (127:8) <Card class="mb-3">
    function create_default_slot_2$5(ctx) {
    	let cardheader;
    	let t0;
    	let cardbody;
    	let t1;
    	let cardfooter;
    	let current;

    	cardheader = new CardHeader({
    			props: {
    				$$slots: { default: [create_default_slot_9$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	cardbody = new CardBody({
    			props: {
    				$$slots: { default: [create_default_slot_4$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	cardfooter = new CardFooter({
    			props: {
    				$$slots: { default: [create_default_slot_3$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cardheader.$$.fragment);
    			t0 = space();
    			create_component(cardbody.$$.fragment);
    			t1 = space();
    			create_component(cardfooter.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cardheader, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(cardbody, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(cardfooter, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cardheader_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				cardheader_changes.$$scope = { dirty, ctx };
    			}

    			cardheader.$set(cardheader_changes);
    			const cardbody_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				cardbody_changes.$$scope = { dirty, ctx };
    			}

    			cardbody.$set(cardbody_changes);
    			const cardfooter_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				cardfooter_changes.$$scope = { dirty, ctx };
    			}

    			cardfooter.$set(cardfooter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cardheader.$$.fragment, local);
    			transition_in(cardbody.$$.fragment, local);
    			transition_in(cardfooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cardheader.$$.fragment, local);
    			transition_out(cardbody.$$.fragment, local);
    			transition_out(cardfooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cardheader, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(cardbody, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(cardfooter, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$5.name,
    		type: "slot",
    		source: "(127:8) <Card class=\\\"mb-3\\\">",
    		ctx
    	});

    	return block;
    }

    // (126:6) <Col xs="auto">
    function create_default_slot_1$6(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: {
    				class: "mb-3",
    				$$slots: { default: [create_default_slot_2$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const card_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				card_changes.$$scope = { dirty, ctx };
    			}

    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$6.name,
    		type: "slot",
    		source: "(126:6) <Col xs=\\\"auto\\\">",
    		ctx
    	});

    	return block;
    }

    // (62:4) <Container>
    function create_default_slot$6(ctx) {
    	let col0;
    	let t0;
    	let col1;
    	let t1;
    	let col2;
    	let current;

    	col0 = new Col({
    			props: {
    				xs: "auto",
    				$$slots: { default: [create_default_slot_21$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	col1 = new Col({
    			props: {
    				xs: "auto",
    				$$slots: { default: [create_default_slot_11$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	col2 = new Col({
    			props: {
    				xs: "auto",
    				$$slots: { default: [create_default_slot_1$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col0.$$.fragment);
    			t0 = space();
    			create_component(col1.$$.fragment);
    			t1 = space();
    			create_component(col2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(col1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(col2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col0_changes.$$scope = { dirty, ctx };
    			}

    			col0.$set(col0_changes);
    			const col1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col1_changes.$$scope = { dirty, ctx };
    			}

    			col1.$set(col1_changes);
    			const col2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col2_changes.$$scope = { dirty, ctx };
    			}

    			col2.$set(col2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col0.$$.fragment, local);
    			transition_in(col1.$$.fragment, local);
    			transition_in(col2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col0.$$.fragment, local);
    			transition_out(col1.$$.fragment, local);
    			transition_out(col2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(col1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(col2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(62:4) <Container>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let main;
    	let h1;
    	let t1;
    	let h20;
    	let t3;
    	let container0;
    	let t4;
    	let p0;
    	let t5;
    	let h21;
    	let t7;
    	let p1;
    	let t9;
    	let container1;
    	let t10;
    	let p2;
    	let t11;
    	let a;
    	let button;
    	let t12;
    	let p3;
    	let t13;
    	let h22;
    	let t15;
    	let container2;
    	let current;

    	container0 = new Container({
    			props: {
    				$$slots: { default: [create_default_slot_36] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	container1 = new Container({
    			props: {
    				$$slots: { default: [create_default_slot_33] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button = new Button({
    			props: {
    				color: "primary",
    				$$slots: { default: [create_default_slot_32] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	container2 = new Container({
    			props: {
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "SOS2021-04";
    			t1 = space();
    			h20 = element("h2");
    			h20.textContent = "Componentes";
    			t3 = space();
    			create_component(container0.$$.fragment);
    			t4 = space();
    			p0 = element("p");
    			t5 = space();
    			h21 = element("h2");
    			h21.textContent = "Descripción del proyecto";
    			t7 = space();
    			p1 = element("p");
    			p1.textContent = "Relación entre tasa de alfabetización, gasto público en educación e índice de pobreza en diversos países por años\r\n        ¿Podría un incremento del gasto educativo de un país reducir los índices de analfabetismo de su población? ¿Existe\r\n        una relación directa entre la pobreza y la falta de estudios?";
    			t9 = space();
    			create_component(container1.$$.fragment);
    			t10 = space();
    			p2 = element("p");
    			t11 = space();
    			a = element("a");
    			create_component(button.$$.fragment);
    			t12 = space();
    			p3 = element("p");
    			t13 = space();
    			h22 = element("h2");
    			h22.textContent = "API's";
    			t15 = space();
    			create_component(container2.$$.fragment);
    			attr_dev(h1, "class", "svelte-1c5583h");
    			add_location(h1, file$c, 18, 4, 276);
    			add_location(h20, file$c, 20, 4, 305);
    			add_location(p0, file$c, 32, 4, 679);
    			add_location(h21, file$c, 33, 4, 690);
    			add_location(p1, file$c, 34, 4, 729);
    			add_location(p2, file$c, 52, 4, 1422);
    			attr_dev(a, "href", "/#/info");
    			add_location(a, file$c, 54, 4, 1437);
    			add_location(p3, file$c, 58, 4, 1520);
    			add_location(h22, file$c, 60, 4, 1535);
    			attr_dev(main, "class", "svelte-1c5583h");
    			add_location(main, file$c, 17, 2, 264);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t1);
    			append_dev(main, h20);
    			append_dev(main, t3);
    			mount_component(container0, main, null);
    			append_dev(main, t4);
    			append_dev(main, p0);
    			append_dev(main, t5);
    			append_dev(main, h21);
    			append_dev(main, t7);
    			append_dev(main, p1);
    			append_dev(main, t9);
    			mount_component(container1, main, null);
    			append_dev(main, t10);
    			append_dev(main, p2);
    			append_dev(main, t11);
    			append_dev(main, a);
    			mount_component(button, a, null);
    			append_dev(main, t12);
    			append_dev(main, p3);
    			append_dev(main, t13);
    			append_dev(main, h22);
    			append_dev(main, t15);
    			mount_component(container2, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const container0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				container0_changes.$$scope = { dirty, ctx };
    			}

    			container0.$set(container0_changes);
    			const container1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				container1_changes.$$scope = { dirty, ctx };
    			}

    			container1.$set(container1_changes);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    			const container2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				container2_changes.$$scope = { dirty, ctx };
    			}

    			container2.$set(container2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container0.$$.fragment, local);
    			transition_in(container1.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			transition_in(container2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container0.$$.fragment, local);
    			transition_out(container1.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			transition_out(container2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(container0);
    			destroy_component(container1);
    			destroy_component(button);
    			destroy_component(container2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Home", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Button,
    		Icon,
    		Card,
    		CardBody,
    		CardFooter,
    		CardHeader,
    		CardSubtitle,
    		CardText,
    		CardTitle,
    		Col,
    		Container,
    		Row
    	});

    	return [];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src\pages\Info.svelte generated by Svelte v3.38.0 */

    const file$b = "src\\pages\\Info.svelte";

    function create_fragment$b(ctx) {
    	let main;
    	let h2;
    	let t1;
    	let u0;
    	let b0;
    	let h30;
    	let t3;
    	let a0;
    	let br0;
    	let t5;
    	let a1;
    	let br1;
    	let t7;
    	let a2;
    	let br2;
    	let t9;
    	let u1;
    	let b1;
    	let h31;
    	let t11;
    	let em0;
    	let t13;
    	let br3;
    	let t14;
    	let b2;
    	let em1;
    	let a3;
    	let t17;
    	let br4;
    	let t18;
    	let b3;
    	let em2;
    	let a4;
    	let t21;
    	let br5;
    	let t22;
    	let u2;
    	let b4;
    	let h32;
    	let t24;
    	let a5;
    	let t26;
    	let a6;
    	let br6;
    	let t28;
    	let a7;
    	let t30;
    	let a8;
    	let br7;
    	let t32;
    	let a9;
    	let t34;
    	let a10;
    	let t36;
    	let u3;
    	let b5;
    	let h33;
    	let t38;
    	let a11;
    	let t40;
    	let a12;
    	let br8;
    	let t42;
    	let a13;
    	let t44;
    	let a14;
    	let br9;
    	let t46;
    	let a15;
    	let t48;
    	let a16;
    	let t50;
    	let br10;
    	let t51;
    	let u4;
    	let b6;
    	let h34;
    	let t53;
    	let a17;
    	let t55;
    	let a18;
    	let br11;
    	let t57;
    	let a19;
    	let t59;
    	let a20;
    	let br12;
    	let t61;
    	let a21;
    	let t63;
    	let a22;

    	const block = {
    		c: function create() {
    			main = element("main");
    			h2 = element("h2");
    			h2.textContent = "SOS2021-04";
    			t1 = space();
    			u0 = element("u");
    			b0 = element("b");
    			h30 = element("h3");
    			h30.textContent = "Componentes";
    			t3 = text("\r\n\t\t\r\n\t\t·");
    			a0 = element("a");
    			a0.textContent = "Manuel González Regadera - education_expenditures";
    			br0 = element("br");
    			t5 = text("\r\n\t\t·");
    			a1 = element("a");
    			a1.textContent = "Javier Carmona Andrés - poverty_risks";
    			br1 = element("br");
    			t7 = text("\r\n\t\t·");
    			a2 = element("a");
    			a2.textContent = "Miguel Gómez Vázquez - illiteracy";
    			br2 = element("br");
    			t9 = space();
    			u1 = element("u");
    			b1 = element("b");
    			h31 = element("h3");
    			h31.textContent = "Descripción del proyecto";
    			t11 = space();
    			em0 = element("em");
    			em0.textContent = "Relación entre tasa de alfabetización, gasto público en educación e índice de pobreza en diversos países por años ¿Podría un incremento\r\n\t\tdel gasto educativo de un país reducir los índices de analfabetismo de su población? ¿Existe una relación directa entre la pobreza y la falta de estudios?";
    			t13 = space();
    			br3 = element("br");
    			t14 = space();
    			b2 = element("b");
    			em1 = element("em");
    			em1.textContent = "Repositorio:";
    			a3 = element("a");
    			a3.textContent = "gti-sos/SOS2021-04";
    			t17 = space();
    			br4 = element("br");
    			t18 = space();
    			b3 = element("b");
    			em2 = element("em");
    			em2.textContent = "URL HerokuApp:";
    			a4 = element("a");
    			a4.textContent = "http://sos2021-04.herokuapp.com";
    			t21 = space();
    			br5 = element("br");
    			t22 = space();
    			u2 = element("u");
    			b4 = element("b");
    			h32 = element("h3");
    			h32.textContent = "API'S";
    			t24 = text("\r\n\r\n\t\t·");
    			a5 = element("a");
    			a5.textContent = "Manuel González Regadera";
    			t26 = text(" : ");
    			a6 = element("a");
    			a6.textContent = "http://sos2021-04.herokuapp.com/api/v1/education_expenditures";
    			br6 = element("br");
    			t28 = text("\r\n\t\t·");
    			a7 = element("a");
    			a7.textContent = "Javier Carmona Andrés";
    			t30 = text(" : ");
    			a8 = element("a");
    			a8.textContent = "http://sos2021-04.herokuapp.com/api/v1/poverty_risks ";
    			br7 = element("br");
    			t32 = text("\r\n\t\t·");
    			a9 = element("a");
    			a9.textContent = "Miguel Gómez Vázquez";
    			t34 = text(" : ");
    			a10 = element("a");
    			a10.textContent = "http://sos2021-04.herokuapp.com/api/v1/illiteracy";
    			t36 = space();
    			u3 = element("u");
    			b5 = element("b");
    			h33 = element("h3");
    			h33.textContent = "Front-End";
    			t38 = text("\r\n\r\n\t\t·");
    			a11 = element("a");
    			a11.textContent = "Manuel González Regadera";
    			t40 = text(" : ");
    			a12 = element("a");
    			a12.textContent = "Education Expenditures";
    			br8 = element("br");
    			t42 = text("\r\n\t\t·");
    			a13 = element("a");
    			a13.textContent = "Javier Carmona Andrés";
    			t44 = text(" : ");
    			a14 = element("a");
    			a14.textContent = "Poverty Risks ";
    			br9 = element("br");
    			t46 = text("\r\n\t\t·");
    			a15 = element("a");
    			a15.textContent = "Miguel Gómez Vázquez";
    			t48 = text(" : ");
    			a16 = element("a");
    			a16.textContent = "Illiteracy";
    			t50 = space();
    			br10 = element("br");
    			t51 = space();
    			u4 = element("u");
    			b6 = element("b");
    			h34 = element("h3");
    			h34.textContent = "Documentacion";
    			t53 = text("\r\n\r\n\t\t·");
    			a17 = element("a");
    			a17.textContent = "Manuel González Regadera";
    			t55 = text(" : ");
    			a18 = element("a");
    			a18.textContent = "https://documenter.getpostman.com/view/14947441/TzJsexSA";
    			br11 = element("br");
    			t57 = text("\r\n\t\t·");
    			a19 = element("a");
    			a19.textContent = "Javier Carmona Andrés";
    			t59 = text(" : ");
    			a20 = element("a");
    			a20.textContent = "https://documenter.getpostman.com/view/14968173/TzJu8we5 ";
    			br12 = element("br");
    			t61 = text("\r\n\t\t·");
    			a21 = element("a");
    			a21.textContent = "Miguel Gómez Vázquez";
    			t63 = text(" : ");
    			a22 = element("a");
    			a22.textContent = "https://documenter.getpostman.com/view/14948423/TzJx7vsm";
    			add_location(h2, file$b, 5, 2, 39);
    			add_location(h30, file$b, 7, 8, 72);
    			add_location(b0, file$b, 7, 5, 69);
    			add_location(u0, file$b, 7, 2, 66);
    			attr_dev(a0, "href", "https://github.com/mangonreg");
    			add_location(a0, file$b, 9, 3, 109);
    			add_location(br0, file$b, 9, 95, 201);
    			attr_dev(a1, "href", "https://github.com/JavierCarmona16");
    			add_location(a1, file$b, 10, 3, 210);
    			add_location(br1, file$b, 10, 89, 296);
    			attr_dev(a2, "href", "https://github.com/migueclon98");
    			add_location(a2, file$b, 11, 3, 305);
    			add_location(br2, file$b, 11, 81, 383);
    			add_location(h31, file$b, 13, 8, 401);
    			add_location(b1, file$b, 13, 5, 398);
    			add_location(u1, file$b, 13, 2, 395);
    			add_location(em0, file$b, 14, 2, 446);
    			add_location(br3, file$b, 16, 2, 752);
    			add_location(em1, file$b, 18, 5, 767);
    			add_location(b2, file$b, 18, 2, 764);
    			attr_dev(a3, "href", "https://github.com/gti-sos/SOS2021-04");
    			add_location(a3, file$b, 18, 30, 792);
    			add_location(br4, file$b, 19, 2, 866);
    			add_location(em2, file$b, 21, 5, 879);
    			add_location(b3, file$b, 21, 2, 876);
    			attr_dev(a4, "href", "http://sos2021-04.herokuapp.com");
    			add_location(a4, file$b, 21, 32, 906);
    			add_location(br5, file$b, 22, 2, 987);
    			add_location(h32, file$b, 24, 8, 1005);
    			add_location(b4, file$b, 24, 5, 1002);
    			add_location(u2, file$b, 24, 2, 999);
    			attr_dev(a5, "href", "https://github.com/mangonreg");
    			add_location(a5, file$b, 26, 3, 1034);
    			attr_dev(a6, "href", "http://sos2021-04.herokuapp.com/api/v1/education_expenditures");
    			add_location(a6, file$b, 26, 73, 1104);
    			add_location(br6, file$b, 26, 210, 1241);
    			attr_dev(a7, "href", "https://github.com/JavierCarmona1");
    			add_location(a7, file$b, 27, 3, 1250);
    			attr_dev(a8, "href", "http://sos2021-04.herokuapp.com/api/v1/poverty_risks");
    			add_location(a8, file$b, 27, 75, 1322);
    			add_location(br7, file$b, 27, 195, 1442);
    			attr_dev(a9, "href", "https://github.com/migueclon98");
    			add_location(a9, file$b, 28, 3, 1451);
    			attr_dev(a10, "href", "http://sos2021-04.herokuapp.com/api/v1/illiteracy");
    			add_location(a10, file$b, 28, 71, 1519);
    			add_location(h33, file$b, 30, 8, 1646);
    			add_location(b5, file$b, 30, 5, 1643);
    			add_location(u3, file$b, 30, 2, 1640);
    			attr_dev(a11, "href", "https://github.com/mangonreg");
    			add_location(a11, file$b, 32, 3, 1679);
    			attr_dev(a12, "href", "/#/education_expenditures");
    			add_location(a12, file$b, 32, 73, 1749);
    			add_location(br8, file$b, 32, 135, 1811);
    			attr_dev(a13, "href", "https://github.com/JavierCarmona1");
    			add_location(a13, file$b, 33, 3, 1820);
    			attr_dev(a14, "href", "/#/poverty_risks");
    			add_location(a14, file$b, 33, 75, 1892);
    			add_location(br9, file$b, 33, 120, 1937);
    			attr_dev(a15, "href", "https://github.com/migueclon98");
    			add_location(a15, file$b, 34, 3, 1946);
    			attr_dev(a16, "href", "/#/illiteracy");
    			add_location(a16, file$b, 34, 71, 2014);
    			add_location(br10, file$b, 36, 2, 2060);
    			add_location(h34, file$b, 38, 8, 2076);
    			add_location(b6, file$b, 38, 5, 2073);
    			add_location(u4, file$b, 38, 2, 2070);
    			attr_dev(a17, "href", "https://github.com/mangonreg");
    			add_location(a17, file$b, 40, 3, 2113);
    			attr_dev(a18, "href", "https://documenter.getpostman.com/view/14947441/TzJsexSA");
    			add_location(a18, file$b, 40, 73, 2183);
    			add_location(br11, file$b, 40, 200, 2310);
    			attr_dev(a19, "href", "https://github.com/JavierCarmona1");
    			add_location(a19, file$b, 41, 3, 2319);
    			attr_dev(a20, "href", "https://documenter.getpostman.com/view/14968173/TzJu8we5");
    			add_location(a20, file$b, 41, 75, 2391);
    			add_location(br12, file$b, 41, 203, 2519);
    			attr_dev(a21, "href", "https://github.com/migueclon98");
    			add_location(a21, file$b, 42, 3, 2528);
    			attr_dev(a22, "href", "https://documenter.getpostman.com/view/14948423/TzJx7vsm");
    			add_location(a22, file$b, 42, 71, 2596);
    			add_location(main, file$b, 3, 0, 23);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h2);
    			append_dev(main, t1);
    			append_dev(main, u0);
    			append_dev(u0, b0);
    			append_dev(b0, h30);
    			append_dev(main, t3);
    			append_dev(main, a0);
    			append_dev(main, br0);
    			append_dev(main, t5);
    			append_dev(main, a1);
    			append_dev(main, br1);
    			append_dev(main, t7);
    			append_dev(main, a2);
    			append_dev(main, br2);
    			append_dev(main, t9);
    			append_dev(main, u1);
    			append_dev(u1, b1);
    			append_dev(b1, h31);
    			append_dev(main, t11);
    			append_dev(main, em0);
    			append_dev(main, t13);
    			append_dev(main, br3);
    			append_dev(main, t14);
    			append_dev(main, b2);
    			append_dev(b2, em1);
    			append_dev(main, a3);
    			append_dev(main, t17);
    			append_dev(main, br4);
    			append_dev(main, t18);
    			append_dev(main, b3);
    			append_dev(b3, em2);
    			append_dev(main, a4);
    			append_dev(main, t21);
    			append_dev(main, br5);
    			append_dev(main, t22);
    			append_dev(main, u2);
    			append_dev(u2, b4);
    			append_dev(b4, h32);
    			append_dev(main, t24);
    			append_dev(main, a5);
    			append_dev(main, t26);
    			append_dev(main, a6);
    			append_dev(main, br6);
    			append_dev(main, t28);
    			append_dev(main, a7);
    			append_dev(main, t30);
    			append_dev(main, a8);
    			append_dev(main, br7);
    			append_dev(main, t32);
    			append_dev(main, a9);
    			append_dev(main, t34);
    			append_dev(main, a10);
    			append_dev(main, t36);
    			append_dev(main, u3);
    			append_dev(u3, b5);
    			append_dev(b5, h33);
    			append_dev(main, t38);
    			append_dev(main, a11);
    			append_dev(main, t40);
    			append_dev(main, a12);
    			append_dev(main, br8);
    			append_dev(main, t42);
    			append_dev(main, a13);
    			append_dev(main, t44);
    			append_dev(main, a14);
    			append_dev(main, br9);
    			append_dev(main, t46);
    			append_dev(main, a15);
    			append_dev(main, t48);
    			append_dev(main, a16);
    			append_dev(main, t50);
    			append_dev(main, br10);
    			append_dev(main, t51);
    			append_dev(main, u4);
    			append_dev(u4, b6);
    			append_dev(b6, h34);
    			append_dev(main, t53);
    			append_dev(main, a17);
    			append_dev(main, t55);
    			append_dev(main, a18);
    			append_dev(main, br11);
    			append_dev(main, t57);
    			append_dev(main, a19);
    			append_dev(main, t59);
    			append_dev(main, a20);
    			append_dev(main, br12);
    			append_dev(main, t61);
    			append_dev(main, a21);
    			append_dev(main, t63);
    			append_dev(main, a22);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Info", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Info> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Info extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Info",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\front\education_expenditures\Edex_Table.svelte generated by Svelte v3.38.0 */

    const { Object: Object_1$2, console: console_1$6 } = globals;
    const file$a = "src\\front\\education_expenditures\\Edex_Table.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[62] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[62] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[67] = list[i];
    	return child_ctx;
    }

    // (406:20) {:else}
    function create_else_block$2(ctx) {
    	let button0;
    	let t;
    	let button1;
    	let current;

    	button0 = new Button({
    			props: {
    				style: "background-color: green;",
    				$$slots: { default: [create_default_slot_26$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*loadInitialData*/ ctx[9]);

    	button1 = new Button({
    			props: {
    				style: "background-color: red;",
    				disabled: true,
    				$$slots: { default: [create_default_slot_25$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(button0.$$.fragment);
    			t = space();
    			create_component(button1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(button1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button0_changes = {};

    			if (dirty[2] & /*$$scope*/ 256) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[2] & /*$$scope*/ 256) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(button1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(406:20) {:else}",
    		ctx
    	});

    	return block;
    }

    // (403:20) {#if edex_data.length!=0}
    function create_if_block_5$2(ctx) {
    	let button0;
    	let t;
    	let button1;
    	let current;

    	button0 = new Button({
    			props: {
    				style: "background-color: green;",
    				disabled: true,
    				$$slots: { default: [create_default_slot_24$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				style: "background-color: red;",
    				$$slots: { default: [create_default_slot_23$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*deleteAll*/ ctx[10]);

    	const block = {
    		c: function create() {
    			create_component(button0.$$.fragment);
    			t = space();
    			create_component(button1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(button1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button0_changes = {};

    			if (dirty[2] & /*$$scope*/ 256) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[2] & /*$$scope*/ 256) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(button1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$2.name,
    		type: "if",
    		source: "(403:20) {#if edex_data.length!=0}",
    		ctx
    	});

    	return block;
    }

    // (407:20) <Button style="background-color: green;" on:click = {loadInitialData}>
    function create_default_slot_26$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cargar datos");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_26$1.name,
    		type: "slot",
    		source: "(407:20) <Button style=\\\"background-color: green;\\\" on:click = {loadInitialData}>",
    		ctx
    	});

    	return block;
    }

    // (408:20) <Button style="background-color: red;" disabled>
    function create_default_slot_25$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar datos");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_25$1.name,
    		type: "slot",
    		source: "(408:20) <Button style=\\\"background-color: red;\\\" disabled>",
    		ctx
    	});

    	return block;
    }

    // (404:20) <Button style="background-color: green;" disabled>
    function create_default_slot_24$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cargar datos");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_24$2.name,
    		type: "slot",
    		source: "(404:20) <Button style=\\\"background-color: green;\\\" disabled>",
    		ctx
    	});

    	return block;
    }

    // (405:20) <Button style="background-color: red;" on:click = {deleteAll}>
    function create_default_slot_23$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar datos");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_23$2.name,
    		type: "slot",
    		source: "(405:20) <Button style=\\\"background-color: red;\\\" on:click = {deleteAll}>",
    		ctx
    	});

    	return block;
    }

    // (402:16) <Col>
    function create_default_slot_22$2(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_5$2, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*edex_data*/ ctx[8].length != 0) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_22$2.name,
    		type: "slot",
    		source: "(402:16) <Col>",
    		ctx
    	});

    	return block;
    }

    // (401:12) <Row>
    function create_default_slot_21$2(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_22$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col_changes = {};

    			if (dirty[0] & /*edex_data*/ 256 | dirty[2] & /*$$scope*/ 256) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_21$2.name,
    		type: "slot",
    		source: "(401:12) <Row>",
    		ctx
    	});

    	return block;
    }

    // (418:56) 
    function create_if_block_4$2(ctx) {
    	let p;
    	let b;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			b = element("b");
    			t = text(/*mensajeCorrecto*/ ctx[7]);
    			add_location(b, file$a, 418, 47, 13271);
    			attr_dev(p, "class", "mensajeCorrecto svelte-17je5wt");
    			add_location(p, file$a, 418, 20, 13244);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, b);
    			append_dev(b, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*mensajeCorrecto*/ 128) set_data_dev(t, /*mensajeCorrecto*/ ctx[7]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$2.name,
    		type: "if",
    		source: "(418:56) ",
    		ctx
    	});

    	return block;
    }

    // (416:20) {#if mensajeError.length!=0}
    function create_if_block_3$2(ctx) {
    	let p;
    	let t0;
    	let b;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Se ha producido un error:");
    			b = element("b");
    			t1 = text(/*mensajeError*/ ctx[6]);
    			add_location(b, file$a, 416, 69, 13137);
    			attr_dev(p, "class", "mensajeError svelte-17je5wt");
    			add_location(p, file$a, 416, 20, 13088);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, b);
    			append_dev(b, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*mensajeError*/ 64) set_data_dev(t1, /*mensajeError*/ ctx[6]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(416:20) {#if mensajeError.length!=0}",
    		ctx
    	});

    	return block;
    }

    // (415:16) <Col md=4 style="text-align: center;">
    function create_default_slot_20$2(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*mensajeError*/ ctx[6].length != 0) return create_if_block_3$2;
    		if (/*mensajeCorrecto*/ ctx[7].length != 0) return create_if_block_4$2;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) {
    				if_block.d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_20$2.name,
    		type: "slot",
    		source: "(415:16) <Col md=4 style=\\\"text-align: center;\\\">",
    		ctx
    	});

    	return block;
    }

    // (412:12) <Row>
    function create_default_slot_19$2(ctx) {
    	let col0;
    	let t0;
    	let col1;
    	let t1;
    	let col2;
    	let current;
    	col0 = new Col({ props: { md: "4" }, $$inline: true });

    	col1 = new Col({
    			props: {
    				md: "4",
    				style: "text-align: center;",
    				$$slots: { default: [create_default_slot_20$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	col2 = new Col({ props: { md: "4" }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(col0.$$.fragment);
    			t0 = space();
    			create_component(col1.$$.fragment);
    			t1 = space();
    			create_component(col2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(col1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(col2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col1_changes = {};

    			if (dirty[0] & /*mensajeError, mensajeCorrecto*/ 192 | dirty[2] & /*$$scope*/ 256) {
    				col1_changes.$$scope = { dirty, ctx };
    			}

    			col1.$set(col1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col0.$$.fragment, local);
    			transition_in(col1.$$.fragment, local);
    			transition_in(col2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col0.$$.fragment, local);
    			transition_out(col1.$$.fragment, local);
    			transition_out(col2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(col1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(col2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_19$2.name,
    		type: "slot",
    		source: "(412:12) <Row>",
    		ctx
    	});

    	return block;
    }

    // (435:6) {#if edex_data.length> 1}
    function create_if_block_2$3(ctx) {
    	let table0;
    	let t0;
    	let table1;
    	let t1;
    	let div;
    	let pagination;
    	let current;

    	table0 = new Table({
    			props: {
    				$$slots: { default: [create_default_slot_18$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table1 = new Table({
    			props: {
    				$$slots: { default: [create_default_slot_17$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	pagination = new Pagination({
    			props: {
    				ariaLabel: "Web pagination",
    				$$slots: { default: [create_default_slot_12$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table0.$$.fragment);
    			t0 = space();
    			create_component(table1.$$.fragment);
    			t1 = space();
    			div = element("div");
    			create_component(pagination.$$.fragment);
    			add_location(div, file$a, 555, 8, 19527);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(table1, target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(pagination, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table0_changes = {};

    			if (dirty[0] & /*query*/ 32 | dirty[2] & /*$$scope*/ 256) {
    				table0_changes.$$scope = { dirty, ctx };
    			}

    			table0.$set(table0_changes);
    			const table1_changes = {};

    			if (dirty[0] & /*edex_data, nuevoElemento*/ 272 | dirty[2] & /*$$scope*/ 256) {
    				table1_changes.$$scope = { dirty, ctx };
    			}

    			table1.$set(table1_changes);
    			const pagination_changes = {};

    			if (dirty[0] & /*pagina_actual, ultima_pagina, offset_actual, esBusqueda*/ 15 | dirty[2] & /*$$scope*/ 256) {
    				pagination_changes.$$scope = { dirty, ctx };
    			}

    			pagination.$set(pagination_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table0.$$.fragment, local);
    			transition_in(table1.$$.fragment, local);
    			transition_in(pagination.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table0.$$.fragment, local);
    			transition_out(table1.$$.fragment, local);
    			transition_out(pagination.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(table1, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			destroy_component(pagination);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(435:6) {#if edex_data.length> 1}",
    		ctx
    	});

    	return block;
    }

    // (436:8) <Table>
    function create_default_slot_18$2(ctx) {
    	let thead;
    	let tr0;
    	let td0;
    	let t0;
    	let td1;
    	let t1;
    	let td2;
    	let t2;
    	let td3;
    	let h3;
    	let t4;
    	let td4;
    	let t5;
    	let td5;
    	let t6;
    	let td6;
    	let t7;
    	let tr1;
    	let td7;
    	let t9;
    	let td8;
    	let t11;
    	let td9;
    	let t13;
    	let td10;
    	let t15;
    	let td11;
    	let t17;
    	let td12;
    	let t19;
    	let td13;
    	let t21;
    	let tbody;
    	let tr2;
    	let td14;
    	let input0;
    	let t22;
    	let td15;
    	let input1;
    	let t23;
    	let td16;
    	let input2;
    	let t24;
    	let input3;
    	let t25;
    	let td17;
    	let input4;
    	let t26;
    	let input5;
    	let t27;
    	let td18;
    	let input6;
    	let t28;
    	let input7;
    	let t29;
    	let td19;
    	let div;
    	let input8;
    	let t30;
    	let input9;
    	let t31;
    	let td20;
    	let button0;
    	let t33;
    	let td21;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			td0 = element("td");
    			t0 = space();
    			td1 = element("td");
    			t1 = space();
    			td2 = element("td");
    			t2 = space();
    			td3 = element("td");
    			h3 = element("h3");
    			h3.textContent = "Busqueda";
    			t4 = space();
    			td4 = element("td");
    			t5 = space();
    			td5 = element("td");
    			t6 = space();
    			td6 = element("td");
    			t7 = space();
    			tr1 = element("tr");
    			td7 = element("td");
    			td7.textContent = "Año";
    			t9 = space();
    			td8 = element("td");
    			td8.textContent = "País";
    			t11 = space();
    			td9 = element("td");
    			td9.textContent = "Gasto en millones de euros";
    			t13 = space();
    			td10 = element("td");
    			td10.textContent = "Porcentaje del gasto público";
    			t15 = space();
    			td11 = element("td");
    			td11.textContent = "Porcentaje del PIB";
    			t17 = space();
    			td12 = element("td");
    			td12.textContent = "Gasto per capita";
    			t19 = space();
    			td13 = element("td");
    			td13.textContent = "Acciones";
    			t21 = space();
    			tbody = element("tbody");
    			tr2 = element("tr");
    			td14 = element("td");
    			input0 = element("input");
    			t22 = space();
    			td15 = element("td");
    			input1 = element("input");
    			t23 = space();
    			td16 = element("td");
    			input2 = element("input");
    			t24 = space();
    			input3 = element("input");
    			t25 = space();
    			td17 = element("td");
    			input4 = element("input");
    			t26 = space();
    			input5 = element("input");
    			t27 = space();
    			td18 = element("td");
    			input6 = element("input");
    			t28 = space();
    			input7 = element("input");
    			t29 = space();
    			td19 = element("td");
    			div = element("div");
    			input8 = element("input");
    			t30 = space();
    			input9 = element("input");
    			t31 = space();
    			td20 = element("td");
    			button0 = element("button");
    			button0.textContent = "Buscar";
    			t33 = space();
    			td21 = element("td");
    			button1 = element("button");
    			button1.textContent = "Restaurar";
    			attr_dev(td0, "valign", "middle");
    			add_location(td0, file$a, 440, 14, 13810);
    			attr_dev(td1, "valign", "middle");
    			add_location(td1, file$a, 441, 14, 13851);
    			attr_dev(td2, "valign", "middle");
    			add_location(td2, file$a, 442, 14, 13892);
    			add_location(h3, file$a, 443, 34, 13953);
    			attr_dev(td3, "valign", "middle");
    			add_location(td3, file$a, 443, 14, 13933);
    			attr_dev(td4, "valign", "middle");
    			add_location(td4, file$a, 444, 14, 13993);
    			attr_dev(td5, "valign", "middle");
    			add_location(td5, file$a, 445, 14, 14034);
    			attr_dev(td6, "valign", "middle");
    			attr_dev(td6, "colspan", "2");
    			add_location(td6, file$a, 446, 14, 14075);
    			set_style(tr0, "text-align", "center");
    			set_style(tr0, "background-color", "rgb(245, 181, 128)");
    			attr_dev(tr0, "valign", "middle");
    			add_location(tr0, file$a, 439, 12, 13708);
    			attr_dev(td7, "valign", "middle");
    			add_location(td7, file$a, 450, 18, 14215);
    			attr_dev(td8, "valign", "middle");
    			add_location(td8, file$a, 451, 18, 14263);
    			attr_dev(td9, "valign", "middle");
    			add_location(td9, file$a, 452, 18, 14312);
    			attr_dev(td10, "valign", "middle");
    			add_location(td10, file$a, 453, 18, 14383);
    			attr_dev(td11, "valign", "middle");
    			add_location(td11, file$a, 454, 18, 14456);
    			attr_dev(td12, "valign", "middle");
    			add_location(td12, file$a, 455, 18, 14519);
    			attr_dev(td13, "valign", "middle");
    			attr_dev(td13, "colspan", "2");
    			add_location(td13, file$a, 456, 18, 14580);
    			set_style(tr1, "text-align", "center");
    			attr_dev(tr1, "valign", "middle");
    			add_location(tr1, file$a, 449, 14, 14146);
    			add_location(thead, file$a, 437, 10, 13671);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "placeholder", "2010");
    			attr_dev(input0, "min", "1950");
    			add_location(input0, file$a, 465, 22, 14924);
    			add_location(td14, file$a, 465, 18, 14920);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "Francia");
    			add_location(input1, file$a, 466, 22, 15024);
    			add_location(td15, file$a, 466, 18, 15020);
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "placeholder", "min");
    			add_location(input2, file$a, 468, 20, 15138);
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "placeholder", "max");
    			add_location(input3, file$a, 469, 20, 15224);
    			add_location(td16, file$a, 467, 18, 15112);
    			attr_dev(input4, "type", "number");
    			attr_dev(input4, "placeholder", "min");
    			add_location(input4, file$a, 473, 20, 15379);
    			attr_dev(input5, "type", "number");
    			attr_dev(input5, "placeholder", "max");
    			add_location(input5, file$a, 474, 20, 15465);
    			add_location(td17, file$a, 472, 18, 15353);
    			attr_dev(input6, "type", "number");
    			attr_dev(input6, "placeholder", "min");
    			add_location(input6, file$a, 477, 20, 15600);
    			attr_dev(input7, "type", "number");
    			attr_dev(input7, "placeholder", "max");
    			add_location(input7, file$a, 478, 20, 15687);
    			add_location(td18, file$a, 476, 18, 15574);
    			attr_dev(input8, "type", "number");
    			attr_dev(input8, "placeholder", "min");
    			attr_dev(input8, "class", "col-xs-12");
    			add_location(input8, file$a, 483, 20, 15875);
    			attr_dev(input9, "type", "number");
    			attr_dev(input9, "placeholder", "max");
    			attr_dev(input9, "class", "col-xs-12");
    			add_location(input9, file$a, 484, 20, 15979);
    			attr_dev(div, "class", "row col-xs-12");
    			add_location(div, file$a, 482, 20, 15825);
    			add_location(td19, file$a, 481, 18, 15799);
    			attr_dev(button0, "class", "btn btn-primary");
    			add_location(button0, file$a, 488, 22, 16138);
    			add_location(td20, file$a, 488, 18, 16134);
    			attr_dev(button1, "class", "btn btn-dark");
    			add_location(button1, file$a, 489, 22, 16236);
    			add_location(td21, file$a, 489, 18, 16232);
    			set_style(tr2, "text-align", "center");
    			set_style(tr2, "align-items", "center");
    			set_style(tr2, "max-width", "100%");
    			add_location(tr2, file$a, 463, 14, 14772);
    			add_location(tbody, file$a, 459, 10, 14679);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, td0);
    			append_dev(tr0, t0);
    			append_dev(tr0, td1);
    			append_dev(tr0, t1);
    			append_dev(tr0, td2);
    			append_dev(tr0, t2);
    			append_dev(tr0, td3);
    			append_dev(td3, h3);
    			append_dev(tr0, t4);
    			append_dev(tr0, td4);
    			append_dev(tr0, t5);
    			append_dev(tr0, td5);
    			append_dev(tr0, t6);
    			append_dev(tr0, td6);
    			append_dev(thead, t7);
    			append_dev(thead, tr1);
    			append_dev(tr1, td7);
    			append_dev(tr1, t9);
    			append_dev(tr1, td8);
    			append_dev(tr1, t11);
    			append_dev(tr1, td9);
    			append_dev(tr1, t13);
    			append_dev(tr1, td10);
    			append_dev(tr1, t15);
    			append_dev(tr1, td11);
    			append_dev(tr1, t17);
    			append_dev(tr1, td12);
    			append_dev(tr1, t19);
    			append_dev(tr1, td13);
    			insert_dev(target, t21, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr2);
    			append_dev(tr2, td14);
    			append_dev(td14, input0);
    			set_input_value(input0, /*query*/ ctx[5].y);
    			append_dev(tr2, t22);
    			append_dev(tr2, td15);
    			append_dev(td15, input1);
    			set_input_value(input1, /*query*/ ctx[5].c);
    			append_dev(tr2, t23);
    			append_dev(tr2, td16);
    			append_dev(td16, input2);
    			set_input_value(input2, /*query*/ ctx[5].apm);
    			append_dev(td16, t24);
    			append_dev(td16, input3);
    			set_input_value(input3, /*query*/ ctx[5].upm);
    			append_dev(tr2, t25);
    			append_dev(tr2, td17);
    			append_dev(td17, input4);
    			set_input_value(input4, /*query*/ ctx[5].app);
    			append_dev(td17, t26);
    			append_dev(td17, input5);
    			set_input_value(input5, /*query*/ ctx[5].upp);
    			append_dev(tr2, t27);
    			append_dev(tr2, td18);
    			append_dev(td18, input6);
    			set_input_value(input6, /*query*/ ctx[5].agdp);
    			append_dev(td18, t28);
    			append_dev(td18, input7);
    			set_input_value(input7, /*query*/ ctx[5].ugdp);
    			append_dev(tr2, t29);
    			append_dev(tr2, td19);
    			append_dev(td19, div);
    			append_dev(div, input8);
    			set_input_value(input8, /*query*/ ctx[5].apc);
    			append_dev(div, t30);
    			append_dev(div, input9);
    			set_input_value(input9, /*query*/ ctx[5].upc);
    			append_dev(tr2, t31);
    			append_dev(tr2, td20);
    			append_dev(td20, button0);
    			append_dev(tr2, t33);
    			append_dev(tr2, td21);
    			append_dev(td21, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[18]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[19]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[20]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[21]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[22]),
    					listen_dev(input5, "input", /*input5_input_handler*/ ctx[23]),
    					listen_dev(input6, "input", /*input6_input_handler*/ ctx[24]),
    					listen_dev(input7, "input", /*input7_input_handler*/ ctx[25]),
    					listen_dev(input8, "input", /*input8_input_handler*/ ctx[26]),
    					listen_dev(input9, "input", /*input9_input_handler*/ ctx[27]),
    					listen_dev(button0, "click", /*searchStat*/ ctx[13], false, false, false),
    					listen_dev(button1, "click", /*borrarQuery*/ ctx[14], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*query*/ 32 && to_number(input0.value) !== /*query*/ ctx[5].y) {
    				set_input_value(input0, /*query*/ ctx[5].y);
    			}

    			if (dirty[0] & /*query*/ 32 && input1.value !== /*query*/ ctx[5].c) {
    				set_input_value(input1, /*query*/ ctx[5].c);
    			}

    			if (dirty[0] & /*query*/ 32 && to_number(input2.value) !== /*query*/ ctx[5].apm) {
    				set_input_value(input2, /*query*/ ctx[5].apm);
    			}

    			if (dirty[0] & /*query*/ 32 && to_number(input3.value) !== /*query*/ ctx[5].upm) {
    				set_input_value(input3, /*query*/ ctx[5].upm);
    			}

    			if (dirty[0] & /*query*/ 32 && to_number(input4.value) !== /*query*/ ctx[5].app) {
    				set_input_value(input4, /*query*/ ctx[5].app);
    			}

    			if (dirty[0] & /*query*/ 32 && to_number(input5.value) !== /*query*/ ctx[5].upp) {
    				set_input_value(input5, /*query*/ ctx[5].upp);
    			}

    			if (dirty[0] & /*query*/ 32 && to_number(input6.value) !== /*query*/ ctx[5].agdp) {
    				set_input_value(input6, /*query*/ ctx[5].agdp);
    			}

    			if (dirty[0] & /*query*/ 32 && to_number(input7.value) !== /*query*/ ctx[5].ugdp) {
    				set_input_value(input7, /*query*/ ctx[5].ugdp);
    			}

    			if (dirty[0] & /*query*/ 32 && to_number(input8.value) !== /*query*/ ctx[5].apc) {
    				set_input_value(input8, /*query*/ ctx[5].apc);
    			}

    			if (dirty[0] & /*query*/ 32 && to_number(input9.value) !== /*query*/ ctx[5].upc) {
    				set_input_value(input9, /*query*/ ctx[5].upc);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t21);
    			if (detaching) detach_dev(tbody);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_18$2.name,
    		type: "slot",
    		source: "(436:8) <Table>",
    		ctx
    	});

    	return block;
    }

    // (539:16) {#each edex_data as stat}
    function create_each_block_2$2(ctx) {
    	let tr;
    	let th0;
    	let t0_value = /*stat*/ ctx[67].year + "";
    	let t0;
    	let t1;
    	let th1;
    	let t2_value = /*stat*/ ctx[67].country + "";
    	let t2;
    	let t3;
    	let th2;
    	let t4_value = /*stat*/ ctx[67].education_expenditure_per_millions + "";
    	let t4;
    	let t5;
    	let th3;
    	let t6_value = /*stat*/ ctx[67].education_expenditure_per_public_expenditure + "";
    	let t6;
    	let t7;
    	let th4;
    	let t8_value = /*stat*/ ctx[67].education_expenditure_gdp + "";
    	let t8;
    	let t9;
    	let th5;
    	let t10_value = /*stat*/ ctx[67].education_expenditure_per_capita + "";
    	let t10;
    	let t11;
    	let th6;
    	let button0;
    	let t13;
    	let th7;
    	let a;
    	let button1;
    	let a_href_value;
    	let t15;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			th0 = element("th");
    			t0 = text(t0_value);
    			t1 = space();
    			th1 = element("th");
    			t2 = text(t2_value);
    			t3 = space();
    			th2 = element("th");
    			t4 = text(t4_value);
    			t5 = space();
    			th3 = element("th");
    			t6 = text(t6_value);
    			t7 = space();
    			th4 = element("th");
    			t8 = text(t8_value);
    			t9 = space();
    			th5 = element("th");
    			t10 = text(t10_value);
    			t11 = space();
    			th6 = element("th");
    			button0 = element("button");
    			button0.textContent = "Eliminar";
    			t13 = space();
    			th7 = element("th");
    			a = element("a");
    			button1 = element("button");
    			button1.textContent = "Modificar";
    			t15 = space();
    			add_location(th0, file$a, 540, 22, 18800);
    			add_location(th1, file$a, 541, 22, 18844);
    			add_location(th2, file$a, 542, 22, 18891);
    			add_location(th3, file$a, 543, 22, 18965);
    			add_location(th4, file$a, 544, 22, 19049);
    			add_location(th5, file$a, 545, 22, 19114);
    			attr_dev(button0, "class", "btn btn-danger");
    			add_location(button0, file$a, 546, 26, 19190);
    			add_location(th6, file$a, 546, 22, 19186);
    			attr_dev(button1, "class", "btn btn-warning");
    			add_location(button1, file$a, 547, 88, 19382);
    			attr_dev(a, "href", a_href_value = "#/education_expenditures/" + /*stat*/ ctx[67].country + "/" + /*stat*/ ctx[67].year);
    			add_location(a, file$a, 547, 26, 19320);
    			add_location(th7, file$a, 547, 22, 19316);
    			set_style(tr, "text-align", "center");
    			add_location(tr, file$a, 539, 18, 18743);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, th0);
    			append_dev(th0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    			append_dev(th1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, th2);
    			append_dev(th2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, th3);
    			append_dev(th3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, th4);
    			append_dev(th4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, th5);
    			append_dev(th5, t10);
    			append_dev(tr, t11);
    			append_dev(tr, th6);
    			append_dev(th6, button0);
    			append_dev(tr, t13);
    			append_dev(tr, th7);
    			append_dev(th7, a);
    			append_dev(a, button1);
    			append_dev(tr, t15);

    			if (!mounted) {
    				dispose = listen_dev(
    					button0,
    					"click",
    					function () {
    						if (is_function(/*deleteElement*/ ctx[12](/*stat*/ ctx[67].year, /*stat*/ ctx[67].country))) /*deleteElement*/ ctx[12](/*stat*/ ctx[67].year, /*stat*/ ctx[67].country).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*edex_data*/ 256 && t0_value !== (t0_value = /*stat*/ ctx[67].year + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*edex_data*/ 256 && t2_value !== (t2_value = /*stat*/ ctx[67].country + "")) set_data_dev(t2, t2_value);
    			if (dirty[0] & /*edex_data*/ 256 && t4_value !== (t4_value = /*stat*/ ctx[67].education_expenditure_per_millions + "")) set_data_dev(t4, t4_value);
    			if (dirty[0] & /*edex_data*/ 256 && t6_value !== (t6_value = /*stat*/ ctx[67].education_expenditure_per_public_expenditure + "")) set_data_dev(t6, t6_value);
    			if (dirty[0] & /*edex_data*/ 256 && t8_value !== (t8_value = /*stat*/ ctx[67].education_expenditure_gdp + "")) set_data_dev(t8, t8_value);
    			if (dirty[0] & /*edex_data*/ 256 && t10_value !== (t10_value = /*stat*/ ctx[67].education_expenditure_per_capita + "")) set_data_dev(t10, t10_value);

    			if (dirty[0] & /*edex_data*/ 256 && a_href_value !== (a_href_value = "#/education_expenditures/" + /*stat*/ ctx[67].country + "/" + /*stat*/ ctx[67].year)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$2.name,
    		type: "each",
    		source: "(539:16) {#each edex_data as stat}",
    		ctx
    	});

    	return block;
    }

    // (499:8) <Table>
    function create_default_slot_17$2(ctx) {
    	let thead;
    	let tr0;
    	let td0;
    	let t0;
    	let td1;
    	let t1;
    	let td2;
    	let t2;
    	let td3;
    	let h3;
    	let t4;
    	let td4;
    	let t5;
    	let td5;
    	let t6;
    	let td6;
    	let t7;
    	let tr1;
    	let td7;
    	let t9;
    	let td8;
    	let t11;
    	let td9;
    	let t13;
    	let td10;
    	let t15;
    	let td11;
    	let t17;
    	let td12;
    	let t19;
    	let td13;
    	let t21;
    	let tbody;
    	let tr2;
    	let td14;
    	let input0;
    	let t22;
    	let td15;
    	let input1;
    	let t23;
    	let td16;
    	let input2;
    	let t24;
    	let td17;
    	let input3;
    	let t25;
    	let td18;
    	let input4;
    	let t26;
    	let td19;
    	let input5;
    	let t27;
    	let td20;
    	let button;
    	let t29;
    	let td21;
    	let t30;
    	let mounted;
    	let dispose;
    	let each_value_2 = /*edex_data*/ ctx[8];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2$2(get_each_context_2$2(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			td0 = element("td");
    			t0 = space();
    			td1 = element("td");
    			t1 = space();
    			td2 = element("td");
    			t2 = space();
    			td3 = element("td");
    			h3 = element("h3");
    			h3.textContent = "Datos";
    			t4 = space();
    			td4 = element("td");
    			t5 = space();
    			td5 = element("td");
    			t6 = space();
    			td6 = element("td");
    			t7 = space();
    			tr1 = element("tr");
    			td7 = element("td");
    			td7.textContent = "Año";
    			t9 = space();
    			td8 = element("td");
    			td8.textContent = "País";
    			t11 = space();
    			td9 = element("td");
    			td9.textContent = "Gasto en millones de euros";
    			t13 = space();
    			td10 = element("td");
    			td10.textContent = "Porcentaje del gasto público";
    			t15 = space();
    			td11 = element("td");
    			td11.textContent = "Porcentaje del PIB";
    			t17 = space();
    			td12 = element("td");
    			td12.textContent = "Gasto per capita";
    			t19 = space();
    			td13 = element("td");
    			td13.textContent = "Acciones";
    			t21 = space();
    			tbody = element("tbody");
    			tr2 = element("tr");
    			td14 = element("td");
    			input0 = element("input");
    			t22 = space();
    			td15 = element("td");
    			input1 = element("input");
    			t23 = space();
    			td16 = element("td");
    			input2 = element("input");
    			t24 = space();
    			td17 = element("td");
    			input3 = element("input");
    			t25 = space();
    			td18 = element("td");
    			input4 = element("input");
    			t26 = space();
    			td19 = element("td");
    			input5 = element("input");
    			t27 = space();
    			td20 = element("td");
    			button = element("button");
    			button.textContent = "Insertar";
    			t29 = space();
    			td21 = element("td");
    			t30 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(td0, "valign", "middle");
    			add_location(td0, file$a, 502, 16, 16663);
    			attr_dev(td1, "valign", "middle");
    			add_location(td1, file$a, 503, 16, 16706);
    			attr_dev(td2, "valign", "middle");
    			add_location(td2, file$a, 504, 16, 16749);
    			add_location(h3, file$a, 505, 37, 16813);
    			attr_dev(td3, "valign", "middle");
    			add_location(td3, file$a, 505, 16, 16792);
    			attr_dev(td4, "valign", "middle");
    			add_location(td4, file$a, 506, 16, 16850);
    			attr_dev(td5, "valign", "middle");
    			add_location(td5, file$a, 507, 16, 16893);
    			attr_dev(td6, "valign", "middle");
    			attr_dev(td6, "colspan", "2");
    			add_location(td6, file$a, 508, 16, 16936);
    			set_style(tr0, "text-align", "center");
    			set_style(tr0, "background-color", "rgb(245, 181, 128)");
    			set_style(tr0, "max-width", "100%");
    			attr_dev(tr0, "valign", "middle");
    			add_location(tr0, file$a, 501, 14, 16542);
    			attr_dev(td7, "valign", "middle");
    			add_location(td7, file$a, 513, 20, 17117);
    			attr_dev(td8, "valign", "middle");
    			add_location(td8, file$a, 514, 20, 17167);
    			attr_dev(td9, "valign", "middle");
    			add_location(td9, file$a, 515, 20, 17218);
    			attr_dev(td10, "valign", "middle");
    			add_location(td10, file$a, 516, 20, 17291);
    			attr_dev(td11, "valign", "middle");
    			add_location(td11, file$a, 517, 20, 17366);
    			attr_dev(td12, "valign", "middle");
    			add_location(td12, file$a, 518, 20, 17431);
    			attr_dev(td13, "valign", "middle");
    			attr_dev(td13, "colspan", "2");
    			add_location(td13, file$a, 519, 20, 17494);
    			set_style(tr1, "text-align", "center");
    			attr_dev(tr1, "valign", "middle");
    			add_location(tr1, file$a, 512, 16, 17046);
    			add_location(thead, file$a, 500, 12, 16517);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "placeholder", "2010");
    			attr_dev(input0, "min", "1900");
    			add_location(input0, file$a, 528, 26, 17773);
    			add_location(td14, file$a, 528, 22, 17769);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "Francia");
    			add_location(input1, file$a, 529, 26, 17888);
    			add_location(td15, file$a, 529, 22, 17884);
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "placeholder", "250.4");
    			add_location(input2, file$a, 530, 26, 17998);
    			add_location(td16, file$a, 530, 22, 17994);
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "placeholder", "112.3");
    			add_location(input3, file$a, 531, 26, 18136);
    			add_location(td17, file$a, 531, 22, 18132);
    			attr_dev(input4, "type", "number");
    			attr_dev(input4, "placeholder", "2.5");
    			add_location(input4, file$a, 532, 26, 18284);
    			add_location(td18, file$a, 532, 22, 18280);
    			attr_dev(input5, "type", "number");
    			attr_dev(input5, "placeholder", "2010");
    			add_location(input5, file$a, 533, 26, 18411);
    			add_location(td19, file$a, 533, 22, 18407);
    			attr_dev(button, "class", "btn btn-success");
    			add_location(button, file$a, 534, 26, 18546);
    			add_location(td20, file$a, 534, 22, 18542);
    			add_location(td21, file$a, 535, 22, 18646);
    			add_location(tr2, file$a, 526, 16, 17681);
    			add_location(tbody, file$a, 522, 12, 17599);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, td0);
    			append_dev(tr0, t0);
    			append_dev(tr0, td1);
    			append_dev(tr0, t1);
    			append_dev(tr0, td2);
    			append_dev(tr0, t2);
    			append_dev(tr0, td3);
    			append_dev(td3, h3);
    			append_dev(tr0, t4);
    			append_dev(tr0, td4);
    			append_dev(tr0, t5);
    			append_dev(tr0, td5);
    			append_dev(tr0, t6);
    			append_dev(tr0, td6);
    			append_dev(thead, t7);
    			append_dev(thead, tr1);
    			append_dev(tr1, td7);
    			append_dev(tr1, t9);
    			append_dev(tr1, td8);
    			append_dev(tr1, t11);
    			append_dev(tr1, td9);
    			append_dev(tr1, t13);
    			append_dev(tr1, td10);
    			append_dev(tr1, t15);
    			append_dev(tr1, td11);
    			append_dev(tr1, t17);
    			append_dev(tr1, td12);
    			append_dev(tr1, t19);
    			append_dev(tr1, td13);
    			insert_dev(target, t21, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr2);
    			append_dev(tr2, td14);
    			append_dev(td14, input0);
    			set_input_value(input0, /*nuevoElemento*/ ctx[4].year);
    			append_dev(tr2, t22);
    			append_dev(tr2, td15);
    			append_dev(td15, input1);
    			set_input_value(input1, /*nuevoElemento*/ ctx[4].country);
    			append_dev(tr2, t23);
    			append_dev(tr2, td16);
    			append_dev(td16, input2);
    			set_input_value(input2, /*nuevoElemento*/ ctx[4].education_expenditure_per_millions);
    			append_dev(tr2, t24);
    			append_dev(tr2, td17);
    			append_dev(td17, input3);
    			set_input_value(input3, /*nuevoElemento*/ ctx[4].education_expenditure_per_public_expenditure);
    			append_dev(tr2, t25);
    			append_dev(tr2, td18);
    			append_dev(td18, input4);
    			set_input_value(input4, /*nuevoElemento*/ ctx[4].education_expenditure_gdp);
    			append_dev(tr2, t26);
    			append_dev(tr2, td19);
    			append_dev(td19, input5);
    			set_input_value(input5, /*nuevoElemento*/ ctx[4].education_expenditure_per_capita);
    			append_dev(tr2, t27);
    			append_dev(tr2, td20);
    			append_dev(td20, button);
    			append_dev(tr2, t29);
    			append_dev(tr2, td21);
    			append_dev(tbody, t30);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler_1*/ ctx[28]),
    					listen_dev(input1, "input", /*input1_input_handler_1*/ ctx[29]),
    					listen_dev(input2, "input", /*input2_input_handler_1*/ ctx[30]),
    					listen_dev(input3, "input", /*input3_input_handler_1*/ ctx[31]),
    					listen_dev(input4, "input", /*input4_input_handler_1*/ ctx[32]),
    					listen_dev(input5, "input", /*input5_input_handler_1*/ ctx[33]),
    					listen_dev(button, "click", /*insertData*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*nuevoElemento*/ 16 && to_number(input0.value) !== /*nuevoElemento*/ ctx[4].year) {
    				set_input_value(input0, /*nuevoElemento*/ ctx[4].year);
    			}

    			if (dirty[0] & /*nuevoElemento*/ 16 && input1.value !== /*nuevoElemento*/ ctx[4].country) {
    				set_input_value(input1, /*nuevoElemento*/ ctx[4].country);
    			}

    			if (dirty[0] & /*nuevoElemento*/ 16 && to_number(input2.value) !== /*nuevoElemento*/ ctx[4].education_expenditure_per_millions) {
    				set_input_value(input2, /*nuevoElemento*/ ctx[4].education_expenditure_per_millions);
    			}

    			if (dirty[0] & /*nuevoElemento*/ 16 && to_number(input3.value) !== /*nuevoElemento*/ ctx[4].education_expenditure_per_public_expenditure) {
    				set_input_value(input3, /*nuevoElemento*/ ctx[4].education_expenditure_per_public_expenditure);
    			}

    			if (dirty[0] & /*nuevoElemento*/ 16 && to_number(input4.value) !== /*nuevoElemento*/ ctx[4].education_expenditure_gdp) {
    				set_input_value(input4, /*nuevoElemento*/ ctx[4].education_expenditure_gdp);
    			}

    			if (dirty[0] & /*nuevoElemento*/ 16 && to_number(input5.value) !== /*nuevoElemento*/ ctx[4].education_expenditure_per_capita) {
    				set_input_value(input5, /*nuevoElemento*/ ctx[4].education_expenditure_per_capita);
    			}

    			if (dirty[0] & /*edex_data, deleteElement*/ 4352) {
    				each_value_2 = /*edex_data*/ ctx[8];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t21);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_17$2.name,
    		type: "slot",
    		source: "(499:8) <Table>",
    		ctx
    	});

    	return block;
    }

    // (559:12) <PaginationItem class={pagina_actual === 1 ? "disabled" : ""}>
    function create_default_slot_16$2(ctx) {
    	let paginationlink;
    	let current;

    	paginationlink = new PaginationLink({
    			props: {
    				previous: true,
    				href: "#/education_expenditures"
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler*/ ctx[34]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_16$2.name,
    		type: "slot",
    		source: "(559:12) <PaginationItem class={pagina_actual === 1 ? \\\"disabled\\\" : \\\"\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (569:16) <PaginationLink                    previous                    href="#/education_expenditures"                    on:click={() => cambiaPagina(page, (page - 1) * 10, esBusqueda)}                    >
    function create_default_slot_15$2(ctx) {
    	let t_value = /*page*/ ctx[62] + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*ultima_pagina*/ 4 && t_value !== (t_value = /*page*/ ctx[62] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_15$2.name,
    		type: "slot",
    		source: "(569:16) <PaginationLink                    previous                    href=\\\"#/education_expenditures\\\"                    on:click={() => cambiaPagina(page, (page - 1) * 10, esBusqueda)}                    >",
    		ctx
    	});

    	return block;
    }

    // (568:14) <PaginationItem class={pagina_actual === page ? "active" : ""}>
    function create_default_slot_14$2(ctx) {
    	let paginationlink;
    	let current;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[35](/*page*/ ctx[62]);
    	}

    	paginationlink = new PaginationLink({
    			props: {
    				previous: true,
    				href: "#/education_expenditures",
    				$$slots: { default: [create_default_slot_15$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", click_handler_1);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const paginationlink_changes = {};

    			if (dirty[0] & /*ultima_pagina*/ 4 | dirty[2] & /*$$scope*/ 256) {
    				paginationlink_changes.$$scope = { dirty, ctx };
    			}

    			paginationlink.$set(paginationlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14$2.name,
    		type: "slot",
    		source: "(568:14) <PaginationItem class={pagina_actual === page ? \\\"active\\\" : \\\"\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (567:12) {#each range(ultima_pagina, 1) as page}
    function create_each_block_1$2(ctx) {
    	let paginationitem;
    	let current;

    	paginationitem = new PaginationItem({
    			props: {
    				class: /*pagina_actual*/ ctx[1] === /*page*/ ctx[62]
    				? "active"
    				: "",
    				$$slots: { default: [create_default_slot_14$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem_changes = {};

    			if (dirty[0] & /*pagina_actual, ultima_pagina*/ 6) paginationitem_changes.class = /*pagina_actual*/ ctx[1] === /*page*/ ctx[62]
    			? "active"
    			: "";

    			if (dirty[0] & /*ultima_pagina, esBusqueda*/ 12 | dirty[2] & /*$$scope*/ 256) {
    				paginationitem_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem.$set(paginationitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(567:12) {#each range(ultima_pagina, 1) as page}",
    		ctx
    	});

    	return block;
    }

    // (577:12) <PaginationItem class={pagina_actual === ultima_pagina ? "disabled" : ""}>
    function create_default_slot_13$2(ctx) {
    	let paginationlink;
    	let current;

    	paginationlink = new PaginationLink({
    			props: {
    				next: true,
    				href: "#/education_expenditures"
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_2*/ ctx[36]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13$2.name,
    		type: "slot",
    		source: "(577:12) <PaginationItem class={pagina_actual === ultima_pagina ? \\\"disabled\\\" : \\\"\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (558:10) <Pagination ariaLabel="Web pagination">
    function create_default_slot_12$2(ctx) {
    	let paginationitem0;
    	let t0;
    	let t1;
    	let paginationitem1;
    	let current;

    	paginationitem0 = new PaginationItem({
    			props: {
    				class: /*pagina_actual*/ ctx[1] === 1 ? "disabled" : "",
    				$$slots: { default: [create_default_slot_16$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let each_value_1 = range$1(/*ultima_pagina*/ ctx[2], 1);
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	paginationitem1 = new PaginationItem({
    			props: {
    				class: /*pagina_actual*/ ctx[1] === /*ultima_pagina*/ ctx[2]
    				? "disabled"
    				: "",
    				$$slots: { default: [create_default_slot_13$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem0.$$.fragment);
    			t0 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			create_component(paginationitem1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem0, target, anchor);
    			insert_dev(target, t0, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			mount_component(paginationitem1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem0_changes = {};
    			if (dirty[0] & /*pagina_actual*/ 2) paginationitem0_changes.class = /*pagina_actual*/ ctx[1] === 1 ? "disabled" : "";

    			if (dirty[0] & /*pagina_actual, offset_actual, esBusqueda*/ 11 | dirty[2] & /*$$scope*/ 256) {
    				paginationitem0_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem0.$set(paginationitem0_changes);

    			if (dirty[0] & /*pagina_actual, ultima_pagina, cambiaPagina, esBusqueda*/ 32782) {
    				each_value_1 = range$1(/*ultima_pagina*/ ctx[2], 1);
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(t1.parentNode, t1);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const paginationitem1_changes = {};

    			if (dirty[0] & /*pagina_actual, ultima_pagina*/ 6) paginationitem1_changes.class = /*pagina_actual*/ ctx[1] === /*ultima_pagina*/ ctx[2]
    			? "disabled"
    			: "";

    			if (dirty[0] & /*pagina_actual, offset_actual, esBusqueda*/ 11 | dirty[2] & /*$$scope*/ 256) {
    				paginationitem1_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem1.$set(paginationitem1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem0.$$.fragment, local);

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(paginationitem1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem0.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(paginationitem1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(paginationitem1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12$2.name,
    		type: "slot",
    		source: "(558:10) <Pagination ariaLabel=\\\"Web pagination\\\">",
    		ctx
    	});

    	return block;
    }

    // (597:6) {#if edex_data.length==1}
    function create_if_block_1$4(ctx) {
    	let table0;
    	let t0;
    	let table1;
    	let t1;
    	let div;
    	let pagination;
    	let current;

    	table0 = new Table({
    			props: {
    				$$slots: { default: [create_default_slot_11$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table1 = new Table({
    			props: {
    				$$slots: { default: [create_default_slot_10$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	pagination = new Pagination({
    			props: {
    				ariaLabel: "Web pagination",
    				$$slots: { default: [create_default_slot_5$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table0.$$.fragment);
    			t0 = space();
    			create_component(table1.$$.fragment);
    			t1 = space();
    			div = element("div");
    			create_component(pagination.$$.fragment);
    			add_location(div, file$a, 711, 14, 27206);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(table1, target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(pagination, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table0_changes = {};

    			if (dirty[0] & /*query*/ 32 | dirty[2] & /*$$scope*/ 256) {
    				table0_changes.$$scope = { dirty, ctx };
    			}

    			table0.$set(table0_changes);
    			const table1_changes = {};

    			if (dirty[0] & /*edex_data, nuevoElemento*/ 272 | dirty[2] & /*$$scope*/ 256) {
    				table1_changes.$$scope = { dirty, ctx };
    			}

    			table1.$set(table1_changes);
    			const pagination_changes = {};

    			if (dirty[0] & /*pagina_actual, ultima_pagina, offset_actual, esBusqueda*/ 15 | dirty[2] & /*$$scope*/ 256) {
    				pagination_changes.$$scope = { dirty, ctx };
    			}

    			pagination.$set(pagination_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table0.$$.fragment, local);
    			transition_in(table1.$$.fragment, local);
    			transition_in(pagination.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table0.$$.fragment, local);
    			transition_out(table1.$$.fragment, local);
    			transition_out(pagination.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(table1, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			destroy_component(pagination);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(597:6) {#if edex_data.length==1}",
    		ctx
    	});

    	return block;
    }

    // (599:8) <Table>
    function create_default_slot_11$2(ctx) {
    	let thead;
    	let tr0;
    	let td0;
    	let t0;
    	let td1;
    	let t1;
    	let td2;
    	let t2;
    	let td3;
    	let h3;
    	let t4;
    	let td4;
    	let t5;
    	let td5;
    	let t6;
    	let td6;
    	let t7;
    	let tr1;
    	let td7;
    	let t9;
    	let td8;
    	let t11;
    	let td9;
    	let t13;
    	let td10;
    	let t15;
    	let td11;
    	let t17;
    	let td12;
    	let t19;
    	let td13;
    	let t21;
    	let tbody;
    	let tr2;
    	let td14;
    	let input0;
    	let t22;
    	let td15;
    	let input1;
    	let t23;
    	let td16;
    	let input2;
    	let t24;
    	let input3;
    	let t25;
    	let td17;
    	let input4;
    	let t26;
    	let input5;
    	let t27;
    	let td18;
    	let input6;
    	let t28;
    	let input7;
    	let t29;
    	let td19;
    	let div;
    	let input8;
    	let t30;
    	let input9;
    	let t31;
    	let td20;
    	let button0;
    	let t33;
    	let td21;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			td0 = element("td");
    			t0 = space();
    			td1 = element("td");
    			t1 = space();
    			td2 = element("td");
    			t2 = space();
    			td3 = element("td");
    			h3 = element("h3");
    			h3.textContent = "Busqueda";
    			t4 = space();
    			td4 = element("td");
    			t5 = space();
    			td5 = element("td");
    			t6 = space();
    			td6 = element("td");
    			t7 = space();
    			tr1 = element("tr");
    			td7 = element("td");
    			td7.textContent = "Año";
    			t9 = space();
    			td8 = element("td");
    			td8.textContent = "País";
    			t11 = space();
    			td9 = element("td");
    			td9.textContent = "Gasto en millones de euros";
    			t13 = space();
    			td10 = element("td");
    			td10.textContent = "Porcentaje del gasto público";
    			t15 = space();
    			td11 = element("td");
    			td11.textContent = "Porcentaje del PIB";
    			t17 = space();
    			td12 = element("td");
    			td12.textContent = "Gasto per capita";
    			t19 = space();
    			td13 = element("td");
    			td13.textContent = "Acciones";
    			t21 = space();
    			tbody = element("tbody");
    			tr2 = element("tr");
    			td14 = element("td");
    			input0 = element("input");
    			t22 = space();
    			td15 = element("td");
    			input1 = element("input");
    			t23 = space();
    			td16 = element("td");
    			input2 = element("input");
    			t24 = space();
    			input3 = element("input");
    			t25 = space();
    			td17 = element("td");
    			input4 = element("input");
    			t26 = space();
    			input5 = element("input");
    			t27 = space();
    			td18 = element("td");
    			input6 = element("input");
    			t28 = space();
    			input7 = element("input");
    			t29 = space();
    			td19 = element("td");
    			div = element("div");
    			input8 = element("input");
    			t30 = space();
    			input9 = element("input");
    			t31 = space();
    			td20 = element("td");
    			button0 = element("button");
    			button0.textContent = "Buscar";
    			t33 = space();
    			td21 = element("td");
    			button1 = element("button");
    			button1.textContent = "Restaurar";
    			attr_dev(td0, "valign", "middle");
    			add_location(td0, file$a, 603, 14, 21194);
    			attr_dev(td1, "valign", "middle");
    			add_location(td1, file$a, 604, 14, 21235);
    			attr_dev(td2, "valign", "middle");
    			add_location(td2, file$a, 605, 14, 21276);
    			add_location(h3, file$a, 606, 34, 21337);
    			attr_dev(td3, "valign", "middle");
    			add_location(td3, file$a, 606, 14, 21317);
    			attr_dev(td4, "valign", "middle");
    			add_location(td4, file$a, 607, 14, 21377);
    			attr_dev(td5, "valign", "middle");
    			add_location(td5, file$a, 608, 14, 21418);
    			attr_dev(td6, "valign", "middle");
    			attr_dev(td6, "colspan", "2");
    			add_location(td6, file$a, 609, 14, 21459);
    			set_style(tr0, "text-align", "center");
    			set_style(tr0, "background-color", "rgb(245, 181, 128)");
    			attr_dev(tr0, "valign", "middle");
    			add_location(tr0, file$a, 602, 12, 21092);
    			attr_dev(td7, "valign", "middle");
    			add_location(td7, file$a, 613, 18, 21599);
    			attr_dev(td8, "valign", "middle");
    			add_location(td8, file$a, 614, 18, 21647);
    			attr_dev(td9, "valign", "middle");
    			add_location(td9, file$a, 615, 18, 21696);
    			attr_dev(td10, "valign", "middle");
    			add_location(td10, file$a, 616, 18, 21767);
    			attr_dev(td11, "valign", "middle");
    			add_location(td11, file$a, 617, 18, 21840);
    			attr_dev(td12, "valign", "middle");
    			add_location(td12, file$a, 618, 18, 21903);
    			attr_dev(td13, "valign", "middle");
    			attr_dev(td13, "colspan", "2");
    			add_location(td13, file$a, 619, 18, 21964);
    			set_style(tr1, "text-align", "center");
    			attr_dev(tr1, "valign", "middle");
    			add_location(tr1, file$a, 612, 14, 21530);
    			add_location(thead, file$a, 600, 10, 21055);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "placeholder", "2010");
    			attr_dev(input0, "min", "1950");
    			add_location(input0, file$a, 628, 22, 22308);
    			add_location(td14, file$a, 628, 18, 22304);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "Francia");
    			add_location(input1, file$a, 629, 22, 22408);
    			add_location(td15, file$a, 629, 18, 22404);
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "placeholder", "min");
    			add_location(input2, file$a, 631, 20, 22522);
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "placeholder", "max");
    			add_location(input3, file$a, 632, 20, 22608);
    			add_location(td16, file$a, 630, 18, 22496);
    			attr_dev(input4, "type", "number");
    			attr_dev(input4, "placeholder", "min");
    			add_location(input4, file$a, 636, 20, 22763);
    			attr_dev(input5, "type", "number");
    			attr_dev(input5, "placeholder", "max");
    			add_location(input5, file$a, 637, 20, 22849);
    			add_location(td17, file$a, 635, 18, 22737);
    			attr_dev(input6, "type", "number");
    			attr_dev(input6, "placeholder", "max");
    			add_location(input6, file$a, 640, 20, 22984);
    			attr_dev(input7, "type", "number");
    			attr_dev(input7, "placeholder", "min");
    			add_location(input7, file$a, 641, 20, 23071);
    			add_location(td18, file$a, 639, 18, 22958);
    			attr_dev(input8, "type", "number");
    			attr_dev(input8, "placeholder", "max");
    			attr_dev(input8, "class", "col-xs-12");
    			add_location(input8, file$a, 646, 20, 23259);
    			attr_dev(input9, "type", "number");
    			attr_dev(input9, "placeholder", "min");
    			attr_dev(input9, "class", "col-xs-12");
    			add_location(input9, file$a, 647, 20, 23363);
    			attr_dev(div, "class", "row col-xs-12");
    			add_location(div, file$a, 645, 20, 23209);
    			add_location(td19, file$a, 644, 18, 23183);
    			attr_dev(button0, "class", "btn btn-primary");
    			add_location(button0, file$a, 651, 22, 23522);
    			add_location(td20, file$a, 651, 18, 23518);
    			attr_dev(button1, "class", "btn btn-dark");
    			add_location(button1, file$a, 652, 22, 23620);
    			add_location(td21, file$a, 652, 18, 23616);
    			set_style(tr2, "text-align", "center");
    			set_style(tr2, "align-items", "center");
    			set_style(tr2, "max-width", "100%");
    			add_location(tr2, file$a, 626, 14, 22156);
    			add_location(tbody, file$a, 622, 10, 22063);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, td0);
    			append_dev(tr0, t0);
    			append_dev(tr0, td1);
    			append_dev(tr0, t1);
    			append_dev(tr0, td2);
    			append_dev(tr0, t2);
    			append_dev(tr0, td3);
    			append_dev(td3, h3);
    			append_dev(tr0, t4);
    			append_dev(tr0, td4);
    			append_dev(tr0, t5);
    			append_dev(tr0, td5);
    			append_dev(tr0, t6);
    			append_dev(tr0, td6);
    			append_dev(thead, t7);
    			append_dev(thead, tr1);
    			append_dev(tr1, td7);
    			append_dev(tr1, t9);
    			append_dev(tr1, td8);
    			append_dev(tr1, t11);
    			append_dev(tr1, td9);
    			append_dev(tr1, t13);
    			append_dev(tr1, td10);
    			append_dev(tr1, t15);
    			append_dev(tr1, td11);
    			append_dev(tr1, t17);
    			append_dev(tr1, td12);
    			append_dev(tr1, t19);
    			append_dev(tr1, td13);
    			insert_dev(target, t21, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr2);
    			append_dev(tr2, td14);
    			append_dev(td14, input0);
    			set_input_value(input0, /*query*/ ctx[5].y);
    			append_dev(tr2, t22);
    			append_dev(tr2, td15);
    			append_dev(td15, input1);
    			set_input_value(input1, /*query*/ ctx[5].c);
    			append_dev(tr2, t23);
    			append_dev(tr2, td16);
    			append_dev(td16, input2);
    			set_input_value(input2, /*query*/ ctx[5].apm);
    			append_dev(td16, t24);
    			append_dev(td16, input3);
    			set_input_value(input3, /*query*/ ctx[5].upm);
    			append_dev(tr2, t25);
    			append_dev(tr2, td17);
    			append_dev(td17, input4);
    			set_input_value(input4, /*query*/ ctx[5].app);
    			append_dev(td17, t26);
    			append_dev(td17, input5);
    			set_input_value(input5, /*query*/ ctx[5].upp);
    			append_dev(tr2, t27);
    			append_dev(tr2, td18);
    			append_dev(td18, input6);
    			set_input_value(input6, /*query*/ ctx[5].agdp);
    			append_dev(td18, t28);
    			append_dev(td18, input7);
    			set_input_value(input7, /*query*/ ctx[5].ugdp);
    			append_dev(tr2, t29);
    			append_dev(tr2, td19);
    			append_dev(td19, div);
    			append_dev(div, input8);
    			set_input_value(input8, /*query*/ ctx[5].apc);
    			append_dev(div, t30);
    			append_dev(div, input9);
    			set_input_value(input9, /*query*/ ctx[5].upc);
    			append_dev(tr2, t31);
    			append_dev(tr2, td20);
    			append_dev(td20, button0);
    			append_dev(tr2, t33);
    			append_dev(tr2, td21);
    			append_dev(td21, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler_2*/ ctx[37]),
    					listen_dev(input1, "input", /*input1_input_handler_2*/ ctx[38]),
    					listen_dev(input2, "input", /*input2_input_handler_2*/ ctx[39]),
    					listen_dev(input3, "input", /*input3_input_handler_2*/ ctx[40]),
    					listen_dev(input4, "input", /*input4_input_handler_2*/ ctx[41]),
    					listen_dev(input5, "input", /*input5_input_handler_2*/ ctx[42]),
    					listen_dev(input6, "input", /*input6_input_handler_1*/ ctx[43]),
    					listen_dev(input7, "input", /*input7_input_handler_1*/ ctx[44]),
    					listen_dev(input8, "input", /*input8_input_handler_1*/ ctx[45]),
    					listen_dev(input9, "input", /*input9_input_handler_1*/ ctx[46]),
    					listen_dev(button0, "click", /*searchStat*/ ctx[13], false, false, false),
    					listen_dev(button1, "click", /*borrarQuery*/ ctx[14], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*query*/ 32 && to_number(input0.value) !== /*query*/ ctx[5].y) {
    				set_input_value(input0, /*query*/ ctx[5].y);
    			}

    			if (dirty[0] & /*query*/ 32 && input1.value !== /*query*/ ctx[5].c) {
    				set_input_value(input1, /*query*/ ctx[5].c);
    			}

    			if (dirty[0] & /*query*/ 32 && to_number(input2.value) !== /*query*/ ctx[5].apm) {
    				set_input_value(input2, /*query*/ ctx[5].apm);
    			}

    			if (dirty[0] & /*query*/ 32 && to_number(input3.value) !== /*query*/ ctx[5].upm) {
    				set_input_value(input3, /*query*/ ctx[5].upm);
    			}

    			if (dirty[0] & /*query*/ 32 && to_number(input4.value) !== /*query*/ ctx[5].app) {
    				set_input_value(input4, /*query*/ ctx[5].app);
    			}

    			if (dirty[0] & /*query*/ 32 && to_number(input5.value) !== /*query*/ ctx[5].upp) {
    				set_input_value(input5, /*query*/ ctx[5].upp);
    			}

    			if (dirty[0] & /*query*/ 32 && to_number(input6.value) !== /*query*/ ctx[5].agdp) {
    				set_input_value(input6, /*query*/ ctx[5].agdp);
    			}

    			if (dirty[0] & /*query*/ 32 && to_number(input7.value) !== /*query*/ ctx[5].ugdp) {
    				set_input_value(input7, /*query*/ ctx[5].ugdp);
    			}

    			if (dirty[0] & /*query*/ 32 && to_number(input8.value) !== /*query*/ ctx[5].apc) {
    				set_input_value(input8, /*query*/ ctx[5].apc);
    			}

    			if (dirty[0] & /*query*/ 32 && to_number(input9.value) !== /*query*/ ctx[5].upc) {
    				set_input_value(input9, /*query*/ ctx[5].upc);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t21);
    			if (detaching) detach_dev(tbody);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11$2.name,
    		type: "slot",
    		source: "(599:8) <Table>",
    		ctx
    	});

    	return block;
    }

    // (660:16) <Table>
    function create_default_slot_10$2(ctx) {
    	let thead;
    	let tr0;
    	let td0;
    	let t0;
    	let td1;
    	let t1;
    	let td2;
    	let t2;
    	let td3;
    	let h3;
    	let t4;
    	let td4;
    	let t5;
    	let td5;
    	let t6;
    	let td6;
    	let t7;
    	let tr1;
    	let td7;
    	let t9;
    	let td8;
    	let t11;
    	let td9;
    	let t13;
    	let td10;
    	let t15;
    	let td11;
    	let t17;
    	let td12;
    	let t19;
    	let td13;
    	let t21;
    	let tbody;
    	let tr2;
    	let td14;
    	let input0;
    	let t22;
    	let td15;
    	let input1;
    	let t23;
    	let td16;
    	let input2;
    	let t24;
    	let td17;
    	let input3;
    	let t25;
    	let td18;
    	let input4;
    	let t26;
    	let td19;
    	let input5;
    	let t27;
    	let td20;
    	let button0;
    	let t29;
    	let td21;
    	let t30;
    	let tr3;
    	let th0;
    	let t31_value = /*edex_data*/ ctx[8][0].year + "";
    	let t31;
    	let t32;
    	let th1;
    	let t33_value = /*edex_data*/ ctx[8][0].country + "";
    	let t33;
    	let t34;
    	let th2;
    	let t35_value = /*edex_data*/ ctx[8][0].education_expenditure_per_millions + "";
    	let t35;
    	let t36;
    	let th3;
    	let t37_value = /*edex_data*/ ctx[8][0].education_expenditure_per_public_expenditure + "";
    	let t37;
    	let t38;
    	let th4;
    	let t39_value = /*edex_data*/ ctx[8][0].education_expenditure_gdp + "";
    	let t39;
    	let t40;
    	let th5;
    	let t41_value = /*edex_data*/ ctx[8][0].education_expenditure_per_capita + "";
    	let t41;
    	let t42;
    	let th6;
    	let button1;
    	let t44;
    	let th7;
    	let a;
    	let button2;
    	let a_href_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			td0 = element("td");
    			t0 = space();
    			td1 = element("td");
    			t1 = space();
    			td2 = element("td");
    			t2 = space();
    			td3 = element("td");
    			h3 = element("h3");
    			h3.textContent = "Datos";
    			t4 = space();
    			td4 = element("td");
    			t5 = space();
    			td5 = element("td");
    			t6 = space();
    			td6 = element("td");
    			t7 = space();
    			tr1 = element("tr");
    			td7 = element("td");
    			td7.textContent = "Año";
    			t9 = space();
    			td8 = element("td");
    			td8.textContent = "País";
    			t11 = space();
    			td9 = element("td");
    			td9.textContent = "Gasto en millones de euros";
    			t13 = space();
    			td10 = element("td");
    			td10.textContent = "Porcentaje del gasto público";
    			t15 = space();
    			td11 = element("td");
    			td11.textContent = "Porcentaje del PIB";
    			t17 = space();
    			td12 = element("td");
    			td12.textContent = "Gasto per capita";
    			t19 = space();
    			td13 = element("td");
    			td13.textContent = "Acciones";
    			t21 = space();
    			tbody = element("tbody");
    			tr2 = element("tr");
    			td14 = element("td");
    			input0 = element("input");
    			t22 = space();
    			td15 = element("td");
    			input1 = element("input");
    			t23 = space();
    			td16 = element("td");
    			input2 = element("input");
    			t24 = space();
    			td17 = element("td");
    			input3 = element("input");
    			t25 = space();
    			td18 = element("td");
    			input4 = element("input");
    			t26 = space();
    			td19 = element("td");
    			input5 = element("input");
    			t27 = space();
    			td20 = element("td");
    			button0 = element("button");
    			button0.textContent = "Insertar";
    			t29 = space();
    			td21 = element("td");
    			t30 = space();
    			tr3 = element("tr");
    			th0 = element("th");
    			t31 = text(t31_value);
    			t32 = space();
    			th1 = element("th");
    			t33 = text(t33_value);
    			t34 = space();
    			th2 = element("th");
    			t35 = text(t35_value);
    			t36 = space();
    			th3 = element("th");
    			t37 = text(t37_value);
    			t38 = space();
    			th4 = element("th");
    			t39 = text(t39_value);
    			t40 = space();
    			th5 = element("th");
    			t41 = text(t41_value);
    			t42 = space();
    			th6 = element("th");
    			button1 = element("button");
    			button1.textContent = "Eliminar";
    			t44 = space();
    			th7 = element("th");
    			a = element("a");
    			button2 = element("button");
    			button2.textContent = "Modificar";
    			attr_dev(td0, "valign", "middle");
    			add_location(td0, file$a, 663, 22, 24154);
    			attr_dev(td1, "valign", "middle");
    			add_location(td1, file$a, 664, 22, 24203);
    			attr_dev(td2, "valign", "middle");
    			add_location(td2, file$a, 665, 22, 24252);
    			add_location(h3, file$a, 666, 43, 24322);
    			attr_dev(td3, "valign", "middle");
    			add_location(td3, file$a, 666, 22, 24301);
    			attr_dev(td4, "valign", "middle");
    			add_location(td4, file$a, 667, 22, 24365);
    			attr_dev(td5, "valign", "middle");
    			add_location(td5, file$a, 668, 22, 24414);
    			attr_dev(td6, "valign", "middle");
    			attr_dev(td6, "colspan", "2");
    			add_location(td6, file$a, 669, 22, 24463);
    			set_style(tr0, "text-align", "center");
    			set_style(tr0, "background-color", "rgb(245, 181, 128)");
    			set_style(tr0, "max-width", "100%");
    			attr_dev(tr0, "valign", "middle");
    			add_location(tr0, file$a, 662, 20, 24027);
    			attr_dev(td7, "valign", "middle");
    			add_location(td7, file$a, 674, 26, 24674);
    			attr_dev(td8, "valign", "middle");
    			add_location(td8, file$a, 675, 26, 24730);
    			attr_dev(td9, "valign", "middle");
    			add_location(td9, file$a, 676, 26, 24787);
    			attr_dev(td10, "valign", "middle");
    			add_location(td10, file$a, 677, 26, 24866);
    			attr_dev(td11, "valign", "middle");
    			add_location(td11, file$a, 678, 26, 24947);
    			attr_dev(td12, "valign", "middle");
    			add_location(td12, file$a, 679, 26, 25018);
    			attr_dev(td13, "valign", "middle");
    			attr_dev(td13, "colspan", "2");
    			add_location(td13, file$a, 680, 26, 25087);
    			set_style(tr1, "text-align", "center");
    			attr_dev(tr1, "valign", "middle");
    			add_location(tr1, file$a, 673, 22, 24597);
    			add_location(thead, file$a, 661, 18, 23996);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "placeholder", "2010");
    			attr_dev(input0, "min", "1900");
    			add_location(input0, file$a, 689, 26, 25398);
    			add_location(td14, file$a, 689, 22, 25394);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "Francia");
    			add_location(input1, file$a, 690, 26, 25513);
    			add_location(td15, file$a, 690, 22, 25509);
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "placeholder", "250.4");
    			add_location(input2, file$a, 691, 26, 25623);
    			add_location(td16, file$a, 691, 22, 25619);
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "placeholder", "112.3");
    			add_location(input3, file$a, 692, 26, 25761);
    			add_location(td17, file$a, 692, 22, 25757);
    			attr_dev(input4, "type", "number");
    			attr_dev(input4, "placeholder", "2.5");
    			add_location(input4, file$a, 693, 26, 25909);
    			add_location(td18, file$a, 693, 22, 25905);
    			attr_dev(input5, "type", "number");
    			attr_dev(input5, "placeholder", "2010");
    			add_location(input5, file$a, 694, 26, 26036);
    			add_location(td19, file$a, 694, 22, 26032);
    			attr_dev(button0, "class", "btn btn-success");
    			add_location(button0, file$a, 695, 26, 26171);
    			add_location(td20, file$a, 695, 22, 26167);
    			add_location(td21, file$a, 696, 22, 26271);
    			add_location(tr2, file$a, 687, 18, 25306);
    			add_location(th0, file$a, 700, 20, 26386);
    			add_location(th1, file$a, 701, 22, 26438);
    			add_location(th2, file$a, 702, 22, 26493);
    			add_location(th3, file$a, 703, 22, 26575);
    			add_location(th4, file$a, 704, 22, 26667);
    			add_location(th5, file$a, 705, 22, 26740);
    			attr_dev(button1, "class", "btn btn-danger");
    			add_location(button1, file$a, 706, 26, 26824);
    			add_location(th6, file$a, 706, 22, 26820);
    			attr_dev(button2, "class", "btn btn-warning");
    			add_location(button2, file$a, 707, 104, 27048);
    			attr_dev(a, "href", a_href_value = "#/education_expenditures/" + /*edex_data*/ ctx[8][0].country + "/" + /*edex_data*/ ctx[8][0].year);
    			add_location(a, file$a, 707, 26, 26970);
    			add_location(th7, file$a, 707, 22, 26966);
    			set_style(tr3, "text-align", "center");
    			add_location(tr3, file$a, 699, 18, 26331);
    			add_location(tbody, file$a, 683, 18, 25210);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, td0);
    			append_dev(tr0, t0);
    			append_dev(tr0, td1);
    			append_dev(tr0, t1);
    			append_dev(tr0, td2);
    			append_dev(tr0, t2);
    			append_dev(tr0, td3);
    			append_dev(td3, h3);
    			append_dev(tr0, t4);
    			append_dev(tr0, td4);
    			append_dev(tr0, t5);
    			append_dev(tr0, td5);
    			append_dev(tr0, t6);
    			append_dev(tr0, td6);
    			append_dev(thead, t7);
    			append_dev(thead, tr1);
    			append_dev(tr1, td7);
    			append_dev(tr1, t9);
    			append_dev(tr1, td8);
    			append_dev(tr1, t11);
    			append_dev(tr1, td9);
    			append_dev(tr1, t13);
    			append_dev(tr1, td10);
    			append_dev(tr1, t15);
    			append_dev(tr1, td11);
    			append_dev(tr1, t17);
    			append_dev(tr1, td12);
    			append_dev(tr1, t19);
    			append_dev(tr1, td13);
    			insert_dev(target, t21, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr2);
    			append_dev(tr2, td14);
    			append_dev(td14, input0);
    			set_input_value(input0, /*nuevoElemento*/ ctx[4].year);
    			append_dev(tr2, t22);
    			append_dev(tr2, td15);
    			append_dev(td15, input1);
    			set_input_value(input1, /*nuevoElemento*/ ctx[4].country);
    			append_dev(tr2, t23);
    			append_dev(tr2, td16);
    			append_dev(td16, input2);
    			set_input_value(input2, /*nuevoElemento*/ ctx[4].education_expenditure_per_millions);
    			append_dev(tr2, t24);
    			append_dev(tr2, td17);
    			append_dev(td17, input3);
    			set_input_value(input3, /*nuevoElemento*/ ctx[4].education_expenditure_per_public_expenditure);
    			append_dev(tr2, t25);
    			append_dev(tr2, td18);
    			append_dev(td18, input4);
    			set_input_value(input4, /*nuevoElemento*/ ctx[4].education_expenditure_gdp);
    			append_dev(tr2, t26);
    			append_dev(tr2, td19);
    			append_dev(td19, input5);
    			set_input_value(input5, /*nuevoElemento*/ ctx[4].education_expenditure_per_capita);
    			append_dev(tr2, t27);
    			append_dev(tr2, td20);
    			append_dev(td20, button0);
    			append_dev(tr2, t29);
    			append_dev(tr2, td21);
    			append_dev(tbody, t30);
    			append_dev(tbody, tr3);
    			append_dev(tr3, th0);
    			append_dev(th0, t31);
    			append_dev(tr3, t32);
    			append_dev(tr3, th1);
    			append_dev(th1, t33);
    			append_dev(tr3, t34);
    			append_dev(tr3, th2);
    			append_dev(th2, t35);
    			append_dev(tr3, t36);
    			append_dev(tr3, th3);
    			append_dev(th3, t37);
    			append_dev(tr3, t38);
    			append_dev(tr3, th4);
    			append_dev(th4, t39);
    			append_dev(tr3, t40);
    			append_dev(tr3, th5);
    			append_dev(th5, t41);
    			append_dev(tr3, t42);
    			append_dev(tr3, th6);
    			append_dev(th6, button1);
    			append_dev(tr3, t44);
    			append_dev(tr3, th7);
    			append_dev(th7, a);
    			append_dev(a, button2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler_3*/ ctx[47]),
    					listen_dev(input1, "input", /*input1_input_handler_3*/ ctx[48]),
    					listen_dev(input2, "input", /*input2_input_handler_3*/ ctx[49]),
    					listen_dev(input3, "input", /*input3_input_handler_3*/ ctx[50]),
    					listen_dev(input4, "input", /*input4_input_handler_3*/ ctx[51]),
    					listen_dev(input5, "input", /*input5_input_handler_3*/ ctx[52]),
    					listen_dev(button0, "click", /*insertData*/ ctx[11], false, false, false),
    					listen_dev(
    						button1,
    						"click",
    						function () {
    							if (is_function(/*deleteElement*/ ctx[12](/*edex_data*/ ctx[8][0].year, /*edex_data*/ ctx[8][0].country))) /*deleteElement*/ ctx[12](/*edex_data*/ ctx[8][0].year, /*edex_data*/ ctx[8][0].country).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*nuevoElemento*/ 16 && to_number(input0.value) !== /*nuevoElemento*/ ctx[4].year) {
    				set_input_value(input0, /*nuevoElemento*/ ctx[4].year);
    			}

    			if (dirty[0] & /*nuevoElemento*/ 16 && input1.value !== /*nuevoElemento*/ ctx[4].country) {
    				set_input_value(input1, /*nuevoElemento*/ ctx[4].country);
    			}

    			if (dirty[0] & /*nuevoElemento*/ 16 && to_number(input2.value) !== /*nuevoElemento*/ ctx[4].education_expenditure_per_millions) {
    				set_input_value(input2, /*nuevoElemento*/ ctx[4].education_expenditure_per_millions);
    			}

    			if (dirty[0] & /*nuevoElemento*/ 16 && to_number(input3.value) !== /*nuevoElemento*/ ctx[4].education_expenditure_per_public_expenditure) {
    				set_input_value(input3, /*nuevoElemento*/ ctx[4].education_expenditure_per_public_expenditure);
    			}

    			if (dirty[0] & /*nuevoElemento*/ 16 && to_number(input4.value) !== /*nuevoElemento*/ ctx[4].education_expenditure_gdp) {
    				set_input_value(input4, /*nuevoElemento*/ ctx[4].education_expenditure_gdp);
    			}

    			if (dirty[0] & /*nuevoElemento*/ 16 && to_number(input5.value) !== /*nuevoElemento*/ ctx[4].education_expenditure_per_capita) {
    				set_input_value(input5, /*nuevoElemento*/ ctx[4].education_expenditure_per_capita);
    			}

    			if (dirty[0] & /*edex_data*/ 256 && t31_value !== (t31_value = /*edex_data*/ ctx[8][0].year + "")) set_data_dev(t31, t31_value);
    			if (dirty[0] & /*edex_data*/ 256 && t33_value !== (t33_value = /*edex_data*/ ctx[8][0].country + "")) set_data_dev(t33, t33_value);
    			if (dirty[0] & /*edex_data*/ 256 && t35_value !== (t35_value = /*edex_data*/ ctx[8][0].education_expenditure_per_millions + "")) set_data_dev(t35, t35_value);
    			if (dirty[0] & /*edex_data*/ 256 && t37_value !== (t37_value = /*edex_data*/ ctx[8][0].education_expenditure_per_public_expenditure + "")) set_data_dev(t37, t37_value);
    			if (dirty[0] & /*edex_data*/ 256 && t39_value !== (t39_value = /*edex_data*/ ctx[8][0].education_expenditure_gdp + "")) set_data_dev(t39, t39_value);
    			if (dirty[0] & /*edex_data*/ 256 && t41_value !== (t41_value = /*edex_data*/ ctx[8][0].education_expenditure_per_capita + "")) set_data_dev(t41, t41_value);

    			if (dirty[0] & /*edex_data*/ 256 && a_href_value !== (a_href_value = "#/education_expenditures/" + /*edex_data*/ ctx[8][0].country + "/" + /*edex_data*/ ctx[8][0].year)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t21);
    			if (detaching) detach_dev(tbody);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10$2.name,
    		type: "slot",
    		source: "(660:16) <Table>",
    		ctx
    	});

    	return block;
    }

    // (715:18) <PaginationItem class={pagina_actual === 1 ? "disabled" : ""}>
    function create_default_slot_9$2(ctx) {
    	let paginationlink;
    	let current;

    	paginationlink = new PaginationLink({
    			props: {
    				previous: true,
    				href: "#/education_expenditures"
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_3*/ ctx[53]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9$2.name,
    		type: "slot",
    		source: "(715:18) <PaginationItem class={pagina_actual === 1 ? \\\"disabled\\\" : \\\"\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (725:22) <PaginationLink                          previous                          href="#/education_expenditures"                          on:click={() => cambiaPagina(page, (page - 1) * 10, esBusqueda)}                          >
    function create_default_slot_8$2(ctx) {
    	let t_value = /*page*/ ctx[62] + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*ultima_pagina*/ 4 && t_value !== (t_value = /*page*/ ctx[62] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$2.name,
    		type: "slot",
    		source: "(725:22) <PaginationLink                          previous                          href=\\\"#/education_expenditures\\\"                          on:click={() => cambiaPagina(page, (page - 1) * 10, esBusqueda)}                          >",
    		ctx
    	});

    	return block;
    }

    // (724:20) <PaginationItem class={pagina_actual === page ? "active" : ""}>
    function create_default_slot_7$2(ctx) {
    	let paginationlink;
    	let current;

    	function click_handler_4() {
    		return /*click_handler_4*/ ctx[54](/*page*/ ctx[62]);
    	}

    	paginationlink = new PaginationLink({
    			props: {
    				previous: true,
    				href: "#/education_expenditures",
    				$$slots: { default: [create_default_slot_8$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", click_handler_4);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const paginationlink_changes = {};

    			if (dirty[0] & /*ultima_pagina*/ 4 | dirty[2] & /*$$scope*/ 256) {
    				paginationlink_changes.$$scope = { dirty, ctx };
    			}

    			paginationlink.$set(paginationlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$2.name,
    		type: "slot",
    		source: "(724:20) <PaginationItem class={pagina_actual === page ? \\\"active\\\" : \\\"\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (723:18) {#each range(ultima_pagina, 1) as page}
    function create_each_block$2(ctx) {
    	let paginationitem;
    	let current;

    	paginationitem = new PaginationItem({
    			props: {
    				class: /*pagina_actual*/ ctx[1] === /*page*/ ctx[62]
    				? "active"
    				: "",
    				$$slots: { default: [create_default_slot_7$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem_changes = {};

    			if (dirty[0] & /*pagina_actual, ultima_pagina*/ 6) paginationitem_changes.class = /*pagina_actual*/ ctx[1] === /*page*/ ctx[62]
    			? "active"
    			: "";

    			if (dirty[0] & /*ultima_pagina, esBusqueda*/ 12 | dirty[2] & /*$$scope*/ 256) {
    				paginationitem_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem.$set(paginationitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(723:18) {#each range(ultima_pagina, 1) as page}",
    		ctx
    	});

    	return block;
    }

    // (733:18) <PaginationItem class={pagina_actual === ultima_pagina ? "disabled" : ""}>
    function create_default_slot_6$2(ctx) {
    	let paginationlink;
    	let current;

    	paginationlink = new PaginationLink({
    			props: {
    				next: true,
    				href: "#/education_expenditures"
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_5*/ ctx[55]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$2.name,
    		type: "slot",
    		source: "(733:18) <PaginationItem class={pagina_actual === ultima_pagina ? \\\"disabled\\\" : \\\"\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (714:16) <Pagination ariaLabel="Web pagination">
    function create_default_slot_5$2(ctx) {
    	let paginationitem0;
    	let t0;
    	let t1;
    	let paginationitem1;
    	let current;

    	paginationitem0 = new PaginationItem({
    			props: {
    				class: /*pagina_actual*/ ctx[1] === 1 ? "disabled" : "",
    				$$slots: { default: [create_default_slot_9$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let each_value = range$1(/*ultima_pagina*/ ctx[2], 1);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	paginationitem1 = new PaginationItem({
    			props: {
    				class: /*pagina_actual*/ ctx[1] === /*ultima_pagina*/ ctx[2]
    				? "disabled"
    				: "",
    				$$slots: { default: [create_default_slot_6$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem0.$$.fragment);
    			t0 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			create_component(paginationitem1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem0, target, anchor);
    			insert_dev(target, t0, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			mount_component(paginationitem1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem0_changes = {};
    			if (dirty[0] & /*pagina_actual*/ 2) paginationitem0_changes.class = /*pagina_actual*/ ctx[1] === 1 ? "disabled" : "";

    			if (dirty[0] & /*pagina_actual, offset_actual, esBusqueda*/ 11 | dirty[2] & /*$$scope*/ 256) {
    				paginationitem0_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem0.$set(paginationitem0_changes);

    			if (dirty[0] & /*pagina_actual, ultima_pagina, cambiaPagina, esBusqueda*/ 32782) {
    				each_value = range$1(/*ultima_pagina*/ ctx[2], 1);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(t1.parentNode, t1);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const paginationitem1_changes = {};

    			if (dirty[0] & /*pagina_actual, ultima_pagina*/ 6) paginationitem1_changes.class = /*pagina_actual*/ ctx[1] === /*ultima_pagina*/ ctx[2]
    			? "disabled"
    			: "";

    			if (dirty[0] & /*pagina_actual, offset_actual, esBusqueda*/ 11 | dirty[2] & /*$$scope*/ 256) {
    				paginationitem1_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem1.$set(paginationitem1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem0.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(paginationitem1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem0.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(paginationitem1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(paginationitem1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$2.name,
    		type: "slot",
    		source: "(714:16) <Pagination ariaLabel=\\\"Web pagination\\\">",
    		ctx
    	});

    	return block;
    }

    // (746:6) {#if edex_data.length==0}
    function create_if_block$5(ctx) {
    	let div;
    	let row0;
    	let t;
    	let row1;
    	let current;

    	row0 = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_3$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	row1 = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_1$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(row0.$$.fragment);
    			t = space();
    			create_component(row1.$$.fragment);
    			set_style(div, "aling-items", "center");
    			set_style(div, "justify-content", "center");
    			add_location(div, file$a, 746, 8, 28723);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(row0, div, null);
    			append_dev(div, t);
    			mount_component(row1, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row0.$$.fragment, local);
    			transition_in(row1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row0.$$.fragment, local);
    			transition_out(row1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(row0);
    			destroy_component(row1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(746:6) {#if edex_data.length==0}",
    		ctx
    	});

    	return block;
    }

    // (749:14) <Col md=12 style="text-align: center;">
    function create_default_slot_4$3(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "No existen datos cargados. Por favor, pulse el botón \"Cargar datos\".";
    			add_location(h2, file$a, 749, 18, 28872);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$3.name,
    		type: "slot",
    		source: "(749:14) <Col md=12 style=\\\"text-align: center;\\\">",
    		ctx
    	});

    	return block;
    }

    // (748:10) <Row>
    function create_default_slot_3$3(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				md: "12",
    				style: "text-align: center;",
    				$$slots: { default: [create_default_slot_4$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col_changes = {};

    			if (dirty[2] & /*$$scope*/ 256) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$3.name,
    		type: "slot",
    		source: "(748:10) <Row>",
    		ctx
    	});

    	return block;
    }

    // (756:14) <Col md=4>
    function create_default_slot_2$4(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "images/noDatos.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "noDatos");
    			add_location(img, file$a, 756, 18, 29100);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$4.name,
    		type: "slot",
    		source: "(756:14) <Col md=4>",
    		ctx
    	});

    	return block;
    }

    // (753:10) <Row>
    function create_default_slot_1$5(ctx) {
    	let col0;
    	let t0;
    	let col1;
    	let t1;
    	let col2;
    	let current;
    	col0 = new Col({ props: { md: "3" }, $$inline: true });

    	col1 = new Col({
    			props: {
    				md: "4",
    				$$slots: { default: [create_default_slot_2$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	col2 = new Col({ props: { md: "4" }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(col0.$$.fragment);
    			t0 = space();
    			create_component(col1.$$.fragment);
    			t1 = space();
    			create_component(col2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(col1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(col2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col1_changes = {};

    			if (dirty[2] & /*$$scope*/ 256) {
    				col1_changes.$$scope = { dirty, ctx };
    			}

    			col1.$set(col1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col0.$$.fragment, local);
    			transition_in(col1.$$.fragment, local);
    			transition_in(col2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col0.$$.fragment, local);
    			transition_out(col1.$$.fragment, local);
    			transition_out(col2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(col1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(col2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$5.name,
    		type: "slot",
    		source: "(753:10) <Row>",
    		ctx
    	});

    	return block;
    }

    // (781:24) <Button style="background-color: blue;">
    function create_default_slot$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Página Principal");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(781:24) <Button style=\\\"background-color: blue;\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let main;
    	let div0;
    	let row0;
    	let t0;
    	let row1;
    	let t1;
    	let br;
    	let t2;
    	let div1;
    	let t3;
    	let t4;
    	let t5;
    	let div3;
    	let footer;
    	let div2;
    	let a;
    	let button;
    	let current;

    	row0 = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_21$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	row1 = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_19$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block0 = /*edex_data*/ ctx[8].length > 1 && create_if_block_2$3(ctx);
    	let if_block1 = /*edex_data*/ ctx[8].length == 1 && create_if_block_1$4(ctx);
    	let if_block2 = /*edex_data*/ ctx[8].length == 0 && create_if_block$5(ctx);

    	button = new Button({
    			props: {
    				style: "background-color: blue;",
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			div0 = element("div");
    			create_component(row0.$$.fragment);
    			t0 = space();
    			create_component(row1.$$.fragment);
    			t1 = space();
    			br = element("br");
    			t2 = space();
    			div1 = element("div");
    			if (if_block0) if_block0.c();
    			t3 = space();
    			if (if_block1) if_block1.c();
    			t4 = space();
    			if (if_block2) if_block2.c();
    			t5 = space();
    			div3 = element("div");
    			footer = element("footer");
    			div2 = element("div");
    			a = element("a");
    			create_component(button.$$.fragment);
    			set_style(div0, "padding", "1%");
    			add_location(div0, file$a, 399, 4, 12263);
    			add_location(br, file$a, 431, 3, 13469);
    			add_location(div1, file$a, 433, 4, 13533);
    			attr_dev(a, "href", "/");
    			add_location(a, file$a, 780, 12, 29555);
    			add_location(div2, file$a, 779, 9, 29536);
    			attr_dev(footer, "class", "svelte-17je5wt");
    			add_location(footer, file$a, 776, 4, 29506);
    			attr_dev(div3, "class", "foot svelte-17je5wt");
    			set_style(div3, "min-width", "100%");
    			set_style(div3, "color", "white");
    			set_style(div3, "background-color", "#343c44");
    			set_style(div3, "min-width", "100%");
    			set_style(div3, "bottom", "0");
    			set_style(div3, "background-color", "#343c44");
    			set_style(div3, "left", "0");
    			set_style(div3, "position", "relative");
    			add_location(div3, file$a, 767, 4, 29293);
    			add_location(main, file$a, 397, 0, 12139);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);
    			mount_component(row0, div0, null);
    			append_dev(div0, t0);
    			mount_component(row1, div0, null);
    			append_dev(main, t1);
    			append_dev(main, br);
    			append_dev(main, t2);
    			append_dev(main, div1);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t3);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t4);
    			if (if_block2) if_block2.m(div1, null);
    			append_dev(main, t5);
    			append_dev(main, div3);
    			append_dev(div3, footer);
    			append_dev(footer, div2);
    			append_dev(div2, a);
    			mount_component(button, a, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row0_changes = {};

    			if (dirty[0] & /*edex_data*/ 256 | dirty[2] & /*$$scope*/ 256) {
    				row0_changes.$$scope = { dirty, ctx };
    			}

    			row0.$set(row0_changes);
    			const row1_changes = {};

    			if (dirty[0] & /*mensajeError, mensajeCorrecto*/ 192 | dirty[2] & /*$$scope*/ 256) {
    				row1_changes.$$scope = { dirty, ctx };
    			}

    			row1.$set(row1_changes);

    			if (/*edex_data*/ ctx[8].length > 1) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*edex_data*/ 256) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2$3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div1, t3);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*edex_data*/ ctx[8].length == 1) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*edex_data*/ 256) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1$4(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div1, t4);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*edex_data*/ ctx[8].length == 0) {
    				if (if_block2) {
    					if (dirty[0] & /*edex_data*/ 256) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block$5(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div1, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			const button_changes = {};

    			if (dirty[2] & /*$$scope*/ 256) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row0.$$.fragment, local);
    			transition_in(row1.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row0.$$.fragment, local);
    			transition_out(row1.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(row0);
    			destroy_component(row1);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const BASE_API_PATH$4 = "api/v1/education_expenditures";

    function range$1(ultima, inicio = 0) {
    	return [...Array(ultima).keys()].map(i => i + inicio);
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Edex_Table", slots, []);

    	let nuevoElemento = {
    		"year": "",
    		"country": "",
    		"education_expenditure_per_millions": "",
    		"education_expenditure_per_public_expenditure": "",
    		"education_expenditure_gdp": "",
    		"education_expenditure_per_capita": ""
    	};

    	let query = {
    		"c": "",
    		"y": "",
    		"apm": "", // aquellos que están por encima de un gasto de x millones en educacion
    		"upm": "", // aquellos que están por debajo de un gasto de x millones en educacion
    		"app": "", //aquellos que están por encima de un porcentaje x de gasto publico en educacion
    		"upp": "", //aquellos que están por debajo de un porcentaje x de gasto publico en educacion
    		"agdp": "", //aquellos que están por encima de un porcentaje x de pib en gasto publico en educacion
    		"ugdp": "", //aquellos que están por debajo de un porcentaje x de pib en gasto publico en educacion        
    		"apc": "", //aquellos que están por encima de una cantidad x per capita de gasto en educacion
    		"upc": "", //aquellos que están por debajo de una cantidad x per capita de gasto en educacion
    		
    	};

    	var fullQuery = "";

    	//Variables auxiliares para la muestra de errores
    	let mensajeError = "";

    	let mensajeCorrecto = "";
    	let { offset_actual = 0 } = $$props;
    	let { limit = 10 } = $$props; //Limite por defecto, opcional
    	let { pagina_actual = 1 } = $$props;
    	let { ultima_pagina = 1 } = $$props; //Se debe actualizar en función de los datos que tengamos
    	let { totalDatos = 0 } = $$props;
    	let { esBusqueda = false } = $$props;

    	//Cargamos los datos iniciales
    	var charged = false;

    	var edex_data = [];

    	//Función asincrona para la carga de datos
    	async function getStats() {
    		$$invalidate(3, esBusqueda = false);
    		console.log("Fetching data...");
    		const res = await fetch(BASE_API_PATH$4 + "?skip=" + offset_actual + "&limit=" + limit);

    		if (res.ok) {
    			console.log(BASE_API_PATH$4 + "?limit=" + limit + "&skip=" + offset_actual);
    			const json = await res.json();

    			if (json.length === undefined) {
    				$$invalidate(8, edex_data = []);
    				edex_data.push(json);
    				getTotalDatos();
    				$$invalidate(6, mensajeError = "");
    				$$invalidate(7, mensajeCorrecto = "");
    			} else {
    				$$invalidate(8, edex_data = json);
    				getTotalDatos();
    				$$invalidate(6, mensajeError = "");
    				$$invalidate(7, mensajeCorrecto = "Datos cargados correctamente");
    			}

    			$$invalidate(6, mensajeError = "");
    		} else {
    			if (res.status === 500) {
    				$$invalidate(7, mensajeCorrecto = "");
    				$$invalidate(6, mensajeError = "No se ha podido acceder a la base de datos");
    			}

    			if (edex_data.length === 0) {
    				$$invalidate(7, mensajeCorrecto = "");
    				$$invalidate(6, mensajeError = "No hay datos disponibles");
    			}
    		}
    	}

    	async function loadInitialData() {
    		//Para cargarlos hacemos un fetch a la direccion donde está el método de carga inicial
    		const peticionCarga = await fetch(BASE_API_PATH$4 + "/loadInitialData"); //Se espera hasta que termine la peticion

    		if (peticionCarga.ok) {
    			const peticionMuestra = await fetch(BASE_API_PATH$4); //Se accede a la toma de todos los elementos

    			if (peticionMuestra.ok) {
    				console.log(" Receiving data, wait a moment ...");
    				const data = await peticionMuestra.json();
    				$$invalidate(8, edex_data = data);
    				console.log(`Done! Received ${data.length} stats.`);
    				console.log(edex_data);
    				$$invalidate(6, mensajeError = "");
    				$$invalidate(7, mensajeCorrecto = "Datos insertados correctamente");
    			} else {
    				console.log("No data loaded.");
    				$$invalidate(6, mensajeError = "Los datos no han podido cargarse");
    			}
    		} else {
    			console.log("Error loading data.");
    			$$invalidate(6, mensajeError = "Error de acceso a BD");
    		}

    		charged = true;
    		console.log(edex_data.length);
    		getStats();
    	}

    	async function deleteAll() {
    		console.log(edex_data.length);

    		await fetch(BASE_API_PATH$4, { method: "DELETE" }).then(function (peticion) {
    			if (peticion.ok) {
    				$$invalidate(8, edex_data = []);
    				charged = false;
    				$$invalidate(6, mensajeError = "");
    				$$invalidate(7, mensajeCorrecto = "Datos eliminados correctamente");
    			} else if (peticion.status == 404) {
    				//no data found
    				console.log("No data found"); //Posibilidad de redirigir a una ventana similar a la de error 404

    				$$invalidate(7, mensajeCorrecto = "");
    				$$invalidate(6, mensajeError = "No se han encontrado datos para eliminar");
    			} else {
    				console.log("Error deleting DB stats");
    				$$invalidate(7, mensajeCorrecto = "");
    				$$invalidate(6, mensajeError = "Error de acceso a BD");
    			}

    			console.log(edex_data.length);
    		});
    	}

    	function removeDataInserted() {
    		$$invalidate(4, nuevoElemento = {
    			"year": "",
    			"country": "",
    			"education_expenditure_per_millions": "",
    			"education_expenditure_per_public_expenditure": "",
    			"education_expenditure_gdp": "",
    			"education_expenditure_per_capita": ""
    		});
    	}

    	

    	async function insertData() {
    		$$invalidate(4, nuevoElemento.year = parseInt(nuevoElemento.year), nuevoElemento);
    		$$invalidate(4, nuevoElemento.country = String(nuevoElemento.country), nuevoElemento);
    		$$invalidate(4, nuevoElemento.education_expenditure_per_millions = parseFloat(nuevoElemento.education_expenditure_per_millions), nuevoElemento);
    		$$invalidate(4, nuevoElemento.education_expenditure_per_public_expenditure = parseFloat(nuevoElemento.education_expenditure_per_public_expenditure), nuevoElemento);
    		$$invalidate(4, nuevoElemento.education_expenditure_gdp = parseFloat(nuevoElemento.education_expenditure_gdp), nuevoElemento);
    		$$invalidate(4, nuevoElemento.education_expenditure_per_capita = parseFloat(nuevoElemento.education_expenditure_per_capita), nuevoElemento);

    		await fetch(BASE_API_PATH$4, {
    			method: "POST",
    			body: JSON.stringify(nuevoElemento),
    			headers: { "Content-Type": "application/json" }
    		}).then(function (res) {
    			if (res.ok) {
    				$$invalidate(6, mensajeError = "");
    				$$invalidate(7, mensajeCorrecto = "Dato cargado correctamente");
    			} else {
    				if (res.status === 409) {
    					$$invalidate(7, mensajeCorrecto = "");
    					$$invalidate(6, mensajeError = "Ya existe un dato con valores idénticos para los campos año y país.");
    				} else if (res.status === 500) {
    					$$invalidate(7, mensajeCorrecto = "");
    					$$invalidate(6, mensajeError = "No se ha podido acceder a la base de datos.");
    				} else if (res.status === 400) {
    					$$invalidate(7, mensajeCorrecto = "");
    					$$invalidate(6, mensajeError = "Todos los campos deben estar rellenados según el patron predefinido.");
    				}
    			}

    			removeDataInserted();
    			getStats();
    		});
    	}

    	async function deleteElement(year, country) {
    		$$invalidate(0, offset_actual = 0);
    		$$invalidate(1, pagina_actual = 1);

    		await fetch(BASE_API_PATH$4 + "/" + country + "/" + year, { method: "DELETE" }).then(function (res) {
    			if (res.ok) {
    				console.log("OK");
    			} else {
    				if (res.status === 404) ; else if (res.status === 500) ;
    			}

    			if (esBusqueda) {
    				searchStat();
    			} else {
    				getStats();
    			}
    		});
    	}

    	async function searchStat() {
    		$$invalidate(3, esBusqueda = true);

    		var parametros = new Map(Object.entries(query).filter(introducidos => {
    				return introducidos[1] != "";
    			}));

    		let simboloQuery = "?";
    		let i = 0; //Contador para saber cuando llega al ultimo par

    		for (var [clave, valor] of parametros.entries()) {
    			i = i + 1;

    			if (i === parametros.entries().length) {
    				simboloQuery += clave + "=" + valor;
    			} else {
    				simboloQuery += clave + "=" + valor + "&";
    			}
    		}

    		fullQuery = "";
    		fullQuery = simboloQuery === "?" ? "" : simboloQuery;

    		//Comprobamos si la query está vacía
    		if (fullQuery != "") {
    			const res = await fetch(BASE_API_PATH$4 + fullQuery + "&skip=" + offset_actual + "&limit=" + limit);

    			if (res.ok) {
    				console.log("OK");
    				const json = await res.json();
    				$$invalidate(6, mensajeError = "");
    				$$invalidate(7, mensajeCorrecto = "¡Se han encontrado coincidencias!");

    				if (json.length === undefined) {
    					$$invalidate(8, edex_data = []);
    					edex_data.push(json);
    					getTotalDatosBusqueda();
    				} else {
    					$$invalidate(8, edex_data = json);
    					getTotalDatosBusqueda();
    				}
    			} else {
    				if (res.status === 404) {
    					$$invalidate(7, mensajeCorrecto = "");
    					$$invalidate(6, mensajeError = "No existen datos con esos parámetros");
    				} else if (res.status === 500) {
    					$$invalidate(7, mensajeCorrecto = "");
    					$$invalidate(6, mensajeError = "No se ha podido acceder a la base de datos");
    				}
    			}
    		} else {
    			$$invalidate(6, mensajeError = "Debe existir al menos un parámetro para realizar la búsqueda");
    		}

    		console.log(query);
    	} //Cargamos los datos en la tabla

    	function borrarQuery() {
    		$$invalidate(5, query = {
    			"c": "",
    			"y": "",
    			"apm": "",
    			"upm": "",
    			"app": "",
    			"upp": "",
    			"agdp": "",
    			"ugdp": "",
    			"apc": "",
    			"upc": ""
    		});

    		getStats();
    	}

    	function cambiaPagina(pagina, offset, busqueda) {
    		console.log("*** Cambio Página ***");
    		console.log("Parametros pagina: " + pagina + " offset: " + offset + " busqueda: " + busqueda);
    		$$invalidate(2, ultima_pagina = Math.ceil(totalDatos / limit));
    		console.log("La última página es: " + ultima_pagina);

    		if (pagina !== pagina_actual) {
    			console.log("enter if");
    			$$invalidate(0, offset_actual = offset);
    			$$invalidate(1, pagina_actual = pagina);

    			if (busqueda == false) {
    				getStats();
    			} else {
    				searchStat();
    			}
    		}

    		console.log("*** Fin Cambio Página ***");
    	}

    	async function getTotalDatos() {
    		const res = await fetch(BASE_API_PATH$4);

    		if (res.ok) {
    			const json = await res.json();
    			$$invalidate(16, totalDatos = json.length);
    			cambiaPagina(pagina_actual, offset_actual, esBusqueda);
    		} else {
    			$$invalidate(7, mensajeCorrecto = "");
    			$$invalidate(6, mensajeError = "No hay datos disponibles");
    		}
    	}

    	async function getTotalDatosBusqueda() {
    		const res = await fetch(BASE_API_PATH$4 + fullQuery);

    		if (res.ok) {
    			const json = await res.json();
    			$$invalidate(16, totalDatos = json.length);
    			cambiaPagina(pagina_actual, offset_actual, esBusqueda);
    		} else {
    			$$invalidate(7, mensajeCorrecto = "");
    			$$invalidate(6, mensajeError = "No hay datos disponibles");
    		}
    	}

    	onMount(getStats);

    	const writable_props = [
    		"offset_actual",
    		"limit",
    		"pagina_actual",
    		"ultima_pagina",
    		"totalDatos",
    		"esBusqueda"
    	];

    	Object_1$2.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$6.warn(`<Edex_Table> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		query.y = to_number(this.value);
    		$$invalidate(5, query);
    	}

    	function input1_input_handler() {
    		query.c = this.value;
    		$$invalidate(5, query);
    	}

    	function input2_input_handler() {
    		query.apm = to_number(this.value);
    		$$invalidate(5, query);
    	}

    	function input3_input_handler() {
    		query.upm = to_number(this.value);
    		$$invalidate(5, query);
    	}

    	function input4_input_handler() {
    		query.app = to_number(this.value);
    		$$invalidate(5, query);
    	}

    	function input5_input_handler() {
    		query.upp = to_number(this.value);
    		$$invalidate(5, query);
    	}

    	function input6_input_handler() {
    		query.agdp = to_number(this.value);
    		$$invalidate(5, query);
    	}

    	function input7_input_handler() {
    		query.ugdp = to_number(this.value);
    		$$invalidate(5, query);
    	}

    	function input8_input_handler() {
    		query.apc = to_number(this.value);
    		$$invalidate(5, query);
    	}

    	function input9_input_handler() {
    		query.upc = to_number(this.value);
    		$$invalidate(5, query);
    	}

    	function input0_input_handler_1() {
    		nuevoElemento.year = to_number(this.value);
    		$$invalidate(4, nuevoElemento);
    	}

    	function input1_input_handler_1() {
    		nuevoElemento.country = this.value;
    		$$invalidate(4, nuevoElemento);
    	}

    	function input2_input_handler_1() {
    		nuevoElemento.education_expenditure_per_millions = to_number(this.value);
    		$$invalidate(4, nuevoElemento);
    	}

    	function input3_input_handler_1() {
    		nuevoElemento.education_expenditure_per_public_expenditure = to_number(this.value);
    		$$invalidate(4, nuevoElemento);
    	}

    	function input4_input_handler_1() {
    		nuevoElemento.education_expenditure_gdp = to_number(this.value);
    		$$invalidate(4, nuevoElemento);
    	}

    	function input5_input_handler_1() {
    		nuevoElemento.education_expenditure_per_capita = to_number(this.value);
    		$$invalidate(4, nuevoElemento);
    	}

    	const click_handler = () => cambiaPagina(pagina_actual - 1, offset_actual - 10, esBusqueda);
    	const click_handler_1 = page => cambiaPagina(page, (page - 1) * 10, esBusqueda);
    	const click_handler_2 = () => cambiaPagina(pagina_actual + 1, offset_actual + 10, esBusqueda);

    	function input0_input_handler_2() {
    		query.y = to_number(this.value);
    		$$invalidate(5, query);
    	}

    	function input1_input_handler_2() {
    		query.c = this.value;
    		$$invalidate(5, query);
    	}

    	function input2_input_handler_2() {
    		query.apm = to_number(this.value);
    		$$invalidate(5, query);
    	}

    	function input3_input_handler_2() {
    		query.upm = to_number(this.value);
    		$$invalidate(5, query);
    	}

    	function input4_input_handler_2() {
    		query.app = to_number(this.value);
    		$$invalidate(5, query);
    	}

    	function input5_input_handler_2() {
    		query.upp = to_number(this.value);
    		$$invalidate(5, query);
    	}

    	function input6_input_handler_1() {
    		query.agdp = to_number(this.value);
    		$$invalidate(5, query);
    	}

    	function input7_input_handler_1() {
    		query.ugdp = to_number(this.value);
    		$$invalidate(5, query);
    	}

    	function input8_input_handler_1() {
    		query.apc = to_number(this.value);
    		$$invalidate(5, query);
    	}

    	function input9_input_handler_1() {
    		query.upc = to_number(this.value);
    		$$invalidate(5, query);
    	}

    	function input0_input_handler_3() {
    		nuevoElemento.year = to_number(this.value);
    		$$invalidate(4, nuevoElemento);
    	}

    	function input1_input_handler_3() {
    		nuevoElemento.country = this.value;
    		$$invalidate(4, nuevoElemento);
    	}

    	function input2_input_handler_3() {
    		nuevoElemento.education_expenditure_per_millions = to_number(this.value);
    		$$invalidate(4, nuevoElemento);
    	}

    	function input3_input_handler_3() {
    		nuevoElemento.education_expenditure_per_public_expenditure = to_number(this.value);
    		$$invalidate(4, nuevoElemento);
    	}

    	function input4_input_handler_3() {
    		nuevoElemento.education_expenditure_gdp = to_number(this.value);
    		$$invalidate(4, nuevoElemento);
    	}

    	function input5_input_handler_3() {
    		nuevoElemento.education_expenditure_per_capita = to_number(this.value);
    		$$invalidate(4, nuevoElemento);
    	}

    	const click_handler_3 = () => cambiaPagina(pagina_actual - 1, offset_actual - 10, esBusqueda);
    	const click_handler_4 = page => cambiaPagina(page, (page - 1) * 10, esBusqueda);
    	const click_handler_5 = () => cambiaPagina(pagina_actual + 1, offset_actual + 10, esBusqueda);

    	$$self.$$set = $$props => {
    		if ("offset_actual" in $$props) $$invalidate(0, offset_actual = $$props.offset_actual);
    		if ("limit" in $$props) $$invalidate(17, limit = $$props.limit);
    		if ("pagina_actual" in $$props) $$invalidate(1, pagina_actual = $$props.pagina_actual);
    		if ("ultima_pagina" in $$props) $$invalidate(2, ultima_pagina = $$props.ultima_pagina);
    		if ("totalDatos" in $$props) $$invalidate(16, totalDatos = $$props.totalDatos);
    		if ("esBusqueda" in $$props) $$invalidate(3, esBusqueda = $$props.esBusqueda);
    	};

    	$$self.$capture_state = () => ({
    		Table,
    		Button,
    		Col,
    		Row,
    		Nav,
    		Modal,
    		ModalBody,
    		ModalFooter,
    		ModalHeader,
    		NavItem,
    		NavLink,
    		Pagination,
    		PaginationItem,
    		PaginationLink,
    		onMount,
    		BASE_API_PATH: BASE_API_PATH$4,
    		nuevoElemento,
    		query,
    		fullQuery,
    		mensajeError,
    		mensajeCorrecto,
    		offset_actual,
    		limit,
    		pagina_actual,
    		ultima_pagina,
    		totalDatos,
    		esBusqueda,
    		charged,
    		edex_data,
    		getStats,
    		loadInitialData,
    		deleteAll,
    		removeDataInserted,
    		insertData,
    		deleteElement,
    		searchStat,
    		borrarQuery,
    		cambiaPagina,
    		range: range$1,
    		getTotalDatos,
    		getTotalDatosBusqueda
    	});

    	$$self.$inject_state = $$props => {
    		if ("nuevoElemento" in $$props) $$invalidate(4, nuevoElemento = $$props.nuevoElemento);
    		if ("query" in $$props) $$invalidate(5, query = $$props.query);
    		if ("fullQuery" in $$props) fullQuery = $$props.fullQuery;
    		if ("mensajeError" in $$props) $$invalidate(6, mensajeError = $$props.mensajeError);
    		if ("mensajeCorrecto" in $$props) $$invalidate(7, mensajeCorrecto = $$props.mensajeCorrecto);
    		if ("offset_actual" in $$props) $$invalidate(0, offset_actual = $$props.offset_actual);
    		if ("limit" in $$props) $$invalidate(17, limit = $$props.limit);
    		if ("pagina_actual" in $$props) $$invalidate(1, pagina_actual = $$props.pagina_actual);
    		if ("ultima_pagina" in $$props) $$invalidate(2, ultima_pagina = $$props.ultima_pagina);
    		if ("totalDatos" in $$props) $$invalidate(16, totalDatos = $$props.totalDatos);
    		if ("esBusqueda" in $$props) $$invalidate(3, esBusqueda = $$props.esBusqueda);
    		if ("charged" in $$props) charged = $$props.charged;
    		if ("edex_data" in $$props) $$invalidate(8, edex_data = $$props.edex_data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		offset_actual,
    		pagina_actual,
    		ultima_pagina,
    		esBusqueda,
    		nuevoElemento,
    		query,
    		mensajeError,
    		mensajeCorrecto,
    		edex_data,
    		loadInitialData,
    		deleteAll,
    		insertData,
    		deleteElement,
    		searchStat,
    		borrarQuery,
    		cambiaPagina,
    		totalDatos,
    		limit,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		input5_input_handler,
    		input6_input_handler,
    		input7_input_handler,
    		input8_input_handler,
    		input9_input_handler,
    		input0_input_handler_1,
    		input1_input_handler_1,
    		input2_input_handler_1,
    		input3_input_handler_1,
    		input4_input_handler_1,
    		input5_input_handler_1,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		input0_input_handler_2,
    		input1_input_handler_2,
    		input2_input_handler_2,
    		input3_input_handler_2,
    		input4_input_handler_2,
    		input5_input_handler_2,
    		input6_input_handler_1,
    		input7_input_handler_1,
    		input8_input_handler_1,
    		input9_input_handler_1,
    		input0_input_handler_3,
    		input1_input_handler_3,
    		input2_input_handler_3,
    		input3_input_handler_3,
    		input4_input_handler_3,
    		input5_input_handler_3,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5
    	];
    }

    class Edex_Table extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$a,
    			create_fragment$a,
    			safe_not_equal,
    			{
    				offset_actual: 0,
    				limit: 17,
    				pagina_actual: 1,
    				ultima_pagina: 2,
    				totalDatos: 16,
    				esBusqueda: 3
    			},
    			[-1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Edex_Table",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get offset_actual() {
    		throw new Error("<Edex_Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set offset_actual(value) {
    		throw new Error("<Edex_Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get limit() {
    		throw new Error("<Edex_Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set limit(value) {
    		throw new Error("<Edex_Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pagina_actual() {
    		throw new Error("<Edex_Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pagina_actual(value) {
    		throw new Error("<Edex_Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ultima_pagina() {
    		throw new Error("<Edex_Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ultima_pagina(value) {
    		throw new Error("<Edex_Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get totalDatos() {
    		throw new Error("<Edex_Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set totalDatos(value) {
    		throw new Error("<Edex_Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get esBusqueda() {
    		throw new Error("<Edex_Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set esBusqueda(value) {
    		throw new Error("<Edex_Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\front\education_expenditures\App_edex.svelte generated by Svelte v3.38.0 */
    const file$9 = "src\\front\\education_expenditures\\App_edex.svelte";

    function create_fragment$9(ctx) {
    	let main;
    	let div1;
    	let div0;
    	let em;
    	let h1;
    	let t1;
    	let div2;
    	let edextable;
    	let current;
    	edextable = new Edex_Table({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			div1 = element("div");
    			div0 = element("div");
    			em = element("em");
    			h1 = element("h1");
    			h1.textContent = "Gastos en educación";
    			t1 = space();
    			div2 = element("div");
    			create_component(edextable.$$.fragment);
    			attr_dev(h1, "class", "display-3");
    			set_style(h1, "text-align", "center");
    			add_location(h1, file$9, 8, 16, 390);
    			add_location(em, file$9, 8, 12, 386);
    			attr_dev(div0, "id", "interno");
    			attr_dev(div0, "class", "grid-block");
    			set_style(div0, "background-color", "rgb(245, 181, 128)");
    			set_style(div0, "border-radius", "4%");
    			set_style(div0, "padding", "1%");
    			add_location(div0, file$9, 7, 8, 261);
    			attr_dev(div1, "class", "grid-block");
    			set_style(div1, "background-image", "url('images/fondo_edex.png')");
    			set_style(div1, "width", "100%");
    			set_style(div1, "height", "100%");
    			set_style(div1, "padding", "5%");
    			add_location(div1, file$9, 6, 4, 131);
    			add_location(div2, file$9, 12, 1, 511);
    			add_location(main, file$9, 5, 0, 119);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div1);
    			append_dev(div1, div0);
    			append_dev(div0, em);
    			append_dev(em, h1);
    			append_dev(main, t1);
    			append_dev(main, div2);
    			mount_component(edextable, div2, null);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(edextable.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(edextable.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(edextable);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App_edex", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App_edex> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ EdexTable: Edex_Table, Container, Row, Col });
    	return [];
    }

    class App_edex extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App_edex",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\front\education_expenditures\Edit_data_edex.svelte generated by Svelte v3.38.0 */

    const { console: console_1$5 } = globals;
    const file$8 = "src\\front\\education_expenditures\\Edit_data_edex.svelte";

    // (91:6) <Table bordered>
    function create_default_slot_1$4(ctx) {
    	let thead;
    	let tr0;
    	let tr1;
    	let td0;
    	let t1;
    	let td1;
    	let t3;
    	let td2;
    	let t5;
    	let td3;
    	let t7;
    	let td4;
    	let t9;
    	let td5;
    	let t11;
    	let td6;
    	let t13;
    	let tbody;
    	let tr2;
    	let td7;
    	let t14;
    	let t15;
    	let td8;
    	let t16;
    	let t17;
    	let td9;
    	let input0;
    	let t18;
    	let td10;
    	let input1;
    	let t19;
    	let td11;
    	let input2;
    	let t20;
    	let td12;
    	let input3;
    	let t21;
    	let td13;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			tr1 = element("tr");
    			td0 = element("td");
    			td0.textContent = "Año";
    			t1 = space();
    			td1 = element("td");
    			td1.textContent = "País";
    			t3 = space();
    			td2 = element("td");
    			td2.textContent = "Gasto en millones de euros";
    			t5 = space();
    			td3 = element("td");
    			td3.textContent = "Porcentaje del gasto público";
    			t7 = space();
    			td4 = element("td");
    			td4.textContent = "Porcentaje del PIB";
    			t9 = space();
    			td5 = element("td");
    			td5.textContent = "Gasto per capita";
    			t11 = space();
    			td6 = element("td");
    			td6.textContent = "Acciones";
    			t13 = space();
    			tbody = element("tbody");
    			tr2 = element("tr");
    			td7 = element("td");
    			t14 = text(/*updateYear*/ ctx[2]);
    			t15 = space();
    			td8 = element("td");
    			t16 = text(/*updateCountry*/ ctx[1]);
    			t17 = space();
    			td9 = element("td");
    			input0 = element("input");
    			t18 = space();
    			td10 = element("td");
    			input1 = element("input");
    			t19 = space();
    			td11 = element("td");
    			input2 = element("input");
    			t20 = space();
    			td12 = element("td");
    			input3 = element("input");
    			t21 = space();
    			td13 = element("td");
    			button = element("button");
    			button.textContent = "Actualizar";
    			add_location(tr0, file$8, 92, 10, 3157);
    			attr_dev(td0, "valign", "middle");
    			add_location(td0, file$8, 94, 16, 3242);
    			attr_dev(td1, "valign", "middle");
    			add_location(td1, file$8, 95, 16, 3288);
    			attr_dev(td2, "valign", "middle");
    			add_location(td2, file$8, 96, 16, 3335);
    			attr_dev(td3, "valign", "middle");
    			add_location(td3, file$8, 97, 16, 3404);
    			attr_dev(td4, "valign", "middle");
    			add_location(td4, file$8, 98, 16, 3475);
    			attr_dev(td5, "valign", "middle");
    			add_location(td5, file$8, 99, 16, 3536);
    			attr_dev(td6, "valign", "middle");
    			attr_dev(td6, "colspan", "2");
    			add_location(td6, file$8, 100, 16, 3595);
    			set_style(tr1, "text-align", "center");
    			attr_dev(tr1, "valign", "middle");
    			add_location(tr1, file$8, 93, 12, 3175);
    			add_location(thead, file$8, 91, 8, 3138);
    			add_location(td7, file$8, 105, 12, 3723);
    			add_location(td8, file$8, 106, 12, 3758);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "placeholder", "250.4");
    			add_location(input0, file$8, 107, 16, 3800);
    			add_location(td9, file$8, 107, 12, 3796);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "placeholder", "112.3");
    			add_location(input1, file$8, 108, 24, 3928);
    			add_location(td10, file$8, 108, 20, 3924);
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "placeholder", "2.5");
    			add_location(input2, file$8, 109, 24, 4066);
    			add_location(td11, file$8, 109, 20, 4062);
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "placeholder", "2010");
    			add_location(input3, file$8, 110, 24, 4183);
    			add_location(td12, file$8, 110, 20, 4179);
    			attr_dev(button, "class", "btn btn-success");
    			add_location(button, file$8, 111, 24, 4308);
    			add_location(td13, file$8, 111, 20, 4304);
    			add_location(tr2, file$8, 104, 10, 3705);
    			add_location(tbody, file$8, 103, 8, 3686);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(thead, tr1);
    			append_dev(tr1, td0);
    			append_dev(tr1, t1);
    			append_dev(tr1, td1);
    			append_dev(tr1, t3);
    			append_dev(tr1, td2);
    			append_dev(tr1, t5);
    			append_dev(tr1, td3);
    			append_dev(tr1, t7);
    			append_dev(tr1, td4);
    			append_dev(tr1, t9);
    			append_dev(tr1, td5);
    			append_dev(tr1, t11);
    			append_dev(tr1, td6);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr2);
    			append_dev(tr2, td7);
    			append_dev(td7, t14);
    			append_dev(tr2, t15);
    			append_dev(tr2, td8);
    			append_dev(td8, t16);
    			append_dev(tr2, t17);
    			append_dev(tr2, td9);
    			append_dev(td9, input0);
    			set_input_value(input0, /*updateEducation_expenditure_per_millions*/ ctx[3]);
    			append_dev(tr2, t18);
    			append_dev(tr2, td10);
    			append_dev(td10, input1);
    			set_input_value(input1, /*updateEducation_expenditure_per_public_expenditure*/ ctx[4]);
    			append_dev(tr2, t19);
    			append_dev(tr2, td11);
    			append_dev(td11, input2);
    			set_input_value(input2, /*updateEducation_expenditure_gdp*/ ctx[5]);
    			append_dev(tr2, t20);
    			append_dev(tr2, td12);
    			append_dev(td12, input3);
    			set_input_value(input3, /*updateEducation_expenditure_per_capita*/ ctx[6]);
    			append_dev(tr2, t21);
    			append_dev(tr2, td13);
    			append_dev(td13, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[9]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[10]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[11]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[12]),
    					listen_dev(button, "click", /*updateStat*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*updateYear*/ 4) set_data_dev(t14, /*updateYear*/ ctx[2]);
    			if (dirty & /*updateCountry*/ 2) set_data_dev(t16, /*updateCountry*/ ctx[1]);

    			if (dirty & /*updateEducation_expenditure_per_millions*/ 8 && to_number(input0.value) !== /*updateEducation_expenditure_per_millions*/ ctx[3]) {
    				set_input_value(input0, /*updateEducation_expenditure_per_millions*/ ctx[3]);
    			}

    			if (dirty & /*updateEducation_expenditure_per_public_expenditure*/ 16 && to_number(input1.value) !== /*updateEducation_expenditure_per_public_expenditure*/ ctx[4]) {
    				set_input_value(input1, /*updateEducation_expenditure_per_public_expenditure*/ ctx[4]);
    			}

    			if (dirty & /*updateEducation_expenditure_gdp*/ 32 && to_number(input2.value) !== /*updateEducation_expenditure_gdp*/ ctx[5]) {
    				set_input_value(input2, /*updateEducation_expenditure_gdp*/ ctx[5]);
    			}

    			if (dirty & /*updateEducation_expenditure_per_capita*/ 64 && to_number(input3.value) !== /*updateEducation_expenditure_per_capita*/ ctx[6]) {
    				set_input_value(input3, /*updateEducation_expenditure_per_capita*/ ctx[6]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(tbody);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(91:6) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (116:6) {#if mensajeError}
    function create_if_block$4(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("ERROR: ");
    			t1 = text(/*mensajeError*/ ctx[7]);
    			set_style(p, "color", "red");
    			add_location(p, file$8, 116, 8, 4475);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*mensajeError*/ 128) set_data_dev(t1, /*mensajeError*/ ctx[7]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(116:6) {#if mensajeError}",
    		ctx
    	});

    	return block;
    }

    // (133:46) <Button style="background-color: blue;">
    function create_default_slot$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Página Principal");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(133:46) <Button style=\\\"background-color: blue;\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let main;
    	let div1;
    	let div0;
    	let em;
    	let h1;
    	let t0;
    	let t1_value = /*params*/ ctx[0].country + "";
    	let t1;
    	let t2;
    	let t3_value = /*params*/ ctx[0].year + "";
    	let t3;
    	let t4;
    	let br;
    	let t5;
    	let table;
    	let t6;
    	let t7;
    	let div3;
    	let footer;
    	let div2;
    	let a;
    	let button;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_1$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block = /*mensajeError*/ ctx[7] && create_if_block$4(ctx);

    	button = new Button({
    			props: {
    				style: "background-color: blue;",
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			div1 = element("div");
    			div0 = element("div");
    			em = element("em");
    			h1 = element("h1");
    			t0 = text("Modifica ");
    			t1 = text(t1_value);
    			t2 = text("/");
    			t3 = text(t3_value);
    			t4 = space();
    			br = element("br");
    			t5 = space();
    			create_component(table.$$.fragment);
    			t6 = space();
    			if (if_block) if_block.c();
    			t7 = space();
    			div3 = element("div");
    			footer = element("footer");
    			div2 = element("div");
    			a = element("a");
    			create_component(button.$$.fragment);
    			attr_dev(h1, "class", "display-3");
    			set_style(h1, "text-align", "center");
    			add_location(h1, file$8, 82, 16, 2946);
    			add_location(em, file$8, 82, 12, 2942);
    			attr_dev(div0, "id", "interno");
    			attr_dev(div0, "class", "grid-block");
    			set_style(div0, "background-color", "rgb(245, 181, 128)");
    			set_style(div0, "border-radius", "4%");
    			set_style(div0, "padding", "1%");
    			add_location(div0, file$8, 81, 8, 2817);
    			attr_dev(div1, "class", "grid-block");
    			set_style(div1, "background-image", "url('images/fondo_edex.png')");
    			set_style(div1, "width", "100%");
    			set_style(div1, "height", "100%");
    			set_style(div1, "padding", "5%");
    			add_location(div1, file$8, 80, 4, 2687);
    			add_location(br, file$8, 87, 4, 3092);
    			attr_dev(a, "href", "#/education_expenditures");
    			add_location(a, file$8, 132, 11, 4811);
    			add_location(div2, file$8, 131, 8, 4793);
    			attr_dev(footer, "class", "svelte-1eplfbf");
    			add_location(footer, file$8, 128, 6, 4764);
    			attr_dev(div3, "class", "foot svelte-1eplfbf");
    			set_style(div3, "min-width", "100%");
    			set_style(div3, "color", "white");
    			set_style(div3, "background-color", "#343c44");
    			set_style(div3, "min-width", "100%");
    			set_style(div3, "bottom", "0");
    			set_style(div3, "background-color", "#343c44");
    			set_style(div3, "left", "0");
    			set_style(div3, "position", "absolute");
    			add_location(div3, file$8, 118, 6, 4543);
    			add_location(main, file$8, 78, 0, 2673);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div1);
    			append_dev(div1, div0);
    			append_dev(div0, em);
    			append_dev(em, h1);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    			append_dev(h1, t2);
    			append_dev(h1, t3);
    			append_dev(main, t4);
    			append_dev(main, br);
    			append_dev(main, t5);
    			mount_component(table, main, null);
    			append_dev(main, t6);
    			if (if_block) if_block.m(main, null);
    			append_dev(main, t7);
    			append_dev(main, div3);
    			append_dev(div3, footer);
    			append_dev(footer, div2);
    			append_dev(div2, a);
    			mount_component(button, a, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*params*/ 1) && t1_value !== (t1_value = /*params*/ ctx[0].country + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*params*/ 1) && t3_value !== (t3_value = /*params*/ ctx[0].year + "")) set_data_dev(t3, t3_value);
    			const table_changes = {};

    			if (dirty & /*$$scope, updateEducation_expenditure_per_capita, updateEducation_expenditure_gdp, updateEducation_expenditure_per_public_expenditure, updateEducation_expenditure_per_millions, updateCountry, updateYear*/ 32894) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);

    			if (/*mensajeError*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(main, t7);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 32768) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(table);
    			if (if_block) if_block.d();
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const BASE_API_PATH$3 = "/api/v1/education_expenditures";

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Edit_data_edex", slots, []);
    	let { params = {} } = $$props;
    	let stat = {};
    	let updateCountry = "";
    	let updateYear = 0;
    	let updateEducation_expenditure_per_millions = 0;
    	let updateEducation_expenditure_per_public_expenditure = 0;
    	let updateEducation_expenditure_gdp = 0;
    	let updateEducation_expenditure_per_capita = 0;
    	let mensajeError = "";

    	async function getStat() {
    		const res = await fetch(BASE_API_PATH$3 + "/" + params.country + "/" + params.year);

    		if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			stat = json;
    			$$invalidate(1, updateCountry = stat.country);
    			$$invalidate(2, updateYear = stat.year);
    			$$invalidate(3, updateEducation_expenditure_per_millions = stat.education_expenditure_per_millions);
    			$$invalidate(4, updateEducation_expenditure_per_public_expenditure = stat.education_expenditure_per_public_expenditure);
    			$$invalidate(5, updateEducation_expenditure_gdp = stat.education_expenditure_gdp);
    			$$invalidate(6, updateEducation_expenditure_per_capita = stat.education_expenditure_per_capita);
    		} else {
    			if (res.status === 404) {
    				$$invalidate(7, mensajeError = "No se encuentra el dato solicitado");
    			} else if (res.status === 500) {
    				$$invalidate(7, mensajeError = "No se han podido acceder a la base de datos");
    			}
    		}
    	}

    	async function updateStat() {
    		await fetch(BASE_API_PATH$3 + "/" + params.country + "/" + params.year, {
    			method: "PUT",
    			body: JSON.stringify({
    				"country": params.country,
    				"year": parseInt(params.year),
    				"education_expenditure_per_millions": parseFloat(updateEducation_expenditure_per_millions),
    				"education_expenditure_per_public_expenditure": parseFloat(updateEducation_expenditure_per_public_expenditure),
    				"education_expenditure_gdp": parseFloat(updateEducation_expenditure_gdp),
    				"education_expenditure_per_capita": parseFloat(updateEducation_expenditure_per_capita)
    			}),
    			headers: { "Content-Type": "application/json" }
    		}).then(function (res) {
    			if (res.ok) {
    				getStat();
    				$$invalidate(7, mensajeError = "");
    			} else {
    				if (res.status === 500) {
    					$$invalidate(7, mensajeError = "No se han podido acceder a la base de datos");
    				} else if (res.status === 404) {
    					$$invalidate(7, mensajeError = "No se han encontrado el dato solicitado");
    				}
    			}
    		});
    	}

    	onMount(getStat);
    	const writable_props = ["params"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$5.warn(`<Edit_data_edex> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		updateEducation_expenditure_per_millions = to_number(this.value);
    		$$invalidate(3, updateEducation_expenditure_per_millions);
    	}

    	function input1_input_handler() {
    		updateEducation_expenditure_per_public_expenditure = to_number(this.value);
    		$$invalidate(4, updateEducation_expenditure_per_public_expenditure);
    	}

    	function input2_input_handler() {
    		updateEducation_expenditure_gdp = to_number(this.value);
    		$$invalidate(5, updateEducation_expenditure_gdp);
    	}

    	function input3_input_handler() {
    		updateEducation_expenditure_per_capita = to_number(this.value);
    		$$invalidate(6, updateEducation_expenditure_per_capita);
    	}

    	$$self.$$set = $$props => {
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		BASE_API_PATH: BASE_API_PATH$3,
    		params,
    		stat,
    		updateCountry,
    		updateYear,
    		updateEducation_expenditure_per_millions,
    		updateEducation_expenditure_per_public_expenditure,
    		updateEducation_expenditure_gdp,
    		updateEducation_expenditure_per_capita,
    		mensajeError,
    		getStat,
    		updateStat
    	});

    	$$self.$inject_state = $$props => {
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    		if ("stat" in $$props) stat = $$props.stat;
    		if ("updateCountry" in $$props) $$invalidate(1, updateCountry = $$props.updateCountry);
    		if ("updateYear" in $$props) $$invalidate(2, updateYear = $$props.updateYear);
    		if ("updateEducation_expenditure_per_millions" in $$props) $$invalidate(3, updateEducation_expenditure_per_millions = $$props.updateEducation_expenditure_per_millions);
    		if ("updateEducation_expenditure_per_public_expenditure" in $$props) $$invalidate(4, updateEducation_expenditure_per_public_expenditure = $$props.updateEducation_expenditure_per_public_expenditure);
    		if ("updateEducation_expenditure_gdp" in $$props) $$invalidate(5, updateEducation_expenditure_gdp = $$props.updateEducation_expenditure_gdp);
    		if ("updateEducation_expenditure_per_capita" in $$props) $$invalidate(6, updateEducation_expenditure_per_capita = $$props.updateEducation_expenditure_per_capita);
    		if ("mensajeError" in $$props) $$invalidate(7, mensajeError = $$props.mensajeError);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		params,
    		updateCountry,
    		updateYear,
    		updateEducation_expenditure_per_millions,
    		updateEducation_expenditure_per_public_expenditure,
    		updateEducation_expenditure_gdp,
    		updateEducation_expenditure_per_capita,
    		mensajeError,
    		updateStat,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler
    	];
    }

    class Edit_data_edex extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { params: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Edit_data_edex",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get params() {
    		throw new Error("<Edit_data_edex>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<Edit_data_edex>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\front\education_expenditures\Edex_Graph.svelte generated by Svelte v3.38.0 */

    const { console: console_1$4 } = globals;
    const file$7 = "src\\front\\education_expenditures\\Edex_Graph.svelte";

    function create_fragment$7(ctx) {
    	let script;
    	let script_src_value;
    	let t0;
    	let main;
    	let figure;
    	let div;
    	let t1;
    	let p;
    	let em;
    	let t3;
    	let table;
    	let thead;
    	let t4;
    	let tbody;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			script = element("script");
    			t0 = space();
    			main = element("main");
    			figure = element("figure");
    			div = element("div");
    			t1 = space();
    			p = element("p");
    			em = element("em");
    			em.textContent = "'El Gasto Público en Educación es aquel que destina el Gobierno a instituciones educativas, administración educativa y subsidios para estudiantes y otras entidades privadas a lo largo de un año.'";
    			t3 = space();
    			table = element("table");
    			thead = element("thead");
    			t4 = space();
    			tbody = element("tbody");
    			if (script.src !== (script_src_value = "https://code.highcharts.com/highcharts.js")) attr_dev(script, "src", script_src_value);
    			add_location(script, file$7, 342, 4, 9092);
    			attr_dev(div, "id", "container");
    			add_location(div, file$7, 349, 8, 9269);
    			add_location(em, file$7, 351, 16, 9420);
    			attr_dev(p, "class", "highcharts-description");
    			set_style(p, "font-size", "0.85em");
    			set_style(p, "text-align", "center");
    			set_style(p, "padding", "1em");
    			add_location(p, file$7, 350, 12, 9309);
    			add_location(thead, file$7, 354, 16, 9696);
    			add_location(tbody, file$7, 355, 16, 9729);
    			attr_dev(table, "id", "datatable");
    			add_location(table, file$7, 353, 12, 9656);
    			attr_dev(figure, "class", "highcharts-figure svelte-15u343e");
    			add_location(figure, file$7, 348, 4, 9225);
    			add_location(main, file$7, 347, 0, 9213);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, div);
    			append_dev(figure, t1);
    			append_dev(figure, p);
    			append_dev(p, em);
    			append_dev(figure, t3);
    			append_dev(figure, table);
    			append_dev(table, thead);
    			append_dev(table, t4);
    			append_dev(table, tbody);

    			if (!mounted) {
    				dispose = listen_dev(script, "load", /*cargaGrafica*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			detach_dev(script);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function compareNumbers(a, b) {
    	return a[0] - b[0];
    }

    function rangoAnyos(inic, fin) {
    	var rango = [];

    	for (var i = inic; i <= fin; i++) {
    		rango.push(i);
    	}

    	return rango;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Edex_Graph", slots, []);
    	var BASE_API_PATH = "/api/v1/education_expenditures";
    	var edex_data = [];
    	var anyos = [];
    	var paises = [];
    	var inicio = 2013;
    	var fin = 2016;
    	var data_clasif = [];

    	var clasif = [
    		"education_expenditure_per_millions",
    		"education_expenditure_per_public_expenditure",
    		"education_expenditure_gdp",
    		"education_expenditure_per_capita"
    	];

    	var datoClasif = clasif[Math.floor(Math.random() * clasif.length)];
    	var datoClasifEsp = "";
    	var conjuntoAnyos = new Set(anyos);
    	var datosGrafica = [];

    	//Declaramos los arrays que incluirán a cada uno de los paise
    	switch (datoClasif) {
    		case "education_expenditure_per_millions":
    			datoClasifEsp = "Gasto en educación en millones de Dolares";
    			break;
    		case "education_expenditure_per_public_expenditure":
    			datoClasifEsp = "Gasto en educación por gasto público";
    			break;
    		case "education_expenditure_gdp":
    			datoClasifEsp = "Gasto en educación por PIB";
    			break;
    		default:
    			datoClasifEsp = "Gasto en educación per capita";
    	}

    	//Variables para mensajes al usuario
    	var mensajeCorrecto = "";

    	var mensajeError = "";

    	//Funciones auxiliares
    	async function tomaDatosGrafica(datos) {
    		var datosFiltradosAnyo = datos.filter(e => {
    			return e.year >= inicio;
    		});

    		paises = new Array();
    		var arrayTotal = [];
    		var arrayAux1 = {};
    		var arrayAux2 = [];
    		var indice = 0;

    		for (var num in datosFiltradosAnyo) {
    			var dato = datosFiltradosAnyo[num]; //Tomamos el dato que estamos iterando

    			if (paises.indexOf(dato.country) != -1) {
    				//Comprobamos si ya hemos pasado por ese país
    				var arrayAux1 = {};

    				var arrayAux2 = [];
    				indice = paises.indexOf(dato.country);
    				arrayAux1 = arrayTotal[indice]; //Guardamos aqui el array del país

    				//Guardamos el par año,datoARepresentar
    				arrayAux2.push(dato.year);

    				arrayAux2.push(dato[datoClasif]);

    				//Lo pusheamos al array1
    				arrayAux1.data.push(arrayAux2);

    				//Modificamos el valor en el general
    				arrayTotal[indice] = arrayAux1;
    			} else {
    				//Quiere decir que es la primera vez que tomamos ese país
    				arrayAux1 = {};

    				arrayAux2 = [];

    				//Añadimos el par año, datoARepresentar
    				arrayAux2.push(dato.year);

    				arrayAux2.push(dato[datoClasif]);

    				//Lo pusheamos al array1 y luego al general
    				arrayAux1 = { name: dato.country, data: [] };

    				arrayAux1.data.push(arrayAux2);
    				arrayTotal.push(arrayAux1);

    				//Por ultimo añadimos el país a la lista de paises
    				paises.push(dato.country);
    			}
    		}

    		/*Una vez tenemos los datos de la siguiente manera

    general[pais1[[año,dato],[año,dato],..],pais2[[año,dato],[año,dato],..],[],...]

    debemos ir creando los objetos {name: pais, data: datos} de tal manera que data esté ordenado
    por años y en caso de no encontrarse el dato en algún año, el valor será null
    */
    		var arrayFinal = [];

    		var paisActual = "";
    		var datosGraficaPorPais = [];
    		var contador = 0;
    		var objeto = {};
    		var anyosAuxiliar = [];
    		var rango = rangoAnyos(inicio, fin);

    		for (var num1 in arrayTotal) {
    			contador = 0;
    			anyosAuxiliar = [];
    			arrayAux1 = {}; //Vaciamos el array auxiliar
    			arrayAux2 = []; //Vaciamos el array auxiliar
    			arrayAux1 = arrayTotal[num1]; //Guardamos el array del pais
    			paisActual = paises[num1];
    			datosGraficaPorPais = []; //Vaciamos el array de datos por pais

    			//Ordenamos los datos por años
    			arrayAux1.data.sort(compareNumbers);

    			//Lo recorremos para tener en cuenta los años presentes
    			for (var num2 in arrayAux1.data) {
    				anyosAuxiliar.push(arrayAux1.data[num2][0]); //Añadimos el año
    			}

    			//creamos el objeto que vamos a insertar en la gráfica
    			for (var num3 in rango) {
    				if (anyosAuxiliar.indexOf(rango[num3]) != -1) {
    					datosGraficaPorPais.push(arrayAux1.data[contador][1]);
    					contador++;
    				} else {
    					datosGraficaPorPais.push(0);
    				}
    			}

    			//Ya con los datos completos, creamos entonces el objeto
    			objeto = {
    				name: paisActual,
    				data: datosGraficaPorPais
    			};

    			arrayFinal.push(objeto);
    		}

    		console.log("Final:" + JSON.stringify(arrayFinal));
    		return arrayFinal;
    	}

    	//Funciones principales
    	async function getData() {
    		console.log("se ejecuta carga datos");
    		const res = await fetch(BASE_API_PATH);

    		if (res.ok) {
    			var json = await res.json();

    			if (json.length === undefined) {
    				edex_data = [];
    				edex_data.push(json);
    			} else {
    				edex_data = json;
    			}

    			mensajeError = "";
    			mensajeCorrecto = "Datos cargados correctamente";
    		} else {
    			if (res.status === 500) {
    				mensajeError = "No se ha podido acceder a la base de datos";
    				console.log("No");
    			}

    			if (edex_data.length === 0) {
    				mensajeError = "No hay datos disponibles";
    				console.log("No");
    			}
    		}

    		console.log(edex_data);

    		//tomamos los años y el dato a buscar de los elementos seleccionados
    		for (var elemento in edex_data) {
    			console.log(elemento);
    			anyos.push(edex_data[elemento].year);
    			data_clasif.push(edex_data[elemento][datoClasif]);
    		}

    		console.log("años: " + anyos);
    		console.log("datos " + datoClasifEsp + ":" + data_clasif);
    		conjuntoAnyos = new Set(anyos);
    		anyos = [...conjuntoAnyos];

    		//Tomamos los datos
    		datosGrafica = tomaDatosGrafica(edex_data);
    	}

    	async function cargaGrafica() {
    		//Peticion de datos
    		console.log("se ejecuta cargar grafica");

    		const res = await fetch(BASE_API_PATH);

    		if (res.ok) {
    			var json = await res.json();

    			if (json.length === undefined) {
    				edex_data = [];
    				edex_data.push(json);
    			} else {
    				edex_data = json;
    			}

    			mensajeError = "";
    			mensajeCorrecto = "Datos cargados correctamente";
    		} else {
    			if (res.status === 500) {
    				mensajeError = "No se ha podido acceder a la base de datos";
    				console.log("No");
    			}

    			if (edex_data.length === 0) {
    				mensajeError = "No hay datos disponibles";
    				console.log("No");
    			}
    		}

    		console.log(edex_data);

    		//tomamos los años y el dato a buscar de los elementos seleccionados
    		for (var elemento in edex_data) {
    			console.log(elemento);
    			anyos.push(edex_data[elemento].year);
    			data_clasif.push(edex_data[elemento][datoClasif]);
    		}

    		console.log("años: " + anyos);
    		console.log("datos " + datoClasifEsp + ":" + data_clasif);
    		conjuntoAnyos = new Set(anyos);
    		anyos = [...conjuntoAnyos];

    		//Tomamos los datos
    		datosGrafica = await tomaDatosGrafica(edex_data);

    		//Construccion de la grafica
    		Highcharts.chart("container", {
    			title: {
    				text: "Gasto público en educación a nivel mundial"
    			},
    			subtitle: { text: datoClasifEsp },
    			yAxis: { title: { text: datoClasifEsp } },
    			xAxis: {
    				accessibility: {
    					rangeDescription: "Range:" + inicio + "  to 2016"
    				}
    			},
    			legend: {
    				layout: "vertical",
    				align: "right",
    				verticalAlign: "middle"
    			},
    			plotOptions: {
    				series: {
    					label: { connectorAllowed: false },
    					pointStart: inicio
    				}
    			},
    			series: datosGrafica,
    			responsive: {
    				rules: [
    					{
    						condition: { maxWidth: 500 },
    						chartOptions: {
    							legend: {
    								layout: "horizontal",
    								align: "center",
    								verticalAlign: "bottom"
    							}
    						}
    					}
    				]
    			}
    		});
    	}

    	function cambiaDato(nombre) {
    		datoClasif = nombre;
    		cargaGrafica();
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$4.warn(`<Edex_Graph> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		each,
    		BASE_API_PATH,
    		edex_data,
    		anyos,
    		paises,
    		inicio,
    		fin,
    		data_clasif,
    		clasif,
    		datoClasif,
    		datoClasifEsp,
    		conjuntoAnyos,
    		datosGrafica,
    		mensajeCorrecto,
    		mensajeError,
    		tomaDatosGrafica,
    		compareNumbers,
    		rangoAnyos,
    		getData,
    		cargaGrafica,
    		cambiaDato
    	});

    	$$self.$inject_state = $$props => {
    		if ("BASE_API_PATH" in $$props) BASE_API_PATH = $$props.BASE_API_PATH;
    		if ("edex_data" in $$props) edex_data = $$props.edex_data;
    		if ("anyos" in $$props) anyos = $$props.anyos;
    		if ("paises" in $$props) paises = $$props.paises;
    		if ("inicio" in $$props) inicio = $$props.inicio;
    		if ("fin" in $$props) fin = $$props.fin;
    		if ("data_clasif" in $$props) data_clasif = $$props.data_clasif;
    		if ("clasif" in $$props) clasif = $$props.clasif;
    		if ("datoClasif" in $$props) datoClasif = $$props.datoClasif;
    		if ("datoClasifEsp" in $$props) datoClasifEsp = $$props.datoClasifEsp;
    		if ("conjuntoAnyos" in $$props) conjuntoAnyos = $$props.conjuntoAnyos;
    		if ("datosGrafica" in $$props) datosGrafica = $$props.datosGrafica;
    		if ("mensajeCorrecto" in $$props) mensajeCorrecto = $$props.mensajeCorrecto;
    		if ("mensajeError" in $$props) mensajeError = $$props.mensajeError;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [cargaGrafica];
    }

    class Edex_Graph extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Edex_Graph",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\front\illiteracy\Edit_Tables.svelte generated by Svelte v3.38.0 */

    const { Object: Object_1$1, console: console_1$3 } = globals;
    const file$6 = "src\\front\\illiteracy\\Edit_Tables.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[62] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[62] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[67] = list[i];
    	return child_ctx;
    }

    // (403:18) {:else}
    function create_else_block$1(ctx) {
    	let button0;
    	let t;
    	let button1;
    	let current;

    	button0 = new Button({
    			props: {
    				style: "background-color: green;",
    				$$slots: { default: [create_default_slot_26] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*loadInitialData*/ ctx[9]);

    	button1 = new Button({
    			props: {
    				style: "background-color: red;",
    				disabled: true,
    				$$slots: { default: [create_default_slot_25] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(button0.$$.fragment);
    			t = space();
    			create_component(button1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(button1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button0_changes = {};

    			if (dirty[2] & /*$$scope*/ 256) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[2] & /*$$scope*/ 256) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(button1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(403:18) {:else}",
    		ctx
    	});

    	return block;
    }

    // (400:18) {#if edex_data.length!=0}
    function create_if_block_5$1(ctx) {
    	let button0;
    	let t;
    	let button1;
    	let current;

    	button0 = new Button({
    			props: {
    				style: "background-color: green;",
    				disabled: true,
    				$$slots: { default: [create_default_slot_24$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				style: "background-color: red;",
    				$$slots: { default: [create_default_slot_23$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*deleteAll*/ ctx[10]);

    	const block = {
    		c: function create() {
    			create_component(button0.$$.fragment);
    			t = space();
    			create_component(button1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(button1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button0_changes = {};

    			if (dirty[2] & /*$$scope*/ 256) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[2] & /*$$scope*/ 256) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(button1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(400:18) {#if edex_data.length!=0}",
    		ctx
    	});

    	return block;
    }

    // (404:18) <Button style="background-color: green;" on:click = {loadInitialData}>
    function create_default_slot_26(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cargar datos");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_26.name,
    		type: "slot",
    		source: "(404:18) <Button style=\\\"background-color: green;\\\" on:click = {loadInitialData}>",
    		ctx
    	});

    	return block;
    }

    // (405:18) <Button style="background-color: red;" disabled>
    function create_default_slot_25(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar datos");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_25.name,
    		type: "slot",
    		source: "(405:18) <Button style=\\\"background-color: red;\\\" disabled>",
    		ctx
    	});

    	return block;
    }

    // (401:18) <Button style="background-color: green;" disabled>
    function create_default_slot_24$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cargar datos");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_24$1.name,
    		type: "slot",
    		source: "(401:18) <Button style=\\\"background-color: green;\\\" disabled>",
    		ctx
    	});

    	return block;
    }

    // (402:18) <Button style="background-color: red;" on:click = {deleteAll}>
    function create_default_slot_23$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar datos");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_23$1.name,
    		type: "slot",
    		source: "(402:18) <Button style=\\\"background-color: red;\\\" on:click = {deleteAll}>",
    		ctx
    	});

    	return block;
    }

    // (399:14) <Col>
    function create_default_slot_22$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_5$1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*edex_data*/ ctx[8].length != 0) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_22$1.name,
    		type: "slot",
    		source: "(399:14) <Col>",
    		ctx
    	});

    	return block;
    }

    // (398:10) <Row>
    function create_default_slot_21$1(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_22$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col_changes = {};

    			if (dirty[0] & /*edex_data*/ 256 | dirty[2] & /*$$scope*/ 256) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_21$1.name,
    		type: "slot",
    		source: "(398:10) <Row>",
    		ctx
    	});

    	return block;
    }

    // (415:54) 
    function create_if_block_4$1(ctx) {
    	let p;
    	let b;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			b = element("b");
    			t = text(/*mensajeCorrecto*/ ctx[7]);
    			add_location(b, file$6, 415, 45, 12470);
    			attr_dev(p, "class", "mensajeCorrecto svelte-3ztnfx");
    			add_location(p, file$6, 415, 18, 12443);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, b);
    			append_dev(b, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*mensajeCorrecto*/ 128) set_data_dev(t, /*mensajeCorrecto*/ ctx[7]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(415:54) ",
    		ctx
    	});

    	return block;
    }

    // (413:18) {#if mensajeError.length!=0}
    function create_if_block_3$1(ctx) {
    	let p;
    	let t0;
    	let b;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Se ha producido un error:");
    			b = element("b");
    			t1 = text(/*mensajeError*/ ctx[6]);
    			add_location(b, file$6, 413, 67, 12340);
    			attr_dev(p, "class", "mensajeError svelte-3ztnfx");
    			add_location(p, file$6, 413, 18, 12291);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, b);
    			append_dev(b, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*mensajeError*/ 64) set_data_dev(t1, /*mensajeError*/ ctx[6]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(413:18) {#if mensajeError.length!=0}",
    		ctx
    	});

    	return block;
    }

    // (412:14) <Col md=4 style="text-align: center;">
    function create_default_slot_20$1(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*mensajeError*/ ctx[6].length != 0) return create_if_block_3$1;
    		if (/*mensajeCorrecto*/ ctx[7].length != 0) return create_if_block_4$1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) {
    				if_block.d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_20$1.name,
    		type: "slot",
    		source: "(412:14) <Col md=4 style=\\\"text-align: center;\\\">",
    		ctx
    	});

    	return block;
    }

    // (409:10) <Row>
    function create_default_slot_19$1(ctx) {
    	let col0;
    	let t0;
    	let col1;
    	let t1;
    	let col2;
    	let current;
    	col0 = new Col({ props: { md: "4" }, $$inline: true });

    	col1 = new Col({
    			props: {
    				md: "4",
    				style: "text-align: center;",
    				$$slots: { default: [create_default_slot_20$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	col2 = new Col({ props: { md: "4" }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(col0.$$.fragment);
    			t0 = space();
    			create_component(col1.$$.fragment);
    			t1 = space();
    			create_component(col2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(col1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(col2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col1_changes = {};

    			if (dirty[0] & /*mensajeError, mensajeCorrecto*/ 192 | dirty[2] & /*$$scope*/ 256) {
    				col1_changes.$$scope = { dirty, ctx };
    			}

    			col1.$set(col1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col0.$$.fragment, local);
    			transition_in(col1.$$.fragment, local);
    			transition_in(col2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col0.$$.fragment, local);
    			transition_out(col1.$$.fragment, local);
    			transition_out(col2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(col1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(col2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_19$1.name,
    		type: "slot",
    		source: "(409:10) <Row>",
    		ctx
    	});

    	return block;
    }

    // (432:4) {#if edex_data.length> 1}
    function create_if_block_2$2(ctx) {
    	let table0;
    	let t0;
    	let table1;
    	let t1;
    	let div;
    	let pagination;
    	let current;

    	table0 = new Table({
    			props: {
    				$$slots: { default: [create_default_slot_18$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table1 = new Table({
    			props: {
    				$$slots: { default: [create_default_slot_17$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	pagination = new Pagination({
    			props: {
    				ariaLabel: "Web pagination",
    				$$slots: { default: [create_default_slot_12$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table0.$$.fragment);
    			t0 = space();
    			create_component(table1.$$.fragment);
    			t1 = space();
    			div = element("div");
    			create_component(pagination.$$.fragment);
    			add_location(div, file$6, 552, 6, 18406);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(table1, target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(pagination, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table0_changes = {};

    			if (dirty[0] & /*query*/ 32 | dirty[2] & /*$$scope*/ 256) {
    				table0_changes.$$scope = { dirty, ctx };
    			}

    			table0.$set(table0_changes);
    			const table1_changes = {};

    			if (dirty[0] & /*edex_data, nuevoElemento*/ 272 | dirty[2] & /*$$scope*/ 256) {
    				table1_changes.$$scope = { dirty, ctx };
    			}

    			table1.$set(table1_changes);
    			const pagination_changes = {};

    			if (dirty[0] & /*pagina_actual, ultima_pagina, offset_actual, esBusqueda*/ 15 | dirty[2] & /*$$scope*/ 256) {
    				pagination_changes.$$scope = { dirty, ctx };
    			}

    			pagination.$set(pagination_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table0.$$.fragment, local);
    			transition_in(table1.$$.fragment, local);
    			transition_in(pagination.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table0.$$.fragment, local);
    			transition_out(table1.$$.fragment, local);
    			transition_out(pagination.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(table1, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			destroy_component(pagination);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(432:4) {#if edex_data.length> 1}",
    		ctx
    	});

    	return block;
    }

    // (433:6) <Table>
    function create_default_slot_18$1(ctx) {
    	let thead;
    	let tr0;
    	let td0;
    	let t0;
    	let td1;
    	let t1;
    	let td2;
    	let t2;
    	let td3;
    	let h3;
    	let t4;
    	let td4;
    	let t5;
    	let td5;
    	let t6;
    	let td6;
    	let t7;
    	let tr1;
    	let td7;
    	let t9;
    	let td8;
    	let t11;
    	let td9;
    	let t13;
    	let td10;
    	let t15;
    	let td11;
    	let t17;
    	let td12;
    	let t19;
    	let td13;
    	let t21;
    	let tbody;
    	let tr2;
    	let td14;
    	let input0;
    	let t22;
    	let td15;
    	let input1;
    	let t23;
    	let td16;
    	let input2;
    	let t24;
    	let input3;
    	let t25;
    	let td17;
    	let input4;
    	let t26;
    	let input5;
    	let t27;
    	let td18;
    	let input6;
    	let t28;
    	let input7;
    	let t29;
    	let td19;
    	let div;
    	let input8;
    	let t30;
    	let input9;
    	let t31;
    	let td20;
    	let button0;
    	let t33;
    	let td21;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			td0 = element("td");
    			t0 = space();
    			td1 = element("td");
    			t1 = space();
    			td2 = element("td");
    			t2 = space();
    			td3 = element("td");
    			h3 = element("h3");
    			h3.textContent = "Busqueda";
    			t4 = space();
    			td4 = element("td");
    			t5 = space();
    			td5 = element("td");
    			t6 = space();
    			td6 = element("td");
    			t7 = space();
    			tr1 = element("tr");
    			td7 = element("td");
    			td7.textContent = "Año";
    			t9 = space();
    			td8 = element("td");
    			td8.textContent = "País";
    			t11 = space();
    			td9 = element("td");
    			td9.textContent = "Alfabetizacion de Mujeres";
    			t13 = space();
    			td10 = element("td");
    			td10.textContent = "Alfabetizacion de hombres";
    			t15 = space();
    			td11 = element("td");
    			td11.textContent = "Alfabetizacion de adultos";
    			t17 = space();
    			td12 = element("td");
    			td12.textContent = "Alfabetizacion de jovenes";
    			t19 = space();
    			td13 = element("td");
    			td13.textContent = "Acciones";
    			t21 = space();
    			tbody = element("tbody");
    			tr2 = element("tr");
    			td14 = element("td");
    			input0 = element("input");
    			t22 = space();
    			td15 = element("td");
    			input1 = element("input");
    			t23 = space();
    			td16 = element("td");
    			input2 = element("input");
    			t24 = space();
    			input3 = element("input");
    			t25 = space();
    			td17 = element("td");
    			input4 = element("input");
    			t26 = space();
    			input5 = element("input");
    			t27 = space();
    			td18 = element("td");
    			input6 = element("input");
    			t28 = space();
    			input7 = element("input");
    			t29 = space();
    			td19 = element("td");
    			div = element("div");
    			input8 = element("input");
    			t30 = space();
    			input9 = element("input");
    			t31 = space();
    			td20 = element("td");
    			button0 = element("button");
    			button0.textContent = "Buscar";
    			t33 = space();
    			td21 = element("td");
    			button1 = element("button");
    			button1.textContent = "Restaurar";
    			attr_dev(td0, "valign", "middle");
    			add_location(td0, file$6, 437, 12, 12975);
    			attr_dev(td1, "valign", "middle");
    			add_location(td1, file$6, 438, 12, 13014);
    			attr_dev(td2, "valign", "middle");
    			add_location(td2, file$6, 439, 12, 13053);
    			add_location(h3, file$6, 440, 32, 13112);
    			attr_dev(td3, "valign", "middle");
    			add_location(td3, file$6, 440, 12, 13092);
    			attr_dev(td4, "valign", "middle");
    			add_location(td4, file$6, 441, 12, 13150);
    			attr_dev(td5, "valign", "middle");
    			add_location(td5, file$6, 442, 12, 13189);
    			attr_dev(td6, "valign", "middle");
    			attr_dev(td6, "colspan", "2");
    			add_location(td6, file$6, 443, 12, 13228);
    			set_style(tr0, "text-align", "center");
    			set_style(tr0, "background-color", "rgb(150, 152, 154)");
    			attr_dev(tr0, "valign", "middle");
    			add_location(tr0, file$6, 436, 10, 12875);
    			attr_dev(td7, "valign", "middle");
    			add_location(td7, file$6, 447, 16, 13362);
    			attr_dev(td8, "valign", "middle");
    			add_location(td8, file$6, 448, 16, 13408);
    			attr_dev(td9, "valign", "middle");
    			add_location(td9, file$6, 449, 16, 13455);
    			attr_dev(td10, "valign", "middle");
    			add_location(td10, file$6, 450, 16, 13523);
    			attr_dev(td11, "valign", "middle");
    			add_location(td11, file$6, 451, 16, 13591);
    			attr_dev(td12, "valign", "middle");
    			add_location(td12, file$6, 452, 16, 13659);
    			attr_dev(td13, "valign", "middle");
    			attr_dev(td13, "colspan", "2");
    			add_location(td13, file$6, 453, 16, 13727);
    			set_style(tr1, "text-align", "center");
    			attr_dev(tr1, "valign", "middle");
    			add_location(tr1, file$6, 446, 12, 13295);
    			add_location(thead, file$6, 434, 8, 12842);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "placeholder", "2010");
    			attr_dev(input0, "min", "1950");
    			add_location(input0, file$6, 462, 20, 14057);
    			add_location(td14, file$6, 462, 16, 14053);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "Francia");
    			add_location(input1, file$6, 463, 20, 14155);
    			add_location(td15, file$6, 463, 16, 14151);
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "placeholder", "min");
    			add_location(input2, file$6, 465, 18, 14265);
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "placeholder", "max");
    			add_location(input3, file$6, 466, 18, 14349);
    			add_location(td16, file$6, 464, 16, 14241);
    			attr_dev(input4, "type", "number");
    			attr_dev(input4, "placeholder", "min");
    			add_location(input4, file$6, 470, 18, 14496);
    			attr_dev(input5, "type", "number");
    			attr_dev(input5, "placeholder", "max");
    			add_location(input5, file$6, 471, 18, 14580);
    			add_location(td17, file$6, 469, 16, 14472);
    			attr_dev(input6, "type", "number");
    			attr_dev(input6, "placeholder", "min");
    			add_location(input6, file$6, 474, 18, 14709);
    			attr_dev(input7, "type", "number");
    			attr_dev(input7, "placeholder", "max");
    			add_location(input7, file$6, 475, 18, 14794);
    			add_location(td18, file$6, 473, 16, 14685);
    			attr_dev(input8, "type", "number");
    			attr_dev(input8, "placeholder", "min");
    			attr_dev(input8, "class", "col-xs-12");
    			add_location(input8, file$6, 480, 18, 14974);
    			attr_dev(input9, "type", "number");
    			attr_dev(input9, "placeholder", "max");
    			attr_dev(input9, "class", "col-xs-12");
    			add_location(input9, file$6, 481, 18, 15076);
    			attr_dev(div, "class", "row col-xs-12");
    			add_location(div, file$6, 479, 18, 14926);
    			add_location(td19, file$6, 478, 16, 14902);
    			attr_dev(button0, "class", "btn btn-primary");
    			add_location(button0, file$6, 485, 20, 15229);
    			add_location(td20, file$6, 485, 16, 15225);
    			attr_dev(button1, "class", "btn btn-dark");
    			add_location(button1, file$6, 486, 20, 15325);
    			add_location(td21, file$6, 486, 16, 15321);
    			set_style(tr2, "text-align", "center");
    			set_style(tr2, "align-items", "center");
    			set_style(tr2, "max-width", "100%");
    			add_location(tr2, file$6, 460, 12, 13909);
    			add_location(tbody, file$6, 456, 8, 13820);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, td0);
    			append_dev(tr0, t0);
    			append_dev(tr0, td1);
    			append_dev(tr0, t1);
    			append_dev(tr0, td2);
    			append_dev(tr0, t2);
    			append_dev(tr0, td3);
    			append_dev(td3, h3);
    			append_dev(tr0, t4);
    			append_dev(tr0, td4);
    			append_dev(tr0, t5);
    			append_dev(tr0, td5);
    			append_dev(tr0, t6);
    			append_dev(tr0, td6);
    			append_dev(thead, t7);
    			append_dev(thead, tr1);
    			append_dev(tr1, td7);
    			append_dev(tr1, t9);
    			append_dev(tr1, td8);
    			append_dev(tr1, t11);
    			append_dev(tr1, td9);
    			append_dev(tr1, t13);
    			append_dev(tr1, td10);
    			append_dev(tr1, t15);
    			append_dev(tr1, td11);
    			append_dev(tr1, t17);
    			append_dev(tr1, td12);
    			append_dev(tr1, t19);
    			append_dev(tr1, td13);
    			insert_dev(target, t21, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr2);
    			append_dev(tr2, td14);
    			append_dev(td14, input0);
    			set_input_value(input0, /*query*/ ctx[5].y);
    			append_dev(tr2, t22);
    			append_dev(tr2, td15);
    			append_dev(td15, input1);
    			set_input_value(input1, /*query*/ ctx[5].c);
    			append_dev(tr2, t23);
    			append_dev(tr2, td16);
    			append_dev(td16, input2);
    			set_input_value(input2, /*query*/ ctx[5].apm);
    			append_dev(td16, t24);
    			append_dev(td16, input3);
    			set_input_value(input3, /*query*/ ctx[5].upm);
    			append_dev(tr2, t25);
    			append_dev(tr2, td17);
    			append_dev(td17, input4);
    			set_input_value(input4, /*query*/ ctx[5].app);
    			append_dev(td17, t26);
    			append_dev(td17, input5);
    			set_input_value(input5, /*query*/ ctx[5].upp);
    			append_dev(tr2, t27);
    			append_dev(tr2, td18);
    			append_dev(td18, input6);
    			set_input_value(input6, /*query*/ ctx[5].agdp);
    			append_dev(td18, t28);
    			append_dev(td18, input7);
    			set_input_value(input7, /*query*/ ctx[5].ugdp);
    			append_dev(tr2, t29);
    			append_dev(tr2, td19);
    			append_dev(td19, div);
    			append_dev(div, input8);
    			set_input_value(input8, /*query*/ ctx[5].apc);
    			append_dev(div, t30);
    			append_dev(div, input9);
    			set_input_value(input9, /*query*/ ctx[5].upc);
    			append_dev(tr2, t31);
    			append_dev(tr2, td20);
    			append_dev(td20, button0);
    			append_dev(tr2, t33);
    			append_dev(tr2, td21);
    			append_dev(td21, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[18]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[19]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[20]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[21]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[22]),
    					listen_dev(input5, "input", /*input5_input_handler*/ ctx[23]),
    					listen_dev(input6, "input", /*input6_input_handler*/ ctx[24]),
    					listen_dev(input7, "input", /*input7_input_handler*/ ctx[25]),
    					listen_dev(input8, "input", /*input8_input_handler*/ ctx[26]),
    					listen_dev(input9, "input", /*input9_input_handler*/ ctx[27]),
    					listen_dev(button0, "click", /*searchStat*/ ctx[13], false, false, false),
    					listen_dev(button1, "click", /*borrarQuery*/ ctx[14], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*query*/ 32 && to_number(input0.value) !== /*query*/ ctx[5].y) {
    				set_input_value(input0, /*query*/ ctx[5].y);
    			}

    			if (dirty[0] & /*query*/ 32 && input1.value !== /*query*/ ctx[5].c) {
    				set_input_value(input1, /*query*/ ctx[5].c);
    			}

    			if (dirty[0] & /*query*/ 32 && to_number(input2.value) !== /*query*/ ctx[5].apm) {
    				set_input_value(input2, /*query*/ ctx[5].apm);
    			}

    			if (dirty[0] & /*query*/ 32 && to_number(input3.value) !== /*query*/ ctx[5].upm) {
    				set_input_value(input3, /*query*/ ctx[5].upm);
    			}

    			if (dirty[0] & /*query*/ 32 && to_number(input4.value) !== /*query*/ ctx[5].app) {
    				set_input_value(input4, /*query*/ ctx[5].app);
    			}

    			if (dirty[0] & /*query*/ 32 && to_number(input5.value) !== /*query*/ ctx[5].upp) {
    				set_input_value(input5, /*query*/ ctx[5].upp);
    			}

    			if (dirty[0] & /*query*/ 32 && to_number(input6.value) !== /*query*/ ctx[5].agdp) {
    				set_input_value(input6, /*query*/ ctx[5].agdp);
    			}

    			if (dirty[0] & /*query*/ 32 && to_number(input7.value) !== /*query*/ ctx[5].ugdp) {
    				set_input_value(input7, /*query*/ ctx[5].ugdp);
    			}

    			if (dirty[0] & /*query*/ 32 && to_number(input8.value) !== /*query*/ ctx[5].apc) {
    				set_input_value(input8, /*query*/ ctx[5].apc);
    			}

    			if (dirty[0] & /*query*/ 32 && to_number(input9.value) !== /*query*/ ctx[5].upc) {
    				set_input_value(input9, /*query*/ ctx[5].upc);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t21);
    			if (detaching) detach_dev(tbody);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_18$1.name,
    		type: "slot",
    		source: "(433:6) <Table>",
    		ctx
    	});

    	return block;
    }

    // (536:14) {#each edex_data as stat}
    function create_each_block_2$1(ctx) {
    	let tr;
    	let th0;
    	let t0_value = /*stat*/ ctx[67].year + "";
    	let t0;
    	let t1;
    	let th1;
    	let t2_value = /*stat*/ ctx[67].country + "";
    	let t2;
    	let t3;
    	let th2;
    	let t4_value = /*stat*/ ctx[67].female_illiteracy_rate + "";
    	let t4;
    	let t5;
    	let t6;
    	let th3;
    	let t7_value = /*stat*/ ctx[67].male_illiteracy_rate + "";
    	let t7;
    	let t8;
    	let t9;
    	let th4;
    	let t10_value = /*stat*/ ctx[67].adult_illiteracy_rate + "";
    	let t10;
    	let t11;
    	let t12;
    	let th5;
    	let t13_value = /*stat*/ ctx[67].young_illiteracy_rate + "";
    	let t13;
    	let t14;
    	let t15;
    	let th6;
    	let button0;
    	let t17;
    	let th7;
    	let a;
    	let button1;
    	let a_href_value;
    	let t19;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			th0 = element("th");
    			t0 = text(t0_value);
    			t1 = space();
    			th1 = element("th");
    			t2 = text(t2_value);
    			t3 = space();
    			th2 = element("th");
    			t4 = text(t4_value);
    			t5 = text("%");
    			t6 = space();
    			th3 = element("th");
    			t7 = text(t7_value);
    			t8 = text("%");
    			t9 = space();
    			th4 = element("th");
    			t10 = text(t10_value);
    			t11 = text("%");
    			t12 = space();
    			th5 = element("th");
    			t13 = text(t13_value);
    			t14 = text("%");
    			t15 = space();
    			th6 = element("th");
    			button0 = element("button");
    			button0.textContent = "Eliminar";
    			t17 = space();
    			th7 = element("th");
    			a = element("a");
    			button1 = element("button");
    			button1.textContent = "Modificar";
    			t19 = space();
    			add_location(th0, file$6, 537, 20, 17760);
    			add_location(th1, file$6, 538, 20, 17802);
    			add_location(th2, file$6, 539, 20, 17847);
    			add_location(th3, file$6, 540, 20, 17908);
    			add_location(th4, file$6, 541, 20, 17967);
    			add_location(th5, file$6, 542, 20, 18027);
    			attr_dev(button0, "class", "btn btn-danger");
    			add_location(button0, file$6, 543, 24, 18091);
    			add_location(th6, file$6, 543, 20, 18087);
    			attr_dev(button1, "class", "btn btn-warning");
    			add_location(button1, file$6, 544, 74, 18269);
    			attr_dev(a, "href", a_href_value = "#/illiteracy/" + /*stat*/ ctx[67].country + "/" + /*stat*/ ctx[67].year);
    			add_location(a, file$6, 544, 24, 18219);
    			add_location(th7, file$6, 544, 20, 18215);
    			set_style(tr, "text-align", "center");
    			add_location(tr, file$6, 536, 16, 17705);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, th0);
    			append_dev(th0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    			append_dev(th1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, th2);
    			append_dev(th2, t4);
    			append_dev(th2, t5);
    			append_dev(tr, t6);
    			append_dev(tr, th3);
    			append_dev(th3, t7);
    			append_dev(th3, t8);
    			append_dev(tr, t9);
    			append_dev(tr, th4);
    			append_dev(th4, t10);
    			append_dev(th4, t11);
    			append_dev(tr, t12);
    			append_dev(tr, th5);
    			append_dev(th5, t13);
    			append_dev(th5, t14);
    			append_dev(tr, t15);
    			append_dev(tr, th6);
    			append_dev(th6, button0);
    			append_dev(tr, t17);
    			append_dev(tr, th7);
    			append_dev(th7, a);
    			append_dev(a, button1);
    			append_dev(tr, t19);

    			if (!mounted) {
    				dispose = listen_dev(
    					button0,
    					"click",
    					function () {
    						if (is_function(/*deleteElement*/ ctx[12](/*stat*/ ctx[67].year, /*stat*/ ctx[67].country))) /*deleteElement*/ ctx[12](/*stat*/ ctx[67].year, /*stat*/ ctx[67].country).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*edex_data*/ 256 && t0_value !== (t0_value = /*stat*/ ctx[67].year + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*edex_data*/ 256 && t2_value !== (t2_value = /*stat*/ ctx[67].country + "")) set_data_dev(t2, t2_value);
    			if (dirty[0] & /*edex_data*/ 256 && t4_value !== (t4_value = /*stat*/ ctx[67].female_illiteracy_rate + "")) set_data_dev(t4, t4_value);
    			if (dirty[0] & /*edex_data*/ 256 && t7_value !== (t7_value = /*stat*/ ctx[67].male_illiteracy_rate + "")) set_data_dev(t7, t7_value);
    			if (dirty[0] & /*edex_data*/ 256 && t10_value !== (t10_value = /*stat*/ ctx[67].adult_illiteracy_rate + "")) set_data_dev(t10, t10_value);
    			if (dirty[0] & /*edex_data*/ 256 && t13_value !== (t13_value = /*stat*/ ctx[67].young_illiteracy_rate + "")) set_data_dev(t13, t13_value);

    			if (dirty[0] & /*edex_data*/ 256 && a_href_value !== (a_href_value = "#/illiteracy/" + /*stat*/ ctx[67].country + "/" + /*stat*/ ctx[67].year)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$1.name,
    		type: "each",
    		source: "(536:14) {#each edex_data as stat}",
    		ctx
    	});

    	return block;
    }

    // (496:6) <Table>
    function create_default_slot_17$1(ctx) {
    	let thead;
    	let tr0;
    	let td0;
    	let t0;
    	let td1;
    	let t1;
    	let td2;
    	let t2;
    	let td3;
    	let h3;
    	let t4;
    	let td4;
    	let t5;
    	let td5;
    	let t6;
    	let td6;
    	let t7;
    	let tr1;
    	let td7;
    	let t9;
    	let td8;
    	let t11;
    	let td9;
    	let t13;
    	let td10;
    	let t15;
    	let td11;
    	let t17;
    	let td12;
    	let t19;
    	let td13;
    	let t21;
    	let tbody;
    	let tr2;
    	let td14;
    	let input0;
    	let t22;
    	let td15;
    	let input1;
    	let t23;
    	let td16;
    	let input2;
    	let t24;
    	let td17;
    	let input3;
    	let t25;
    	let td18;
    	let input4;
    	let t26;
    	let td19;
    	let input5;
    	let t27;
    	let td20;
    	let button;
    	let t29;
    	let td21;
    	let t30;
    	let mounted;
    	let dispose;
    	let each_value_2 = /*edex_data*/ ctx[8];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			td0 = element("td");
    			t0 = space();
    			td1 = element("td");
    			t1 = space();
    			td2 = element("td");
    			t2 = space();
    			td3 = element("td");
    			h3 = element("h3");
    			h3.textContent = "Datos";
    			t4 = space();
    			td4 = element("td");
    			t5 = space();
    			td5 = element("td");
    			t6 = space();
    			td6 = element("td");
    			t7 = space();
    			tr1 = element("tr");
    			td7 = element("td");
    			td7.textContent = "Año";
    			t9 = space();
    			td8 = element("td");
    			td8.textContent = "País";
    			t11 = space();
    			td9 = element("td");
    			td9.textContent = "Alfabetizacion de Mujeres";
    			t13 = space();
    			td10 = element("td");
    			td10.textContent = "Alfabetizacion de hombres";
    			t15 = space();
    			td11 = element("td");
    			td11.textContent = "Alfabetizacion de adultos";
    			t17 = space();
    			td12 = element("td");
    			td12.textContent = "Alfabetizacion de jovenes";
    			t19 = space();
    			td13 = element("td");
    			td13.textContent = "Acciones";
    			t21 = space();
    			tbody = element("tbody");
    			tr2 = element("tr");
    			td14 = element("td");
    			input0 = element("input");
    			t22 = space();
    			td15 = element("td");
    			input1 = element("input");
    			t23 = space();
    			td16 = element("td");
    			input2 = element("input");
    			t24 = space();
    			td17 = element("td");
    			input3 = element("input");
    			t25 = space();
    			td18 = element("td");
    			input4 = element("input");
    			t26 = space();
    			td19 = element("td");
    			input5 = element("input");
    			t27 = space();
    			td20 = element("td");
    			button = element("button");
    			button.textContent = "Insertar";
    			t29 = space();
    			td21 = element("td");
    			t30 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(td0, "valign", "middle");
    			add_location(td0, file$6, 499, 14, 15732);
    			attr_dev(td1, "valign", "middle");
    			add_location(td1, file$6, 500, 14, 15773);
    			attr_dev(td2, "valign", "middle");
    			add_location(td2, file$6, 501, 14, 15814);
    			add_location(h3, file$6, 502, 35, 15876);
    			attr_dev(td3, "valign", "middle");
    			add_location(td3, file$6, 502, 14, 15855);
    			attr_dev(td4, "valign", "middle");
    			add_location(td4, file$6, 503, 14, 15911);
    			attr_dev(td5, "valign", "middle");
    			add_location(td5, file$6, 504, 14, 15952);
    			attr_dev(td6, "valign", "middle");
    			attr_dev(td6, "colspan", "2");
    			add_location(td6, file$6, 505, 14, 15993);
    			set_style(tr0, "text-align", "center");
    			set_style(tr0, "background-color", "rgb(150, 152, 154)");
    			set_style(tr0, "max-width", "100%");
    			attr_dev(tr0, "valign", "middle");
    			add_location(tr0, file$6, 498, 12, 15613);
    			attr_dev(td7, "valign", "middle");
    			add_location(td7, file$6, 510, 18, 16164);
    			attr_dev(td8, "valign", "middle");
    			add_location(td8, file$6, 511, 18, 16212);
    			attr_dev(td9, "valign", "middle");
    			add_location(td9, file$6, 512, 18, 16261);
    			attr_dev(td10, "valign", "middle");
    			add_location(td10, file$6, 513, 18, 16331);
    			attr_dev(td11, "valign", "middle");
    			add_location(td11, file$6, 514, 18, 16401);
    			attr_dev(td12, "valign", "middle");
    			add_location(td12, file$6, 515, 18, 16471);
    			attr_dev(td13, "valign", "middle");
    			attr_dev(td13, "colspan", "2");
    			add_location(td13, file$6, 516, 18, 16541);
    			set_style(tr1, "text-align", "center");
    			attr_dev(tr1, "valign", "middle");
    			add_location(tr1, file$6, 509, 14, 16095);
    			add_location(thead, file$6, 497, 10, 15590);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "placeholder", "2010");
    			attr_dev(input0, "min", "1900");
    			add_location(input0, file$6, 525, 24, 16806);
    			add_location(td14, file$6, 525, 20, 16802);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "Francia");
    			add_location(input1, file$6, 526, 24, 16919);
    			add_location(td15, file$6, 526, 20, 16915);
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "placeholder", "250.4");
    			add_location(input2, file$6, 527, 24, 17027);
    			add_location(td16, file$6, 527, 20, 17023);
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "placeholder", "112.3");
    			add_location(input3, file$6, 528, 24, 17151);
    			add_location(td17, file$6, 528, 20, 17147);
    			attr_dev(input4, "type", "number");
    			attr_dev(input4, "placeholder", "2.5");
    			add_location(input4, file$6, 529, 24, 17273);
    			add_location(td18, file$6, 529, 20, 17269);
    			attr_dev(input5, "type", "number");
    			attr_dev(input5, "placeholder", "2010");
    			add_location(input5, file$6, 530, 24, 17394);
    			add_location(td19, file$6, 530, 20, 17390);
    			attr_dev(button, "class", "btn btn-success");
    			add_location(button, file$6, 531, 24, 17516);
    			add_location(td20, file$6, 531, 20, 17512);
    			add_location(td21, file$6, 532, 20, 17614);
    			add_location(tr2, file$6, 523, 14, 16718);
    			add_location(tbody, file$6, 519, 10, 16640);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, td0);
    			append_dev(tr0, t0);
    			append_dev(tr0, td1);
    			append_dev(tr0, t1);
    			append_dev(tr0, td2);
    			append_dev(tr0, t2);
    			append_dev(tr0, td3);
    			append_dev(td3, h3);
    			append_dev(tr0, t4);
    			append_dev(tr0, td4);
    			append_dev(tr0, t5);
    			append_dev(tr0, td5);
    			append_dev(tr0, t6);
    			append_dev(tr0, td6);
    			append_dev(thead, t7);
    			append_dev(thead, tr1);
    			append_dev(tr1, td7);
    			append_dev(tr1, t9);
    			append_dev(tr1, td8);
    			append_dev(tr1, t11);
    			append_dev(tr1, td9);
    			append_dev(tr1, t13);
    			append_dev(tr1, td10);
    			append_dev(tr1, t15);
    			append_dev(tr1, td11);
    			append_dev(tr1, t17);
    			append_dev(tr1, td12);
    			append_dev(tr1, t19);
    			append_dev(tr1, td13);
    			insert_dev(target, t21, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr2);
    			append_dev(tr2, td14);
    			append_dev(td14, input0);
    			set_input_value(input0, /*nuevoElemento*/ ctx[4].year);
    			append_dev(tr2, t22);
    			append_dev(tr2, td15);
    			append_dev(td15, input1);
    			set_input_value(input1, /*nuevoElemento*/ ctx[4].country);
    			append_dev(tr2, t23);
    			append_dev(tr2, td16);
    			append_dev(td16, input2);
    			set_input_value(input2, /*nuevoElemento*/ ctx[4].female_illiteracy_rate);
    			append_dev(tr2, t24);
    			append_dev(tr2, td17);
    			append_dev(td17, input3);
    			set_input_value(input3, /*nuevoElemento*/ ctx[4].male_illiteracy_rate);
    			append_dev(tr2, t25);
    			append_dev(tr2, td18);
    			append_dev(td18, input4);
    			set_input_value(input4, /*nuevoElemento*/ ctx[4].adult_illiteracy_rate);
    			append_dev(tr2, t26);
    			append_dev(tr2, td19);
    			append_dev(td19, input5);
    			set_input_value(input5, /*nuevoElemento*/ ctx[4].young_illiteracy_rate);
    			append_dev(tr2, t27);
    			append_dev(tr2, td20);
    			append_dev(td20, button);
    			append_dev(tr2, t29);
    			append_dev(tr2, td21);
    			append_dev(tbody, t30);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler_1*/ ctx[28]),
    					listen_dev(input1, "input", /*input1_input_handler_1*/ ctx[29]),
    					listen_dev(input2, "input", /*input2_input_handler_1*/ ctx[30]),
    					listen_dev(input3, "input", /*input3_input_handler_1*/ ctx[31]),
    					listen_dev(input4, "input", /*input4_input_handler_1*/ ctx[32]),
    					listen_dev(input5, "input", /*input5_input_handler_1*/ ctx[33]),
    					listen_dev(button, "click", /*insertData*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*nuevoElemento*/ 16 && to_number(input0.value) !== /*nuevoElemento*/ ctx[4].year) {
    				set_input_value(input0, /*nuevoElemento*/ ctx[4].year);
    			}

    			if (dirty[0] & /*nuevoElemento*/ 16 && input1.value !== /*nuevoElemento*/ ctx[4].country) {
    				set_input_value(input1, /*nuevoElemento*/ ctx[4].country);
    			}

    			if (dirty[0] & /*nuevoElemento*/ 16 && to_number(input2.value) !== /*nuevoElemento*/ ctx[4].female_illiteracy_rate) {
    				set_input_value(input2, /*nuevoElemento*/ ctx[4].female_illiteracy_rate);
    			}

    			if (dirty[0] & /*nuevoElemento*/ 16 && to_number(input3.value) !== /*nuevoElemento*/ ctx[4].male_illiteracy_rate) {
    				set_input_value(input3, /*nuevoElemento*/ ctx[4].male_illiteracy_rate);
    			}

    			if (dirty[0] & /*nuevoElemento*/ 16 && to_number(input4.value) !== /*nuevoElemento*/ ctx[4].adult_illiteracy_rate) {
    				set_input_value(input4, /*nuevoElemento*/ ctx[4].adult_illiteracy_rate);
    			}

    			if (dirty[0] & /*nuevoElemento*/ 16 && to_number(input5.value) !== /*nuevoElemento*/ ctx[4].young_illiteracy_rate) {
    				set_input_value(input5, /*nuevoElemento*/ ctx[4].young_illiteracy_rate);
    			}

    			if (dirty[0] & /*edex_data, deleteElement*/ 4352) {
    				each_value_2 = /*edex_data*/ ctx[8];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$1(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t21);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_17$1.name,
    		type: "slot",
    		source: "(496:6) <Table>",
    		ctx
    	});

    	return block;
    }

    // (556:10) <PaginationItem class={pagina_actual === 1 ? "disabled" : ""}>
    function create_default_slot_16$1(ctx) {
    	let paginationlink;
    	let current;

    	paginationlink = new PaginationLink({
    			props: { previous: true, href: "#/illiteracy" },
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler*/ ctx[34]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_16$1.name,
    		type: "slot",
    		source: "(556:10) <PaginationItem class={pagina_actual === 1 ? \\\"disabled\\\" : \\\"\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (566:14) <PaginationLink                  previous                  href="#/illiteracy"                  on:click={() => cambiaPagina(page, (page - 1) * 10, esBusqueda)}                  >
    function create_default_slot_15$1(ctx) {
    	let t_value = /*page*/ ctx[62] + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*ultima_pagina*/ 4 && t_value !== (t_value = /*page*/ ctx[62] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_15$1.name,
    		type: "slot",
    		source: "(566:14) <PaginationLink                  previous                  href=\\\"#/illiteracy\\\"                  on:click={() => cambiaPagina(page, (page - 1) * 10, esBusqueda)}                  >",
    		ctx
    	});

    	return block;
    }

    // (565:12) <PaginationItem class={pagina_actual === page ? "active" : ""}>
    function create_default_slot_14$1(ctx) {
    	let paginationlink;
    	let current;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[35](/*page*/ ctx[62]);
    	}

    	paginationlink = new PaginationLink({
    			props: {
    				previous: true,
    				href: "#/illiteracy",
    				$$slots: { default: [create_default_slot_15$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", click_handler_1);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const paginationlink_changes = {};

    			if (dirty[0] & /*ultima_pagina*/ 4 | dirty[2] & /*$$scope*/ 256) {
    				paginationlink_changes.$$scope = { dirty, ctx };
    			}

    			paginationlink.$set(paginationlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14$1.name,
    		type: "slot",
    		source: "(565:12) <PaginationItem class={pagina_actual === page ? \\\"active\\\" : \\\"\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (564:10) {#each range(ultima_pagina, 1) as page}
    function create_each_block_1$1(ctx) {
    	let paginationitem;
    	let current;

    	paginationitem = new PaginationItem({
    			props: {
    				class: /*pagina_actual*/ ctx[1] === /*page*/ ctx[62]
    				? "active"
    				: "",
    				$$slots: { default: [create_default_slot_14$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem_changes = {};

    			if (dirty[0] & /*pagina_actual, ultima_pagina*/ 6) paginationitem_changes.class = /*pagina_actual*/ ctx[1] === /*page*/ ctx[62]
    			? "active"
    			: "";

    			if (dirty[0] & /*ultima_pagina, esBusqueda*/ 12 | dirty[2] & /*$$scope*/ 256) {
    				paginationitem_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem.$set(paginationitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(564:10) {#each range(ultima_pagina, 1) as page}",
    		ctx
    	});

    	return block;
    }

    // (574:10) <PaginationItem class={pagina_actual === ultima_pagina ? "disabled" : ""}>
    function create_default_slot_13$1(ctx) {
    	let paginationlink;
    	let current;

    	paginationlink = new PaginationLink({
    			props: { next: true, href: "#/illiteracy" },
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_2*/ ctx[36]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13$1.name,
    		type: "slot",
    		source: "(574:10) <PaginationItem class={pagina_actual === ultima_pagina ? \\\"disabled\\\" : \\\"\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (555:8) <Pagination ariaLabel="Web pagination">
    function create_default_slot_12$1(ctx) {
    	let paginationitem0;
    	let t0;
    	let t1;
    	let paginationitem1;
    	let current;

    	paginationitem0 = new PaginationItem({
    			props: {
    				class: /*pagina_actual*/ ctx[1] === 1 ? "disabled" : "",
    				$$slots: { default: [create_default_slot_16$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let each_value_1 = range(/*ultima_pagina*/ ctx[2], 1);
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	paginationitem1 = new PaginationItem({
    			props: {
    				class: /*pagina_actual*/ ctx[1] === /*ultima_pagina*/ ctx[2]
    				? "disabled"
    				: "",
    				$$slots: { default: [create_default_slot_13$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem0.$$.fragment);
    			t0 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			create_component(paginationitem1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem0, target, anchor);
    			insert_dev(target, t0, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			mount_component(paginationitem1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem0_changes = {};
    			if (dirty[0] & /*pagina_actual*/ 2) paginationitem0_changes.class = /*pagina_actual*/ ctx[1] === 1 ? "disabled" : "";

    			if (dirty[0] & /*pagina_actual, offset_actual, esBusqueda*/ 11 | dirty[2] & /*$$scope*/ 256) {
    				paginationitem0_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem0.$set(paginationitem0_changes);

    			if (dirty[0] & /*pagina_actual, ultima_pagina, cambiaPagina, esBusqueda*/ 32782) {
    				each_value_1 = range(/*ultima_pagina*/ ctx[2], 1);
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(t1.parentNode, t1);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const paginationitem1_changes = {};

    			if (dirty[0] & /*pagina_actual, ultima_pagina*/ 6) paginationitem1_changes.class = /*pagina_actual*/ ctx[1] === /*ultima_pagina*/ ctx[2]
    			? "disabled"
    			: "";

    			if (dirty[0] & /*pagina_actual, offset_actual, esBusqueda*/ 11 | dirty[2] & /*$$scope*/ 256) {
    				paginationitem1_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem1.$set(paginationitem1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem0.$$.fragment, local);

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(paginationitem1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem0.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(paginationitem1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(paginationitem1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12$1.name,
    		type: "slot",
    		source: "(555:8) <Pagination ariaLabel=\\\"Web pagination\\\">",
    		ctx
    	});

    	return block;
    }

    // (594:4) {#if edex_data.length==1}
    function create_if_block_1$3(ctx) {
    	let table0;
    	let t0;
    	let table1;
    	let t1;
    	let div;
    	let pagination;
    	let current;

    	table0 = new Table({
    			props: {
    				$$slots: { default: [create_default_slot_11$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table1 = new Table({
    			props: {
    				$$slots: { default: [create_default_slot_10$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	pagination = new Pagination({
    			props: {
    				ariaLabel: "Web pagination",
    				$$slots: { default: [create_default_slot_5$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table0.$$.fragment);
    			t0 = space();
    			create_component(table1.$$.fragment);
    			t1 = space();
    			div = element("div");
    			create_component(pagination.$$.fragment);
    			add_location(div, file$6, 708, 12, 25673);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(table1, target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(pagination, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table0_changes = {};

    			if (dirty[0] & /*query*/ 32 | dirty[2] & /*$$scope*/ 256) {
    				table0_changes.$$scope = { dirty, ctx };
    			}

    			table0.$set(table0_changes);
    			const table1_changes = {};

    			if (dirty[0] & /*edex_data, nuevoElemento*/ 272 | dirty[2] & /*$$scope*/ 256) {
    				table1_changes.$$scope = { dirty, ctx };
    			}

    			table1.$set(table1_changes);
    			const pagination_changes = {};

    			if (dirty[0] & /*pagina_actual, ultima_pagina, offset_actual, esBusqueda*/ 15 | dirty[2] & /*$$scope*/ 256) {
    				pagination_changes.$$scope = { dirty, ctx };
    			}

    			pagination.$set(pagination_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table0.$$.fragment, local);
    			transition_in(table1.$$.fragment, local);
    			transition_in(pagination.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table0.$$.fragment, local);
    			transition_out(table1.$$.fragment, local);
    			transition_out(pagination.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(table1, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			destroy_component(pagination);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(594:4) {#if edex_data.length==1}",
    		ctx
    	});

    	return block;
    }

    // (596:6) <Table>
    function create_default_slot_11$1(ctx) {
    	let thead;
    	let tr0;
    	let td0;
    	let t0;
    	let td1;
    	let t1;
    	let td2;
    	let t2;
    	let td3;
    	let h3;
    	let t4;
    	let td4;
    	let t5;
    	let td5;
    	let t6;
    	let td6;
    	let t7;
    	let tr1;
    	let td7;
    	let t9;
    	let td8;
    	let t11;
    	let td9;
    	let t13;
    	let td10;
    	let t15;
    	let td11;
    	let t17;
    	let td12;
    	let t19;
    	let td13;
    	let t21;
    	let tbody;
    	let tr2;
    	let td14;
    	let input0;
    	let t22;
    	let td15;
    	let input1;
    	let t23;
    	let td16;
    	let input2;
    	let t24;
    	let input3;
    	let t25;
    	let td17;
    	let input4;
    	let t26;
    	let input5;
    	let t27;
    	let td18;
    	let input6;
    	let t28;
    	let input7;
    	let t29;
    	let td19;
    	let div;
    	let input8;
    	let t30;
    	let input9;
    	let t31;
    	let td20;
    	let button0;
    	let t33;
    	let td21;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			td0 = element("td");
    			t0 = space();
    			td1 = element("td");
    			t1 = space();
    			td2 = element("td");
    			t2 = space();
    			td3 = element("td");
    			h3 = element("h3");
    			h3.textContent = "Busqueda";
    			t4 = space();
    			td4 = element("td");
    			t5 = space();
    			td5 = element("td");
    			t6 = space();
    			td6 = element("td");
    			t7 = space();
    			tr1 = element("tr");
    			td7 = element("td");
    			td7.textContent = "Año";
    			t9 = space();
    			td8 = element("td");
    			td8.textContent = "País";
    			t11 = space();
    			td9 = element("td");
    			td9.textContent = "Alfabetizacion de Mujeres";
    			t13 = space();
    			td10 = element("td");
    			td10.textContent = "Alfabetizacion de hombres";
    			t15 = space();
    			td11 = element("td");
    			td11.textContent = "Alfabetizacion de adultos";
    			t17 = space();
    			td12 = element("td");
    			td12.textContent = "Alfabetizacion de jovenes";
    			t19 = space();
    			td13 = element("td");
    			td13.textContent = "Acciones";
    			t21 = space();
    			tbody = element("tbody");
    			tr2 = element("tr");
    			td14 = element("td");
    			input0 = element("input");
    			t22 = space();
    			td15 = element("td");
    			input1 = element("input");
    			t23 = space();
    			td16 = element("td");
    			input2 = element("input");
    			t24 = space();
    			input3 = element("input");
    			t25 = space();
    			td17 = element("td");
    			input4 = element("input");
    			t26 = space();
    			input5 = element("input");
    			t27 = space();
    			td18 = element("td");
    			input6 = element("input");
    			t28 = space();
    			input7 = element("input");
    			t29 = space();
    			td19 = element("td");
    			div = element("div");
    			input8 = element("input");
    			t30 = space();
    			input9 = element("input");
    			t31 = space();
    			td20 = element("td");
    			button0 = element("button");
    			button0.textContent = "Buscar";
    			t33 = space();
    			td21 = element("td");
    			button1 = element("button");
    			button1.textContent = "Restaurar";
    			attr_dev(td0, "valign", "middle");
    			add_location(td0, file$6, 600, 12, 19953);
    			attr_dev(td1, "valign", "middle");
    			add_location(td1, file$6, 601, 12, 19992);
    			attr_dev(td2, "valign", "middle");
    			add_location(td2, file$6, 602, 12, 20031);
    			add_location(h3, file$6, 603, 32, 20090);
    			attr_dev(td3, "valign", "middle");
    			add_location(td3, file$6, 603, 12, 20070);
    			attr_dev(td4, "valign", "middle");
    			add_location(td4, file$6, 604, 12, 20128);
    			attr_dev(td5, "valign", "middle");
    			add_location(td5, file$6, 605, 12, 20167);
    			attr_dev(td6, "valign", "middle");
    			attr_dev(td6, "colspan", "2");
    			add_location(td6, file$6, 606, 12, 20206);
    			set_style(tr0, "text-align", "center");
    			set_style(tr0, "background-color", "rgb(150, 152, 154)");
    			attr_dev(tr0, "valign", "middle");
    			add_location(tr0, file$6, 599, 10, 19853);
    			attr_dev(td7, "valign", "middle");
    			add_location(td7, file$6, 610, 16, 20340);
    			attr_dev(td8, "valign", "middle");
    			add_location(td8, file$6, 611, 16, 20386);
    			attr_dev(td9, "valign", "middle");
    			add_location(td9, file$6, 612, 16, 20433);
    			attr_dev(td10, "valign", "middle");
    			add_location(td10, file$6, 613, 16, 20501);
    			attr_dev(td11, "valign", "middle");
    			add_location(td11, file$6, 614, 16, 20569);
    			attr_dev(td12, "valign", "middle");
    			add_location(td12, file$6, 615, 16, 20637);
    			attr_dev(td13, "valign", "middle");
    			attr_dev(td13, "colspan", "2");
    			add_location(td13, file$6, 616, 16, 20705);
    			set_style(tr1, "text-align", "center");
    			attr_dev(tr1, "valign", "middle");
    			add_location(tr1, file$6, 609, 12, 20273);
    			add_location(thead, file$6, 597, 8, 19820);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "placeholder", "2010");
    			attr_dev(input0, "min", "1950");
    			add_location(input0, file$6, 625, 20, 21035);
    			add_location(td14, file$6, 625, 16, 21031);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "Francia");
    			add_location(input1, file$6, 626, 20, 21133);
    			add_location(td15, file$6, 626, 16, 21129);
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "placeholder", "min");
    			add_location(input2, file$6, 628, 18, 21243);
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "placeholder", "max");
    			add_location(input3, file$6, 629, 18, 21327);
    			add_location(td16, file$6, 627, 16, 21219);
    			attr_dev(input4, "type", "number");
    			attr_dev(input4, "placeholder", "min");
    			add_location(input4, file$6, 633, 18, 21474);
    			attr_dev(input5, "type", "number");
    			attr_dev(input5, "placeholder", "max");
    			add_location(input5, file$6, 634, 18, 21558);
    			add_location(td17, file$6, 632, 16, 21450);
    			attr_dev(input6, "type", "number");
    			attr_dev(input6, "placeholder", "max");
    			add_location(input6, file$6, 637, 18, 21687);
    			attr_dev(input7, "type", "number");
    			attr_dev(input7, "placeholder", "min");
    			add_location(input7, file$6, 638, 18, 21772);
    			add_location(td18, file$6, 636, 16, 21663);
    			attr_dev(input8, "type", "number");
    			attr_dev(input8, "placeholder", "max");
    			attr_dev(input8, "class", "col-xs-12");
    			add_location(input8, file$6, 643, 18, 21952);
    			attr_dev(input9, "type", "number");
    			attr_dev(input9, "placeholder", "min");
    			attr_dev(input9, "class", "col-xs-12");
    			add_location(input9, file$6, 644, 18, 22054);
    			attr_dev(div, "class", "row col-xs-12");
    			add_location(div, file$6, 642, 18, 21904);
    			add_location(td19, file$6, 641, 16, 21880);
    			attr_dev(button0, "class", "btn btn-primary");
    			add_location(button0, file$6, 648, 20, 22207);
    			add_location(td20, file$6, 648, 16, 22203);
    			attr_dev(button1, "class", "btn btn-dark");
    			add_location(button1, file$6, 649, 20, 22303);
    			add_location(td21, file$6, 649, 16, 22299);
    			set_style(tr2, "text-align", "center");
    			set_style(tr2, "align-items", "center");
    			set_style(tr2, "max-width", "100%");
    			add_location(tr2, file$6, 623, 12, 20887);
    			add_location(tbody, file$6, 619, 8, 20798);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, td0);
    			append_dev(tr0, t0);
    			append_dev(tr0, td1);
    			append_dev(tr0, t1);
    			append_dev(tr0, td2);
    			append_dev(tr0, t2);
    			append_dev(tr0, td3);
    			append_dev(td3, h3);
    			append_dev(tr0, t4);
    			append_dev(tr0, td4);
    			append_dev(tr0, t5);
    			append_dev(tr0, td5);
    			append_dev(tr0, t6);
    			append_dev(tr0, td6);
    			append_dev(thead, t7);
    			append_dev(thead, tr1);
    			append_dev(tr1, td7);
    			append_dev(tr1, t9);
    			append_dev(tr1, td8);
    			append_dev(tr1, t11);
    			append_dev(tr1, td9);
    			append_dev(tr1, t13);
    			append_dev(tr1, td10);
    			append_dev(tr1, t15);
    			append_dev(tr1, td11);
    			append_dev(tr1, t17);
    			append_dev(tr1, td12);
    			append_dev(tr1, t19);
    			append_dev(tr1, td13);
    			insert_dev(target, t21, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr2);
    			append_dev(tr2, td14);
    			append_dev(td14, input0);
    			set_input_value(input0, /*query*/ ctx[5].y);
    			append_dev(tr2, t22);
    			append_dev(tr2, td15);
    			append_dev(td15, input1);
    			set_input_value(input1, /*query*/ ctx[5].c);
    			append_dev(tr2, t23);
    			append_dev(tr2, td16);
    			append_dev(td16, input2);
    			set_input_value(input2, /*query*/ ctx[5].apm);
    			append_dev(td16, t24);
    			append_dev(td16, input3);
    			set_input_value(input3, /*query*/ ctx[5].upm);
    			append_dev(tr2, t25);
    			append_dev(tr2, td17);
    			append_dev(td17, input4);
    			set_input_value(input4, /*query*/ ctx[5].app);
    			append_dev(td17, t26);
    			append_dev(td17, input5);
    			set_input_value(input5, /*query*/ ctx[5].upp);
    			append_dev(tr2, t27);
    			append_dev(tr2, td18);
    			append_dev(td18, input6);
    			set_input_value(input6, /*query*/ ctx[5].agdp);
    			append_dev(td18, t28);
    			append_dev(td18, input7);
    			set_input_value(input7, /*query*/ ctx[5].ugdp);
    			append_dev(tr2, t29);
    			append_dev(tr2, td19);
    			append_dev(td19, div);
    			append_dev(div, input8);
    			set_input_value(input8, /*query*/ ctx[5].apc);
    			append_dev(div, t30);
    			append_dev(div, input9);
    			set_input_value(input9, /*query*/ ctx[5].upc);
    			append_dev(tr2, t31);
    			append_dev(tr2, td20);
    			append_dev(td20, button0);
    			append_dev(tr2, t33);
    			append_dev(tr2, td21);
    			append_dev(td21, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler_2*/ ctx[37]),
    					listen_dev(input1, "input", /*input1_input_handler_2*/ ctx[38]),
    					listen_dev(input2, "input", /*input2_input_handler_2*/ ctx[39]),
    					listen_dev(input3, "input", /*input3_input_handler_2*/ ctx[40]),
    					listen_dev(input4, "input", /*input4_input_handler_2*/ ctx[41]),
    					listen_dev(input5, "input", /*input5_input_handler_2*/ ctx[42]),
    					listen_dev(input6, "input", /*input6_input_handler_1*/ ctx[43]),
    					listen_dev(input7, "input", /*input7_input_handler_1*/ ctx[44]),
    					listen_dev(input8, "input", /*input8_input_handler_1*/ ctx[45]),
    					listen_dev(input9, "input", /*input9_input_handler_1*/ ctx[46]),
    					listen_dev(button0, "click", /*searchStat*/ ctx[13], false, false, false),
    					listen_dev(button1, "click", /*borrarQuery*/ ctx[14], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*query*/ 32 && to_number(input0.value) !== /*query*/ ctx[5].y) {
    				set_input_value(input0, /*query*/ ctx[5].y);
    			}

    			if (dirty[0] & /*query*/ 32 && input1.value !== /*query*/ ctx[5].c) {
    				set_input_value(input1, /*query*/ ctx[5].c);
    			}

    			if (dirty[0] & /*query*/ 32 && to_number(input2.value) !== /*query*/ ctx[5].apm) {
    				set_input_value(input2, /*query*/ ctx[5].apm);
    			}

    			if (dirty[0] & /*query*/ 32 && to_number(input3.value) !== /*query*/ ctx[5].upm) {
    				set_input_value(input3, /*query*/ ctx[5].upm);
    			}

    			if (dirty[0] & /*query*/ 32 && to_number(input4.value) !== /*query*/ ctx[5].app) {
    				set_input_value(input4, /*query*/ ctx[5].app);
    			}

    			if (dirty[0] & /*query*/ 32 && to_number(input5.value) !== /*query*/ ctx[5].upp) {
    				set_input_value(input5, /*query*/ ctx[5].upp);
    			}

    			if (dirty[0] & /*query*/ 32 && to_number(input6.value) !== /*query*/ ctx[5].agdp) {
    				set_input_value(input6, /*query*/ ctx[5].agdp);
    			}

    			if (dirty[0] & /*query*/ 32 && to_number(input7.value) !== /*query*/ ctx[5].ugdp) {
    				set_input_value(input7, /*query*/ ctx[5].ugdp);
    			}

    			if (dirty[0] & /*query*/ 32 && to_number(input8.value) !== /*query*/ ctx[5].apc) {
    				set_input_value(input8, /*query*/ ctx[5].apc);
    			}

    			if (dirty[0] & /*query*/ 32 && to_number(input9.value) !== /*query*/ ctx[5].upc) {
    				set_input_value(input9, /*query*/ ctx[5].upc);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t21);
    			if (detaching) detach_dev(tbody);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11$1.name,
    		type: "slot",
    		source: "(596:6) <Table>",
    		ctx
    	});

    	return block;
    }

    // (657:14) <Table>
    function create_default_slot_10$1(ctx) {
    	let thead;
    	let tr0;
    	let td0;
    	let t0;
    	let td1;
    	let t1;
    	let td2;
    	let t2;
    	let td3;
    	let h3;
    	let t4;
    	let td4;
    	let t5;
    	let td5;
    	let t6;
    	let td6;
    	let t7;
    	let tr1;
    	let td7;
    	let t9;
    	let td8;
    	let t11;
    	let td9;
    	let t13;
    	let td10;
    	let t15;
    	let td11;
    	let t17;
    	let td12;
    	let t19;
    	let td13;
    	let t21;
    	let tbody;
    	let tr2;
    	let td14;
    	let input0;
    	let t22;
    	let td15;
    	let input1;
    	let t23;
    	let td16;
    	let input2;
    	let t24;
    	let td17;
    	let input3;
    	let t25;
    	let td18;
    	let input4;
    	let t26;
    	let td19;
    	let input5;
    	let t27;
    	let td20;
    	let button0;
    	let t29;
    	let td21;
    	let t30;
    	let tr3;
    	let th0;
    	let t31_value = /*edex_data*/ ctx[8][0].year + "";
    	let t31;
    	let t32;
    	let th1;
    	let t33_value = /*edex_data*/ ctx[8][0].country + "";
    	let t33;
    	let t34;
    	let th2;
    	let t35_value = /*edex_data*/ ctx[8][0].female_illiteracy_rate + "";
    	let t35;
    	let t36;
    	let th3;
    	let t37_value = /*edex_data*/ ctx[8][0].male_illiteracy_rate + "";
    	let t37;
    	let t38;
    	let th4;
    	let t39_value = /*edex_data*/ ctx[8][0].adult_illiteracy_rate + "";
    	let t39;
    	let t40;
    	let th5;
    	let t41_value = /*edex_data*/ ctx[8][0].young_illiteracy_rate + "";
    	let t41;
    	let t42;
    	let th6;
    	let button1;
    	let t44;
    	let th7;
    	let a;
    	let button2;
    	let a_href_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			td0 = element("td");
    			t0 = space();
    			td1 = element("td");
    			t1 = space();
    			td2 = element("td");
    			t2 = space();
    			td3 = element("td");
    			h3 = element("h3");
    			h3.textContent = "Datos";
    			t4 = space();
    			td4 = element("td");
    			t5 = space();
    			td5 = element("td");
    			t6 = space();
    			td6 = element("td");
    			t7 = space();
    			tr1 = element("tr");
    			td7 = element("td");
    			td7.textContent = "Año";
    			t9 = space();
    			td8 = element("td");
    			td8.textContent = "País";
    			t11 = space();
    			td9 = element("td");
    			td9.textContent = "Alfabetizacion de Mujeres";
    			t13 = space();
    			td10 = element("td");
    			td10.textContent = "Alfabetizacion de hombres";
    			t15 = space();
    			td11 = element("td");
    			td11.textContent = "Alfabetizacion de adultos";
    			t17 = space();
    			td12 = element("td");
    			td12.textContent = "Alfabetizacion de jovenes";
    			t19 = space();
    			td13 = element("td");
    			td13.textContent = "Acciones";
    			t21 = space();
    			tbody = element("tbody");
    			tr2 = element("tr");
    			td14 = element("td");
    			input0 = element("input");
    			t22 = space();
    			td15 = element("td");
    			input1 = element("input");
    			t23 = space();
    			td16 = element("td");
    			input2 = element("input");
    			t24 = space();
    			td17 = element("td");
    			input3 = element("input");
    			t25 = space();
    			td18 = element("td");
    			input4 = element("input");
    			t26 = space();
    			td19 = element("td");
    			input5 = element("input");
    			t27 = space();
    			td20 = element("td");
    			button0 = element("button");
    			button0.textContent = "Insertar";
    			t29 = space();
    			td21 = element("td");
    			t30 = space();
    			tr3 = element("tr");
    			th0 = element("th");
    			t31 = text(t31_value);
    			t32 = space();
    			th1 = element("th");
    			t33 = text(t33_value);
    			t34 = space();
    			th2 = element("th");
    			t35 = text(t35_value);
    			t36 = space();
    			th3 = element("th");
    			t37 = text(t37_value);
    			t38 = space();
    			th4 = element("th");
    			t39 = text(t39_value);
    			t40 = space();
    			th5 = element("th");
    			t41 = text(t41_value);
    			t42 = space();
    			th6 = element("th");
    			button1 = element("button");
    			button1.textContent = "Eliminar";
    			t44 = space();
    			th7 = element("th");
    			a = element("a");
    			button2 = element("button");
    			button2.textContent = "Modificar";
    			attr_dev(td0, "valign", "middle");
    			add_location(td0, file$6, 660, 20, 22817);
    			attr_dev(td1, "valign", "middle");
    			add_location(td1, file$6, 661, 20, 22864);
    			attr_dev(td2, "valign", "middle");
    			add_location(td2, file$6, 662, 20, 22911);
    			add_location(h3, file$6, 663, 41, 22979);
    			attr_dev(td3, "valign", "middle");
    			add_location(td3, file$6, 663, 20, 22958);
    			attr_dev(td4, "valign", "middle");
    			add_location(td4, file$6, 664, 20, 23020);
    			attr_dev(td5, "valign", "middle");
    			add_location(td5, file$6, 665, 20, 23067);
    			attr_dev(td6, "valign", "middle");
    			attr_dev(td6, "colspan", "2");
    			add_location(td6, file$6, 666, 20, 23114);
    			set_style(tr0, "text-align", "center");
    			set_style(tr0, "background-color", "rgb(150, 152, 154)");
    			set_style(tr0, "max-width", "100%");
    			attr_dev(tr0, "valign", "middle");
    			add_location(tr0, file$6, 659, 18, 22692);
    			attr_dev(td7, "valign", "middle");
    			add_location(td7, file$6, 671, 24, 23315);
    			attr_dev(td8, "valign", "middle");
    			add_location(td8, file$6, 672, 24, 23369);
    			attr_dev(td9, "valign", "middle");
    			add_location(td9, file$6, 673, 24, 23424);
    			attr_dev(td10, "valign", "middle");
    			add_location(td10, file$6, 674, 24, 23500);
    			attr_dev(td11, "valign", "middle");
    			add_location(td11, file$6, 675, 24, 23576);
    			attr_dev(td12, "valign", "middle");
    			add_location(td12, file$6, 676, 24, 23652);
    			attr_dev(td13, "valign", "middle");
    			attr_dev(td13, "colspan", "2");
    			add_location(td13, file$6, 677, 24, 23728);
    			set_style(tr1, "text-align", "center");
    			attr_dev(tr1, "valign", "middle");
    			add_location(tr1, file$6, 670, 20, 23240);
    			add_location(thead, file$6, 658, 16, 22663);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "placeholder", "2010");
    			attr_dev(input0, "min", "1900");
    			add_location(input0, file$6, 686, 24, 24023);
    			add_location(td14, file$6, 686, 20, 24019);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "Francia");
    			add_location(input1, file$6, 687, 24, 24136);
    			add_location(td15, file$6, 687, 20, 24132);
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "placeholder", "250.4");
    			add_location(input2, file$6, 688, 24, 24244);
    			add_location(td16, file$6, 688, 20, 24240);
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "placeholder", "112.3");
    			add_location(input3, file$6, 689, 24, 24368);
    			add_location(td17, file$6, 689, 20, 24364);
    			attr_dev(input4, "type", "number");
    			attr_dev(input4, "placeholder", "2.5");
    			add_location(input4, file$6, 690, 24, 24490);
    			add_location(td18, file$6, 690, 20, 24486);
    			attr_dev(input5, "type", "number");
    			attr_dev(input5, "placeholder", "2010");
    			add_location(input5, file$6, 691, 24, 24611);
    			add_location(td19, file$6, 691, 20, 24607);
    			attr_dev(button0, "class", "btn btn-success");
    			add_location(button0, file$6, 692, 24, 24733);
    			add_location(td20, file$6, 692, 20, 24729);
    			add_location(td21, file$6, 693, 20, 24831);
    			add_location(tr2, file$6, 684, 16, 23935);
    			add_location(th0, file$6, 697, 18, 24938);
    			add_location(th1, file$6, 698, 20, 24988);
    			add_location(th2, file$6, 699, 20, 25041);
    			add_location(th3, file$6, 700, 20, 25109);
    			add_location(th4, file$6, 701, 20, 25175);
    			add_location(th5, file$6, 702, 20, 25242);
    			attr_dev(button1, "class", "btn btn-danger");
    			add_location(button1, file$6, 703, 24, 25313);
    			add_location(th6, file$6, 703, 20, 25309);
    			attr_dev(button2, "class", "btn btn-warning");
    			add_location(button2, file$6, 704, 90, 25523);
    			attr_dev(a, "href", a_href_value = "#/illiteracy/" + /*edex_data*/ ctx[8][0].country + "/" + /*edex_data*/ ctx[8][0].year);
    			add_location(a, file$6, 704, 24, 25457);
    			add_location(th7, file$6, 704, 20, 25453);
    			set_style(tr3, "text-align", "center");
    			add_location(tr3, file$6, 696, 16, 24885);
    			add_location(tbody, file$6, 680, 16, 23845);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, td0);
    			append_dev(tr0, t0);
    			append_dev(tr0, td1);
    			append_dev(tr0, t1);
    			append_dev(tr0, td2);
    			append_dev(tr0, t2);
    			append_dev(tr0, td3);
    			append_dev(td3, h3);
    			append_dev(tr0, t4);
    			append_dev(tr0, td4);
    			append_dev(tr0, t5);
    			append_dev(tr0, td5);
    			append_dev(tr0, t6);
    			append_dev(tr0, td6);
    			append_dev(thead, t7);
    			append_dev(thead, tr1);
    			append_dev(tr1, td7);
    			append_dev(tr1, t9);
    			append_dev(tr1, td8);
    			append_dev(tr1, t11);
    			append_dev(tr1, td9);
    			append_dev(tr1, t13);
    			append_dev(tr1, td10);
    			append_dev(tr1, t15);
    			append_dev(tr1, td11);
    			append_dev(tr1, t17);
    			append_dev(tr1, td12);
    			append_dev(tr1, t19);
    			append_dev(tr1, td13);
    			insert_dev(target, t21, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr2);
    			append_dev(tr2, td14);
    			append_dev(td14, input0);
    			set_input_value(input0, /*nuevoElemento*/ ctx[4].year);
    			append_dev(tr2, t22);
    			append_dev(tr2, td15);
    			append_dev(td15, input1);
    			set_input_value(input1, /*nuevoElemento*/ ctx[4].country);
    			append_dev(tr2, t23);
    			append_dev(tr2, td16);
    			append_dev(td16, input2);
    			set_input_value(input2, /*nuevoElemento*/ ctx[4].female_illiteracy_rate);
    			append_dev(tr2, t24);
    			append_dev(tr2, td17);
    			append_dev(td17, input3);
    			set_input_value(input3, /*nuevoElemento*/ ctx[4].male_illiteracy_rate);
    			append_dev(tr2, t25);
    			append_dev(tr2, td18);
    			append_dev(td18, input4);
    			set_input_value(input4, /*nuevoElemento*/ ctx[4].adult_illiteracy_rate);
    			append_dev(tr2, t26);
    			append_dev(tr2, td19);
    			append_dev(td19, input5);
    			set_input_value(input5, /*nuevoElemento*/ ctx[4].young_illiteracy_rate);
    			append_dev(tr2, t27);
    			append_dev(tr2, td20);
    			append_dev(td20, button0);
    			append_dev(tr2, t29);
    			append_dev(tr2, td21);
    			append_dev(tbody, t30);
    			append_dev(tbody, tr3);
    			append_dev(tr3, th0);
    			append_dev(th0, t31);
    			append_dev(tr3, t32);
    			append_dev(tr3, th1);
    			append_dev(th1, t33);
    			append_dev(tr3, t34);
    			append_dev(tr3, th2);
    			append_dev(th2, t35);
    			append_dev(tr3, t36);
    			append_dev(tr3, th3);
    			append_dev(th3, t37);
    			append_dev(tr3, t38);
    			append_dev(tr3, th4);
    			append_dev(th4, t39);
    			append_dev(tr3, t40);
    			append_dev(tr3, th5);
    			append_dev(th5, t41);
    			append_dev(tr3, t42);
    			append_dev(tr3, th6);
    			append_dev(th6, button1);
    			append_dev(tr3, t44);
    			append_dev(tr3, th7);
    			append_dev(th7, a);
    			append_dev(a, button2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler_3*/ ctx[47]),
    					listen_dev(input1, "input", /*input1_input_handler_3*/ ctx[48]),
    					listen_dev(input2, "input", /*input2_input_handler_3*/ ctx[49]),
    					listen_dev(input3, "input", /*input3_input_handler_3*/ ctx[50]),
    					listen_dev(input4, "input", /*input4_input_handler_3*/ ctx[51]),
    					listen_dev(input5, "input", /*input5_input_handler_3*/ ctx[52]),
    					listen_dev(button0, "click", /*insertData*/ ctx[11], false, false, false),
    					listen_dev(
    						button1,
    						"click",
    						function () {
    							if (is_function(/*deleteElement*/ ctx[12](/*edex_data*/ ctx[8][0].year, /*edex_data*/ ctx[8][0].country))) /*deleteElement*/ ctx[12](/*edex_data*/ ctx[8][0].year, /*edex_data*/ ctx[8][0].country).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*nuevoElemento*/ 16 && to_number(input0.value) !== /*nuevoElemento*/ ctx[4].year) {
    				set_input_value(input0, /*nuevoElemento*/ ctx[4].year);
    			}

    			if (dirty[0] & /*nuevoElemento*/ 16 && input1.value !== /*nuevoElemento*/ ctx[4].country) {
    				set_input_value(input1, /*nuevoElemento*/ ctx[4].country);
    			}

    			if (dirty[0] & /*nuevoElemento*/ 16 && to_number(input2.value) !== /*nuevoElemento*/ ctx[4].female_illiteracy_rate) {
    				set_input_value(input2, /*nuevoElemento*/ ctx[4].female_illiteracy_rate);
    			}

    			if (dirty[0] & /*nuevoElemento*/ 16 && to_number(input3.value) !== /*nuevoElemento*/ ctx[4].male_illiteracy_rate) {
    				set_input_value(input3, /*nuevoElemento*/ ctx[4].male_illiteracy_rate);
    			}

    			if (dirty[0] & /*nuevoElemento*/ 16 && to_number(input4.value) !== /*nuevoElemento*/ ctx[4].adult_illiteracy_rate) {
    				set_input_value(input4, /*nuevoElemento*/ ctx[4].adult_illiteracy_rate);
    			}

    			if (dirty[0] & /*nuevoElemento*/ 16 && to_number(input5.value) !== /*nuevoElemento*/ ctx[4].young_illiteracy_rate) {
    				set_input_value(input5, /*nuevoElemento*/ ctx[4].young_illiteracy_rate);
    			}

    			if (dirty[0] & /*edex_data*/ 256 && t31_value !== (t31_value = /*edex_data*/ ctx[8][0].year + "")) set_data_dev(t31, t31_value);
    			if (dirty[0] & /*edex_data*/ 256 && t33_value !== (t33_value = /*edex_data*/ ctx[8][0].country + "")) set_data_dev(t33, t33_value);
    			if (dirty[0] & /*edex_data*/ 256 && t35_value !== (t35_value = /*edex_data*/ ctx[8][0].female_illiteracy_rate + "")) set_data_dev(t35, t35_value);
    			if (dirty[0] & /*edex_data*/ 256 && t37_value !== (t37_value = /*edex_data*/ ctx[8][0].male_illiteracy_rate + "")) set_data_dev(t37, t37_value);
    			if (dirty[0] & /*edex_data*/ 256 && t39_value !== (t39_value = /*edex_data*/ ctx[8][0].adult_illiteracy_rate + "")) set_data_dev(t39, t39_value);
    			if (dirty[0] & /*edex_data*/ 256 && t41_value !== (t41_value = /*edex_data*/ ctx[8][0].young_illiteracy_rate + "")) set_data_dev(t41, t41_value);

    			if (dirty[0] & /*edex_data*/ 256 && a_href_value !== (a_href_value = "#/illiteracy/" + /*edex_data*/ ctx[8][0].country + "/" + /*edex_data*/ ctx[8][0].year)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t21);
    			if (detaching) detach_dev(tbody);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10$1.name,
    		type: "slot",
    		source: "(657:14) <Table>",
    		ctx
    	});

    	return block;
    }

    // (712:16) <PaginationItem class={pagina_actual === 1 ? "disabled" : ""}>
    function create_default_slot_9$1(ctx) {
    	let paginationlink;
    	let current;

    	paginationlink = new PaginationLink({
    			props: { previous: true, href: "#/illiteracy" },
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_3*/ ctx[53]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9$1.name,
    		type: "slot",
    		source: "(712:16) <PaginationItem class={pagina_actual === 1 ? \\\"disabled\\\" : \\\"\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (722:20) <PaginationLink                        previous                        href="#/illiteracy"                        on:click={() => cambiaPagina(page, (page - 1) * 10, esBusqueda)}                        >
    function create_default_slot_8$1(ctx) {
    	let t_value = /*page*/ ctx[62] + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*ultima_pagina*/ 4 && t_value !== (t_value = /*page*/ ctx[62] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$1.name,
    		type: "slot",
    		source: "(722:20) <PaginationLink                        previous                        href=\\\"#/illiteracy\\\"                        on:click={() => cambiaPagina(page, (page - 1) * 10, esBusqueda)}                        >",
    		ctx
    	});

    	return block;
    }

    // (721:18) <PaginationItem class={pagina_actual === page ? "active" : ""}>
    function create_default_slot_7$1(ctx) {
    	let paginationlink;
    	let current;

    	function click_handler_4() {
    		return /*click_handler_4*/ ctx[54](/*page*/ ctx[62]);
    	}

    	paginationlink = new PaginationLink({
    			props: {
    				previous: true,
    				href: "#/illiteracy",
    				$$slots: { default: [create_default_slot_8$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", click_handler_4);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const paginationlink_changes = {};

    			if (dirty[0] & /*ultima_pagina*/ 4 | dirty[2] & /*$$scope*/ 256) {
    				paginationlink_changes.$$scope = { dirty, ctx };
    			}

    			paginationlink.$set(paginationlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$1.name,
    		type: "slot",
    		source: "(721:18) <PaginationItem class={pagina_actual === page ? \\\"active\\\" : \\\"\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (720:16) {#each range(ultima_pagina, 1) as page}
    function create_each_block$1(ctx) {
    	let paginationitem;
    	let current;

    	paginationitem = new PaginationItem({
    			props: {
    				class: /*pagina_actual*/ ctx[1] === /*page*/ ctx[62]
    				? "active"
    				: "",
    				$$slots: { default: [create_default_slot_7$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem_changes = {};

    			if (dirty[0] & /*pagina_actual, ultima_pagina*/ 6) paginationitem_changes.class = /*pagina_actual*/ ctx[1] === /*page*/ ctx[62]
    			? "active"
    			: "";

    			if (dirty[0] & /*ultima_pagina, esBusqueda*/ 12 | dirty[2] & /*$$scope*/ 256) {
    				paginationitem_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem.$set(paginationitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(720:16) {#each range(ultima_pagina, 1) as page}",
    		ctx
    	});

    	return block;
    }

    // (730:16) <PaginationItem class={pagina_actual === ultima_pagina ? "disabled" : ""}>
    function create_default_slot_6$1(ctx) {
    	let paginationlink;
    	let current;

    	paginationlink = new PaginationLink({
    			props: { next: true, href: "#/illiteracy" },
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_5*/ ctx[55]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$1.name,
    		type: "slot",
    		source: "(730:16) <PaginationItem class={pagina_actual === ultima_pagina ? \\\"disabled\\\" : \\\"\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (711:14) <Pagination ariaLabel="Web pagination">
    function create_default_slot_5$1(ctx) {
    	let paginationitem0;
    	let t0;
    	let t1;
    	let paginationitem1;
    	let current;

    	paginationitem0 = new PaginationItem({
    			props: {
    				class: /*pagina_actual*/ ctx[1] === 1 ? "disabled" : "",
    				$$slots: { default: [create_default_slot_9$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let each_value = range(/*ultima_pagina*/ ctx[2], 1);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	paginationitem1 = new PaginationItem({
    			props: {
    				class: /*pagina_actual*/ ctx[1] === /*ultima_pagina*/ ctx[2]
    				? "disabled"
    				: "",
    				$$slots: { default: [create_default_slot_6$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem0.$$.fragment);
    			t0 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			create_component(paginationitem1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem0, target, anchor);
    			insert_dev(target, t0, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			mount_component(paginationitem1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem0_changes = {};
    			if (dirty[0] & /*pagina_actual*/ 2) paginationitem0_changes.class = /*pagina_actual*/ ctx[1] === 1 ? "disabled" : "";

    			if (dirty[0] & /*pagina_actual, offset_actual, esBusqueda*/ 11 | dirty[2] & /*$$scope*/ 256) {
    				paginationitem0_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem0.$set(paginationitem0_changes);

    			if (dirty[0] & /*pagina_actual, ultima_pagina, cambiaPagina, esBusqueda*/ 32782) {
    				each_value = range(/*ultima_pagina*/ ctx[2], 1);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(t1.parentNode, t1);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const paginationitem1_changes = {};

    			if (dirty[0] & /*pagina_actual, ultima_pagina*/ 6) paginationitem1_changes.class = /*pagina_actual*/ ctx[1] === /*ultima_pagina*/ ctx[2]
    			? "disabled"
    			: "";

    			if (dirty[0] & /*pagina_actual, offset_actual, esBusqueda*/ 11 | dirty[2] & /*$$scope*/ 256) {
    				paginationitem1_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem1.$set(paginationitem1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem0.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(paginationitem1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem0.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(paginationitem1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(paginationitem1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$1.name,
    		type: "slot",
    		source: "(711:14) <Pagination ariaLabel=\\\"Web pagination\\\">",
    		ctx
    	});

    	return block;
    }

    // (743:4) {#if edex_data.length==0}
    function create_if_block$3(ctx) {
    	let div;
    	let row0;
    	let t;
    	let row1;
    	let current;

    	row0 = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_3$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	row1 = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(row0.$$.fragment);
    			t = space();
    			create_component(row1.$$.fragment);
    			set_style(div, "aling-items", "center");
    			set_style(div, "justify-content", "center");
    			add_location(div, file$6, 743, 6, 27088);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(row0, div, null);
    			append_dev(div, t);
    			mount_component(row1, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row0.$$.fragment, local);
    			transition_in(row1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row0.$$.fragment, local);
    			transition_out(row1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(row0);
    			destroy_component(row1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(743:4) {#if edex_data.length==0}",
    		ctx
    	});

    	return block;
    }

    // (746:12) <Col md=12 style="text-align: center;">
    function create_default_slot_4$2(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "No existen datos cargados. Por favor, pulse el botón \"Cargar datos\".";
    			add_location(h2, file$6, 746, 16, 27231);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$2.name,
    		type: "slot",
    		source: "(746:12) <Col md=12 style=\\\"text-align: center;\\\">",
    		ctx
    	});

    	return block;
    }

    // (745:8) <Row>
    function create_default_slot_3$2(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				md: "12",
    				style: "text-align: center;",
    				$$slots: { default: [create_default_slot_4$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col_changes = {};

    			if (dirty[2] & /*$$scope*/ 256) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$2.name,
    		type: "slot",
    		source: "(745:8) <Row>",
    		ctx
    	});

    	return block;
    }

    // (753:12) <Col md=4>
    function create_default_slot_2$3(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "images/noDatos.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "noDatos");
    			add_location(img, file$6, 753, 16, 27445);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$3.name,
    		type: "slot",
    		source: "(753:12) <Col md=4>",
    		ctx
    	});

    	return block;
    }

    // (750:8) <Row>
    function create_default_slot_1$3(ctx) {
    	let col0;
    	let t0;
    	let col1;
    	let t1;
    	let col2;
    	let current;
    	col0 = new Col({ props: { md: "3" }, $$inline: true });

    	col1 = new Col({
    			props: {
    				md: "4",
    				$$slots: { default: [create_default_slot_2$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	col2 = new Col({ props: { md: "4" }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(col0.$$.fragment);
    			t0 = space();
    			create_component(col1.$$.fragment);
    			t1 = space();
    			create_component(col2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(col1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(col2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col1_changes = {};

    			if (dirty[2] & /*$$scope*/ 256) {
    				col1_changes.$$scope = { dirty, ctx };
    			}

    			col1.$set(col1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col0.$$.fragment, local);
    			transition_in(col1.$$.fragment, local);
    			transition_in(col2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col0.$$.fragment, local);
    			transition_out(col1.$$.fragment, local);
    			transition_out(col2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(col1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(col2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(750:8) <Row>",
    		ctx
    	});

    	return block;
    }

    // (778:22) <Button style="background-color: blue;">
    function create_default_slot$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Página Principal");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(778:22) <Button style=\\\"background-color: blue;\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let main;
    	let div0;
    	let row0;
    	let t0;
    	let row1;
    	let t1;
    	let br;
    	let t2;
    	let div1;
    	let t3;
    	let t4;
    	let t5;
    	let div3;
    	let footer;
    	let div2;
    	let a;
    	let button;
    	let current;

    	row0 = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_21$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	row1 = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_19$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block0 = /*edex_data*/ ctx[8].length > 1 && create_if_block_2$2(ctx);
    	let if_block1 = /*edex_data*/ ctx[8].length == 1 && create_if_block_1$3(ctx);
    	let if_block2 = /*edex_data*/ ctx[8].length == 0 && create_if_block$3(ctx);

    	button = new Button({
    			props: {
    				style: "background-color: blue;",
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			div0 = element("div");
    			create_component(row0.$$.fragment);
    			t0 = space();
    			create_component(row1.$$.fragment);
    			t1 = space();
    			br = element("br");
    			t2 = space();
    			div1 = element("div");
    			if (if_block0) if_block0.c();
    			t3 = space();
    			if (if_block1) if_block1.c();
    			t4 = space();
    			if (if_block2) if_block2.c();
    			t5 = space();
    			div3 = element("div");
    			footer = element("footer");
    			div2 = element("div");
    			a = element("a");
    			create_component(button.$$.fragment);
    			set_style(div0, "padding", "1%");
    			add_location(div0, file$6, 396, 2, 11500);
    			add_location(br, file$6, 428, 1, 12652);
    			add_location(div1, file$6, 430, 2, 12712);
    			attr_dev(a, "href", "/");
    			add_location(a, file$6, 777, 10, 27856);
    			add_location(div2, file$6, 776, 7, 27839);
    			attr_dev(footer, "class", "svelte-3ztnfx");
    			add_location(footer, file$6, 773, 2, 27813);
    			attr_dev(div3, "class", "foot svelte-3ztnfx");
    			set_style(div3, "min-width", "100%");
    			set_style(div3, "color", "white");
    			set_style(div3, "background-color", "#343c44");
    			set_style(div3, "min-width", "100%");
    			set_style(div3, "bottom", "0");
    			set_style(div3, "background-color", "#343c44");
    			set_style(div3, "left", "0");
    			set_style(div3, "position", "relative");
    			add_location(div3, file$6, 764, 2, 27618);
    			add_location(main, file$6, 394, 0, 11380);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);
    			mount_component(row0, div0, null);
    			append_dev(div0, t0);
    			mount_component(row1, div0, null);
    			append_dev(main, t1);
    			append_dev(main, br);
    			append_dev(main, t2);
    			append_dev(main, div1);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t3);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t4);
    			if (if_block2) if_block2.m(div1, null);
    			append_dev(main, t5);
    			append_dev(main, div3);
    			append_dev(div3, footer);
    			append_dev(footer, div2);
    			append_dev(div2, a);
    			mount_component(button, a, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row0_changes = {};

    			if (dirty[0] & /*edex_data*/ 256 | dirty[2] & /*$$scope*/ 256) {
    				row0_changes.$$scope = { dirty, ctx };
    			}

    			row0.$set(row0_changes);
    			const row1_changes = {};

    			if (dirty[0] & /*mensajeError, mensajeCorrecto*/ 192 | dirty[2] & /*$$scope*/ 256) {
    				row1_changes.$$scope = { dirty, ctx };
    			}

    			row1.$set(row1_changes);

    			if (/*edex_data*/ ctx[8].length > 1) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*edex_data*/ 256) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2$2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div1, t3);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*edex_data*/ ctx[8].length == 1) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*edex_data*/ 256) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1$3(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div1, t4);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*edex_data*/ ctx[8].length == 0) {
    				if (if_block2) {
    					if (dirty[0] & /*edex_data*/ 256) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block$3(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div1, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			const button_changes = {};

    			if (dirty[2] & /*$$scope*/ 256) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row0.$$.fragment, local);
    			transition_in(row1.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row0.$$.fragment, local);
    			transition_out(row1.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(row0);
    			destroy_component(row1);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const BASE_API_PATH$2 = "api/v1/illiteracy";

    function range(ultima, inicio = 0) {
    	return [...Array(ultima).keys()].map(i => i + inicio);
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Edit_Tables", slots, []);

    	let nuevoElemento = {
    		"year": "",
    		"country": "",
    		"female_illiteracy_rate": "",
    		"male_illiteracy_rate": "",
    		"adult_illiteracy_rate": "",
    		"young_illiteracy_rate": ""
    	};

    	let query = {
    		"c": "",
    		"y": "",
    		"apm": "", // aquellos que están por encima de un gasto de x millones en educacion
    		"upm": "", // aquellos que están por debajo de un gasto de x millones en educacion
    		"app": "", //aquellos que están por encima de un porcentaje x de gasto publico en educacion
    		"upp": "", //aquellos que están por debajo de un porcentaje x de gasto publico en educacion
    		"agdp": "", //aquellos que están por encima de un porcentaje x de pib en gasto publico en educacion
    		"ugdp": "", //aquellos que están por debajo de un porcentaje x de pib en gasto publico en educacion        
    		"apc": "", //aquellos que están por encima de una cantidad x per capita de gasto en educacion
    		"upc": "", //aquellos que están por debajo de una cantidad x per capita de gasto en educacion
    		
    	};

    	var fullQuery = "";

    	//Variables auxiliares para la muestra de errores
    	let mensajeError = "";

    	let mensajeCorrecto = "";
    	let { offset_actual = 0 } = $$props;
    	let { limit = 10 } = $$props; //Limite por defecto, opcional
    	let { pagina_actual = 1 } = $$props;
    	let { ultima_pagina = 1 } = $$props; //Se debe actualizar en función de los datos que tengamos
    	let { totalDatos = 0 } = $$props;
    	let { esBusqueda = false } = $$props;

    	//Cargamos los datos iniciales
    	var charged = false;

    	var edex_data = [];

    	//Función asincrona para la carga de datos
    	async function getStats() {
    		$$invalidate(3, esBusqueda = false);
    		console.log("Fetching data...");
    		const res = await fetch(BASE_API_PATH$2 + "?skip=" + offset_actual + "&limit=" + limit);

    		if (res.ok) {
    			console.log(BASE_API_PATH$2 + "?limit=" + limit + "&skip=" + offset_actual);
    			const json = await res.json();

    			if (json.length === undefined) {
    				$$invalidate(8, edex_data = []);
    				edex_data.push(json);
    				getTotalDatos();
    				$$invalidate(6, mensajeError = "");
    				$$invalidate(7, mensajeCorrecto = "Datos cargados correctamente");
    			} else {
    				$$invalidate(8, edex_data = json);
    				getTotalDatos();
    				$$invalidate(6, mensajeError = "");
    				$$invalidate(7, mensajeCorrecto = "Datos cargados correctamente");
    			}

    			$$invalidate(6, mensajeError = "");
    		} else {
    			if (res.status === 500) {
    				$$invalidate(7, mensajeCorrecto = "");
    				$$invalidate(6, mensajeError = "No se ha podido acceder a la base de datos");
    			}

    			if (edex_data.length === 0) {
    				$$invalidate(7, mensajeCorrecto = "");
    				$$invalidate(6, mensajeError = "No hay datos disponibles");
    			}
    		}
    	}

    	async function loadInitialData() {
    		//Para cargarlos hacemos un fetch a la direccion donde está el método de carga inicial
    		const peticionCarga = await fetch(BASE_API_PATH$2 + "/loadInitialData"); //Se espera hasta que termine la peticion

    		if (peticionCarga.ok) {
    			const peticionMuestra = await fetch(BASE_API_PATH$2); //Se accede a la toma de todos los elementos

    			if (peticionMuestra.ok) {
    				console.log(" Receiving data, wait a moment ...");
    				const data = await peticionMuestra.json();
    				$$invalidate(8, edex_data = data);
    				console.log(`Done! Received ${data.length} stats.`);
    				console.log(edex_data);
    				$$invalidate(6, mensajeError = "");
    				$$invalidate(7, mensajeCorrecto = "Datos insertados correctamente");
    			} else {
    				console.log("No data loaded.");
    				$$invalidate(6, mensajeError = "Los datos no han podido cargarse");
    			}
    		} else {
    			console.log("Error loading data.");
    			$$invalidate(6, mensajeError = "Error de acceso a BD");
    		}

    		charged = true;
    		console.log(edex_data.length);
    		getStats();
    	}

    	async function deleteAll() {
    		console.log(edex_data.length);

    		await fetch(BASE_API_PATH$2, { method: "DELETE" }).then(function (peticion) {
    			if (peticion.ok) {
    				$$invalidate(8, edex_data = []);
    				charged = false;
    				$$invalidate(6, mensajeError = "");
    				$$invalidate(7, mensajeCorrecto = "Datos eliminados correctamente");
    			} else if (peticion.status == 404) {
    				//no data found
    				console.log("No data found"); //Posibilidad de redirigir a una ventana similar a la de error 404

    				$$invalidate(7, mensajeCorrecto = "");
    				$$invalidate(6, mensajeError = "No se han encontrado datos para eliminar");
    			} else {
    				console.log("Error deleting DB stats");
    				$$invalidate(7, mensajeCorrecto = "");
    				$$invalidate(6, mensajeError = "Error de acceso a BD");
    			}

    			console.log(edex_data.length);
    		});
    	}

    	function removeDataInserted() {
    		$$invalidate(4, nuevoElemento = {
    			"year": "",
    			"country": "",
    			"female_illiteracy_rate": "",
    			"male_illiteracy_rate": "",
    			"adult_illiteracy_rate": "",
    			"young_illiteracy_rate": ""
    		});
    	}

    	

    	async function insertData() {
    		$$invalidate(4, nuevoElemento.year = parseInt(nuevoElemento.year), nuevoElemento);
    		$$invalidate(4, nuevoElemento.country = String(nuevoElemento.country), nuevoElemento);
    		$$invalidate(4, nuevoElemento.female_illiteracy_rate = parseFloat(nuevoElemento.female_illiteracy_rate), nuevoElemento);
    		$$invalidate(4, nuevoElemento.male_illiteracy_rate = parseFloat(nuevoElemento.male_illiteracy_rate), nuevoElemento);
    		$$invalidate(4, nuevoElemento.adult_illiteracy_rate = parseFloat(nuevoElemento.adult_illiteracy_rate), nuevoElemento);
    		$$invalidate(4, nuevoElemento.young_illiteracy_rate = parseFloat(nuevoElemento.young_illiteracy_rate), nuevoElemento);

    		await fetch(BASE_API_PATH$2, {
    			method: "POST",
    			body: JSON.stringify(nuevoElemento),
    			headers: { "Content-Type": "application/json" }
    		}).then(function (res) {
    			if (res.ok) {
    				$$invalidate(6, mensajeError = "");
    				$$invalidate(7, mensajeCorrecto = "Dato cargado correctamente");
    			} else {
    				if (res.status === 409) {
    					$$invalidate(7, mensajeCorrecto = "");
    					$$invalidate(6, mensajeError = `Ya existe un dato con valores idénticos para los campos año y país.`);
    					window.alert("Ya existe un dato con valores idénticos para los campos año y país.");
    				} else if (res.status === 500) {
    					$$invalidate(7, mensajeCorrecto = "");
    					$$invalidate(6, mensajeError = "No se ha podido acceder a la base de datos.");
    				} else if (res.status === 400) {
    					$$invalidate(7, mensajeCorrecto = "");
    					$$invalidate(6, mensajeError = "Todos los campos deben estar rellenados según el patron predefinido.");
    					window.alert("Todos los campos deben estar rellenados según el patron predefinido.");
    				}
    			}

    			removeDataInserted();
    			getStats();
    		});
    	}

    	async function deleteElement(year, country) {
    		$$invalidate(0, offset_actual = 0);
    		$$invalidate(1, pagina_actual = 1);

    		await fetch(BASE_API_PATH$2 + "/" + country + "/" + year, { method: "DELETE" }).then(function (res) {
    			if (res.ok) {
    				console.log("OK");
    			} else {
    				if (res.status === 404) ; else if (res.status === 500) ;
    			}

    			getStats();
    		});
    	}

    	async function searchStat() {
    		$$invalidate(3, esBusqueda = true);

    		var parametros = new Map(Object.entries(query).filter(introducidos => {
    				return introducidos[1] != "";
    			}));

    		let simboloQuery = "?";
    		let i = 0; //Contador para saber cuando llega al ultimo par

    		for (var [clave, valor] of parametros.entries()) {
    			i = i + 1;

    			if (i === parametros.entries().length) {
    				simboloQuery += clave + "=" + valor;
    			} else {
    				simboloQuery += clave + "=" + valor + "&";
    			}
    		}

    		fullQuery = "";
    		fullQuery = simboloQuery === "?" ? "" : simboloQuery;

    		//Comprobamos si la query está vacía
    		if (fullQuery != "") {
    			const res = await fetch(BASE_API_PATH$2 + fullQuery + "&skip=" + offset_actual + "&limit=" + limit);

    			if (res.ok) {
    				console.log("OK");
    				const json = await res.json();
    				$$invalidate(6, mensajeError = "");
    				$$invalidate(7, mensajeCorrecto = "¡Se han encontrado coincidencias!");

    				if (json.length === undefined) {
    					$$invalidate(8, edex_data = []);
    					edex_data.push(json);
    					getTotalDatosBusqueda();
    				} else {
    					$$invalidate(8, edex_data = json);
    					getTotalDatosBusqueda();
    				}
    			} else {
    				if (res.status === 404) {
    					$$invalidate(7, mensajeCorrecto = "");
    					$$invalidate(6, mensajeError = "No existen datos con esos parámetros");
    				} else if (res.status === 500) {
    					$$invalidate(7, mensajeCorrecto = "");
    					$$invalidate(6, mensajeError = "No se ha podido acceder a la base de datos");
    				}
    			}
    		} else {
    			$$invalidate(6, mensajeError = "Debe existir al menos un parámetro para realizar la búsqueda");
    		}

    		console.log(query);
    	} //Cargamos los datos en la tabla

    	function borrarQuery() {
    		$$invalidate(5, query = {
    			"c": "",
    			"y": "",
    			"apm": "",
    			"upm": "",
    			"app": "",
    			"upp": "",
    			"agdp": "",
    			"ugdp": "",
    			"apc": "",
    			"upc": ""
    		});

    		getStats();
    	}

    	function cambiaPagina(pagina, offset, busqueda) {
    		console.log("*** Cambio Página ***");
    		console.log("Parametros pagina: " + pagina + " offset: " + offset + " busqueda: " + busqueda);
    		$$invalidate(2, ultima_pagina = Math.ceil(totalDatos / limit));
    		console.log("La última página es: " + ultima_pagina);

    		if (pagina !== pagina_actual) {
    			console.log("enter if");
    			$$invalidate(0, offset_actual = offset);
    			$$invalidate(1, pagina_actual = pagina);

    			if (busqueda == false) {
    				getStats();
    			} else {
    				searchStat();
    			}
    		}

    		console.log("*** Fin Cambio Página ***");
    	}

    	async function getTotalDatos() {
    		const res = await fetch(BASE_API_PATH$2);

    		if (res.ok) {
    			const json = await res.json();
    			$$invalidate(16, totalDatos = json.length);
    			cambiaPagina(pagina_actual, offset_actual, esBusqueda);
    		} else {
    			$$invalidate(7, mensajeCorrecto = "");
    			$$invalidate(6, mensajeError = "No hay datos disponibles");
    		}
    	}

    	async function getTotalDatosBusqueda() {
    		const res = await fetch(BASE_API_PATH$2 + fullQuery);

    		if (res.ok) {
    			const json = await res.json();
    			$$invalidate(16, totalDatos = json.length);
    			cambiaPagina(pagina_actual, offset_actual, esBusqueda);
    		} else {
    			$$invalidate(7, mensajeCorrecto = "");
    			$$invalidate(6, mensajeError = "No hay datos disponibles");
    		}
    	}

    	onMount(getStats);

    	const writable_props = [
    		"offset_actual",
    		"limit",
    		"pagina_actual",
    		"ultima_pagina",
    		"totalDatos",
    		"esBusqueda"
    	];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$3.warn(`<Edit_Tables> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		query.y = to_number(this.value);
    		$$invalidate(5, query);
    	}

    	function input1_input_handler() {
    		query.c = this.value;
    		$$invalidate(5, query);
    	}

    	function input2_input_handler() {
    		query.apm = to_number(this.value);
    		$$invalidate(5, query);
    	}

    	function input3_input_handler() {
    		query.upm = to_number(this.value);
    		$$invalidate(5, query);
    	}

    	function input4_input_handler() {
    		query.app = to_number(this.value);
    		$$invalidate(5, query);
    	}

    	function input5_input_handler() {
    		query.upp = to_number(this.value);
    		$$invalidate(5, query);
    	}

    	function input6_input_handler() {
    		query.agdp = to_number(this.value);
    		$$invalidate(5, query);
    	}

    	function input7_input_handler() {
    		query.ugdp = to_number(this.value);
    		$$invalidate(5, query);
    	}

    	function input8_input_handler() {
    		query.apc = to_number(this.value);
    		$$invalidate(5, query);
    	}

    	function input9_input_handler() {
    		query.upc = to_number(this.value);
    		$$invalidate(5, query);
    	}

    	function input0_input_handler_1() {
    		nuevoElemento.year = to_number(this.value);
    		$$invalidate(4, nuevoElemento);
    	}

    	function input1_input_handler_1() {
    		nuevoElemento.country = this.value;
    		$$invalidate(4, nuevoElemento);
    	}

    	function input2_input_handler_1() {
    		nuevoElemento.female_illiteracy_rate = to_number(this.value);
    		$$invalidate(4, nuevoElemento);
    	}

    	function input3_input_handler_1() {
    		nuevoElemento.male_illiteracy_rate = to_number(this.value);
    		$$invalidate(4, nuevoElemento);
    	}

    	function input4_input_handler_1() {
    		nuevoElemento.adult_illiteracy_rate = to_number(this.value);
    		$$invalidate(4, nuevoElemento);
    	}

    	function input5_input_handler_1() {
    		nuevoElemento.young_illiteracy_rate = to_number(this.value);
    		$$invalidate(4, nuevoElemento);
    	}

    	const click_handler = () => cambiaPagina(pagina_actual - 1, offset_actual - 10, esBusqueda);
    	const click_handler_1 = page => cambiaPagina(page, (page - 1) * 10, esBusqueda);
    	const click_handler_2 = () => cambiaPagina(pagina_actual + 1, offset_actual + 10, esBusqueda);

    	function input0_input_handler_2() {
    		query.y = to_number(this.value);
    		$$invalidate(5, query);
    	}

    	function input1_input_handler_2() {
    		query.c = this.value;
    		$$invalidate(5, query);
    	}

    	function input2_input_handler_2() {
    		query.apm = to_number(this.value);
    		$$invalidate(5, query);
    	}

    	function input3_input_handler_2() {
    		query.upm = to_number(this.value);
    		$$invalidate(5, query);
    	}

    	function input4_input_handler_2() {
    		query.app = to_number(this.value);
    		$$invalidate(5, query);
    	}

    	function input5_input_handler_2() {
    		query.upp = to_number(this.value);
    		$$invalidate(5, query);
    	}

    	function input6_input_handler_1() {
    		query.agdp = to_number(this.value);
    		$$invalidate(5, query);
    	}

    	function input7_input_handler_1() {
    		query.ugdp = to_number(this.value);
    		$$invalidate(5, query);
    	}

    	function input8_input_handler_1() {
    		query.apc = to_number(this.value);
    		$$invalidate(5, query);
    	}

    	function input9_input_handler_1() {
    		query.upc = to_number(this.value);
    		$$invalidate(5, query);
    	}

    	function input0_input_handler_3() {
    		nuevoElemento.year = to_number(this.value);
    		$$invalidate(4, nuevoElemento);
    	}

    	function input1_input_handler_3() {
    		nuevoElemento.country = this.value;
    		$$invalidate(4, nuevoElemento);
    	}

    	function input2_input_handler_3() {
    		nuevoElemento.female_illiteracy_rate = to_number(this.value);
    		$$invalidate(4, nuevoElemento);
    	}

    	function input3_input_handler_3() {
    		nuevoElemento.male_illiteracy_rate = to_number(this.value);
    		$$invalidate(4, nuevoElemento);
    	}

    	function input4_input_handler_3() {
    		nuevoElemento.adult_illiteracy_rate = to_number(this.value);
    		$$invalidate(4, nuevoElemento);
    	}

    	function input5_input_handler_3() {
    		nuevoElemento.young_illiteracy_rate = to_number(this.value);
    		$$invalidate(4, nuevoElemento);
    	}

    	const click_handler_3 = () => cambiaPagina(pagina_actual - 1, offset_actual - 10, esBusqueda);
    	const click_handler_4 = page => cambiaPagina(page, (page - 1) * 10, esBusqueda);
    	const click_handler_5 = () => cambiaPagina(pagina_actual + 1, offset_actual + 10, esBusqueda);

    	$$self.$$set = $$props => {
    		if ("offset_actual" in $$props) $$invalidate(0, offset_actual = $$props.offset_actual);
    		if ("limit" in $$props) $$invalidate(17, limit = $$props.limit);
    		if ("pagina_actual" in $$props) $$invalidate(1, pagina_actual = $$props.pagina_actual);
    		if ("ultima_pagina" in $$props) $$invalidate(2, ultima_pagina = $$props.ultima_pagina);
    		if ("totalDatos" in $$props) $$invalidate(16, totalDatos = $$props.totalDatos);
    		if ("esBusqueda" in $$props) $$invalidate(3, esBusqueda = $$props.esBusqueda);
    	};

    	$$self.$capture_state = () => ({
    		Table,
    		Button,
    		Col,
    		Row,
    		Nav,
    		Modal,
    		ModalBody,
    		ModalFooter,
    		ModalHeader,
    		NavItem,
    		NavLink,
    		Pagination,
    		PaginationItem,
    		PaginationLink,
    		onMount,
    		BASE_API_PATH: BASE_API_PATH$2,
    		nuevoElemento,
    		query,
    		fullQuery,
    		mensajeError,
    		mensajeCorrecto,
    		offset_actual,
    		limit,
    		pagina_actual,
    		ultima_pagina,
    		totalDatos,
    		esBusqueda,
    		charged,
    		edex_data,
    		getStats,
    		loadInitialData,
    		deleteAll,
    		removeDataInserted,
    		insertData,
    		deleteElement,
    		searchStat,
    		borrarQuery,
    		cambiaPagina,
    		range,
    		getTotalDatos,
    		getTotalDatosBusqueda
    	});

    	$$self.$inject_state = $$props => {
    		if ("nuevoElemento" in $$props) $$invalidate(4, nuevoElemento = $$props.nuevoElemento);
    		if ("query" in $$props) $$invalidate(5, query = $$props.query);
    		if ("fullQuery" in $$props) fullQuery = $$props.fullQuery;
    		if ("mensajeError" in $$props) $$invalidate(6, mensajeError = $$props.mensajeError);
    		if ("mensajeCorrecto" in $$props) $$invalidate(7, mensajeCorrecto = $$props.mensajeCorrecto);
    		if ("offset_actual" in $$props) $$invalidate(0, offset_actual = $$props.offset_actual);
    		if ("limit" in $$props) $$invalidate(17, limit = $$props.limit);
    		if ("pagina_actual" in $$props) $$invalidate(1, pagina_actual = $$props.pagina_actual);
    		if ("ultima_pagina" in $$props) $$invalidate(2, ultima_pagina = $$props.ultima_pagina);
    		if ("totalDatos" in $$props) $$invalidate(16, totalDatos = $$props.totalDatos);
    		if ("esBusqueda" in $$props) $$invalidate(3, esBusqueda = $$props.esBusqueda);
    		if ("charged" in $$props) charged = $$props.charged;
    		if ("edex_data" in $$props) $$invalidate(8, edex_data = $$props.edex_data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		offset_actual,
    		pagina_actual,
    		ultima_pagina,
    		esBusqueda,
    		nuevoElemento,
    		query,
    		mensajeError,
    		mensajeCorrecto,
    		edex_data,
    		loadInitialData,
    		deleteAll,
    		insertData,
    		deleteElement,
    		searchStat,
    		borrarQuery,
    		cambiaPagina,
    		totalDatos,
    		limit,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		input5_input_handler,
    		input6_input_handler,
    		input7_input_handler,
    		input8_input_handler,
    		input9_input_handler,
    		input0_input_handler_1,
    		input1_input_handler_1,
    		input2_input_handler_1,
    		input3_input_handler_1,
    		input4_input_handler_1,
    		input5_input_handler_1,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		input0_input_handler_2,
    		input1_input_handler_2,
    		input2_input_handler_2,
    		input3_input_handler_2,
    		input4_input_handler_2,
    		input5_input_handler_2,
    		input6_input_handler_1,
    		input7_input_handler_1,
    		input8_input_handler_1,
    		input9_input_handler_1,
    		input0_input_handler_3,
    		input1_input_handler_3,
    		input2_input_handler_3,
    		input3_input_handler_3,
    		input4_input_handler_3,
    		input5_input_handler_3,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5
    	];
    }

    class Edit_Tables extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$6,
    			create_fragment$6,
    			safe_not_equal,
    			{
    				offset_actual: 0,
    				limit: 17,
    				pagina_actual: 1,
    				ultima_pagina: 2,
    				totalDatos: 16,
    				esBusqueda: 3
    			},
    			[-1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Edit_Tables",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get offset_actual() {
    		throw new Error("<Edit_Tables>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set offset_actual(value) {
    		throw new Error("<Edit_Tables>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get limit() {
    		throw new Error("<Edit_Tables>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set limit(value) {
    		throw new Error("<Edit_Tables>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pagina_actual() {
    		throw new Error("<Edit_Tables>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pagina_actual(value) {
    		throw new Error("<Edit_Tables>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ultima_pagina() {
    		throw new Error("<Edit_Tables>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ultima_pagina(value) {
    		throw new Error("<Edit_Tables>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get totalDatos() {
    		throw new Error("<Edit_Tables>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set totalDatos(value) {
    		throw new Error("<Edit_Tables>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get esBusqueda() {
    		throw new Error("<Edit_Tables>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set esBusqueda(value) {
    		throw new Error("<Edit_Tables>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\front\illiteracy\illiteracyApp.svelte generated by Svelte v3.38.0 */
    const file$5 = "src\\front\\illiteracy\\illiteracyApp.svelte";

    function create_fragment$5(ctx) {
    	let main;
    	let div1;
    	let div0;
    	let em;
    	let h1;
    	let t1;
    	let div2;
    	let edittable;
    	let current;
    	edittable = new Edit_Tables({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			div1 = element("div");
    			div0 = element("div");
    			em = element("em");
    			h1 = element("h1");
    			h1.textContent = "Tasa de Alafabetizacion";
    			t1 = space();
    			div2 = element("div");
    			create_component(edittable.$$.fragment);
    			attr_dev(h1, "class", "display-3");
    			set_style(h1, "text-align", "center");
    			add_location(h1, file$5, 8, 18, 407);
    			add_location(em, file$5, 8, 14, 403);
    			attr_dev(div0, "id", "interno");
    			attr_dev(div0, "class", "grid-block");
    			set_style(div0, "background-color", "rgb(150, 152, 154)");
    			set_style(div0, "border-radius", "4%");
    			set_style(div0, "padding", "1%");
    			add_location(div0, file$5, 7, 10, 276);
    			attr_dev(div1, "class", "grid-block");
    			set_style(div1, "background-image", "url('images/fondo_edex.png')");
    			set_style(div1, "width", "100%");
    			set_style(div1, "height", "100%");
    			set_style(div1, "padding", "5%");
    			add_location(div1, file$5, 6, 6, 144);
    			add_location(div2, file$5, 12, 4, 541);
    			add_location(main, file$5, 5, 2, 130);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div1);
    			append_dev(div1, div0);
    			append_dev(div0, em);
    			append_dev(em, h1);
    			append_dev(main, t1);
    			append_dev(main, div2);
    			mount_component(edittable, div2, null);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(edittable.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(edittable.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(edittable);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("IlliteracyApp", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<IlliteracyApp> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ EditTable: Edit_Tables, Container, Row, Col });
    	return [];
    }

    class IlliteracyApp extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IlliteracyApp",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\front\illiteracy\edit_data_illiteracy.svelte generated by Svelte v3.38.0 */

    const { console: console_1$2 } = globals;
    const file$4 = "src\\front\\illiteracy\\edit_data_illiteracy.svelte";

    // (99:8) <NavLink href="#/illiteracy">
    function create_default_slot_4$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Volver");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(99:8) <NavLink href=\\\"#/illiteracy\\\">",
    		ctx
    	});

    	return block;
    }

    // (98:6) <NavItem>
    function create_default_slot_3$1(ctx) {
    	let navlink;
    	let current;

    	navlink = new NavLink({
    			props: {
    				href: "#/illiteracy",
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navlink_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				navlink_changes.$$scope = { dirty, ctx };
    			}

    			navlink.$set(navlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(98:6) <NavItem>",
    		ctx
    	});

    	return block;
    }

    // (97:4) <Nav>
    function create_default_slot_2$2(ctx) {
    	let navitem;
    	let current;

    	navitem = new NavItem({
    			props: {
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navitem_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				navitem_changes.$$scope = { dirty, ctx };
    			}

    			navitem.$set(navitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(97:4) <Nav>",
    		ctx
    	});

    	return block;
    }

    // (111:6) {#if errorMsg}
    function create_if_block_1$2(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("ERROR: ");
    			t1 = text(/*errorMsg*/ ctx[7]);
    			attr_dev(p, "class", "msgRed svelte-lhbtsa");
    			set_style(p, "color", "#9d1c24");
    			add_location(p, file$4, 111, 8, 3516);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*errorMsg*/ 128) set_data_dev(t1, /*errorMsg*/ ctx[7]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(111:6) {#if errorMsg}",
    		ctx
    	});

    	return block;
    }

    // (114:6) {#if okMsg}
    function create_if_block$2(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*okMsg*/ ctx[8]);
    			attr_dev(p, "class", "msgGreen svelte-lhbtsa");
    			set_style(p, "color", "#155724");
    			add_location(p, file$4, 114, 8, 3620);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*okMsg*/ 256) set_data_dev(t, /*okMsg*/ ctx[8]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(114:6) {#if okMsg}",
    		ctx
    	});

    	return block;
    }

    // (169:14) <Button outline color="primary" on:click={updateStat}                  >
    function create_default_slot_1$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Actualizar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(169:14) <Button outline color=\\\"primary\\\" on:click={updateStat}                  >",
    		ctx
    	});

    	return block;
    }

    // (120:6) <Table bordered>
    function create_default_slot$2(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let th6;
    	let t13;
    	let tbody;
    	let tr1;
    	let td0;
    	let t14;
    	let t15;
    	let td1;
    	let t16;
    	let t17;
    	let td2;
    	let input0;
    	let t18;
    	let td3;
    	let input1;
    	let t19;
    	let td4;
    	let input2;
    	let t20;
    	let td5;
    	let input3;
    	let t21;
    	let td6;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	button = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*updateStat*/ ctx[9]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "País";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Alfabetizacion de mujeres";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Alfabetizacion de hombres";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Alfabetizacion de adultos";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Alfabetizacion de jovenes";
    			t11 = space();
    			th6 = element("th");
    			th6.textContent = "Acciones";
    			t13 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			t14 = text(/*updateCountry*/ ctx[1]);
    			t15 = space();
    			td1 = element("td");
    			t16 = text(/*updateDate*/ ctx[2]);
    			t17 = space();
    			td2 = element("td");
    			input0 = element("input");
    			t18 = space();
    			td3 = element("td");
    			input1 = element("input");
    			t19 = space();
    			td4 = element("td");
    			input2 = element("input");
    			t20 = space();
    			td5 = element("td");
    			input3 = element("input");
    			t21 = space();
    			td6 = element("td");
    			create_component(button.$$.fragment);
    			add_location(th0, file$4, 122, 12, 3785);
    			add_location(th1, file$4, 123, 12, 3814);
    			add_location(th2, file$4, 124, 12, 3841);
    			add_location(th3, file$4, 125, 12, 3890);
    			add_location(th4, file$4, 126, 12, 3939);
    			add_location(th5, file$4, 127, 12, 3988);
    			add_location(th6, file$4, 128, 12, 4037);
    			add_location(tr0, file$4, 121, 10, 3767);
    			add_location(thead, file$4, 120, 8, 3748);
    			add_location(td0, file$4, 133, 12, 4136);
    			add_location(td1, file$4, 134, 12, 4174);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "placeholder", "1000");
    			attr_dev(input0, "min", "1");
    			add_location(input0, file$4, 136, 15, 4229);
    			add_location(td2, file$4, 135, 12, 4209);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "placeholder", "1000");
    			attr_dev(input1, "min", "1");
    			add_location(input1, file$4, 144, 15, 4442);
    			add_location(td3, file$4, 143, 12, 4422);
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "placeholder", "10.2");
    			attr_dev(input2, "min", "1.0");
    			add_location(input2, file$4, 152, 15, 4657);
    			add_location(td4, file$4, 151, 12, 4637);
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "placeholder", "2.1");
    			attr_dev(input3, "min", "1.0");
    			add_location(input3, file$4, 160, 15, 4877);
    			add_location(td5, file$4, 159, 12, 4857);
    			add_location(td6, file$4, 167, 12, 5077);
    			add_location(tr1, file$4, 132, 10, 4118);
    			add_location(tbody, file$4, 131, 8, 4099);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			append_dev(tr0, t11);
    			append_dev(tr0, th6);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, t14);
    			append_dev(tr1, t15);
    			append_dev(tr1, td1);
    			append_dev(td1, t16);
    			append_dev(tr1, t17);
    			append_dev(tr1, td2);
    			append_dev(td2, input0);
    			set_input_value(input0, /*updateMenBorn*/ ctx[3]);
    			append_dev(tr1, t18);
    			append_dev(tr1, td3);
    			append_dev(td3, input1);
    			set_input_value(input1, /*updateWomenBorn*/ ctx[4]);
    			append_dev(tr1, t19);
    			append_dev(tr1, td4);
    			append_dev(td4, input2);
    			set_input_value(input2, /*updateNatalityRate*/ ctx[5]);
    			append_dev(tr1, t20);
    			append_dev(tr1, td5);
    			append_dev(td5, input3);
    			set_input_value(input3, /*updateFertilityRate*/ ctx[6]);
    			append_dev(tr1, t21);
    			append_dev(tr1, td6);
    			mount_component(button, td6, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[10]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[11]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[12]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[13])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*updateCountry*/ 2) set_data_dev(t14, /*updateCountry*/ ctx[1]);
    			if (!current || dirty & /*updateDate*/ 4) set_data_dev(t16, /*updateDate*/ ctx[2]);

    			if (dirty & /*updateMenBorn*/ 8 && to_number(input0.value) !== /*updateMenBorn*/ ctx[3]) {
    				set_input_value(input0, /*updateMenBorn*/ ctx[3]);
    			}

    			if (dirty & /*updateWomenBorn*/ 16 && to_number(input1.value) !== /*updateWomenBorn*/ ctx[4]) {
    				set_input_value(input1, /*updateWomenBorn*/ ctx[4]);
    			}

    			if (dirty & /*updateNatalityRate*/ 32 && to_number(input2.value) !== /*updateNatalityRate*/ ctx[5]) {
    				set_input_value(input2, /*updateNatalityRate*/ ctx[5]);
    			}

    			if (dirty & /*updateFertilityRate*/ 64 && to_number(input3.value) !== /*updateFertilityRate*/ ctx[6]) {
    				set_input_value(input3, /*updateFertilityRate*/ ctx[6]);
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(120:6) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let main;
    	let nav;
    	let t0;
    	let div0;
    	let h2;
    	let t1;
    	let strong0;
    	let t2_value = /*params*/ ctx[0].country + "";
    	let t2;
    	let t3;
    	let strong1;
    	let t4_value = /*params*/ ctx[0].date + "";
    	let t4;
    	let t5;
    	let div1;
    	let t6;
    	let t7;
    	let div2;
    	let table;
    	let current;

    	nav = new Nav({
    			props: {
    				$$slots: { default: [create_default_slot_2$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block0 = /*errorMsg*/ ctx[7] && create_if_block_1$2(ctx);
    	let if_block1 = /*okMsg*/ ctx[8] && create_if_block$2(ctx);

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(nav.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			h2 = element("h2");
    			t1 = text("Editar campo ");
    			strong0 = element("strong");
    			t2 = text(t2_value);
    			t3 = space();
    			strong1 = element("strong");
    			t4 = text(t4_value);
    			t5 = space();
    			div1 = element("div");
    			if (if_block0) if_block0.c();
    			t6 = space();
    			if (if_block1) if_block1.c();
    			t7 = space();
    			div2 = element("div");
    			create_component(table.$$.fragment);
    			add_location(strong0, file$4, 104, 21, 3371);
    			add_location(strong1, file$4, 105, 8, 3414);
    			add_location(h2, file$4, 103, 6, 3344);
    			attr_dev(div0, "class", "svelte-lhbtsa");
    			add_location(div0, file$4, 102, 4, 3331);
    			attr_dev(div1, "class", "svelte-lhbtsa");
    			add_location(div1, file$4, 109, 4, 3479);
    			attr_dev(div2, "class", "svelte-lhbtsa");
    			add_location(div2, file$4, 118, 4, 3709);
    			attr_dev(main, "class", "svelte-lhbtsa");
    			add_location(main, file$4, 95, 2, 3202);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(nav, main, null);
    			append_dev(main, t0);
    			append_dev(main, div0);
    			append_dev(div0, h2);
    			append_dev(h2, t1);
    			append_dev(h2, strong0);
    			append_dev(strong0, t2);
    			append_dev(h2, t3);
    			append_dev(h2, strong1);
    			append_dev(strong1, t4);
    			append_dev(main, t5);
    			append_dev(main, div1);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t6);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(main, t7);
    			append_dev(main, div2);
    			mount_component(table, div2, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const nav_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				nav_changes.$$scope = { dirty, ctx };
    			}

    			nav.$set(nav_changes);
    			if ((!current || dirty & /*params*/ 1) && t2_value !== (t2_value = /*params*/ ctx[0].country + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty & /*params*/ 1) && t4_value !== (t4_value = /*params*/ ctx[0].date + "")) set_data_dev(t4, t4_value);

    			if (/*errorMsg*/ ctx[7]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$2(ctx);
    					if_block0.c();
    					if_block0.m(div1, t6);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*okMsg*/ ctx[8]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$2(ctx);
    					if_block1.c();
    					if_block1.m(div1, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			const table_changes = {};

    			if (dirty & /*$$scope, updateFertilityRate, updateNatalityRate, updateWomenBorn, updateMenBorn, updateDate, updateCountry*/ 65662) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav.$$.fragment, local);
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(nav);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			destroy_component(table);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const BASE_CONTACT_API_PATH = "/api/v1";

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Edit_data_illiteracy", slots, []);
    	let { params = {} } = $$props;
    	let stat = {};
    	let updateCountry = "XXXX";
    	let updateDate = 1999;
    	let updateMenBorn = 999;
    	let updateWomenBorn = 999.9;
    	let updateNatalityRate = 999.9;
    	let updateFertilityRate = 999.9;
    	let errorMsg = "";
    	let okMsg = "";

    	async function getStat() {
    		console.log("Fetching stat..." + params.country + " " + params.date);
    		const res = await fetch(BASE_CONTACT_API_PATH + "/illiteracy/" + params.country + "/" + params.date);

    		if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			stat = json;
    			$$invalidate(1, updateCountry = stat.country);
    			$$invalidate(2, updateDate = stat.year);
    			$$invalidate(3, updateMenBorn = stat["female_illiteracy_rate"]);
    			$$invalidate(4, updateWomenBorn = stat["male_illiteracy_rate"]);
    			$$invalidate(5, updateNatalityRate = stat["adult_illiteracy_rate"]);
    			$$invalidate(6, updateFertilityRate = stat["young_illiteracy_rate"]);
    			console.log("Received stat.");
    		} else {
    			if (res.status === 404) {
    				$$invalidate(7, errorMsg = `No existe dato con pais: ${params.country} y fecha: ${params.date}`);
    			} else if (res.status === 500) {
    				$$invalidate(7, errorMsg = "No se han podido acceder a la base de datos");
    			}

    			$$invalidate(8, okMsg = "");
    			console.log("ERROR!" + errorMsg);
    		}
    	}

    	async function updateStat() {
    		console.log("Updating stat..." + JSON.stringify(params.country) + JSON.stringify(params.date));

    		await fetch(BASE_CONTACT_API_PATH + "/illiteracy/" + params.country + "/" + params.date, {
    			method: "PUT",
    			body: JSON.stringify({
    				country: params.country,
    				year: parseInt(updateDate),
    				"female_illiteracy_rate": parseFloat(updateMenBorn),
    				"male_illiteracy_rate": parseFloat(updateWomenBorn),
    				"adult_illiteracy_rate": parseFloat(updateNatalityRate),
    				"young_illiteracy_rate": parseFloat(updateFertilityRate)
    			}),
    			headers: { "Content-Type": "application/json" }
    		}).then(function (res) {
    			if (res.ok) {
    				console.log("OK");
    				getStat();
    				$$invalidate(7, errorMsg = "");
    				$$invalidate(8, okMsg = `${params.country} ${params.date} ha sido actualizado correctamente`);
    			} else {
    				if (res.status === 500) {
    					$$invalidate(7, errorMsg = "No se han podido acceder a la base de datos");
    				} else if (res.status === 404) {
    					$$invalidate(7, errorMsg = "No se han encontrado el dato solicitado");
    				} else if (res.status === 400) {
    					$$invalidate(7, errorMsg = "Todos los parámetros deben estar rellenados correctamente");
    				}

    				$$invalidate(8, okMsg = "");
    				getStat();
    				console.log("ERROR!" + errorMsg);
    			}
    		});
    	}

    	onMount(getStat);
    	const writable_props = ["params"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$2.warn(`<Edit_data_illiteracy> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		updateMenBorn = to_number(this.value);
    		$$invalidate(3, updateMenBorn);
    	}

    	function input1_input_handler() {
    		updateWomenBorn = to_number(this.value);
    		$$invalidate(4, updateWomenBorn);
    	}

    	function input2_input_handler() {
    		updateNatalityRate = to_number(this.value);
    		$$invalidate(5, updateNatalityRate);
    	}

    	function input3_input_handler() {
    		updateFertilityRate = to_number(this.value);
    		$$invalidate(6, updateFertilityRate);
    	}

    	$$self.$$set = $$props => {
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		Nav,
    		NavItem,
    		NavLink,
    		BASE_CONTACT_API_PATH,
    		params,
    		stat,
    		updateCountry,
    		updateDate,
    		updateMenBorn,
    		updateWomenBorn,
    		updateNatalityRate,
    		updateFertilityRate,
    		errorMsg,
    		okMsg,
    		getStat,
    		updateStat
    	});

    	$$self.$inject_state = $$props => {
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    		if ("stat" in $$props) stat = $$props.stat;
    		if ("updateCountry" in $$props) $$invalidate(1, updateCountry = $$props.updateCountry);
    		if ("updateDate" in $$props) $$invalidate(2, updateDate = $$props.updateDate);
    		if ("updateMenBorn" in $$props) $$invalidate(3, updateMenBorn = $$props.updateMenBorn);
    		if ("updateWomenBorn" in $$props) $$invalidate(4, updateWomenBorn = $$props.updateWomenBorn);
    		if ("updateNatalityRate" in $$props) $$invalidate(5, updateNatalityRate = $$props.updateNatalityRate);
    		if ("updateFertilityRate" in $$props) $$invalidate(6, updateFertilityRate = $$props.updateFertilityRate);
    		if ("errorMsg" in $$props) $$invalidate(7, errorMsg = $$props.errorMsg);
    		if ("okMsg" in $$props) $$invalidate(8, okMsg = $$props.okMsg);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		params,
    		updateCountry,
    		updateDate,
    		updateMenBorn,
    		updateWomenBorn,
    		updateNatalityRate,
    		updateFertilityRate,
    		errorMsg,
    		okMsg,
    		updateStat,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler
    	];
    }

    class Edit_data_illiteracy extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { params: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Edit_data_illiteracy",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get params() {
    		throw new Error("<Edit_data_illiteracy>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<Edit_data_illiteracy>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\front\poverty_risks\tabla_poverty_risks.svelte generated by Svelte v3.38.0 */

    const { Object: Object_1, console: console_1$1 } = globals;
    const file$3 = "src\\front\\poverty_risks\\tabla_poverty_risks.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[52] = list[i];
    	return child_ctx;
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[52] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[52] = list[i];
    	return child_ctx;
    }

    // (426:20) {:else}
    function create_else_block_2(ctx) {
    	let button0;
    	let t;
    	let button1;
    	let current;

    	button0 = new Button({
    			props: {
    				style: "background-color: green;",
    				$$slots: { default: [create_default_slot_24] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*loadInitialData*/ ctx[17]);

    	button1 = new Button({
    			props: {
    				style: "background-color: red;",
    				disabled: true,
    				$$slots: { default: [create_default_slot_23] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(button0.$$.fragment);
    			t = space();
    			create_component(button1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(button1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 268435456) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 268435456) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(button1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(426:20) {:else}",
    		ctx
    	});

    	return block;
    }

    // (422:20) {#if datosRecibidos.length!=0}
    function create_if_block_9(ctx) {
    	let button0;
    	let t;
    	let button1;
    	let current;

    	button0 = new Button({
    			props: {
    				style: "background-color: green;",
    				disabled: true,
    				$$slots: { default: [create_default_slot_22] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				style: "background-color: red;",
    				$$slots: { default: [create_default_slot_21] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*deleteAll*/ ctx[19]);

    	const block = {
    		c: function create() {
    			create_component(button0.$$.fragment);
    			t = space();
    			create_component(button1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(button1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 268435456) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 268435456) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(button1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(422:20) {#if datosRecibidos.length!=0}",
    		ctx
    	});

    	return block;
    }

    // (427:20) <Button style="background-color: green;" on:click = {loadInitialData}>
    function create_default_slot_24(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cargar datos");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_24.name,
    		type: "slot",
    		source: "(427:20) <Button style=\\\"background-color: green;\\\" on:click = {loadInitialData}>",
    		ctx
    	});

    	return block;
    }

    // (428:20) <Button style="background-color: red;" disabled>
    function create_default_slot_23(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar datos");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_23.name,
    		type: "slot",
    		source: "(428:20) <Button style=\\\"background-color: red;\\\" disabled>",
    		ctx
    	});

    	return block;
    }

    // (423:20) <Button style="background-color: green;" disabled>
    function create_default_slot_22(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cargar datos");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_22.name,
    		type: "slot",
    		source: "(423:20) <Button style=\\\"background-color: green;\\\" disabled>",
    		ctx
    	});

    	return block;
    }

    // (424:20) <Button style="background-color: red;" on:click = {deleteAll}>
    function create_default_slot_21(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar datos");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_21.name,
    		type: "slot",
    		source: "(424:20) <Button style=\\\"background-color: red;\\\" on:click = {deleteAll}>",
    		ctx
    	});

    	return block;
    }

    // (421:16) <Col>
    function create_default_slot_20(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_9, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*datosRecibidos*/ ctx[0].length != 0) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_20.name,
    		type: "slot",
    		source: "(421:16) <Col>",
    		ctx
    	});

    	return block;
    }

    // (420:12) <Row>
    function create_default_slot_19(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_20] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col_changes = {};

    			if (dirty[0] & /*datosRecibidos*/ 1 | dirty[1] & /*$$scope*/ 268435456) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_19.name,
    		type: "slot",
    		source: "(420:12) <Row>",
    		ctx
    	});

    	return block;
    }

    // (438:20) {#if msjError.length!=0}
    function create_if_block_8(ctx) {
    	let p;
    	let t0;
    	let b;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Se ha producido un error:");
    			b = element("b");
    			t1 = text(/*msjError*/ ctx[3]);
    			add_location(b, file$3, 438, 69, 15792);
    			set_style(p, "color", "tomato");
    			add_location(p, file$3, 438, 20, 15743);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, b);
    			append_dev(b, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*msjError*/ 8) set_data_dev(t1, /*msjError*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(438:20) {#if msjError.length!=0}",
    		ctx
    	});

    	return block;
    }

    // (441:20) {#if msjOK.length!=0}
    function create_if_block_7(ctx) {
    	let p;
    	let b;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			b = element("b");
    			t = text(/*msjOK*/ ctx[4]);
    			add_location(b, file$3, 441, 37, 15924);
    			attr_dev(p, "class", "msjOK");
    			add_location(p, file$3, 441, 20, 15907);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, b);
    			append_dev(b, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*msjOK*/ 16) set_data_dev(t, /*msjOK*/ ctx[4]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(441:20) {#if msjOK.length!=0}",
    		ctx
    	});

    	return block;
    }

    // (437:16) <Col md=4 style="text-align: center;">
    function create_default_slot_18(ctx) {
    	let t;
    	let if_block1_anchor;
    	let if_block0 = /*msjError*/ ctx[3].length != 0 && create_if_block_8(ctx);
    	let if_block1 = /*msjOK*/ ctx[4].length != 0 && create_if_block_7(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*msjError*/ ctx[3].length != 0) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_8(ctx);
    					if_block0.c();
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*msjOK*/ ctx[4].length != 0) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_7(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_18.name,
    		type: "slot",
    		source: "(437:16) <Col md=4 style=\\\"text-align: center;\\\">",
    		ctx
    	});

    	return block;
    }

    // (434:12) <Row>
    function create_default_slot_17(ctx) {
    	let col0;
    	let t0;
    	let col1;
    	let t1;
    	let col2;
    	let current;
    	col0 = new Col({ props: { md: "4" }, $$inline: true });

    	col1 = new Col({
    			props: {
    				md: "4",
    				style: "text-align: center;",
    				$$slots: { default: [create_default_slot_18] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	col2 = new Col({ props: { md: "4" }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(col0.$$.fragment);
    			t0 = space();
    			create_component(col1.$$.fragment);
    			t1 = space();
    			create_component(col2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(col1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(col2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col1_changes = {};

    			if (dirty[0] & /*msjOK, msjError*/ 24 | dirty[1] & /*$$scope*/ 268435456) {
    				col1_changes.$$scope = { dirty, ctx };
    			}

    			col1.$set(col1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col0.$$.fragment, local);
    			transition_in(col1.$$.fragment, local);
    			transition_in(col2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col0.$$.fragment, local);
    			transition_out(col1.$$.fragment, local);
    			transition_out(col2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(col1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(col2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_17.name,
    		type: "slot",
    		source: "(434:12) <Row>",
    		ctx
    	});

    	return block;
    }

    // (458:8) <Table>
    function create_default_slot_16(ctx) {
    	let thead;
    	let tr0;
    	let td0;
    	let t1;
    	let td1;
    	let t3;
    	let td2;
    	let t5;
    	let td3;
    	let t7;
    	let td4;
    	let t9;
    	let td5;
    	let t11;
    	let td6;
    	let t13;
    	let tbody;
    	let tr1;
    	let td7;
    	let input0;
    	let t14;
    	let td8;
    	let input1;
    	let t15;
    	let td9;
    	let input2;
    	let t16;
    	let input3;
    	let t17;
    	let td10;
    	let input4;
    	let t18;
    	let input5;
    	let t19;
    	let td11;
    	let input6;
    	let t20;
    	let input7;
    	let t21;
    	let td12;
    	let input8;
    	let t22;
    	let input9;
    	let t23;
    	let td13;
    	let button0;
    	let t25;
    	let td14;
    	let button1;
    	let t27;
    	let td15;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			td0 = element("td");
    			td0.textContent = "Año";
    			t1 = space();
    			td1 = element("td");
    			td1.textContent = "País";
    			t3 = space();
    			td2 = element("td");
    			td2.textContent = "Personas en riesgo de pobreza";
    			t5 = space();
    			td3 = element("td");
    			td3.textContent = "Índice de riesgo de pobreza (persona)";
    			t7 = space();
    			td4 = element("td");
    			td4.textContent = "Índice de riesgo de pobreza (hogar)";
    			t9 = space();
    			td5 = element("td");
    			td5.textContent = "Porcentaje población en riesgo de pobreza";
    			t11 = space();
    			td6 = element("td");
    			td6.textContent = "Acciones";
    			t13 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td7 = element("td");
    			input0 = element("input");
    			t14 = space();
    			td8 = element("td");
    			input1 = element("input");
    			t15 = space();
    			td9 = element("td");
    			input2 = element("input");
    			t16 = space();
    			input3 = element("input");
    			t17 = space();
    			td10 = element("td");
    			input4 = element("input");
    			t18 = space();
    			input5 = element("input");
    			t19 = space();
    			td11 = element("td");
    			input6 = element("input");
    			t20 = space();
    			input7 = element("input");
    			t21 = space();
    			td12 = element("td");
    			input8 = element("input");
    			t22 = space();
    			input9 = element("input");
    			t23 = space();
    			td13 = element("td");
    			button0 = element("button");
    			button0.textContent = "Buscar";
    			t25 = space();
    			td14 = element("td");
    			button1 = element("button");
    			button1.textContent = "Resetear";
    			t27 = space();
    			td15 = element("td");
    			attr_dev(td0, "valign", "middle");
    			add_location(td0, file$3, 461, 20, 16437);
    			attr_dev(td1, "valign", "middle");
    			add_location(td1, file$3, 462, 20, 16487);
    			attr_dev(td2, "valign", "middle");
    			add_location(td2, file$3, 463, 20, 16538);
    			attr_dev(td3, "valign", "middle");
    			add_location(td3, file$3, 464, 20, 16614);
    			attr_dev(td4, "valign", "middle");
    			add_location(td4, file$3, 465, 20, 16698);
    			attr_dev(td5, "valign", "middle");
    			add_location(td5, file$3, 466, 20, 16780);
    			attr_dev(td6, "valign", "middle");
    			attr_dev(td6, "colspan", "2");
    			add_location(td6, file$3, 467, 20, 16868);
    			set_style(tr0, "text-align", "center");
    			attr_dev(tr0, "valign", "middle");
    			add_location(tr0, file$3, 460, 16, 16366);
    			add_location(thead, file$3, 459, 12, 16339);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "placeholder", "2015");
    			attr_dev(input0, "min", "1900");
    			add_location(input0, file$3, 476, 20, 17149);
    			add_location(td7, file$3, 476, 16, 17145);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "Francia");
    			add_location(input1, file$3, 477, 20, 17260);
    			add_location(td8, file$3, 477, 16, 17256);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "placeholder", "min");
    			add_location(input2, file$3, 479, 20, 17385);
    			attr_dev(input3, "type", "text");
    			attr_dev(input3, "placeholder", "max");
    			add_location(input3, file$3, 480, 20, 17483);
    			add_location(td9, file$3, 478, 16, 17359);
    			attr_dev(input4, "type", "text");
    			attr_dev(input4, "placeholder", "min");
    			add_location(input4, file$3, 483, 20, 17626);
    			attr_dev(input5, "type", "text");
    			attr_dev(input5, "placeholder", "max");
    			add_location(input5, file$3, 484, 20, 17724);
    			add_location(td10, file$3, 482, 16, 17600);
    			attr_dev(input6, "type", "text");
    			attr_dev(input6, "placeholder", "min");
    			add_location(input6, file$3, 487, 20, 17867);
    			attr_dev(input7, "type", "text");
    			attr_dev(input7, "placeholder", "max");
    			add_location(input7, file$3, 488, 20, 17965);
    			add_location(td11, file$3, 486, 16, 17841);
    			attr_dev(input8, "type", "text");
    			attr_dev(input8, "placeholder", "min");
    			add_location(input8, file$3, 491, 20, 18108);
    			attr_dev(input9, "type", "text");
    			attr_dev(input9, "placeholder", "max");
    			add_location(input9, file$3, 492, 20, 18209);
    			add_location(td12, file$3, 490, 16, 18082);
    			attr_dev(button0, "class", "btn btn-primary");
    			add_location(button0, file$3, 494, 20, 18333);
    			add_location(td13, file$3, 494, 16, 18329);
    			attr_dev(button1, "class", "btn btn-secondary");
    			add_location(button1, file$3, 495, 20, 18429);
    			add_location(td14, file$3, 495, 16, 18425);
    			add_location(td15, file$3, 496, 16, 18525);
    			add_location(tr1, file$3, 474, 12, 17067);
    			add_location(tbody, file$3, 470, 12, 16973);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, td0);
    			append_dev(tr0, t1);
    			append_dev(tr0, td1);
    			append_dev(tr0, t3);
    			append_dev(tr0, td2);
    			append_dev(tr0, t5);
    			append_dev(tr0, td3);
    			append_dev(tr0, t7);
    			append_dev(tr0, td4);
    			append_dev(tr0, t9);
    			append_dev(tr0, td5);
    			append_dev(tr0, t11);
    			append_dev(tr0, td6);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td7);
    			append_dev(td7, input0);
    			set_input_value(input0, /*parametrosBusqueda*/ ctx[7].y);
    			append_dev(tr1, t14);
    			append_dev(tr1, td8);
    			append_dev(td8, input1);
    			set_input_value(input1, /*parametrosBusqueda*/ ctx[7].c);
    			append_dev(tr1, t15);
    			append_dev(tr1, td9);
    			append_dev(td9, input2);
    			set_input_value(input2, /*parametrosBusqueda*/ ctx[7].aprp);
    			append_dev(td9, t16);
    			append_dev(td9, input3);
    			set_input_value(input3, /*parametrosBusqueda*/ ctx[7].uprp);
    			append_dev(tr1, t17);
    			append_dev(tr1, td10);
    			append_dev(td10, input4);
    			set_input_value(input4, /*parametrosBusqueda*/ ctx[7].appl);
    			append_dev(td10, t18);
    			append_dev(td10, input5);
    			set_input_value(input5, /*parametrosBusqueda*/ ctx[7].uppl);
    			append_dev(tr1, t19);
    			append_dev(tr1, td11);
    			append_dev(td11, input6);
    			set_input_value(input6, /*parametrosBusqueda*/ ctx[7].ahpl);
    			append_dev(td11, t20);
    			append_dev(td11, input7);
    			set_input_value(input7, /*parametrosBusqueda*/ ctx[7].uhpl);
    			append_dev(tr1, t21);
    			append_dev(tr1, td12);
    			append_dev(td12, input8);
    			set_input_value(input8, /*parametrosBusqueda*/ ctx[7].apercnt);
    			append_dev(td12, t22);
    			append_dev(td12, input9);
    			set_input_value(input9, /*parametrosBusqueda*/ ctx[7].upercnt);
    			append_dev(tr1, t23);
    			append_dev(tr1, td13);
    			append_dev(td13, button0);
    			append_dev(tr1, t25);
    			append_dev(tr1, td14);
    			append_dev(td14, button1);
    			append_dev(tr1, t27);
    			append_dev(tr1, td15);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[22]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[23]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[24]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[25]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[26]),
    					listen_dev(input5, "input", /*input5_input_handler*/ ctx[27]),
    					listen_dev(input6, "input", /*input6_input_handler*/ ctx[28]),
    					listen_dev(input7, "input", /*input7_input_handler*/ ctx[29]),
    					listen_dev(input8, "input", /*input8_input_handler*/ ctx[30]),
    					listen_dev(input9, "input", /*input9_input_handler*/ ctx[31]),
    					listen_dev(button0, "click", /*searchData*/ ctx[14], false, false, false),
    					listen_dev(button1, "click", /*resetQuery*/ ctx[15], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*parametrosBusqueda*/ 128 && to_number(input0.value) !== /*parametrosBusqueda*/ ctx[7].y) {
    				set_input_value(input0, /*parametrosBusqueda*/ ctx[7].y);
    			}

    			if (dirty[0] & /*parametrosBusqueda*/ 128 && input1.value !== /*parametrosBusqueda*/ ctx[7].c) {
    				set_input_value(input1, /*parametrosBusqueda*/ ctx[7].c);
    			}

    			if (dirty[0] & /*parametrosBusqueda*/ 128 && input2.value !== /*parametrosBusqueda*/ ctx[7].aprp) {
    				set_input_value(input2, /*parametrosBusqueda*/ ctx[7].aprp);
    			}

    			if (dirty[0] & /*parametrosBusqueda*/ 128 && input3.value !== /*parametrosBusqueda*/ ctx[7].uprp) {
    				set_input_value(input3, /*parametrosBusqueda*/ ctx[7].uprp);
    			}

    			if (dirty[0] & /*parametrosBusqueda*/ 128 && input4.value !== /*parametrosBusqueda*/ ctx[7].appl) {
    				set_input_value(input4, /*parametrosBusqueda*/ ctx[7].appl);
    			}

    			if (dirty[0] & /*parametrosBusqueda*/ 128 && input5.value !== /*parametrosBusqueda*/ ctx[7].uppl) {
    				set_input_value(input5, /*parametrosBusqueda*/ ctx[7].uppl);
    			}

    			if (dirty[0] & /*parametrosBusqueda*/ 128 && input6.value !== /*parametrosBusqueda*/ ctx[7].ahpl) {
    				set_input_value(input6, /*parametrosBusqueda*/ ctx[7].ahpl);
    			}

    			if (dirty[0] & /*parametrosBusqueda*/ 128 && input7.value !== /*parametrosBusqueda*/ ctx[7].uhpl) {
    				set_input_value(input7, /*parametrosBusqueda*/ ctx[7].uhpl);
    			}

    			if (dirty[0] & /*parametrosBusqueda*/ 128 && input8.value !== /*parametrosBusqueda*/ ctx[7].apercnt) {
    				set_input_value(input8, /*parametrosBusqueda*/ ctx[7].apercnt);
    			}

    			if (dirty[0] & /*parametrosBusqueda*/ 128 && input9.value !== /*parametrosBusqueda*/ ctx[7].upercnt) {
    				set_input_value(input9, /*parametrosBusqueda*/ ctx[7].upercnt);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(tbody);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_16.name,
    		type: "slot",
    		source: "(458:8) <Table>",
    		ctx
    	});

    	return block;
    }

    // (510:4) {#if superBusqueda.length!=0}
    function create_if_block_5(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				$$slots: { default: [create_default_slot_12] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty[0] & /*currentPageBusqueda, datosBusquedaSinLimit, superBusqueda*/ 580 | dirty[1] & /*$$scope*/ 268435456) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(510:4) {#if superBusqueda.length!=0}",
    		ctx
    	});

    	return block;
    }

    // (529:16) {#each superBusqueda as stat}
    function create_each_block_2(ctx) {
    	let tr;
    	let th0;
    	let t0_value = /*stat*/ ctx[52].year + "";
    	let t0;
    	let t1;
    	let th1;
    	let t2_value = /*stat*/ ctx[52].country + "";
    	let t2;
    	let t3;
    	let th2;
    	let t4_value = /*stat*/ ctx[52].people_in_risk_of_poverty + "";
    	let t4;
    	let t5;
    	let th3;
    	let t6_value = /*stat*/ ctx[52].people_poverty_line + "";
    	let t6;
    	let t7;
    	let th4;
    	let t8_value = /*stat*/ ctx[52].home_poverty_line + "";
    	let t8;
    	let t9;
    	let th5;
    	let t10_value = /*stat*/ ctx[52].percentage_risk_of_poverty + "";
    	let t10;
    	let t11;
    	let th6;
    	let button0;
    	let t13;
    	let th7;
    	let a;
    	let button1;
    	let a_href_value;
    	let t15;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			th0 = element("th");
    			t0 = text(t0_value);
    			t1 = space();
    			th1 = element("th");
    			t2 = text(t2_value);
    			t3 = space();
    			th2 = element("th");
    			t4 = text(t4_value);
    			t5 = space();
    			th3 = element("th");
    			t6 = text(t6_value);
    			t7 = space();
    			th4 = element("th");
    			t8 = text(t8_value);
    			t9 = space();
    			th5 = element("th");
    			t10 = text(t10_value);
    			t11 = space();
    			th6 = element("th");
    			button0 = element("button");
    			button0.textContent = "Borrar";
    			t13 = space();
    			th7 = element("th");
    			a = element("a");
    			button1 = element("button");
    			button1.textContent = "Editar";
    			t15 = space();
    			add_location(th0, file$3, 530, 20, 19750);
    			add_location(th1, file$3, 531, 20, 19792);
    			add_location(th2, file$3, 532, 20, 19837);
    			add_location(th3, file$3, 533, 20, 19900);
    			add_location(th4, file$3, 534, 20, 19957);
    			add_location(th5, file$3, 535, 20, 20012);
    			attr_dev(button0, "class", "btn btn-danger");
    			add_location(button0, file$3, 536, 24, 20080);
    			add_location(th6, file$3, 536, 20, 20076);
    			attr_dev(button1, "class", "btn btn-warning");
    			add_location(button1, file$3, 537, 77, 20259);
    			attr_dev(a, "href", a_href_value = "#/poverty_risks/" + /*stat*/ ctx[52].country + "/" + /*stat*/ ctx[52].year);
    			add_location(a, file$3, 537, 24, 20206);
    			add_location(th7, file$3, 537, 20, 20202);
    			set_style(tr, "text-align", "center");
    			add_location(tr, file$3, 529, 16, 19695);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, th0);
    			append_dev(th0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    			append_dev(th1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, th2);
    			append_dev(th2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, th3);
    			append_dev(th3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, th4);
    			append_dev(th4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, th5);
    			append_dev(th5, t10);
    			append_dev(tr, t11);
    			append_dev(tr, th6);
    			append_dev(th6, button0);
    			append_dev(tr, t13);
    			append_dev(tr, th7);
    			append_dev(th7, a);
    			append_dev(a, button1);
    			append_dev(tr, t15);

    			if (!mounted) {
    				dispose = listen_dev(
    					button0,
    					"click",
    					function () {
    						if (is_function(/*deleteElement*/ ctx[18](/*stat*/ ctx[52].year, /*stat*/ ctx[52].country))) /*deleteElement*/ ctx[18](/*stat*/ ctx[52].year, /*stat*/ ctx[52].country).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*superBusqueda*/ 4 && t0_value !== (t0_value = /*stat*/ ctx[52].year + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*superBusqueda*/ 4 && t2_value !== (t2_value = /*stat*/ ctx[52].country + "")) set_data_dev(t2, t2_value);
    			if (dirty[0] & /*superBusqueda*/ 4 && t4_value !== (t4_value = /*stat*/ ctx[52].people_in_risk_of_poverty + "")) set_data_dev(t4, t4_value);
    			if (dirty[0] & /*superBusqueda*/ 4 && t6_value !== (t6_value = /*stat*/ ctx[52].people_poverty_line + "")) set_data_dev(t6, t6_value);
    			if (dirty[0] & /*superBusqueda*/ 4 && t8_value !== (t8_value = /*stat*/ ctx[52].home_poverty_line + "")) set_data_dev(t8, t8_value);
    			if (dirty[0] & /*superBusqueda*/ 4 && t10_value !== (t10_value = /*stat*/ ctx[52].percentage_risk_of_poverty + "")) set_data_dev(t10, t10_value);

    			if (dirty[0] & /*superBusqueda*/ 4 && a_href_value !== (a_href_value = "#/poverty_risks/" + /*stat*/ ctx[52].country + "/" + /*stat*/ ctx[52].year)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(529:16) {#each superBusqueda as stat}",
    		ctx
    	});

    	return block;
    }

    // (546:16) <PaginationItem class="{currentPageBusqueda===1? 'disabled' : ''}">
    function create_default_slot_15(ctx) {
    	let paginationlink;
    	let current;

    	paginationlink = new PaginationLink({
    			props: { previous: true, href: "#/poverty_risks" },
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler*/ ctx[32]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_15.name,
    		type: "slot",
    		source: "(546:16) <PaginationItem class=\\\"{currentPageBusqueda===1? 'disabled' : ''}\\\">",
    		ctx
    	});

    	return block;
    }

    // (549:16) {#if masDatosBusqueda}
    function create_if_block_6(ctx) {
    	let paginationitem;
    	let current;

    	paginationitem = new PaginationItem({
    			props: {
    				class: /*currentPageBusqueda*/ ctx[6] === Math.ceil(/*datosBusquedaSinLimit*/ ctx[9].length / /*limit*/ ctx[11])
    				? "disabled"
    				: "",
    				$$slots: { default: [create_default_slot_14] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem_changes = {};

    			if (dirty[0] & /*currentPageBusqueda, datosBusquedaSinLimit*/ 576) paginationitem_changes.class = /*currentPageBusqueda*/ ctx[6] === Math.ceil(/*datosBusquedaSinLimit*/ ctx[9].length / /*limit*/ ctx[11])
    			? "disabled"
    			: "";

    			if (dirty[1] & /*$$scope*/ 268435456) {
    				paginationitem_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem.$set(paginationitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(549:16) {#if masDatosBusqueda}",
    		ctx
    	});

    	return block;
    }

    // (550:16) <PaginationItem class="{currentPageBusqueda===(Math.ceil(datosBusquedaSinLimit.length / limit))? 'disabled' : ''}">
    function create_default_slot_14(ctx) {
    	let paginationlink;
    	let current;

    	paginationlink = new PaginationLink({
    			props: { next: true, href: "#/poverty_risks" },
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_1*/ ctx[33]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14.name,
    		type: "slot",
    		source: "(550:16) <PaginationItem class=\\\"{currentPageBusqueda===(Math.ceil(datosBusquedaSinLimit.length / limit))? 'disabled' : ''}\\\">",
    		ctx
    	});

    	return block;
    }

    // (545:12) <Pagination ariaLabel ="Web Pagination">
    function create_default_slot_13(ctx) {
    	let paginationitem;
    	let t;
    	let if_block_anchor;
    	let current;

    	paginationitem = new PaginationItem({
    			props: {
    				class: /*currentPageBusqueda*/ ctx[6] === 1 ? "disabled" : "",
    				$$slots: { default: [create_default_slot_15] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block = /*masDatosBusqueda*/ ctx[13] && create_if_block_6(ctx);

    	const block = {
    		c: function create() {
    			create_component(paginationitem.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem, target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem_changes = {};
    			if (dirty[0] & /*currentPageBusqueda*/ 64) paginationitem_changes.class = /*currentPageBusqueda*/ ctx[6] === 1 ? "disabled" : "";

    			if (dirty[1] & /*$$scope*/ 268435456) {
    				paginationitem_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem.$set(paginationitem_changes);
    			if (/*masDatosBusqueda*/ ctx[13]) if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem, detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13.name,
    		type: "slot",
    		source: "(545:12) <Pagination ariaLabel =\\\"Web Pagination\\\">",
    		ctx
    	});

    	return block;
    }

    // (511:8) <Table>
    function create_default_slot_12(ctx) {
    	let thead;
    	let tr;
    	let td0;
    	let t1;
    	let td1;
    	let t3;
    	let td2;
    	let t5;
    	let td3;
    	let t7;
    	let td4;
    	let t9;
    	let td5;
    	let t11;
    	let td6;
    	let t13;
    	let tbody;
    	let t14;
    	let pagination;
    	let current;
    	let each_value_2 = /*superBusqueda*/ ctx[2];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	pagination = new Pagination({
    			props: {
    				ariaLabel: "Web Pagination",
    				$$slots: { default: [create_default_slot_13] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr = element("tr");
    			td0 = element("td");
    			td0.textContent = "Año";
    			t1 = space();
    			td1 = element("td");
    			td1.textContent = "País";
    			t3 = space();
    			td2 = element("td");
    			td2.textContent = "Personas en riesgo de pobreza";
    			t5 = space();
    			td3 = element("td");
    			td3.textContent = "Índice de riesgo de pobreza (persona)";
    			t7 = space();
    			td4 = element("td");
    			td4.textContent = "Índice de riesgo de pobreza (hogar)";
    			t9 = space();
    			td5 = element("td");
    			td5.textContent = "Porcentaje población en riesgo de pobreza";
    			t11 = space();
    			td6 = element("td");
    			td6.textContent = "Acciones";
    			t13 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t14 = space();
    			create_component(pagination.$$.fragment);
    			attr_dev(td0, "valign", "middle");
    			add_location(td0, file$3, 514, 20, 18962);
    			attr_dev(td1, "valign", "middle");
    			add_location(td1, file$3, 515, 20, 19012);
    			attr_dev(td2, "valign", "middle");
    			add_location(td2, file$3, 516, 20, 19063);
    			attr_dev(td3, "valign", "middle");
    			add_location(td3, file$3, 517, 20, 19139);
    			attr_dev(td4, "valign", "middle");
    			add_location(td4, file$3, 518, 20, 19223);
    			attr_dev(td5, "valign", "middle");
    			add_location(td5, file$3, 519, 20, 19305);
    			attr_dev(td6, "valign", "middle");
    			attr_dev(td6, "colspan", "2");
    			add_location(td6, file$3, 520, 20, 19393);
    			set_style(tr, "text-align", "center");
    			attr_dev(tr, "valign", "middle");
    			add_location(tr, file$3, 513, 16, 18891);
    			add_location(thead, file$3, 512, 12, 18864);
    			add_location(tbody, file$3, 523, 12, 19498);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr);
    			append_dev(tr, td0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(tr, t11);
    			append_dev(tr, td6);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, tbody, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			insert_dev(target, t14, anchor);
    			mount_component(pagination, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*superBusqueda, deleteElement*/ 262148) {
    				each_value_2 = /*superBusqueda*/ ctx[2];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}

    			const pagination_changes = {};

    			if (dirty[0] & /*currentPageBusqueda, datosBusquedaSinLimit*/ 576 | dirty[1] & /*$$scope*/ 268435456) {
    				pagination_changes.$$scope = { dirty, ctx };
    			}

    			pagination.$set(pagination_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pagination.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pagination.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t14);
    			destroy_component(pagination, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12.name,
    		type: "slot",
    		source: "(511:8) <Table>",
    		ctx
    	});

    	return block;
    }

    // (683:8) {:else}
    function create_else_block_1(ctx) {
    	let div;
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(row.$$.fragment);
    			set_style(div, "aling-items", "center");
    			set_style(div, "justify-content", "center");
    			add_location(div, file$3, 683, 12, 27336);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(row, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row_changes = {};

    			if (dirty[1] & /*$$scope*/ 268435456) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(row);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(683:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (620:4) {#if datosRecibidos.length!=0}
    function create_if_block_3(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty[0] & /*currentPage, datosRecibidosSinLimit, datosRecibidos, nuevoElemento*/ 1059 | dirty[1] & /*$$scope*/ 268435456) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(620:4) {#if datosRecibidos.length!=0}",
    		ctx
    	});

    	return block;
    }

    // (559:4) {#if datosBusqueda.length!=0}
    function create_if_block$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*datosBusqueda*/ ctx[8].length != 0) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_2(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_2(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(559:4) {#if datosBusqueda.length!=0}",
    		ctx
    	});

    	return block;
    }

    // (686:20) <Col md=12 style="text-align: center;">
    function create_default_slot_11(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "No existen datos cargados. Por favor, pulse el botón \"Cargar datos\".";
    			add_location(h2, file$3, 686, 24, 27503);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(686:20) <Col md=12 style=\\\"text-align: center;\\\">",
    		ctx
    	});

    	return block;
    }

    // (685:16) <Row>
    function create_default_slot_10(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				md: "12",
    				style: "text-align: center;",
    				$$slots: { default: [create_default_slot_11] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col_changes = {};

    			if (dirty[1] & /*$$scope*/ 268435456) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(685:16) <Row>",
    		ctx
    	});

    	return block;
    }

    // (654:16) {#each datosRecibidos as stat}
    function create_each_block_1(ctx) {
    	let tr;
    	let th0;
    	let t0_value = /*stat*/ ctx[52].year + "";
    	let t0;
    	let t1;
    	let th1;
    	let t2_value = /*stat*/ ctx[52].country + "";
    	let t2;
    	let t3;
    	let th2;
    	let t4_value = /*stat*/ ctx[52].people_in_risk_of_poverty + "";
    	let t4;
    	let t5;
    	let th3;
    	let t6_value = /*stat*/ ctx[52].people_poverty_line + "";
    	let t6;
    	let t7;
    	let th4;
    	let t8_value = /*stat*/ ctx[52].home_poverty_line + "";
    	let t8;
    	let t9;
    	let th5;
    	let t10_value = /*stat*/ ctx[52].percentage_risk_of_poverty + "";
    	let t10;
    	let t11;
    	let th6;
    	let button0;
    	let t13;
    	let th7;
    	let a;
    	let button1;
    	let a_href_value;
    	let t15;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			th0 = element("th");
    			t0 = text(t0_value);
    			t1 = space();
    			th1 = element("th");
    			t2 = text(t2_value);
    			t3 = space();
    			th2 = element("th");
    			t4 = text(t4_value);
    			t5 = space();
    			th3 = element("th");
    			t6 = text(t6_value);
    			t7 = space();
    			th4 = element("th");
    			t8 = text(t8_value);
    			t9 = space();
    			th5 = element("th");
    			t10 = text(t10_value);
    			t11 = space();
    			th6 = element("th");
    			button0 = element("button");
    			button0.textContent = "Borrar";
    			t13 = space();
    			th7 = element("th");
    			a = element("a");
    			button1 = element("button");
    			button1.textContent = "Editar";
    			t15 = space();
    			add_location(th0, file$3, 655, 20, 25989);
    			add_location(th1, file$3, 656, 20, 26031);
    			add_location(th2, file$3, 657, 20, 26076);
    			add_location(th3, file$3, 658, 20, 26139);
    			add_location(th4, file$3, 659, 20, 26196);
    			add_location(th5, file$3, 660, 20, 26251);
    			attr_dev(button0, "class", "btn btn-danger");
    			add_location(button0, file$3, 661, 24, 26319);
    			add_location(th6, file$3, 661, 20, 26315);
    			attr_dev(button1, "class", "btn btn-warning");
    			add_location(button1, file$3, 662, 77, 26498);
    			attr_dev(a, "href", a_href_value = "#/poverty_risks/" + /*stat*/ ctx[52].country + "/" + /*stat*/ ctx[52].year);
    			add_location(a, file$3, 662, 24, 26445);
    			add_location(th7, file$3, 662, 20, 26441);
    			set_style(tr, "text-align", "center");
    			add_location(tr, file$3, 654, 16, 25934);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, th0);
    			append_dev(th0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    			append_dev(th1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, th2);
    			append_dev(th2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, th3);
    			append_dev(th3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, th4);
    			append_dev(th4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, th5);
    			append_dev(th5, t10);
    			append_dev(tr, t11);
    			append_dev(tr, th6);
    			append_dev(th6, button0);
    			append_dev(tr, t13);
    			append_dev(tr, th7);
    			append_dev(th7, a);
    			append_dev(a, button1);
    			append_dev(tr, t15);

    			if (!mounted) {
    				dispose = listen_dev(
    					button0,
    					"click",
    					function () {
    						if (is_function(/*deleteElement*/ ctx[18](/*stat*/ ctx[52].year, /*stat*/ ctx[52].country))) /*deleteElement*/ ctx[18](/*stat*/ ctx[52].year, /*stat*/ ctx[52].country).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*datosRecibidos*/ 1 && t0_value !== (t0_value = /*stat*/ ctx[52].year + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*datosRecibidos*/ 1 && t2_value !== (t2_value = /*stat*/ ctx[52].country + "")) set_data_dev(t2, t2_value);
    			if (dirty[0] & /*datosRecibidos*/ 1 && t4_value !== (t4_value = /*stat*/ ctx[52].people_in_risk_of_poverty + "")) set_data_dev(t4, t4_value);
    			if (dirty[0] & /*datosRecibidos*/ 1 && t6_value !== (t6_value = /*stat*/ ctx[52].people_poverty_line + "")) set_data_dev(t6, t6_value);
    			if (dirty[0] & /*datosRecibidos*/ 1 && t8_value !== (t8_value = /*stat*/ ctx[52].home_poverty_line + "")) set_data_dev(t8, t8_value);
    			if (dirty[0] & /*datosRecibidos*/ 1 && t10_value !== (t10_value = /*stat*/ ctx[52].percentage_risk_of_poverty + "")) set_data_dev(t10, t10_value);

    			if (dirty[0] & /*datosRecibidos*/ 1 && a_href_value !== (a_href_value = "#/poverty_risks/" + /*stat*/ ctx[52].country + "/" + /*stat*/ ctx[52].year)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(654:16) {#each datosRecibidos as stat}",
    		ctx
    	});

    	return block;
    }

    // (671:16) <PaginationItem class="{currentPage===1? 'disabled' : ''}">
    function create_default_slot_9(ctx) {
    	let paginationlink;
    	let current;

    	paginationlink = new PaginationLink({
    			props: { previous: true, href: "#/poverty_risks" },
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_4*/ ctx[42]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(671:16) <PaginationItem class=\\\"{currentPage===1? 'disabled' : ''}\\\">",
    		ctx
    	});

    	return block;
    }

    // (674:16) {#if masDatos}
    function create_if_block_4(ctx) {
    	let paginationitem;
    	let current;

    	paginationitem = new PaginationItem({
    			props: {
    				class: /*currentPage*/ ctx[5] === Math.ceil(/*datosRecibidosSinLimit*/ ctx[1].length / /*limit*/ ctx[11])
    				? "disabled"
    				: "",
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem_changes = {};

    			if (dirty[0] & /*currentPage, datosRecibidosSinLimit*/ 34) paginationitem_changes.class = /*currentPage*/ ctx[5] === Math.ceil(/*datosRecibidosSinLimit*/ ctx[1].length / /*limit*/ ctx[11])
    			? "disabled"
    			: "";

    			if (dirty[1] & /*$$scope*/ 268435456) {
    				paginationitem_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem.$set(paginationitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(674:16) {#if masDatos}",
    		ctx
    	});

    	return block;
    }

    // (675:16) <PaginationItem class="{currentPage===(Math.ceil(datosRecibidosSinLimit.length / limit))? 'disabled' : ''}">
    function create_default_slot_8(ctx) {
    	let paginationlink;
    	let current;

    	paginationlink = new PaginationLink({
    			props: { next: true, href: "#/poverty_risks" },
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_5*/ ctx[43]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(675:16) <PaginationItem class=\\\"{currentPage===(Math.ceil(datosRecibidosSinLimit.length / limit))? 'disabled' : ''}\\\">",
    		ctx
    	});

    	return block;
    }

    // (670:12) <Pagination ariaLabel ="Web Pagination">
    function create_default_slot_7(ctx) {
    	let paginationitem;
    	let t;
    	let if_block_anchor;
    	let current;

    	paginationitem = new PaginationItem({
    			props: {
    				class: /*currentPage*/ ctx[5] === 1 ? "disabled" : "",
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block = /*masDatos*/ ctx[12] && create_if_block_4(ctx);

    	const block = {
    		c: function create() {
    			create_component(paginationitem.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem, target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem_changes = {};
    			if (dirty[0] & /*currentPage*/ 32) paginationitem_changes.class = /*currentPage*/ ctx[5] === 1 ? "disabled" : "";

    			if (dirty[1] & /*$$scope*/ 268435456) {
    				paginationitem_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem.$set(paginationitem_changes);
    			if (/*masDatos*/ ctx[12]) if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem, detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(670:12) <Pagination ariaLabel =\\\"Web Pagination\\\">",
    		ctx
    	});

    	return block;
    }

    // (621:8) <Table>
    function create_default_slot_6(ctx) {
    	let thead;
    	let tr0;
    	let td0;
    	let t1;
    	let td1;
    	let t3;
    	let td2;
    	let t5;
    	let td3;
    	let t7;
    	let td4;
    	let t9;
    	let td5;
    	let t11;
    	let td6;
    	let t13;
    	let tbody;
    	let tr1;
    	let td7;
    	let input0;
    	let t14;
    	let td8;
    	let input1;
    	let t15;
    	let td9;
    	let input2;
    	let t16;
    	let td10;
    	let input3;
    	let t17;
    	let td11;
    	let input4;
    	let t18;
    	let td12;
    	let input5;
    	let t19;
    	let td13;
    	let button;
    	let t21;
    	let td14;
    	let t22;
    	let t23;
    	let pagination;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*datosRecibidos*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	pagination = new Pagination({
    			props: {
    				ariaLabel: "Web Pagination",
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			td0 = element("td");
    			td0.textContent = "Año";
    			t1 = space();
    			td1 = element("td");
    			td1.textContent = "País";
    			t3 = space();
    			td2 = element("td");
    			td2.textContent = "Personas en riesgo de pobreza";
    			t5 = space();
    			td3 = element("td");
    			td3.textContent = "Índice de riesgo de pobreza (persona)";
    			t7 = space();
    			td4 = element("td");
    			td4.textContent = "Índice de riesgo de pobreza (hogar)";
    			t9 = space();
    			td5 = element("td");
    			td5.textContent = "Porcentaje población en riesgo de pobreza";
    			t11 = space();
    			td6 = element("td");
    			td6.textContent = "Acciones";
    			t13 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td7 = element("td");
    			input0 = element("input");
    			t14 = space();
    			td8 = element("td");
    			input1 = element("input");
    			t15 = space();
    			td9 = element("td");
    			input2 = element("input");
    			t16 = space();
    			td10 = element("td");
    			input3 = element("input");
    			t17 = space();
    			td11 = element("td");
    			input4 = element("input");
    			t18 = space();
    			td12 = element("td");
    			input5 = element("input");
    			t19 = space();
    			td13 = element("td");
    			button = element("button");
    			button.textContent = "Insertar";
    			t21 = space();
    			td14 = element("td");
    			t22 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t23 = space();
    			create_component(pagination.$$.fragment);
    			attr_dev(td0, "valign", "middle");
    			add_location(td0, file$3, 624, 20, 24214);
    			attr_dev(td1, "valign", "middle");
    			add_location(td1, file$3, 625, 20, 24264);
    			attr_dev(td2, "valign", "middle");
    			add_location(td2, file$3, 626, 20, 24315);
    			attr_dev(td3, "valign", "middle");
    			add_location(td3, file$3, 627, 20, 24391);
    			attr_dev(td4, "valign", "middle");
    			add_location(td4, file$3, 628, 20, 24475);
    			attr_dev(td5, "valign", "middle");
    			add_location(td5, file$3, 629, 20, 24557);
    			attr_dev(td6, "valign", "middle");
    			attr_dev(td6, "colspan", "2");
    			add_location(td6, file$3, 630, 20, 24645);
    			set_style(tr0, "text-align", "center");
    			attr_dev(tr0, "valign", "middle");
    			add_location(tr0, file$3, 623, 16, 24143);
    			add_location(thead, file$3, 622, 12, 24116);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "placeholder", "2015");
    			attr_dev(input0, "min", "1900");
    			add_location(input0, file$3, 639, 20, 24926);
    			add_location(td7, file$3, 639, 16, 24922);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "Francia");
    			add_location(input1, file$3, 640, 20, 25035);
    			add_location(td8, file$3, 640, 16, 25031);
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "placeholder", "8.474");
    			add_location(input2, file$3, 641, 20, 25139);
    			add_location(td9, file$3, 641, 16, 25135);
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "placeholder", "12.849");
    			add_location(input3, file$3, 642, 20, 25262);
    			add_location(td10, file$3, 642, 16, 25258);
    			attr_dev(input4, "type", "number");
    			attr_dev(input4, "placeholder", "26.983");
    			add_location(input4, file$3, 643, 20, 25380);
    			add_location(td11, file$3, 643, 16, 25376);
    			attr_dev(input5, "type", "number");
    			attr_dev(input5, "placeholder", "13.6");
    			add_location(input5, file$3, 644, 20, 25496);
    			add_location(td12, file$3, 644, 16, 25492);
    			attr_dev(button, "class", "btn btn-success");
    			add_location(button, file$3, 645, 20, 25619);
    			add_location(td13, file$3, 645, 16, 25615);
    			add_location(td14, file$3, 646, 16, 25713);
    			add_location(tr1, file$3, 637, 12, 24844);
    			add_location(tbody, file$3, 633, 12, 24750);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, td0);
    			append_dev(tr0, t1);
    			append_dev(tr0, td1);
    			append_dev(tr0, t3);
    			append_dev(tr0, td2);
    			append_dev(tr0, t5);
    			append_dev(tr0, td3);
    			append_dev(tr0, t7);
    			append_dev(tr0, td4);
    			append_dev(tr0, t9);
    			append_dev(tr0, td5);
    			append_dev(tr0, t11);
    			append_dev(tr0, td6);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td7);
    			append_dev(td7, input0);
    			set_input_value(input0, /*nuevoElemento*/ ctx[10].year);
    			append_dev(tr1, t14);
    			append_dev(tr1, td8);
    			append_dev(td8, input1);
    			set_input_value(input1, /*nuevoElemento*/ ctx[10].country);
    			append_dev(tr1, t15);
    			append_dev(tr1, td9);
    			append_dev(td9, input2);
    			set_input_value(input2, /*nuevoElemento*/ ctx[10].people_in_risk_of_poverty);
    			append_dev(tr1, t16);
    			append_dev(tr1, td10);
    			append_dev(td10, input3);
    			set_input_value(input3, /*nuevoElemento*/ ctx[10].people_poverty_line);
    			append_dev(tr1, t17);
    			append_dev(tr1, td11);
    			append_dev(td11, input4);
    			set_input_value(input4, /*nuevoElemento*/ ctx[10].home_poverty_line);
    			append_dev(tr1, t18);
    			append_dev(tr1, td12);
    			append_dev(td12, input5);
    			set_input_value(input5, /*nuevoElemento*/ ctx[10].percentage_risk_of_poverty);
    			append_dev(tr1, t19);
    			append_dev(tr1, td13);
    			append_dev(td13, button);
    			append_dev(tr1, t21);
    			append_dev(tr1, td14);
    			append_dev(tbody, t22);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			insert_dev(target, t23, anchor);
    			mount_component(pagination, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler_1*/ ctx[36]),
    					listen_dev(input1, "input", /*input1_input_handler_1*/ ctx[37]),
    					listen_dev(input2, "input", /*input2_input_handler_1*/ ctx[38]),
    					listen_dev(input3, "input", /*input3_input_handler_1*/ ctx[39]),
    					listen_dev(input4, "input", /*input4_input_handler_1*/ ctx[40]),
    					listen_dev(input5, "input", /*input5_input_handler_1*/ ctx[41]),
    					listen_dev(button, "click", /*insertData*/ ctx[16], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*nuevoElemento*/ 1024 && to_number(input0.value) !== /*nuevoElemento*/ ctx[10].year) {
    				set_input_value(input0, /*nuevoElemento*/ ctx[10].year);
    			}

    			if (dirty[0] & /*nuevoElemento*/ 1024 && input1.value !== /*nuevoElemento*/ ctx[10].country) {
    				set_input_value(input1, /*nuevoElemento*/ ctx[10].country);
    			}

    			if (dirty[0] & /*nuevoElemento*/ 1024 && to_number(input2.value) !== /*nuevoElemento*/ ctx[10].people_in_risk_of_poverty) {
    				set_input_value(input2, /*nuevoElemento*/ ctx[10].people_in_risk_of_poverty);
    			}

    			if (dirty[0] & /*nuevoElemento*/ 1024 && to_number(input3.value) !== /*nuevoElemento*/ ctx[10].people_poverty_line) {
    				set_input_value(input3, /*nuevoElemento*/ ctx[10].people_poverty_line);
    			}

    			if (dirty[0] & /*nuevoElemento*/ 1024 && to_number(input4.value) !== /*nuevoElemento*/ ctx[10].home_poverty_line) {
    				set_input_value(input4, /*nuevoElemento*/ ctx[10].home_poverty_line);
    			}

    			if (dirty[0] & /*nuevoElemento*/ 1024 && to_number(input5.value) !== /*nuevoElemento*/ ctx[10].percentage_risk_of_poverty) {
    				set_input_value(input5, /*nuevoElemento*/ ctx[10].percentage_risk_of_poverty);
    			}

    			if (dirty[0] & /*datosRecibidos, deleteElement*/ 262145) {
    				each_value_1 = /*datosRecibidos*/ ctx[0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			const pagination_changes = {};

    			if (dirty[0] & /*currentPage, datosRecibidosSinLimit*/ 34 | dirty[1] & /*$$scope*/ 268435456) {
    				pagination_changes.$$scope = { dirty, ctx };
    			}

    			pagination.$set(pagination_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pagination.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pagination.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t23);
    			destroy_component(pagination, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(621:8) <Table>",
    		ctx
    	});

    	return block;
    }

    // (608:8) {:else}
    function create_else_block(ctx) {
    	let div;
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(row.$$.fragment);
    			set_style(div, "aling-items", "center");
    			set_style(div, "justify-content", "center");
    			add_location(div, file$3, 608, 12, 23566);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(row, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row_changes = {};

    			if (dirty[1] & /*$$scope*/ 268435456) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(row);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(608:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (560:8) {#if datosBusqueda.length!=0}
    function create_if_block_1$1(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty[0] & /*currentPageBusqueda, datosBusquedaSinLimit, datosBusqueda*/ 832 | dirty[1] & /*$$scope*/ 268435456) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(560:8) {#if datosBusqueda.length!=0}",
    		ctx
    	});

    	return block;
    }

    // (611:20) <Col md=12 style="text-align: center;">
    function create_default_slot_5(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "No existen datos cargados. Por favor, pulse el botón \"Cargar datos\".";
    			add_location(h2, file$3, 611, 24, 23733);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(611:20) <Col md=12 style=\\\"text-align: center;\\\">",
    		ctx
    	});

    	return block;
    }

    // (610:16) <Row>
    function create_default_slot_4(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				md: "12",
    				style: "text-align: center;",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col_changes = {};

    			if (dirty[1] & /*$$scope*/ 268435456) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(610:16) <Row>",
    		ctx
    	});

    	return block;
    }

    // (579:16) {#each datosBusqueda as stat}
    function create_each_block(ctx) {
    	let tr;
    	let th0;
    	let t0_value = /*stat*/ ctx[52].year + "";
    	let t0;
    	let t1;
    	let th1;
    	let t2_value = /*stat*/ ctx[52].country + "";
    	let t2;
    	let t3;
    	let th2;
    	let t4_value = /*stat*/ ctx[52].people_in_risk_of_poverty + "";
    	let t4;
    	let t5;
    	let th3;
    	let t6_value = /*stat*/ ctx[52].people_poverty_line + "";
    	let t6;
    	let t7;
    	let th4;
    	let t8_value = /*stat*/ ctx[52].home_poverty_line + "";
    	let t8;
    	let t9;
    	let th5;
    	let t10_value = /*stat*/ ctx[52].percentage_risk_of_poverty + "";
    	let t10;
    	let t11;
    	let th6;
    	let button0;
    	let t13;
    	let th7;
    	let a;
    	let button1;
    	let a_href_value;
    	let t15;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			th0 = element("th");
    			t0 = text(t0_value);
    			t1 = space();
    			th1 = element("th");
    			t2 = text(t2_value);
    			t3 = space();
    			th2 = element("th");
    			t4 = text(t4_value);
    			t5 = space();
    			th3 = element("th");
    			t6 = text(t6_value);
    			t7 = space();
    			th4 = element("th");
    			t8 = text(t8_value);
    			t9 = space();
    			th5 = element("th");
    			t10 = text(t10_value);
    			t11 = space();
    			th6 = element("th");
    			button0 = element("button");
    			button0.textContent = "Borrar";
    			t13 = space();
    			th7 = element("th");
    			a = element("a");
    			button1 = element("button");
    			button1.textContent = "Editar";
    			t15 = space();
    			add_location(th0, file$3, 580, 20, 22175);
    			add_location(th1, file$3, 581, 20, 22217);
    			add_location(th2, file$3, 582, 20, 22262);
    			add_location(th3, file$3, 583, 20, 22325);
    			add_location(th4, file$3, 584, 20, 22382);
    			add_location(th5, file$3, 585, 20, 22437);
    			attr_dev(button0, "class", "btn btn-danger");
    			add_location(button0, file$3, 586, 24, 22505);
    			add_location(th6, file$3, 586, 20, 22501);
    			attr_dev(button1, "class", "btn btn-warning");
    			add_location(button1, file$3, 587, 77, 22684);
    			attr_dev(a, "href", a_href_value = "#/poverty_risks/" + /*stat*/ ctx[52].country + "/" + /*stat*/ ctx[52].year);
    			add_location(a, file$3, 587, 24, 22631);
    			add_location(th7, file$3, 587, 20, 22627);
    			set_style(tr, "text-align", "center");
    			add_location(tr, file$3, 579, 16, 22120);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, th0);
    			append_dev(th0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    			append_dev(th1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, th2);
    			append_dev(th2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, th3);
    			append_dev(th3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, th4);
    			append_dev(th4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, th5);
    			append_dev(th5, t10);
    			append_dev(tr, t11);
    			append_dev(tr, th6);
    			append_dev(th6, button0);
    			append_dev(tr, t13);
    			append_dev(tr, th7);
    			append_dev(th7, a);
    			append_dev(a, button1);
    			append_dev(tr, t15);

    			if (!mounted) {
    				dispose = listen_dev(
    					button0,
    					"click",
    					function () {
    						if (is_function(/*deleteElement*/ ctx[18](/*stat*/ ctx[52].year, /*stat*/ ctx[52].country))) /*deleteElement*/ ctx[18](/*stat*/ ctx[52].year, /*stat*/ ctx[52].country).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*datosBusqueda*/ 256 && t0_value !== (t0_value = /*stat*/ ctx[52].year + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*datosBusqueda*/ 256 && t2_value !== (t2_value = /*stat*/ ctx[52].country + "")) set_data_dev(t2, t2_value);
    			if (dirty[0] & /*datosBusqueda*/ 256 && t4_value !== (t4_value = /*stat*/ ctx[52].people_in_risk_of_poverty + "")) set_data_dev(t4, t4_value);
    			if (dirty[0] & /*datosBusqueda*/ 256 && t6_value !== (t6_value = /*stat*/ ctx[52].people_poverty_line + "")) set_data_dev(t6, t6_value);
    			if (dirty[0] & /*datosBusqueda*/ 256 && t8_value !== (t8_value = /*stat*/ ctx[52].home_poverty_line + "")) set_data_dev(t8, t8_value);
    			if (dirty[0] & /*datosBusqueda*/ 256 && t10_value !== (t10_value = /*stat*/ ctx[52].percentage_risk_of_poverty + "")) set_data_dev(t10, t10_value);

    			if (dirty[0] & /*datosBusqueda*/ 256 && a_href_value !== (a_href_value = "#/poverty_risks/" + /*stat*/ ctx[52].country + "/" + /*stat*/ ctx[52].year)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(579:16) {#each datosBusqueda as stat}",
    		ctx
    	});

    	return block;
    }

    // (596:16) <PaginationItem class="{currentPageBusqueda===1? 'disabled' : ''}">
    function create_default_slot_3(ctx) {
    	let paginationlink;
    	let current;

    	paginationlink = new PaginationLink({
    			props: { previous: true, href: "#/poverty_risks" },
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_2*/ ctx[34]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(596:16) <PaginationItem class=\\\"{currentPageBusqueda===1? 'disabled' : ''}\\\">",
    		ctx
    	});

    	return block;
    }

    // (599:16) {#if masDatosBusqueda}
    function create_if_block_2$1(ctx) {
    	let paginationitem;
    	let current;

    	paginationitem = new PaginationItem({
    			props: {
    				class: /*currentPageBusqueda*/ ctx[6] === Math.ceil(/*datosBusquedaSinLimit*/ ctx[9].length / /*limit*/ ctx[11])
    				? "disabled"
    				: "",
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem_changes = {};

    			if (dirty[0] & /*currentPageBusqueda, datosBusquedaSinLimit*/ 576) paginationitem_changes.class = /*currentPageBusqueda*/ ctx[6] === Math.ceil(/*datosBusquedaSinLimit*/ ctx[9].length / /*limit*/ ctx[11])
    			? "disabled"
    			: "";

    			if (dirty[1] & /*$$scope*/ 268435456) {
    				paginationitem_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem.$set(paginationitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(599:16) {#if masDatosBusqueda}",
    		ctx
    	});

    	return block;
    }

    // (600:16) <PaginationItem class="{currentPageBusqueda===(Math.ceil(datosBusquedaSinLimit.length / limit))? 'disabled' : ''}">
    function create_default_slot_2$1(ctx) {
    	let paginationlink;
    	let current;

    	paginationlink = new PaginationLink({
    			props: { next: true, href: "#/poverty_risks" },
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_3*/ ctx[35]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(600:16) <PaginationItem class=\\\"{currentPageBusqueda===(Math.ceil(datosBusquedaSinLimit.length / limit))? 'disabled' : ''}\\\">",
    		ctx
    	});

    	return block;
    }

    // (595:12) <Pagination ariaLabel ="Web Pagination">
    function create_default_slot_1$1(ctx) {
    	let paginationitem;
    	let t;
    	let if_block_anchor;
    	let current;

    	paginationitem = new PaginationItem({
    			props: {
    				class: /*currentPageBusqueda*/ ctx[6] === 1 ? "disabled" : "",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block = /*masDatosBusqueda*/ ctx[13] && create_if_block_2$1(ctx);

    	const block = {
    		c: function create() {
    			create_component(paginationitem.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem, target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem_changes = {};
    			if (dirty[0] & /*currentPageBusqueda*/ 64) paginationitem_changes.class = /*currentPageBusqueda*/ ctx[6] === 1 ? "disabled" : "";

    			if (dirty[1] & /*$$scope*/ 268435456) {
    				paginationitem_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem.$set(paginationitem_changes);
    			if (/*masDatosBusqueda*/ ctx[13]) if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem, detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(595:12) <Pagination ariaLabel =\\\"Web Pagination\\\">",
    		ctx
    	});

    	return block;
    }

    // (561:8) <Table>
    function create_default_slot$1(ctx) {
    	let thead;
    	let tr;
    	let td0;
    	let t1;
    	let td1;
    	let t3;
    	let td2;
    	let t5;
    	let td3;
    	let t7;
    	let td4;
    	let t9;
    	let td5;
    	let t11;
    	let td6;
    	let t13;
    	let tbody;
    	let t14;
    	let pagination;
    	let current;
    	let each_value = /*datosBusqueda*/ ctx[8];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	pagination = new Pagination({
    			props: {
    				ariaLabel: "Web Pagination",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr = element("tr");
    			td0 = element("td");
    			td0.textContent = "Año";
    			t1 = space();
    			td1 = element("td");
    			td1.textContent = "País";
    			t3 = space();
    			td2 = element("td");
    			td2.textContent = "Personas en riesgo de pobreza";
    			t5 = space();
    			td3 = element("td");
    			td3.textContent = "Índice de riesgo de pobreza (persona)";
    			t7 = space();
    			td4 = element("td");
    			td4.textContent = "Índice de riesgo de pobreza (hogar)";
    			t9 = space();
    			td5 = element("td");
    			td5.textContent = "Porcentaje población en riesgo de pobreza";
    			t11 = space();
    			td6 = element("td");
    			td6.textContent = "Acciones";
    			t13 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t14 = space();
    			create_component(pagination.$$.fragment);
    			attr_dev(td0, "valign", "middle");
    			add_location(td0, file$3, 564, 20, 21387);
    			attr_dev(td1, "valign", "middle");
    			add_location(td1, file$3, 565, 20, 21437);
    			attr_dev(td2, "valign", "middle");
    			add_location(td2, file$3, 566, 20, 21488);
    			attr_dev(td3, "valign", "middle");
    			add_location(td3, file$3, 567, 20, 21564);
    			attr_dev(td4, "valign", "middle");
    			add_location(td4, file$3, 568, 20, 21648);
    			attr_dev(td5, "valign", "middle");
    			add_location(td5, file$3, 569, 20, 21730);
    			attr_dev(td6, "valign", "middle");
    			attr_dev(td6, "colspan", "2");
    			add_location(td6, file$3, 570, 20, 21818);
    			set_style(tr, "text-align", "center");
    			attr_dev(tr, "valign", "middle");
    			add_location(tr, file$3, 563, 16, 21316);
    			add_location(thead, file$3, 562, 12, 21289);
    			add_location(tbody, file$3, 573, 12, 21923);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr);
    			append_dev(tr, td0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(tr, t11);
    			append_dev(tr, td6);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, tbody, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			insert_dev(target, t14, anchor);
    			mount_component(pagination, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*datosBusqueda, deleteElement*/ 262400) {
    				each_value = /*datosBusqueda*/ ctx[8];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			const pagination_changes = {};

    			if (dirty[0] & /*currentPageBusqueda, datosBusquedaSinLimit*/ 576 | dirty[1] & /*$$scope*/ 268435456) {
    				pagination_changes.$$scope = { dirty, ctx };
    			}

    			pagination.$set(pagination_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pagination.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pagination.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t14);
    			destroy_component(pagination, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(561:8) <Table>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let main;
    	let div;
    	let row0;
    	let t0;
    	let br0;
    	let t1;
    	let br1;
    	let t2;
    	let row1;
    	let t3;
    	let br2;
    	let t4;
    	let h30;
    	let t6;
    	let table;
    	let t7;
    	let h31;
    	let t9;
    	let t10;
    	let current_block_type_index;
    	let if_block1;
    	let current;

    	row0 = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_19] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	row1 = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_17] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table = new Table({
    			props: {
    				$$slots: { default: [create_default_slot_16] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block0 = /*superBusqueda*/ ctx[2].length != 0 && create_if_block_5(ctx);
    	const if_block_creators = [create_if_block$1, create_if_block_3, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*datosBusqueda*/ ctx[8].length != 0) return 0;
    		if (/*datosRecibidos*/ ctx[0].length != 0) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");
    			create_component(row0.$$.fragment);
    			t0 = space();
    			br0 = element("br");
    			t1 = space();
    			br1 = element("br");
    			t2 = space();
    			create_component(row1.$$.fragment);
    			t3 = space();
    			br2 = element("br");
    			t4 = space();
    			h30 = element("h3");
    			h30.textContent = "Búsqueda";
    			t6 = space();
    			create_component(table.$$.fragment);
    			t7 = space();
    			h31 = element("h3");
    			h31.textContent = "Listado de datos";
    			t9 = space();
    			if (if_block0) if_block0.c();
    			t10 = space();
    			if_block1.c();
    			add_location(br0, file$3, 431, 12, 15526);
    			add_location(br1, file$3, 432, 12, 15544);
    			set_style(div, "padding", "1%");
    			add_location(div, file$3, 418, 4, 14755);
    			add_location(br2, file$3, 451, 3, 16106);
    			add_location(h30, file$3, 454, 4, 16172);
    			add_location(h31, file$3, 506, 4, 18667);
    			attr_dev(main, "class", "svelte-swwete");
    			add_location(main, file$3, 415, 0, 14629);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			mount_component(row0, div, null);
    			append_dev(div, t0);
    			append_dev(div, br0);
    			append_dev(div, t1);
    			append_dev(div, br1);
    			append_dev(div, t2);
    			mount_component(row1, div, null);
    			append_dev(main, t3);
    			append_dev(main, br2);
    			append_dev(main, t4);
    			append_dev(main, h30);
    			append_dev(main, t6);
    			mount_component(table, main, null);
    			append_dev(main, t7);
    			append_dev(main, h31);
    			append_dev(main, t9);
    			if (if_block0) if_block0.m(main, null);
    			append_dev(main, t10);
    			if_blocks[current_block_type_index].m(main, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row0_changes = {};

    			if (dirty[0] & /*datosRecibidos*/ 1 | dirty[1] & /*$$scope*/ 268435456) {
    				row0_changes.$$scope = { dirty, ctx };
    			}

    			row0.$set(row0_changes);
    			const row1_changes = {};

    			if (dirty[0] & /*msjOK, msjError*/ 24 | dirty[1] & /*$$scope*/ 268435456) {
    				row1_changes.$$scope = { dirty, ctx };
    			}

    			row1.$set(row1_changes);
    			const table_changes = {};

    			if (dirty[0] & /*parametrosBusqueda*/ 128 | dirty[1] & /*$$scope*/ 268435456) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);

    			if (/*superBusqueda*/ ctx[2].length != 0) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*superBusqueda*/ 4) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_5(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(main, t10);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(main, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row0.$$.fragment, local);
    			transition_in(row1.$$.fragment, local);
    			transition_in(table.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row0.$$.fragment, local);
    			transition_out(row1.$$.fragment, local);
    			transition_out(table.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(row0);
    			destroy_component(row1);
    			destroy_component(table);
    			if (if_block0) if_block0.d();
    			if_blocks[current_block_type_index].d();
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

    const BASE_API_PATH$1 = "api/v1/poverty_risks";

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Tabla_poverty_risks", slots, []);
    	let datosRecibidos = [];
    	let datosRecibidosSinLimit = [];
    	let superBusqueda = [];

    	//Variables auxiliares para la muestra de errores
    	let msjError = "";

    	let msjOK = "";

    	//Variables de paginacion
    	let limit = 10;

    	let offset = 0;
    	let masDatos = true;

    	/* No la utilizamos pero nos sirve para saber
    en que pagina estamos (quizas en un futuro)*/
    	let currentPage = 1;

    	//Variables de paginacion
    	let limitBusqueda = 10;

    	let offsetBusqueda = 0;
    	let masDatosBusqueda = true;

    	/* No la utilizamos pero nos sirve para saber
    en que pagina estamos (quizas en un futuro)*/
    	let currentPageBusqueda = 1;

    	async function getStats() {
    		console.log("Fetching data...");

    		/* Busqueda a la URL que se necesite
    (se le pueden pasar parámetros para modificar las consultas)
    Voy a tener una función para cada petición que quiera hacer.*/
    		const res = await fetch(BASE_API_PATH$1 + "?" + "limit=" + limit + "&skip=" + offset * limit);

    		const resSinLimit = await fetch(BASE_API_PATH$1);

    		if (res.ok) {
    			const json = await res.json();
    			const jsonSinLimit = await resSinLimit.json();

    			/*Que espere la respuesta de la consulta y la guarde en
    un JSON.*/
    			$$invalidate(0, datosRecibidos = json);

    			$$invalidate(1, datosRecibidosSinLimit = jsonSinLimit);

    			/*Y ahora la guardas en el array datosRecibidos.*/
    			$$invalidate(3, msjError = "");

    			$$invalidate(4, msjOK = "Datos cargados correctamente");
    			console.log(JSON.stringify(datosRecibidos, null, 2));
    			console.log(datosRecibidos.length + " Datos Recibidos");
    			console.log(datosRecibidosSinLimit.length + ": Nº Datos Totales");
    			console.log(Math.ceil(datosRecibidosSinLimit.length / limit) + ": Nº max pag(Math.ceil)");
    			console.log(currentPage + ": currentPage");
    			console.log(res);
    		} else {
    			if (datosRecibidos.length == 0) {
    				$$invalidate(3, msjError = "No hay datos disponibles");
    			}

    			if (res.status === 500) {
    				$$invalidate(3, msjError = "No se ha podido acceder a la base de datos");
    			}
    		}
    	}

    	getStats(); // Se carga la función cuando se cargan los scripts.

    	/*Creamos un elemento de tipo JSON para BUSCAR los datos,
    Porque mi API sólo funciona a partir de objetos JSON
    No lo puedo hacer de forma separada*/
    	let parametrosBusqueda = {
    		"c": "",
    		"y": "",
    		"aprp": "",
    		"uprp": "",
    		"appl": "",
    		"uppl": "",
    		"ahpl": "",
    		"uhpl": "",
    		"apercnt": "",
    		"upercnt": ""
    	};

    	/* Creo un array para almacenar los datos
    guardados de las BÚSQUEDAS*/
    	let datosBusqueda = [];

    	let datosBusquedaSinLimit = [];
    	let queryVarConLimitOffset = "";

    	async function searchData() {
    		console.log("Searching stat...");

    		//Variable con la que luego crearemos las URL de las querys
    		let queryVar = "?";

    		/*Me devuelve los que tienen valores correctos, NO tienen valor "" (vacío).

    filter() llama a la función callback  sobre cada elemento del array,
    y construye un nuevo array con todos los valores para los cuales 
    callback devuelve un valor verdadero */
    		var parameters = new Map(Object.entries(parametrosBusqueda).filter(cadaParametro => {
    				return cadaParametro[1] != "";
    			}));

    		for (var [clave, valor] of parameters.entries()) {
    			queryVar += clave + "=" + valor + "&";
    		}

    		queryVarConLimitOffset += queryVar + "limit" + "=" + limitBusqueda + "&" + "skip" + "=" + offsetBusqueda * limitBusqueda;
    		console.log(offsetBusqueda * limitBusqueda + " : offsetBusqueda*limitBusqueda");

    		//var theQuery = queryVarConLimitOffset.slice(0, -1);
    		var theQuery = "";

    		// console.log(queryVar+ " : queryVar");
    		//console.log(queryVarConLimitOffset+ " : queryVarConLimitOffset");
    		theQuery = queryVarConLimitOffset === "?"
    		? ""
    		: queryVarConLimitOffset;

    		//console.log(theQuery+ " : theQuery");
    		console.log(BASE_API_PATH$1 + theQuery + " : BASE_API_PATH + theQuery");

    		//Comprobamos si la query está vacía
    		if (theQuery != "") {
    			const res = await fetch(BASE_API_PATH$1 + theQuery);
    			const resBusqueda = await fetch(BASE_API_PATH$1 + queryVar);

    			if (res.ok) {
    				console.log("OK");
    				const json = await res.json();
    				const jsonBusqueda = await resBusqueda.json();

    				/* msjError = "";
     msjOK = "Estos son los resultados de la búsqueda:";*/
    				console.log(JSON.stringify(json, null, 2));

    				if (json.length === undefined) {
    					datosBusqueda.push(json);
    					console.log(datosBusqueda.length + " Datos: " + datosBusqueda);
    				} else {
    					$$invalidate(8, datosBusqueda = json);
    					$$invalidate(9, datosBusquedaSinLimit = jsonBusqueda);
    				}

    				if (datosBusqueda.length == 0) {
    					$$invalidate(3, msjError = "No existen datos con esos parámetros");
    				} else {
    					$$invalidate(3, msjError = "");
    					$$invalidate(4, msjOK = "Estos son los resultados de la búsqueda");
    				}
    			} else {
    				if (res.status === 404) {
    					$$invalidate(3, msjError = "No existen datos con esos parámetros");
    				} else if (res.status === 500) {
    					$$invalidate(3, msjError = "Error al acceder a la base de datos");
    				}
    			}
    		} else {
    			$$invalidate(3, msjError = "Debe introducir por lo menos 1 parámetro de búsqueda");
    		}
    	}

    	function resetQuery() {
    		$$invalidate(7, parametrosBusqueda = {
    			"y": "",
    			"c": "",
    			"aprp": "",
    			"uprp": "",
    			"appl": "",
    			"uppl": "",
    			"ahpl": "",
    			"uhpl": "",
    			"apercnt": "",
    			"upercnt": ""
    		});

    		$$invalidate(8, datosBusqueda = []);
    		getStats();
    	}

    	//Creamos un elemento de tipo JSON para insertar nuevos datos,
    	//Porque mi API sólo funciona a partir de objetos JSON
    	//No lo puedo hacer de forma separada
    	let nuevoElemento = {
    		"year": "",
    		"country": "",
    		"people_in_risk_of_poverty": "",
    		"people_poverty_line": "",
    		"home_poverty_line": "",
    		"percentage_risk_of_poverty": ""
    	};

    	function removeDataInserted() {
    		$$invalidate(10, nuevoElemento = {
    			"year": "",
    			"country": "",
    			"people_in_risk_of_poverty": "",
    			"people_poverty_line": "",
    			"home_poverty_line": "",
    			"percentage_risk_of_poverty": ""
    		});
    	}

    	

    	async function insertData() {
    		$$invalidate(10, nuevoElemento.year = parseInt(nuevoElemento.year), nuevoElemento);
    		$$invalidate(10, nuevoElemento.country = String(nuevoElemento.country), nuevoElemento);
    		$$invalidate(10, nuevoElemento.people_in_risk_of_poverty = parseFloat(nuevoElemento.people_in_risk_of_poverty), nuevoElemento);
    		$$invalidate(10, nuevoElemento.people_poverty_line = parseFloat(nuevoElemento.people_poverty_line), nuevoElemento);
    		$$invalidate(10, nuevoElemento.home_poverty_line = parseFloat(nuevoElemento.home_poverty_line), nuevoElemento);
    		$$invalidate(10, nuevoElemento.percentage_risk_of_poverty = parseFloat(nuevoElemento.percentage_risk_of_poverty), nuevoElemento);

    		await fetch(BASE_API_PATH$1, {
    			method: "POST",
    			body: JSON.stringify(nuevoElemento),
    			headers: { "Content-Type": "application/json" }
    		}).then(function (res) {
    			if (res.ok) {
    				$$invalidate(3, msjError = "");
    				$$invalidate(4, msjOK = "Dato cargado correctamente");
    			} else {
    				if (res.status === 409) {
    					$$invalidate(3, msjError = `Ya existe un dato con valores idénticos para los mismos campos.`);
    					alert("Ya existe un dato con valores idénticos para los mismos campos.");
    				} else if (res.status === 500) {
    					$$invalidate(3, msjError = "No se ha podido acceder a la base de datos.");
    				} else if (res.status === 400) {
    					$$invalidate(3, msjError = "Todos los campos deben estar rellenados según el patron predefinido.");
    				}
    			}

    			removeDataInserted();
    			getStats();
    		});
    	}

    	async function loadInitialData() {
    		//Para cargarlos hacemos un fetch a la direccion donde está el método de carga inicial
    		const peticionCarga = await fetch(BASE_API_PATH$1 + "/loadInitialData"); //Se espera hasta que termine la peticion

    		//const numTotalDatos = await fetch(BASE_API_PATH);
    		if (peticionCarga.ok) {
    			const peticionMuestra = await fetch(BASE_API_PATH$1 + "?" + "limit=" + limit + "&offset=" + offset * limit); //Se accede a la toma de todos los elementos

    			if (peticionMuestra.ok) {
    				console.log(" Receiving data, wait a moment ...");
    				const data = await peticionMuestra.json();
    				$$invalidate(0, datosRecibidos = data);

    				//const numData= await numTotalDatos.json();
    				//datosRecibidosSinLimit = numTotalDatos;
    				console.log(`Done! Received ${data.length} stats.`);

    				//console.log( datosRecibidosSinLimit.length+": Datos Totales Búsqueda");
    				$$invalidate(3, msjError = "");

    				$$invalidate(4, msjOK = "Datos insertados correctamente");
    			} else {
    				console.log("No data loaded.");
    				$$invalidate(3, msjError = "Los datos no han podido cargarse");
    			}
    		} else {
    			console.log("Error loading data.");
    			$$invalidate(3, msjError = "Error de acceso a BD");
    		}

    		console.log(datosRecibidos.length + " Datos Recibidos");
    		console.log(currentPage + ": currentPage");
    		console.log(datosRecibidosSinLimit.length + ": Nº Datos Totales");
    		console.log(Math.ceil(datosRecibidosSinLimit.length) / limit + ": Math.ceil");
    	}

    	async function deleteElement(year, country) {

    		await fetch(BASE_API_PATH$1 + "/" + country + "/" + year, { method: "DELETE" }).then(function (res) {
    			if (res.ok) {
    				console.log("OK");
    				getStats();
    			} else {
    				if (res.status === 404) ; else if (res.status === 500) ;
    			}
    		});
    	}

    	async function deleteAll() {
    		console.log(datosRecibidos.length);

    		await fetch(BASE_API_PATH$1, { method: "DELETE" }).then(function (peticion) {
    			if (peticion.ok) {
    				$$invalidate(0, datosRecibidos = []);
    				$$invalidate(3, msjError = "");
    				$$invalidate(4, msjOK = "Datos eliminados correctamente");
    			} else if (peticion.status == 404) {
    				//no data found
    				console.log("No data found");

    				$$invalidate(3, msjError = "No hay datos que eliminar");
    			} else {
    				console.log("Error deleting DB stats");
    				$$invalidate(3, msjError = "No se puede acceder a la base de datos");
    			}

    			console.log(datosRecibidos.length);
    		});
    	}

    	function changePage(increment) {
    		offset += increment;
    		$$invalidate(5, currentPage += increment);
    		console.log("Cambiando de página");
    		getStats();
    	}

    	function changePageBusqueda(increment) {
    		offsetBusqueda += increment;
    		$$invalidate(6, currentPageBusqueda += increment);
    		console.log("Cambiando de página en búsqueda");

    		if (increment > 0) {
    			superBusquedaPositiva();
    		} else {
    			superBusquedaNegativa();
    		}
    	}

    	async function superBusquedaPositiva(increment) {
    		offsetBusqueda += increment;
    		$$invalidate(6, currentPageBusqueda += increment);
    		console.log("Cambiando de página en búsqueda");
    		const ressuperBusqueda = await fetch(BASE_API_PATH$1 + "?" + "apercnt=0&upercnt=90&limit=" + limit + "&skip=" + 0);

    		if (ressuperBusqueda.ok) {
    			const jsonsuperBusqueda = await ressuperBusqueda.json();

    			/*Que espere la respuesta de la consulta y la guarde en
    un JSON.*/
    			$$invalidate(2, superBusqueda = jsonsuperBusqueda);

    			/*Y ahora la guardas en el array datosRecibidos.*/
    			$$invalidate(3, msjError = "");

    			$$invalidate(4, msjOK = "Datos cargados correctamente");
    			console.log(JSON.stringify(superBusqueda, null, 2));
    			console.log(superBusqueda.length + " Datos Recibidos");
    			console.log(currentPageBusqueda + ": currentPage");
    			console.log(superBusqueda);
    		} else {
    			if (superBusqueda.length == 0) {
    				$$invalidate(3, msjError = "No hay datos disponibles");
    			}

    			if (ressuperBusqueda.status === 500) {
    				$$invalidate(3, msjError = "No se ha podido acceder a la base de datos");
    			}
    		}
    	}

    	async function superBusquedaNegativa(increment) {
    		offsetBusqueda += increment;
    		$$invalidate(6, currentPageBusqueda += increment);
    		console.log("Cambiando de página en búsqueda");
    		const ressuperBusqueda = await fetch(BASE_API_PATH$1 + "?" + "apercnt=0&upercnt=90&limit=" + limit + "&skip=" + 10);

    		if (ressuperBusqueda.ok) {
    			const jsonsuperBusqueda = await ressuperBusqueda.json();

    			/*Que espere la respuesta de la consulta y la guarde en
    un JSON.*/
    			$$invalidate(2, superBusqueda = jsonsuperBusqueda);

    			/*Y ahora la guardas en el array datosRecibidos.*/
    			$$invalidate(3, msjError = "");

    			$$invalidate(4, msjOK = "Datos cargados correctamente");
    			console.log(JSON.stringify(superBusqueda, null, 2));
    			console.log(superBusqueda.length + " Datos Recibidos");
    			console.log(currentPageBusqueda + ": currentPage");
    			console.log(superBusqueda);
    		} else {
    			if (superBusqueda.length == 0) {
    				$$invalidate(3, msjError = "No hay datos disponibles");
    			}

    			if (ressuperBusqueda.status === 500) {
    				$$invalidate(3, msjError = "No se ha podido acceder a la base de datos");
    			}
    		}
    	}

    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<Tabla_poverty_risks> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		parametrosBusqueda.y = to_number(this.value);
    		$$invalidate(7, parametrosBusqueda);
    	}

    	function input1_input_handler() {
    		parametrosBusqueda.c = this.value;
    		$$invalidate(7, parametrosBusqueda);
    	}

    	function input2_input_handler() {
    		parametrosBusqueda.aprp = this.value;
    		$$invalidate(7, parametrosBusqueda);
    	}

    	function input3_input_handler() {
    		parametrosBusqueda.uprp = this.value;
    		$$invalidate(7, parametrosBusqueda);
    	}

    	function input4_input_handler() {
    		parametrosBusqueda.appl = this.value;
    		$$invalidate(7, parametrosBusqueda);
    	}

    	function input5_input_handler() {
    		parametrosBusqueda.uppl = this.value;
    		$$invalidate(7, parametrosBusqueda);
    	}

    	function input6_input_handler() {
    		parametrosBusqueda.ahpl = this.value;
    		$$invalidate(7, parametrosBusqueda);
    	}

    	function input7_input_handler() {
    		parametrosBusqueda.uhpl = this.value;
    		$$invalidate(7, parametrosBusqueda);
    	}

    	function input8_input_handler() {
    		parametrosBusqueda.apercnt = this.value;
    		$$invalidate(7, parametrosBusqueda);
    	}

    	function input9_input_handler() {
    		parametrosBusqueda.upercnt = this.value;
    		$$invalidate(7, parametrosBusqueda);
    	}

    	const click_handler = () => changePageBusqueda(-1);
    	const click_handler_1 = () => changePageBusqueda(1);
    	const click_handler_2 = () => changePageBusqueda(-1);
    	const click_handler_3 = () => changePageBusqueda(1);

    	function input0_input_handler_1() {
    		nuevoElemento.year = to_number(this.value);
    		$$invalidate(10, nuevoElemento);
    	}

    	function input1_input_handler_1() {
    		nuevoElemento.country = this.value;
    		$$invalidate(10, nuevoElemento);
    	}

    	function input2_input_handler_1() {
    		nuevoElemento.people_in_risk_of_poverty = to_number(this.value);
    		$$invalidate(10, nuevoElemento);
    	}

    	function input3_input_handler_1() {
    		nuevoElemento.people_poverty_line = to_number(this.value);
    		$$invalidate(10, nuevoElemento);
    	}

    	function input4_input_handler_1() {
    		nuevoElemento.home_poverty_line = to_number(this.value);
    		$$invalidate(10, nuevoElemento);
    	}

    	function input5_input_handler_1() {
    		nuevoElemento.percentage_risk_of_poverty = to_number(this.value);
    		$$invalidate(10, nuevoElemento);
    	}

    	const click_handler_4 = () => changePage(-1);
    	const click_handler_5 = () => changePage(1);

    	$$self.$capture_state = () => ({
    		Table,
    		Button,
    		Col,
    		Row,
    		Pagination,
    		PaginationItem,
    		PaginationLink,
    		BASE_API_PATH: BASE_API_PATH$1,
    		datosRecibidos,
    		datosRecibidosSinLimit,
    		superBusqueda,
    		msjError,
    		msjOK,
    		limit,
    		offset,
    		masDatos,
    		currentPage,
    		limitBusqueda,
    		offsetBusqueda,
    		masDatosBusqueda,
    		currentPageBusqueda,
    		getStats,
    		parametrosBusqueda,
    		datosBusqueda,
    		datosBusquedaSinLimit,
    		queryVarConLimitOffset,
    		searchData,
    		resetQuery,
    		nuevoElemento,
    		removeDataInserted,
    		insertData,
    		loadInitialData,
    		deleteElement,
    		deleteAll,
    		changePage,
    		changePageBusqueda,
    		superBusquedaPositiva,
    		superBusquedaNegativa
    	});

    	$$self.$inject_state = $$props => {
    		if ("datosRecibidos" in $$props) $$invalidate(0, datosRecibidos = $$props.datosRecibidos);
    		if ("datosRecibidosSinLimit" in $$props) $$invalidate(1, datosRecibidosSinLimit = $$props.datosRecibidosSinLimit);
    		if ("superBusqueda" in $$props) $$invalidate(2, superBusqueda = $$props.superBusqueda);
    		if ("msjError" in $$props) $$invalidate(3, msjError = $$props.msjError);
    		if ("msjOK" in $$props) $$invalidate(4, msjOK = $$props.msjOK);
    		if ("limit" in $$props) $$invalidate(11, limit = $$props.limit);
    		if ("offset" in $$props) offset = $$props.offset;
    		if ("masDatos" in $$props) $$invalidate(12, masDatos = $$props.masDatos);
    		if ("currentPage" in $$props) $$invalidate(5, currentPage = $$props.currentPage);
    		if ("limitBusqueda" in $$props) limitBusqueda = $$props.limitBusqueda;
    		if ("offsetBusqueda" in $$props) offsetBusqueda = $$props.offsetBusqueda;
    		if ("masDatosBusqueda" in $$props) $$invalidate(13, masDatosBusqueda = $$props.masDatosBusqueda);
    		if ("currentPageBusqueda" in $$props) $$invalidate(6, currentPageBusqueda = $$props.currentPageBusqueda);
    		if ("parametrosBusqueda" in $$props) $$invalidate(7, parametrosBusqueda = $$props.parametrosBusqueda);
    		if ("datosBusqueda" in $$props) $$invalidate(8, datosBusqueda = $$props.datosBusqueda);
    		if ("datosBusquedaSinLimit" in $$props) $$invalidate(9, datosBusquedaSinLimit = $$props.datosBusquedaSinLimit);
    		if ("queryVarConLimitOffset" in $$props) queryVarConLimitOffset = $$props.queryVarConLimitOffset;
    		if ("nuevoElemento" in $$props) $$invalidate(10, nuevoElemento = $$props.nuevoElemento);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		datosRecibidos,
    		datosRecibidosSinLimit,
    		superBusqueda,
    		msjError,
    		msjOK,
    		currentPage,
    		currentPageBusqueda,
    		parametrosBusqueda,
    		datosBusqueda,
    		datosBusquedaSinLimit,
    		nuevoElemento,
    		limit,
    		masDatos,
    		masDatosBusqueda,
    		searchData,
    		resetQuery,
    		insertData,
    		loadInitialData,
    		deleteElement,
    		deleteAll,
    		changePage,
    		changePageBusqueda,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		input5_input_handler,
    		input6_input_handler,
    		input7_input_handler,
    		input8_input_handler,
    		input9_input_handler,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		input0_input_handler_1,
    		input1_input_handler_1,
    		input2_input_handler_1,
    		input3_input_handler_1,
    		input4_input_handler_1,
    		input5_input_handler_1,
    		click_handler_4,
    		click_handler_5
    	];
    }

    class Tabla_poverty_risks extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {}, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tabla_poverty_risks",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\front\poverty_risks\appPovertyRisks.svelte generated by Svelte v3.38.0 */
    const file$2 = "src\\front\\poverty_risks\\appPovertyRisks.svelte";

    function create_fragment$2(ctx) {
    	let main;
    	let div1;
    	let div0;
    	let em;
    	let h1;
    	let t1;
    	let div2;
    	let tabla_poverty_risks;
    	let current;
    	tabla_poverty_risks = new Tabla_poverty_risks({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			div1 = element("div");
    			div0 = element("div");
    			em = element("em");
    			h1 = element("h1");
    			h1.textContent = "Riesgos de pobreza";
    			t1 = space();
    			div2 = element("div");
    			create_component(tabla_poverty_risks.$$.fragment);
    			attr_dev(h1, "class", "display-3");
    			set_style(h1, "text-align", "center");
    			add_location(h1, file$2, 7, 16, 445);
    			add_location(em, file$2, 7, 12, 441);
    			attr_dev(div0, "id", "interno");
    			attr_dev(div0, "class", "grid-block");
    			set_style(div0, "background-color", "rgb(31, 208, 160)");
    			set_style(div0, "border-radius", "4%");
    			set_style(div0, "padding", "1%");
    			add_location(div0, file$2, 6, 8, 317);
    			attr_dev(div1, "class", "grid-block");
    			set_style(div1, "background-image", "url('https://i0.wp.com/criptotendencia.com/wp-content/uploads/2019/02/Como-nacio-el-Euro.jpg?fit=1000%2C642&ssl=1')");
    			set_style(div1, "width", "100%");
    			set_style(div1, "height", "100%");
    			set_style(div1, "padding", "5%");
    			add_location(div1, file$2, 5, 4, 100);
    			add_location(div2, file$2, 11, 1, 565);
    			add_location(main, file$2, 4, 0, 88);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div1);
    			append_dev(div1, div0);
    			append_dev(div0, em);
    			append_dev(em, h1);
    			append_dev(main, t1);
    			append_dev(main, div2);
    			mount_component(tabla_poverty_risks, div2, null);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tabla_poverty_risks.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tabla_poverty_risks.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(tabla_poverty_risks);
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

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("AppPovertyRisks", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<AppPovertyRisks> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Tabla_poverty_risks });
    	return [];
    }

    class AppPovertyRisks extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AppPovertyRisks",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\front\poverty_risks\editData_poverty_risks.svelte generated by Svelte v3.38.0 */

    const { console: console_1 } = globals;
    const file$1 = "src\\front\\poverty_risks\\editData_poverty_risks.svelte";

    // (96:10) {#if msjError.length!=0}
    function create_if_block_2(ctx) {
    	let p;
    	let t0;
    	let b;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Se ha producido un error:");
    			b = element("b");
    			t1 = text(/*msjError*/ ctx[7]);
    			add_location(b, file$1, 96, 59, 3387);
    			set_style(p, "color", "tomato");
    			add_location(p, file$1, 96, 10, 3338);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, b);
    			append_dev(b, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*msjError*/ 128) set_data_dev(t1, /*msjError*/ ctx[7]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(96:10) {#if msjError.length!=0}",
    		ctx
    	});

    	return block;
    }

    // (99:10) {#if msjOK.length!=0}
    function create_if_block_1(ctx) {
    	let p;
    	let b;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			b = element("b");
    			t = text(/*msjOK*/ ctx[8]);
    			add_location(b, file$1, 99, 27, 3489);
    			attr_dev(p, "class", "msjOK");
    			add_location(p, file$1, 99, 10, 3472);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, b);
    			append_dev(b, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*msjOK*/ 256) set_data_dev(t, /*msjOK*/ ctx[8]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(99:10) {#if msjOK.length!=0}",
    		ctx
    	});

    	return block;
    }

    // (94:6) <Col md=4 style="text-align: right;">
    function create_default_slot_2(ctx) {
    	let div;
    	let t;
    	let if_block0 = /*msjError*/ ctx[7].length != 0 && create_if_block_2(ctx);
    	let if_block1 = /*msjOK*/ ctx[8].length != 0 && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			add_location(div, file$1, 94, 6, 3285);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t);
    			if (if_block1) if_block1.m(div, null);
    		},
    		p: function update(ctx, dirty) {
    			if (/*msjError*/ ctx[7].length != 0) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					if_block0.m(div, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*msjOK*/ ctx[8].length != 0) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(94:6) <Col md=4 style=\\\"text-align: right;\\\">",
    		ctx
    	});

    	return block;
    }

    // (105:6) <Table bordered>
    function create_default_slot_1(ctx) {
    	let thead;
    	let tr0;
    	let tr1;
    	let td0;
    	let t1;
    	let td1;
    	let t3;
    	let td2;
    	let t5;
    	let td3;
    	let t7;
    	let td4;
    	let t9;
    	let td5;
    	let t11;
    	let td6;
    	let t13;
    	let tbody;
    	let tr2;
    	let td7;
    	let t14;
    	let t15;
    	let td8;
    	let t16;
    	let t17;
    	let td9;
    	let input0;
    	let t18;
    	let td10;
    	let input1;
    	let t19;
    	let td11;
    	let input2;
    	let t20;
    	let td12;
    	let input3;
    	let t21;
    	let td13;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			tr1 = element("tr");
    			td0 = element("td");
    			td0.textContent = "Año";
    			t1 = space();
    			td1 = element("td");
    			td1.textContent = "País";
    			t3 = space();
    			td2 = element("td");
    			td2.textContent = "Personas en riesgo de pobreza";
    			t5 = space();
    			td3 = element("td");
    			td3.textContent = "Índice de riesgo de pobreza (persona)";
    			t7 = space();
    			td4 = element("td");
    			td4.textContent = "Índice de riesgo de pobreza (hogar)";
    			t9 = space();
    			td5 = element("td");
    			td5.textContent = "Porcentaje población en riesgo de pobreza";
    			t11 = space();
    			td6 = element("td");
    			td6.textContent = "Acciones";
    			t13 = space();
    			tbody = element("tbody");
    			tr2 = element("tr");
    			td7 = element("td");
    			t14 = text(/*updateYear*/ ctx[2]);
    			t15 = space();
    			td8 = element("td");
    			t16 = text(/*updateCountry*/ ctx[1]);
    			t17 = space();
    			td9 = element("td");
    			input0 = element("input");
    			t18 = space();
    			td10 = element("td");
    			input1 = element("input");
    			t19 = space();
    			td11 = element("td");
    			input2 = element("input");
    			t20 = space();
    			td12 = element("td");
    			input3 = element("input");
    			t21 = space();
    			td13 = element("td");
    			button = element("button");
    			button.textContent = "Actualizar";
    			add_location(tr0, file$1, 106, 10, 3611);
    			attr_dev(td0, "valign", "middle");
    			add_location(td0, file$1, 108, 16, 3696);
    			attr_dev(td1, "valign", "middle");
    			add_location(td1, file$1, 109, 16, 3742);
    			attr_dev(td2, "valign", "middle");
    			add_location(td2, file$1, 110, 16, 3789);
    			attr_dev(td3, "valign", "middle");
    			add_location(td3, file$1, 111, 16, 3861);
    			attr_dev(td4, "valign", "middle");
    			add_location(td4, file$1, 112, 16, 3941);
    			attr_dev(td5, "valign", "middle");
    			add_location(td5, file$1, 113, 16, 4019);
    			attr_dev(td6, "valign", "middle");
    			attr_dev(td6, "colspan", "2");
    			add_location(td6, file$1, 114, 16, 4103);
    			set_style(tr1, "text-align", "center");
    			attr_dev(tr1, "valign", "middle");
    			add_location(tr1, file$1, 107, 12, 3629);
    			add_location(thead, file$1, 105, 8, 3592);
    			add_location(td7, file$1, 119, 18, 4237);
    			add_location(td8, file$1, 120, 18, 4278);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "placeholder", "8474000");
    			add_location(input0, file$1, 121, 24, 4328);
    			add_location(td9, file$1, 121, 20, 4324);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "placeholder", "12849");
    			add_location(input1, file$1, 122, 24, 4449);
    			add_location(td10, file$1, 122, 20, 4445);
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "placeholder", "26983");
    			add_location(input2, file$1, 123, 24, 4562);
    			add_location(td11, file$1, 123, 20, 4558);
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "placeholder", "13.6");
    			add_location(input3, file$1, 124, 24, 4673);
    			add_location(td12, file$1, 124, 20, 4669);
    			attr_dev(button, "class", "btn btn-success");
    			add_location(button, file$1, 125, 24, 4792);
    			add_location(td13, file$1, 125, 20, 4788);
    			add_location(tr2, file$1, 118, 10, 4213);
    			add_location(tbody, file$1, 117, 8, 4194);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(thead, tr1);
    			append_dev(tr1, td0);
    			append_dev(tr1, t1);
    			append_dev(tr1, td1);
    			append_dev(tr1, t3);
    			append_dev(tr1, td2);
    			append_dev(tr1, t5);
    			append_dev(tr1, td3);
    			append_dev(tr1, t7);
    			append_dev(tr1, td4);
    			append_dev(tr1, t9);
    			append_dev(tr1, td5);
    			append_dev(tr1, t11);
    			append_dev(tr1, td6);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr2);
    			append_dev(tr2, td7);
    			append_dev(td7, t14);
    			append_dev(tr2, t15);
    			append_dev(tr2, td8);
    			append_dev(td8, t16);
    			append_dev(tr2, t17);
    			append_dev(tr2, td9);
    			append_dev(td9, input0);
    			set_input_value(input0, /*updatePeople_in_risk_of_poverty*/ ctx[3]);
    			append_dev(tr2, t18);
    			append_dev(tr2, td10);
    			append_dev(td10, input1);
    			set_input_value(input1, /*updatePeople_poverty_line*/ ctx[4]);
    			append_dev(tr2, t19);
    			append_dev(tr2, td11);
    			append_dev(td11, input2);
    			set_input_value(input2, /*updateHome_poverty_line*/ ctx[5]);
    			append_dev(tr2, t20);
    			append_dev(tr2, td12);
    			append_dev(td12, input3);
    			set_input_value(input3, /*updatePercentage_risk_of_poverty*/ ctx[6]);
    			append_dev(tr2, t21);
    			append_dev(tr2, td13);
    			append_dev(td13, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[10]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[11]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[12]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[13]),
    					listen_dev(button, "click", /*updateStat*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*updateYear*/ 4) set_data_dev(t14, /*updateYear*/ ctx[2]);
    			if (dirty & /*updateCountry*/ 2) set_data_dev(t16, /*updateCountry*/ ctx[1]);

    			if (dirty & /*updatePeople_in_risk_of_poverty*/ 8 && to_number(input0.value) !== /*updatePeople_in_risk_of_poverty*/ ctx[3]) {
    				set_input_value(input0, /*updatePeople_in_risk_of_poverty*/ ctx[3]);
    			}

    			if (dirty & /*updatePeople_poverty_line*/ 16 && to_number(input1.value) !== /*updatePeople_poverty_line*/ ctx[4]) {
    				set_input_value(input1, /*updatePeople_poverty_line*/ ctx[4]);
    			}

    			if (dirty & /*updateHome_poverty_line*/ 32 && to_number(input2.value) !== /*updateHome_poverty_line*/ ctx[5]) {
    				set_input_value(input2, /*updateHome_poverty_line*/ ctx[5]);
    			}

    			if (dirty & /*updatePercentage_risk_of_poverty*/ 64 && to_number(input3.value) !== /*updatePercentage_risk_of_poverty*/ ctx[6]) {
    				set_input_value(input3, /*updatePercentage_risk_of_poverty*/ ctx[6]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(tbody);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(105:6) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (130:6) {#if msjError}
    function create_if_block(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("ERROR: ");
    			t1 = text(/*msjError*/ ctx[7]);
    			set_style(p, "color", "red");
    			add_location(p, file$1, 130, 8, 4955);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*msjError*/ 128) set_data_dev(t1, /*msjError*/ ctx[7]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(130:6) {#if msjError}",
    		ctx
    	});

    	return block;
    }

    // (147:37) <Button style="background-color: blue;">
    function create_default_slot(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Volver");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(147:37) <Button style=\\\"background-color: blue;\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let main;
    	let div1;
    	let div0;
    	let em;
    	let h1;
    	let t0;
    	let t1_value = /*params*/ ctx[0].country + "";
    	let t1;
    	let t2;
    	let t3_value = /*params*/ ctx[0].year + "";
    	let t3;
    	let t4;
    	let br;
    	let t5;
    	let col;
    	let t6;
    	let table;
    	let t7;
    	let t8;
    	let div3;
    	let footer;
    	let div2;
    	let a;
    	let button;
    	let current;

    	col = new Col({
    			props: {
    				md: "4",
    				style: "text-align: right;",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block = /*msjError*/ ctx[7] && create_if_block(ctx);

    	button = new Button({
    			props: {
    				style: "background-color: blue;",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			div1 = element("div");
    			div0 = element("div");
    			em = element("em");
    			h1 = element("h1");
    			t0 = text("Modifica ");
    			t1 = text(t1_value);
    			t2 = text("/");
    			t3 = text(t3_value);
    			t4 = space();
    			br = element("br");
    			t5 = space();
    			create_component(col.$$.fragment);
    			t6 = space();
    			create_component(table.$$.fragment);
    			t7 = space();
    			if (if_block) if_block.c();
    			t8 = space();
    			div3 = element("div");
    			footer = element("footer");
    			div2 = element("div");
    			a = element("a");
    			create_component(button.$$.fragment);
    			attr_dev(h1, "class", "display-3");
    			set_style(h1, "text-align", "center");
    			add_location(h1, file$1, 87, 16, 3085);
    			add_location(em, file$1, 87, 12, 3081);
    			attr_dev(div0, "id", "interno");
    			attr_dev(div0, "class", "grid-block");
    			set_style(div0, "background-color", "rgb(245, 181, 128)");
    			set_style(div0, "border-radius", "4%");
    			set_style(div0, "padding", "1%");
    			add_location(div0, file$1, 86, 8, 2956);
    			attr_dev(div1, "class", "grid-block");
    			set_style(div1, "background-image", "url('https://i0.wp.com/criptotendencia.com/wp-content/uploads/2019/02/Como-nacio-el-Euro.jpg?fit=1000%2C642&ssl=1')");
    			set_style(div1, "width", "100%");
    			set_style(div1, "height", "100%");
    			set_style(div1, "padding", "5%");
    			add_location(div1, file$1, 85, 4, 2739);
    			add_location(br, file$1, 92, 4, 3228);
    			attr_dev(a, "href", "#/poverty_risks");
    			add_location(a, file$1, 146, 11, 5287);
    			add_location(div2, file$1, 145, 8, 5269);
    			attr_dev(footer, "class", "svelte-1t9ak6h");
    			add_location(footer, file$1, 142, 6, 5240);
    			attr_dev(div3, "class", "foot");
    			set_style(div3, "min-width", "100%");
    			set_style(div3, "color", "white");
    			set_style(div3, "background-color", "#343c44");
    			set_style(div3, "min-width", "100%");
    			set_style(div3, "bottom", "0");
    			set_style(div3, "background-color", "#343c44");
    			set_style(div3, "left", "0");
    			set_style(div3, "position", "absolute");
    			add_location(div3, file$1, 132, 6, 5019);
    			add_location(main, file$1, 83, 0, 2725);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div1);
    			append_dev(div1, div0);
    			append_dev(div0, em);
    			append_dev(em, h1);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    			append_dev(h1, t2);
    			append_dev(h1, t3);
    			append_dev(main, t4);
    			append_dev(main, br);
    			append_dev(main, t5);
    			mount_component(col, main, null);
    			append_dev(main, t6);
    			mount_component(table, main, null);
    			append_dev(main, t7);
    			if (if_block) if_block.m(main, null);
    			append_dev(main, t8);
    			append_dev(main, div3);
    			append_dev(div3, footer);
    			append_dev(footer, div2);
    			append_dev(div2, a);
    			mount_component(button, a, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*params*/ 1) && t1_value !== (t1_value = /*params*/ ctx[0].country + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*params*/ 1) && t3_value !== (t3_value = /*params*/ ctx[0].year + "")) set_data_dev(t3, t3_value);
    			const col_changes = {};

    			if (dirty & /*$$scope, msjOK, msjError*/ 65920) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    			const table_changes = {};

    			if (dirty & /*$$scope, updatePercentage_risk_of_poverty, updateHome_poverty_line, updatePeople_poverty_line, updatePeople_in_risk_of_poverty, updateCountry, updateYear*/ 65662) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);

    			if (/*msjError*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(main, t8);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			transition_in(table.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col.$$.fragment, local);
    			transition_out(table.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(col);
    			destroy_component(table);
    			if (if_block) if_block.d();
    			destroy_component(button);
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

    const BASE_API_PATH = "/api/v1/poverty_risks";

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("EditData_poverty_risks", slots, []);
    	let { params = {} } = $$props;

    	//Viene un JSON y yo recojo los datos en el JSON stats.
    	let stat = {};

    	let updateCountry = "";
    	let updateYear = 0;
    	let updatePeople_in_risk_of_poverty = 0;
    	let updatePeople_poverty_line = 0;
    	let updateHome_poverty_line = 0;
    	let updatePercentage_risk_of_poverty = 0;
    	let msjError = "";
    	let msjOK = "";

    	async function getStat() {
    		const res = await fetch(BASE_API_PATH + "/" + params.country + "/" + params.year);

    		if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();

    			/*Guardo todos los datos de la petición y la guardo en mi plantilla JSON.*/
    			stat = json;

    			$$invalidate(1, updateCountry = stat.country);
    			$$invalidate(2, updateYear = stat.year);
    			$$invalidate(3, updatePeople_in_risk_of_poverty = stat.people_in_risk_of_poverty);
    			$$invalidate(4, updatePeople_poverty_line = stat.people_poverty_line);
    			$$invalidate(5, updateHome_poverty_line = stat.home_poverty_line);
    			$$invalidate(6, updatePercentage_risk_of_poverty = stat.percentage_risk_of_poverty);
    		} else {
    			if (res.status === 404) {
    				$$invalidate(7, msjError = "No se encuentra el dato solicitado");
    			} else if (res.status === 500) {
    				$$invalidate(7, msjError = "Error al intentar acceder a la base de datos");
    			}
    		}
    	}

    	async function updateStat() {
    		await fetch(BASE_API_PATH + "/" + params.country + "/" + params.year, {
    			method: "PUT",
    			body: JSON.stringify({
    				"country": params.country,
    				"year": parseInt(params.year),
    				"people_in_risk_of_poverty": parseFloat(updatePeople_in_risk_of_poverty),
    				"people_poverty_line": parseFloat(updatePeople_poverty_line),
    				"home_poverty_line": parseFloat(updateHome_poverty_line),
    				"percentage_risk_of_poverty": parseFloat(updatePercentage_risk_of_poverty)
    			}),
    			headers: { "Content-Type": "application/json" }
    		}).then(function (res) {
    			if (res.ok) {
    				getStat();
    				$$invalidate(7, msjError = "");
    				$$invalidate(8, msjOK = "Dato actualizado");
    			} else {
    				if (res.status === 500) {
    					$$invalidate(7, msjError = "No se han podido acceder a la base de datos");
    				} else if (res.status === 404) {
    					$$invalidate(7, msjError = "Error al intentar encontrar el dato solicitado");
    				}
    			}
    		});
    	}

    	onMount(getStat);
    	const writable_props = ["params"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<EditData_poverty_risks> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		updatePeople_in_risk_of_poverty = to_number(this.value);
    		$$invalidate(3, updatePeople_in_risk_of_poverty);
    	}

    	function input1_input_handler() {
    		updatePeople_poverty_line = to_number(this.value);
    		$$invalidate(4, updatePeople_poverty_line);
    	}

    	function input2_input_handler() {
    		updateHome_poverty_line = to_number(this.value);
    		$$invalidate(5, updateHome_poverty_line);
    	}

    	function input3_input_handler() {
    		updatePercentage_risk_of_poverty = to_number(this.value);
    		$$invalidate(6, updatePercentage_risk_of_poverty);
    	}

    	$$self.$$set = $$props => {
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		Col,
    		Nav,
    		NavItem,
    		NavLink,
    		BASE_API_PATH,
    		params,
    		stat,
    		updateCountry,
    		updateYear,
    		updatePeople_in_risk_of_poverty,
    		updatePeople_poverty_line,
    		updateHome_poverty_line,
    		updatePercentage_risk_of_poverty,
    		msjError,
    		msjOK,
    		getStat,
    		updateStat
    	});

    	$$self.$inject_state = $$props => {
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    		if ("stat" in $$props) stat = $$props.stat;
    		if ("updateCountry" in $$props) $$invalidate(1, updateCountry = $$props.updateCountry);
    		if ("updateYear" in $$props) $$invalidate(2, updateYear = $$props.updateYear);
    		if ("updatePeople_in_risk_of_poverty" in $$props) $$invalidate(3, updatePeople_in_risk_of_poverty = $$props.updatePeople_in_risk_of_poverty);
    		if ("updatePeople_poverty_line" in $$props) $$invalidate(4, updatePeople_poverty_line = $$props.updatePeople_poverty_line);
    		if ("updateHome_poverty_line" in $$props) $$invalidate(5, updateHome_poverty_line = $$props.updateHome_poverty_line);
    		if ("updatePercentage_risk_of_poverty" in $$props) $$invalidate(6, updatePercentage_risk_of_poverty = $$props.updatePercentage_risk_of_poverty);
    		if ("msjError" in $$props) $$invalidate(7, msjError = $$props.msjError);
    		if ("msjOK" in $$props) $$invalidate(8, msjOK = $$props.msjOK);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		params,
    		updateCountry,
    		updateYear,
    		updatePeople_in_risk_of_poverty,
    		updatePeople_poverty_line,
    		updateHome_poverty_line,
    		updatePercentage_risk_of_poverty,
    		msjError,
    		msjOK,
    		updateStat,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler
    	];
    }

    class EditData_poverty_risks extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { params: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EditData_poverty_risks",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get params() {
    		throw new Error("<EditData_poverty_risks>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<EditData_poverty_risks>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.38.0 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let router;
    	let current;

    	router = new Router({
    			props: { routes: /*routes*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(router.$$.fragment);
    			add_location(main, file, 41, 0, 1252);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(router, main, null);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(router);
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

    	const routes = {
    		"/": Home,
    		"/info": Info,
    		"/education_expenditures": App_edex,
    		"/education_expenditures/:country/:year": Edit_data_edex,
    		"/edex_graphs": Edex_Graph,
    		"/illiteracy": IlliteracyApp,
    		"/illiteracy/:country/:date": Edit_data_illiteracy,
    		"/poverty_risks": AppPovertyRisks,
    		"/poverty_risks/:country/:year": EditData_poverty_risks,
    		"*": NotFound, //Debe ir la última o se ejecutará antes y la tomará como no encontrada
    		
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Router,
    		NotFound,
    		Home,
    		Info,
    		App_edex,
    		Edit_data_edex,
    		Edex_Graphs: Edex_Graph,
    		illiteracy: IlliteracyApp,
    		illiteracy_edit: Edit_data_illiteracy,
    		AppPovertyRisks,
    		editData_poverty_risks: EditData_poverty_risks,
    		routes
    	});

    	return [routes];
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

    const app = new App({
    	target: document.body,
    	props: {
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
