// Dependency-free regression harness: simulated DOM, not real-host acceptance.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const clientSource = await readFile(new URL('../lib/client.js', import.meta.url), 'utf8');
const factoryReturn = "    return createChatZoomClient(require('react'));";
assert.equal(clientSource.split(factoryReturn).length, 2, 'locate the client factory return exactly once');
let api;
const sandbox = {
  window: { __ModuleLoader__: { load(definition) {
    assert.equal(definition.id, 'dsh-plugin-chat-zoom');
    api = definition.factory(() => { throw new Error('test must not load a separate React'); });
  } } }
};
vm.runInNewContext(clientSource.replace(factoryReturn,
  '    return { mountChatZoom, createChatZoomClient, normalizeBinding, validateKeyboardConfig, readKeyboardConfig, saveKeyboardConfig, clearKeyboardConfig, DEFAULT_KEYBOARD, KEYBOARD_STORAGE_KEY };'), sandbox);

// Only selectors used by this plugin are modeled. No layout/browser fidelity is claimed.
class Element {
  constructor(tag = 'div', attrs = {}) {
    this.nodeType = 1;
    this.tag = tag;
    this.attrs = new Map(Object.entries(attrs));
    this.children = [];
    this.parentElement = null;
    this.dataset = {};
    this.style = {};
    this.hidden = false;
    this.isConnected = true;
    this.scrollHeight = 1000;
    this.clientHeight = 400;
    this.scrollTop = 600;
  }
  getAttribute(name) { return this.attrs.get(name) ?? null; }
  setAttribute(name, value) { this.attrs.set(name, String(value)); }
  removeAttribute(name) { this.attrs.delete(name); }
  appendChild(child) { child.parentElement = this; this.children.push(child); return child; }
  contains(element) { return element === this || this.children.some(child => child.contains(element)); }
  matches(selector) {
    return selector.split(',').some(part => {
      const rule = part.trim();
      if (rule === '[contenteditable]:not([contenteditable="false"])') {
        return this.attrs.has('contenteditable') && this.getAttribute('contenteditable') !== 'false';
      }
      if (rule === 'input:not([type])') return this.tag === 'input' && !this.attrs.has('type');
      if (rule.startsWith('.')) return (this.getAttribute('class') ?? '').split(' ').includes(rule.slice(1));
      const tag = rule.match(/^[a-z]+/);
      if (tag && this.tag !== tag[0]) return false;
      const attributes = [...rule.matchAll(/\[([\w-]+)(?:="([^"]*)")?\]/g)];
      return (!!tag || attributes.length > 0) && attributes.every(([, name, value]) =>
        (name === 'hidden' && this.hidden || this.attrs.has(name))
        && (value === undefined || this.getAttribute(name) === value));
    });
  }
  closest(selector) {
    return this.matches(selector) ? this : this.parentElement?.closest(selector) ?? null;
  }
  querySelectorAll(selector) {
    if (selector.startsWith(':scope > ')) return this.children.filter(child => child.matches(selector.slice(9)));
    return this.children.flatMap(child => [
      ...(child.matches(selector) ? [child] : []), ...child.querySelectorAll(selector)
    ]);
  }
  querySelector(selector) { return this.querySelectorAll(selector)[0] ?? null; }
  getBoundingClientRect() { return { top: 0, bottom: 400, right: 800, height: 400 }; }
  getClientRects() { return this.hidden ? [] : [this.getBoundingClientRect()]; }
  remove() {
    if (this.parentElement) this.parentElement.children = this.parentElement.children.filter(child => child !== this);
    this.parentElement = null;
    this.isConnected = false;
  }
}

function fixture(t) {
  const html = new Element('html');
  const body = html.appendChild(new Element('body'));
  const head = html.appendChild(new Element('head'));
  const root = body.appendChild(new Element('div', {
    'data-conversation-content': '', 'data-conversation-region': 'chat'
  }));
  const scroller = root.appendChild(new Element('div', { 'data-conversation-scroll': '' }));
  const flow = scroller.appendChild(new Element('div', { 'data-chat-flow': '' }));
  const composer = scroller.appendChild(new Element('div', {
    'data-composer-seat': '', 'data-conversation-region': 'composer'
  }));
  const textarea = composer.appendChild(new Element('textarea'));
  const editable = composer.appendChild(new Element('div', { contenteditable: 'true' }));
  const plainInput = composer.appendChild(new Element('input'));
  const textInput = composer.appendChild(new Element('input', { type: 'text' }));
  const button = flow.appendChild(new Element('button'));
  const link = flow.appendChild(new Element('a', { href: '#' }));
  const send = composer.appendChild(new Element('button'));
  const file = composer.appendChild(new Element('input', { type: 'file' }));
  const checkbox = composer.appendChild(new Element('input', { type: 'checkbox' }));
  const select = composer.appendChild(new Element('select'));
  const embedded = flow.appendChild(new Element('textarea'));
  const terminal = flow.appendChild(new Element('div', { class: 'xterm', contenteditable: 'true' }));
  const ignored = composer.appendChild(new Element('div', { 'data-dsh-chat-zoom-ignore': '' }));
  const ignoredInput = ignored.appendChild(new Element('textarea'));
  const sidebar = body.appendChild(new Element('button'));
  const settings = body.appendChild(new Element('select'));
  const doc = {
    body, head, documentElement: html, activeElement: body,
    createElement: tag => new Element(tag),
    querySelectorAll: selector => html.querySelectorAll(selector)
  };
  const listeners = new Map();
  const storage = new Map();
  const timers = new Map();
  const frames = new Map();
  const observers = new Set();
  let clock = 100;
  let sequence = 0;
  const win = {
    document: doc, CSS: { supports: () => true }, innerWidth: 1000,
    performance: { now: () => clock },
    localStorage: {
      getItem: key => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: key => storage.delete(key)
    },
    MutationObserver: class {
      constructor(callback) { observers.add(this); this.callback = callback; this.active = false; }
      observe() { this.active = true; }
      disconnect() { this.active = false; }
    },
    requestAnimationFrame(callback) { const id = ++sequence; frames.set(id, callback); return id; },
    cancelAnimationFrame(id) { frames.delete(id); },
    setTimeout(callback, delay) { const id = ++sequence; timers.set(id, { callback, due:clock + delay }); return id; },
    clearTimeout(id) { timers.delete(id); },
    addEventListener: (name, listener) => listeners.set(name, listener),
    removeEventListener: (name, listener) => {
      if (listeners.get(name) === listener) listeners.delete(name);
    }
  };
  const controller = api.mountChatZoom(win);
  t.after(() => controller.dispose());
  function dispatch(name, options = {}) {
    const event = {
      key: '+', ctrlKey: true, altKey: false, metaKey: false, shiftKey: false,
      cancelable: true, defaultPrevented: false, target: doc.activeElement,
      preventDefault() { this.defaultPrevented = true; },
      stopImmediatePropagation() { this.stopped = true; },
      ...options
    };
    listeners.get(name)?.(event);
    return event;
  }
  return {
    controller, dispatch, win, doc, body, html, root, flow, composer, textarea, editable,
    plainInput, textInput, button, link, send, file, checkbox, select, embedded,
    terminal, ignoredInput, sidebar, settings, storage, listeners, scroller, head,
    timers, frames, observers,
    flushFrames() {
      const pending = [...frames]; frames.clear();
      for (const [, callback] of pending) callback(clock);
    },
    mutate(records) { for (const observer of observers) if (observer.active) observer.callback(records); },
    tick(amount) {
      clock += amount;
      for (const [id, timer] of [...timers]) if (timer.due <= clock && timers.delete(id)) timer.callback();
    }
  };
}

for (const name of ['textarea', 'editable', 'plainInput', 'textInput']) {
  test(`keyboard zoom works with composer ${name} focus`, t => {
    const f = fixture(t);
    f.doc.activeElement = f[name];
    assert.equal(f.dispatch('keydown').defaultPrevented, true);
    assert.equal(f.controller.percent, 110);
    f.dispatch('keydown', { key: '-' });
    assert.equal(f.controller.percent, 100);
    f.controller.setPercent(140);
    f.dispatch('keydown', { key: '0' });
    assert.equal(f.controller.percent, 100);
  });
}

for (const name of ['button', 'link', 'send', 'file', 'checkbox', 'select', 'embedded', 'terminal', 'ignoredInput', 'sidebar', 'settings', 'flow', 'composer']) {
  test(`keyboard does not claim ${name} focus even while hovering chat`, t => {
    const f = fixture(t);
    f.dispatch('pointerover', { target: f.flow });
    f.doc.activeElement = f[name];
    for (const key of ['+', '-', '0']) {
      f.controller.setPercent(130);
      const event = f.dispatch('keydown', { key });
      assert.equal(event.defaultPrevented, false);
      assert.equal(event.stopped, undefined);
      assert.equal(f.controller.percent, 130);
    }
  });
}

for (const focus of ['body', 'html', null]) {
  test(`idle focus ${focus} requires a current chat hover`, t => {
    const f = fixture(t);
    f.doc.activeElement = focus === null ? null : f[focus];
    assert.equal(f.dispatch('keydown').defaultPrevented, false);
    f.dispatch('pointerover', { target: f.flow });
    assert.equal(f.dispatch('keydown').defaultPrevented, true);
    assert.equal(f.controller.percent, 110);
    f.dispatch('pointerout', { relatedTarget: f.sidebar });
    assert.equal(f.dispatch('keydown').defaultPrevented, false);
  });
}

test('composition events, IME flags, forbidden modifiers and editing shortcuts are not claimed', t => {
  const f = fixture(t);
  f.doc.activeElement = f.textarea;
  f.dispatch('compositionstart');
  assert.equal(f.dispatch('keydown').defaultPrevented, false);
  f.dispatch('compositionend');
  for (const options of [
    { isComposing: true }, { keyCode: 229 }, { altKey: true }, { metaKey: true },
    { ctrlKey: false }, { getModifierState: name => name === 'AltGraph' },
    { key: 'c' }, { key: 'v' }, { key: 'z' }, { key: '0', shiftKey: true },
    { defaultPrevented: true }, { cancelable: false }
  ]) {
    const event = f.dispatch('keydown', options);
    assert.equal(event.stopped, undefined);
    assert.equal(f.controller.percent, 100);
  }
  assert.equal(f.dispatch('keydown').defaultPrevented, true);
});

test('a visible modal blocks composer and hover shortcuts; closing it restores handling', t => {
  const f = fixture(t);
  const modal = f.body.appendChild(new Element('dialog', { open: '' }));
  f.doc.activeElement = f.textarea;
  assert.equal(f.dispatch('keydown').defaultPrevented, false);
  f.doc.activeElement = f.body;
  f.dispatch('pointerover', { target: f.flow });
  assert.equal(f.dispatch('keydown').defaultPrevented, false);
  modal.hidden = true;
  f.doc.activeElement = f.textarea;
  assert.equal(f.dispatch('keydown').defaultPrevented, true);
});

test('Ctrl-wheel targeting, throttle, normal scrolling and embedded editor exclusion stay unchanged', t => {
  const f = fixture(t);
  f.doc.activeElement = f.button;
  assert.equal(f.dispatch('wheel', { target: f.flow, deltaY: -1 }).defaultPrevented, true);
  assert.equal(f.controller.percent, 110);
  f.dispatch('wheel', { target: f.flow, deltaY: -1 });
  assert.equal(f.controller.percent, 110);
  f.tick(90);
  f.dispatch('wheel', { target: f.flow, deltaY: -1 });
  assert.equal(f.controller.percent, 120);
  for (const options of [
    { target: f.flow, ctrlKey: false }, { target: f.embedded },
    { target: f.sidebar }, { target: f.flow, deltaY: 0 }
  ]) {
    assert.equal(f.dispatch('wheel', { deltaY: -1, ...options }).defaultPrevented, false);
    assert.equal(f.controller.percent, 120);
  }
});

test('settings controller, limits, storage clearing and disposal still work', t => {
  const f = fixture(t);
  f.controller.setPercent(200);
  f.doc.activeElement = f.textarea;
  assert.equal(f.dispatch('keydown').defaultPrevented, true);
  assert.equal(f.controller.percent, 200);
  f.controller.setPercent(80);
  assert.equal(f.dispatch('keydown', { key: '-' }).defaultPrevented, true);
  assert.equal(f.controller.percent, 80);
  f.controller.change(1);
  assert.equal(f.controller.percent, 90);
  assert.equal(f.storage.get('dsh-plugin-chat-zoom:v1:percent'), '90');
  f.storage.set('unrelated', 'keep');
  f.controller.clearMemory();
  assert.equal(f.controller.percent, 100);
  assert.equal(f.storage.has('dsh-plugin-chat-zoom:v1:percent'), false);
  assert.equal(f.storage.get('unrelated'), 'keep');
  f.controller.dispose();
  assert.equal(f.listeners.size, 0);
  assert.equal(f.flow.getAttribute('data-dsh-chat-zoom-owner'), null);
  assert.equal(f.composer.getAttribute('data-dsh-chat-zoom-owner'), null);
});

// A virtual React tree checks real settings callbacks, not browser rendering or tab order.
function settingsFixture(t, supported = true) {
  const f = fixture(t);
  f.win.CSS.supports = () => supported;
  sandbox.window = f.win;
  let Settings;
  const hooks = [];
  let cursor = 0;
  let idCursor = 0;
  const React = {
    createElement: (type, props, ...children) => ({ type, props: props ?? {}, children: children.flat() }),
    useSyncExternalStore: (_subscribe, getSnapshot) => getSnapshot(),
    useState(initial) {
      const index = cursor++;
      if (!(index in hooks)) hooks[index] = initial;
      return [hooks[index], value => { hooks[index] = typeof value === 'function' ? value(hooks[index]) : value; }];
    },
    useId: () => `:test-description-${idCursor++}:`
  };
  api.createChatZoomClient(React).apply({
    effect: start => t.after(start()),
    slots: {
      inject(name, register) { assert.equal(name, 'settings.section'); register(); },
      register(metadata, component) {
        assert.equal(metadata.id, 'chat-zoom');
        Settings = component;
      }
    }
  });
  const render = () => { cursor = 0; idCursor = 0; return Settings(); };
  return { ...f, controller:f.win[Symbol.for('dsh-plugin-chat-zoom:instance')], render };
}
function nodes(tree, predicate) {
  if (!tree || typeof tree !== 'object') return [];
  return [...(predicate(tree) ? [tree] : []), ...tree.children.flatMap(child => nodes(child, predicate))];
}
function text(tree) {
  return tree && typeof tree === 'object' ? tree.children.map(text).join('') : String(tree ?? '');
}
const byType = (tree, type) => nodes(tree, node => node.type === type);
const button = (tree, label) => byType(tree, 'button').find(node => text(node) === label);

test('settings show current percentage, local scope and only implemented native controls', t => {
  const f = settingsFixture(t);
  const tree = f.render();
  const output = byType(tree, 'output')[0];
  assert.equal(text(output), '100%');
  assert.equal(output.props['aria-label'], '当前聊天倍率');
  assert.match(text(tree), /仅缩放聊天消息与输入区。侧栏、设置和全局弹窗不变。/);
  assert.match(text(tree), /范围 80%—200%，每档 10 个百分点。/);
  assert.equal(nodes(tree, node => node.props.role === 'group' && node.props['aria-label'] === '聊天倍率').length, 1);
  assert.equal(byType(tree, 'select').length, 2);
  assert.equal(byType(tree, 'input').length, 3);
  assert.deepEqual(byType(tree, 'button').map(text), ['缩小', '放大', '恢复 100%', '清除倍率记忆', '保存快捷键', '恢复默认快捷键', '恢复默认滚轮']);
  assert.equal(nodes(tree, node => node.props.role === 'status' && node.props['aria-live'] === 'polite').length, 3);
});

test('settings selection, zoom buttons, reset and clear stay wired to the real controller', t => {
  const f = settingsFixture(t);
  byType(f.render(), 'select')[0].props.onChange({ target: { value: '140' } });
  assert.equal(text(byType(f.render(), 'output')[0]), '140%');
  button(f.render(), '缩小').props.onClick();
  assert.equal(text(byType(f.render(), 'output')[0]), '130%');
  button(f.render(), '放大').props.onClick();
  assert.equal(byType(f.render(), 'select')[0].props.value, 140);
  button(f.render(), '恢复 100%').props.onClick();
  assert.equal(text(byType(f.render(), 'output')[0]), '100%');
  assert.equal(f.storage.get('dsh-plugin-chat-zoom:v1:percent'), '100');
  f.storage.set('unrelated', 'keep');
  button(f.render(), '清除倍率记忆').props.onClick();
  assert.equal(f.storage.has('dsh-plugin-chat-zoom:v1:percent'), false);
  assert.equal(f.storage.get('unrelated'), 'keep');
});

test('settings preserve all options and disable only the relevant boundary button', t => {
  const f = settingsFixture(t);
  assert.deepEqual(byType(byType(f.render(), 'select')[0], 'option').map(node => node.props.value), Array.from({ length: 13 }, (_, i) => 80 + i * 10));
  for (const value of [80, 200]) {
    byType(f.render(), 'select')[0].props.onChange({ target: { value: String(value) } });
    const tree = f.render();
    assert.equal(text(byType(tree, 'output')[0]), `${value}%`);
    assert.equal(button(tree, '缩小').props.disabled, value === 80);
    assert.equal(button(tree, '放大').props.disabled, value === 200);
    assert.equal(byType(tree, 'select')[0].props.disabled, false);
  }
});

test('unsupported zoom keeps native settings controls disabled and the status visible', t => {
  const f = settingsFixture(t, false);
  const tree = f.render();
  for (const node of [...byType(tree, 'button'), ...byType(tree, 'select')]) assert.equal(node.props.disabled, true);
  assert.match(text(nodes(tree, node => node.props.role === 'status' && !node.props.id)[0]), /不支持/);
  assert.equal(text(byType(tree, 'output')[0]), '100%');
});

test('settings separate primary adjustments from memory actions and retain wrap/focus CSS', t => {
  const f = settingsFixture(t);
  const tree = f.render();
  const primary = nodes(tree, node => node.props.className === 'chat-zoom-settings-actions')[0];
  const memory = nodes(tree, node => node.props.className === 'chat-zoom-settings-memory')[0];
  assert.deepEqual(byType(primary, 'button').map(text), ['缩小', '放大']);
  assert.deepEqual(byType(memory, 'button').map(text), ['恢复 100%', '清除倍率记忆']);
  for (const control of byType(tree, 'button')) assert.equal(control.props.type, text(control) === '保存快捷键' ? 'submit' : 'button');
  const css = f.doc.head.children[0].textContent;
  assert.match(css, /\.chat-zoom-settings-summary \{[^}]*flex-wrap:wrap/);
  assert.match(css, /\.chat-zoom-settings-actions,[^{]*\{[^}]*flex-wrap:wrap/);
  assert.match(css, /\.chat-zoom-settings button:focus-visible/);
});

const keyboardConfig = (zoomIn = 'Alt+J', zoomOut = 'Alt+K', reset = 'F9') => ({ version:1, bindings:{ zoomIn, zoomOut, reset } });

test('keyboard model normalizes modifier order, aliases and symbol Shift overlap', () => {
  for (const [input, expected] of [[' control + = ', 'Ctrl+Plus'], ['Ctrl++', 'Ctrl+Plus'], ['shift+CTRL+Plus', 'Ctrl+Plus'], ['option+k', 'Alt+K'], ['cmd+0', 'Meta+0'], ['Shift+F8', 'Shift+F8'], ['F2', 'F2']]) {
    assert.equal(api.normalizeBinding(input), expected);
  }
});

test('keyboard model refuses typing, editing, browser, system and multi-step bindings', () => {
  for (const input of ['A', '1', 'Shift+A', 'Shift+1', 'Enter', 'Space', 'Backspace', 'Delete', 'Escape', 'Tab', 'F1', 'F3', 'F4', 'F5', 'F11', 'F12', 'Ctrl+C', 'Ctrl+Shift+V', 'Meta+Q', 'Ctrl+R', 'Alt+F4', 'Alt+D', 'Ctrl+2', 'Meta+9', 'Ctrl+K Ctrl+J', 'Ctrl+Ctrl+Plus', '', null, {}, 'a'.repeat(81)]) {
    assert.equal(api.normalizeBinding(input), null, String(input));
  }
});

test('keyboard config rejects malformed, future and duplicate/overlapping configurations atomically', () => {
  for (const value of [null, {}, { version:2, bindings:keyboardConfig().bindings }, { ...keyboardConfig(), extra:true }, { version:1, bindings:{} }, { version:1, bindings:[] }, keyboardConfig('Alt+J', 'option+j'), keyboardConfig('Ctrl+Plus', 'Ctrl+Shift+Equal'), keyboardConfig('Ctrl+R')]) {
    assert.equal(api.validateKeyboardConfig(value).ok, false);
  }
  const result = api.validateKeyboardConfig(keyboardConfig());
  assert.equal(result.ok, true);
  assert.equal(JSON.stringify(result.config), JSON.stringify(keyboardConfig()));
});

test('missing or invalid keyboard records safely default without migrating away the old zoom key', t => {
  const f = fixture(t);
  f.storage.set('dsh-plugin-chat-zoom:v1:percent', '150');
  for (const raw of [null, '{', 'null', '[]', JSON.stringify({ version:9, bindings:{} }), JSON.stringify(keyboardConfig('Ctrl+R'))]) {
    if (raw === null) f.storage.delete(api.KEYBOARD_STORAGE_KEY);
    else f.storage.set(api.KEYBOARD_STORAGE_KEY, raw);
    assert.equal(JSON.stringify(api.readKeyboardConfig(f.win.localStorage)), JSON.stringify(api.DEFAULT_KEYBOARD));
    assert.equal(f.storage.get('dsh-plugin-chat-zoom:v1:percent'), '150');
    assert.equal(f.storage.get(api.KEYBOARD_STORAGE_KEY) ?? null, raw);
  }
});

test('keyboard preferences round-trip, restore defaults and leave other preferences untouched', t => {
  const f = fixture(t);
  f.storage.set('dsh-plugin-chat-zoom:v1:percent', '130');
  f.storage.set('unrelated', 'keep');
  assert.equal(api.saveKeyboardConfig(f.win.localStorage, keyboardConfig()), true);
  assert.equal(JSON.stringify(api.readKeyboardConfig(f.win.localStorage)), JSON.stringify(keyboardConfig()));
  const saved = f.storage.get(api.KEYBOARD_STORAGE_KEY);
  assert.equal(api.saveKeyboardConfig(f.win.localStorage, keyboardConfig('Ctrl+R')), false);
  assert.equal(f.storage.get(api.KEYBOARD_STORAGE_KEY), saved);
  assert.equal(api.clearKeyboardConfig(f.win.localStorage), true);
  assert.equal(JSON.stringify(api.readKeyboardConfig(f.win.localStorage)), JSON.stringify(api.DEFAULT_KEYBOARD));
  assert.equal(f.storage.get('dsh-plugin-chat-zoom:v1:percent'), '130');
  assert.equal(f.storage.get('unrelated'), 'keep');
});

test('keyboard persistence tolerates absent and blocked storage without throwing', () => {
  const blocked = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); }, removeItem() { throw new Error('blocked'); } };
  for (const storage of [null, undefined, blocked]) {
    assert.equal(JSON.stringify(api.readKeyboardConfig(storage)), JSON.stringify(api.DEFAULT_KEYBOARD));
    assert.equal(api.saveKeyboardConfig(storage, keyboardConfig()), false);
    assert.equal(api.clearKeyboardConfig(storage), false);
  }
});

test('custom Alt letters and unmodified function key replace rather than extend default keyboard actions', t => {
  const f = fixture(t);
  assert.equal(f.controller.setKeyboardConfig(keyboardConfig()).ok, true);
  f.doc.activeElement = f.textarea;
  assert.equal(f.dispatch('keydown').defaultPrevented, false);
  assert.equal(f.dispatch('keydown', { key:'j', ctrlKey:false, altKey:true }).defaultPrevented, true);
  assert.equal(f.controller.percent, 110);
  assert.equal(f.dispatch('keydown', { key:'k', ctrlKey:false, altKey:true }).defaultPrevented, true);
  assert.equal(f.controller.percent, 100);
  f.controller.setPercent(170);
  assert.equal(f.dispatch('keydown', { key:'F9', ctrlKey:false }).defaultPrevented, true);
  assert.equal(f.controller.percent, 100);
});

test('Shift, Meta and multi-modifier single chords require exact non-symbol modifiers', t => {
  const f = fixture(t);
  f.controller.setKeyboardConfig(keyboardConfig('Shift+F8', 'Meta+Minus', 'Ctrl+Alt+0'));
  f.doc.activeElement = f.textarea;
  assert.equal(f.dispatch('keydown', { key:'F8', ctrlKey:false }).defaultPrevented, false);
  assert.equal(f.dispatch('keydown', { key:'F8', ctrlKey:false, shiftKey:true }).defaultPrevented, true);
  assert.equal(f.controller.percent, 110);
  assert.equal(f.dispatch('keydown', { key:'-', ctrlKey:false, metaKey:true }).defaultPrevented, true);
  f.controller.setPercent(150);
  assert.equal(f.dispatch('keydown', { key:'0', altKey:true }).defaultPrevented, true);
  assert.equal(f.controller.percent, 100);
});

test('custom chords preserve IME, AltGraph, exact modifiers and uncancelable/default-prevented events', t => {
  const f = fixture(t);
  f.controller.setKeyboardConfig(keyboardConfig());
  f.doc.activeElement = f.textarea;
  const gesture = { key:'j', ctrlKey:false, altKey:true };
  for (const extra of [{ isComposing:true }, { keyCode:229 }, { getModifierState:() => true }, { shiftKey:true }, { metaKey:true }, { defaultPrevented:true }, { cancelable:false }]) {
    const event = f.dispatch('keydown', { ...gesture, ...extra });
    assert.equal(event.stopped, undefined);
    assert.equal(f.controller.percent, 100);
  }
  f.dispatch('compositionstart');
  assert.equal(f.dispatch('keydown', gesture).defaultPrevented, false);
  f.dispatch('compositionend');
  assert.equal(f.dispatch('keydown', gesture).defaultPrevented, true);
});

test('custom bindings preserve strict focus, current hover, modal and embedded-tool exclusions', t => {
  const f = fixture(t);
  f.controller.setKeyboardConfig(keyboardConfig());
  const gesture = { key:'j', ctrlKey:false, altKey:true };
  f.dispatch('pointerover', { target:f.flow });
  for (const name of ['button', 'link', 'send', 'file', 'checkbox', 'select', 'embedded', 'terminal', 'ignoredInput', 'sidebar', 'settings', 'flow', 'composer']) {
    f.doc.activeElement = f[name];
    assert.equal(f.dispatch('keydown', gesture).defaultPrevented, false, name);
  }
  f.doc.activeElement = f.body;
  assert.equal(f.dispatch('keydown', gesture).defaultPrevented, true);
  f.dispatch('pointerout', { relatedTarget:f.sidebar });
  assert.equal(f.dispatch('keydown', gesture).defaultPrevented, false);
  const modal = f.body.appendChild(new Element('dialog', { open:'' }));
  f.doc.activeElement = f.textarea;
  assert.equal(f.dispatch('keydown', gesture).defaultPrevented, false);
  modal.hidden = true;
  assert.equal(f.dispatch('keydown', gesture).defaultPrevented, true);
});

test('keyboard customizations leave Ctrl-wheel independent and consume configured keys at zoom limits', t => {
  const f = fixture(t);
  f.controller.setKeyboardConfig(keyboardConfig('F8', 'F9', 'F2'));
  f.doc.activeElement = f.textarea;
  for (const [key, percent] of [['F8', 200], ['F9', 80]]) {
    f.controller.setPercent(percent);
    assert.equal(f.dispatch('keydown', { key, ctrlKey:false }).defaultPrevented, true);
    assert.equal(f.controller.percent, percent);
  }
  f.controller.setPercent(100);
  assert.equal(f.dispatch('wheel', { target:f.flow, deltaY:-1 }).defaultPrevented, true);
  assert.equal(f.controller.percent, 110);
  assert.equal(f.dispatch('wheel', { target:f.flow, deltaY:-1, ctrlKey:false, altKey:true }).defaultPrevented, false);
});

test('saved custom bindings and old percentage restore on remount without modifying unrelated storage', t => {
  const f = fixture(t);
  f.controller.setPercent(150);
  f.controller.setKeyboardConfig(keyboardConfig());
  f.storage.set('unrelated', 'keep');
  const active = api.mountChatZoom(f.win);
  t.after(() => active.dispose());
  assert.equal(active.percent, 150);
  assert.equal(JSON.stringify(active.getSnapshot().keyboardConfig), JSON.stringify(keyboardConfig()));
  f.doc.activeElement = f.textarea;
  assert.equal(f.dispatch('keydown', { key:'j', ctrlKey:false, altKey:true }).defaultPrevented, true);
  assert.equal(active.percent, 160);
  assert.equal(f.storage.get('unrelated'), 'keep');
});

test('invalid future keyboard records default on mount while retaining the old percent and original record', t => {
  const f = fixture(t);
  f.storage.set('dsh-plugin-chat-zoom:v1:percent', '140');
  const raw = JSON.stringify({ version:5, bindings:{} });
  f.storage.set(api.KEYBOARD_STORAGE_KEY, raw);
  const active = api.mountChatZoom(f.win);
  t.after(() => active.dispose());
  assert.equal(active.percent, 140);
  assert.equal(JSON.stringify(active.getSnapshot().keyboardConfig), JSON.stringify(api.DEFAULT_KEYBOARD));
  assert.equal(f.storage.get(api.KEYBOARD_STORAGE_KEY), raw);
});

function fillBindings(f, bindings) {
  for (const [index, action] of ['zoomIn', 'zoomOut', 'reset'].entries()) {
    byType(f.render(), 'input')[index].props.onChange({ target:{ value:bindings[action] } });
  }
}
function submitBindings(f) { byType(f.render(), 'form')[0].props.onSubmit({ preventDefault() {} }); }
const bindingStatus = f => text(nodes(f.render(), node => node.props.role === 'status' && node.props.id)[0]);

test('native keyboard inputs keep unsaved drafts inactive then validate/save canonical config', t => {
  const f = settingsFixture(t);
  fillBindings(f, keyboardConfig('option+j', 'Alt+k', 'F9').bindings);
  assert.match(bindingStatus(f), /未保存/);
  assert.equal(f.storage.has(api.KEYBOARD_STORAGE_KEY), false);
  assert.equal(f.controller.getSnapshot().keyboardConfig.bindings.zoomIn, 'Ctrl+Plus');
  submitBindings(f);
  assert.match(bindingStatus(f), /已生效并保存/);
  assert.equal(byType(f.render(), 'input')[0].props.value, 'Alt+J');
  assert.equal(JSON.parse(f.storage.get(api.KEYBOARD_STORAGE_KEY)).bindings.zoomIn, 'Alt+J');
  f.doc.activeElement = f.textarea;
  f.dispatch('keydown', { key:'j', ctrlKey:false, altKey:true });
  assert.equal(f.controller.percent, 110);
  for (const control of byType(f.render(), 'input')) {
    assert.equal(control.props.onKeyDown, undefined);
    assert.equal(control.props.autoFocus, undefined);
    assert.equal(control.props.maxLength, 80);
    for (const id of control.props['aria-describedby'].split(' ')) assert.equal(nodes(f.render(), node => node.props.id === id).length, 1);
  }
});

test('duplicate or reserved UI input reports an error and never changes the active or stored config', t => {
  const f = settingsFixture(t);
  for (const config of [keyboardConfig('Alt+J', 'option+j'), keyboardConfig('Ctrl+R')]) {
    fillBindings(f, config.bindings);
    submitBindings(f);
    assert.match(bindingStatus(f), /相同|不支持或不安全/);
    assert.equal(byType(f.render(), 'input')[0].props['aria-invalid'], true);
    assert.equal(f.storage.has(api.KEYBOARD_STORAGE_KEY), false);
    assert.equal(f.controller.getSnapshot().keyboardConfig.bindings.zoomIn, 'Ctrl+Plus');
  }
});

test('restoring keyboard defaults removes only the keyboard key and discards pending drafts', t => {
  const f = settingsFixture(t);
  fillBindings(f, keyboardConfig().bindings);
  submitBindings(f);
  f.controller.setPercent(130);
  f.storage.set('unrelated', 'keep');
  fillBindings(f, keyboardConfig('F8', 'F9', 'F2').bindings);
  button(f.render(), '恢复默认快捷键').props.onClick();
  assert.equal(byType(f.render(), 'input')[0].props.value, 'Ctrl+Plus');
  assert.equal(f.storage.has(api.KEYBOARD_STORAGE_KEY), false);
  assert.equal(f.storage.get('dsh-plugin-chat-zoom:v1:percent'), '130');
  assert.equal(f.storage.get('unrelated'), 'keep');
  assert.match(bindingStatus(f), /已恢复默认.*倍率不变/);
  fillBindings(f, keyboardConfig().bindings);
  submitBindings(f);
  button(f.render(), '清除倍率记忆').props.onClick();
  assert.equal(f.storage.has(api.KEYBOARD_STORAGE_KEY), true);
});

test('blocked keyboard writes/removals are session-only, report failures and retain truthful old records', t => {
  const f = settingsFixture(t);
  fillBindings(f, keyboardConfig().bindings);
  submitBindings(f);
  const saved = f.storage.get(api.KEYBOARD_STORAGE_KEY);
  f.win.localStorage.setItem = () => { throw new Error('blocked'); };
  f.win.localStorage.removeItem = () => { throw new Error('blocked'); };
  fillBindings(f, keyboardConfig('F8', 'F9', 'F2').bindings);
  submitBindings(f);
  assert.match(bindingStatus(f), /本页已生效.*无法保存/);
  assert.equal(f.controller.getSnapshot().keyboardConfig.bindings.zoomIn, 'F8');
  assert.equal(f.storage.get(api.KEYBOARD_STORAGE_KEY), saved);
  button(f.render(), '恢复默认快捷键').props.onClick();
  assert.match(bindingStatus(f), /本页已生效.*无法删除/);
  assert.equal(f.controller.getSnapshot().keyboardConfig.bindings.zoomIn, 'Ctrl+Plus');
  assert.equal(f.storage.get(api.KEYBOARD_STORAGE_KEY), saved);
});

test('symbol aliases preserve Ctrl plus/equal/shift and numpad defaults', t => {
  const f = fixture(t);
  f.doc.activeElement = f.textarea;
  for (const options of [{ key:'=' }, { key:'+', shiftKey:true }, { key:'=', shiftKey:true }, { key:'Add', code:'NumpadAdd' }]) {
    f.controller.setPercent(100);
    assert.equal(f.dispatch('keydown', options).defaultPrevented, true);
    assert.equal(f.controller.percent, 110);
  }
});

const wheelConfig = modifier => ({ version:1, modifier });
const wheelGesture = modifier => ({ ctrlKey:modifier === 'Ctrl', altKey:modifier === 'Alt', shiftKey:modifier === 'Shift', metaKey:modifier === 'Meta' });
const wheelSelect = f => byType(f.render(), 'select').find(node => node.props['aria-label'] === '滚轮修饰键');
const wheelStatus = f => text(nodes(f.render(), node => node.props.role === 'status' && node.props.id?.endsWith('-wheel'))[0]);

for (const modifier of ['Ctrl', 'Alt', 'Shift', 'Meta']) {
  test(`wheel ${modifier} selection claims only that modifier and preserves throttle, direction and limits`, t => {
    const f = fixture(t);
    assert.equal(f.controller.setWheelConfig(wheelConfig(modifier)).ok, true);
    const gesture = { target:f.flow, deltaY:-1, ...wheelGesture(modifier) };
    assert.equal(f.dispatch('wheel', gesture).defaultPrevented, true);
    assert.equal(f.controller.percent, 110);
    assert.equal(f.dispatch('wheel', gesture).defaultPrevented, true);
    assert.equal(f.controller.percent, 110);
    f.tick(89);
    f.dispatch('wheel', gesture);
    assert.equal(f.controller.percent, 110);
    f.tick(1);
    f.dispatch('wheel', gesture);
    assert.equal(f.controller.percent, 120);
    f.dispatch('wheel', { ...gesture, deltaY:1 });
    assert.equal(f.controller.percent, 110, 'direction reversal is immediate');
    for (const [value, deltaY] of [[200, -1], [80, 1]]) {
      f.controller.setPercent(value);
      f.tick(90);
      assert.equal(f.dispatch('wheel', { ...gesture, deltaY }).defaultPrevented, true);
      assert.equal(f.controller.percent, value);
    }
    f.controller.setPercent(130);
    for (const other of ['Ctrl', 'Alt', 'Shift', 'Meta'].filter(value => value !== modifier)) {
      assert.equal(f.dispatch('wheel', { ...gesture, ...wheelGesture(other) }).defaultPrevented, false);
      assert.equal(f.dispatch('wheel', { ...gesture, [`${other.toLowerCase()}Key`]:true }).defaultPrevented, false);
    }
    assert.equal(f.dispatch('wheel', { ...gesture, ...wheelGesture(null) }).defaultPrevented, false);
    assert.equal(f.controller.percent, 130);
  });
}

test('wheel ignores malformed configs and does not overwrite saved preferences', t => {
  const f = fixture(t);
  f.controller.setWheelConfig(wheelConfig('Alt'));
  const stored = f.storage.get('dsh-plugin-chat-zoom:v1:wheel');
  for (const config of [null, {}, wheelConfig('None'), wheelConfig('Ctrl+Alt'), wheelConfig('alt'), { version:2, modifier:'Alt' }, { ...wheelConfig('Shift'), extra:true }, ['Alt']]) {
    assert.equal(f.controller.setWheelConfig(config).ok, false);
    assert.equal(f.controller.getSnapshot().wheelConfig.modifier, 'Alt');
    assert.equal(f.storage.get('dsh-plugin-chat-zoom:v1:wheel'), stored);
  }
});

test('wheel preference restores independently of old percentage and keyboard on remount', t => {
  const f = fixture(t);
  f.controller.setPercent(150);
  f.controller.setKeyboardConfig(keyboardConfig());
  f.controller.setWheelConfig(wheelConfig('Meta'));
  f.storage.set('unrelated', 'keep');
  const active = api.mountChatZoom(f.win);
  t.after(() => active.dispose());
  assert.equal(active.percent, 150);
  assert.equal(active.getSnapshot().keyboardConfig.bindings.zoomIn, 'Alt+J');
  assert.equal(active.getSnapshot().wheelConfig.modifier, 'Meta');
  assert.deepEqual(JSON.parse(f.storage.get('dsh-plugin-chat-zoom:v1:wheel')), wheelConfig('Meta'));
  assert.equal(f.dispatch('wheel', { target:f.flow, deltaY:-1, ...wheelGesture('Meta') }).defaultPrevented, true);
  assert.equal(active.percent, 160);
  assert.equal(f.storage.get('unrelated'), 'keep');
});

test('missing, invalid and future wheel records default without writes or percent migration', t => {
  const f = fixture(t);
  f.storage.set('dsh-plugin-chat-zoom:v1:percent', '140');
  for (const raw of [null, '{', 'null', '[]', JSON.stringify({ version:2, modifier:'Alt' }), JSON.stringify(wheelConfig('None'))]) {
    if (raw === null) f.storage.delete('dsh-plugin-chat-zoom:v1:wheel');
    else f.storage.set('dsh-plugin-chat-zoom:v1:wheel', raw);
    const active = api.mountChatZoom(f.win);
    assert.equal(active.percent, 140);
    assert.equal(active.getSnapshot().wheelConfig.modifier, 'Ctrl');
    assert.equal(f.storage.get('dsh-plugin-chat-zoom:v1:wheel') ?? null, raw);
    active.dispose();
  }
});

test('wheel reset clears only its own key, preserves keyboard drafts and starts a fresh throttle gate', t => {
  const f = settingsFixture(t);
  f.controller.setPercent(130);
  f.controller.setKeyboardConfig(keyboardConfig());
  fillBindings(f, keyboardConfig('F8', 'F9', 'F2').bindings);
  const keyboardSaved = f.storage.get(api.KEYBOARD_STORAGE_KEY);
  f.controller.setWheelConfig(wheelConfig('Alt'));
  f.dispatch('wheel', { target:f.flow, deltaY:-1, ...wheelGesture('Alt') });
  const level = f.controller.percent;
  button(f.render(), '恢复默认滚轮').props.onClick();
  assert.equal(f.controller.percent, level);
  assert.equal(f.storage.has('dsh-plugin-chat-zoom:v1:wheel'), false);
  assert.equal(f.storage.get(api.KEYBOARD_STORAGE_KEY), keyboardSaved);
  assert.equal(byType(f.render(), 'input')[0].props.value, 'F8');
  assert.match(wheelStatus(f), /恢复默认.*倍率和键盘不变/);
  assert.equal(f.dispatch('wheel', { target:f.flow, deltaY:-1 }).defaultPrevented, true);
  assert.equal(f.controller.percent, level + 10, 'reset does not inherit a recent old-modifier gate');
  f.controller.setWheelConfig(wheelConfig('Shift'));
  assert.equal(f.dispatch('wheel', { target:f.flow, deltaY:-1, ...wheelGesture('Shift') }).defaultPrevented, true);
  assert.equal(f.controller.percent, level + 20, 'modifier changes apply without waiting for previous gate');
});

test('custom wheel preserves keyboard and all independent clear/reset actions', t => {
  const f = fixture(t);
  f.controller.setKeyboardConfig(keyboardConfig());
  f.controller.setWheelConfig(wheelConfig('Shift'));
  f.doc.activeElement = f.textarea;
  assert.equal(f.dispatch('keydown', { key:'j', ctrlKey:false, altKey:true }).defaultPrevented, true);
  f.controller.clearMemory();
  assert.equal(f.controller.getSnapshot().wheelConfig.modifier, 'Shift');
  assert.equal(f.storage.has('dsh-plugin-chat-zoom:v1:wheel'), true);
  f.controller.resetKeyboardConfig();
  assert.equal(f.controller.getSnapshot().wheelConfig.modifier, 'Shift');
  assert.equal(f.dispatch('keydown').defaultPrevented, true);
});

test('custom wheel avoids scope, IME, AltGraph, dialog and noncancelable/default-prevented gestures', t => {
  const f = fixture(t);
  f.controller.setWheelConfig(wheelConfig('Alt'));
  const gesture = { target:f.flow, deltaY:-1, ...wheelGesture('Alt') };
  for (const extra of [{ target:f.sidebar }, { target:f.settings }, { target:f.embedded }, { target:f.terminal }, { target:f.ignoredInput }, { deltaY:0 }, { deltaY:NaN }, { deltaY:Infinity }, { isComposing:true }, { keyCode:229 }, { getModifierState:() => true }, { cancelable:false }, { defaultPrevented:true }]) {
    assert.equal(f.dispatch('wheel', { ...gesture, ...extra }).stopped, undefined);
    assert.equal(f.controller.percent, 100);
  }
  f.dispatch('compositionstart');
  assert.equal(f.dispatch('wheel', gesture).defaultPrevented, false);
  f.dispatch('compositionend');
  const modal = f.body.appendChild(new Element('dialog', { open:'' }));
  assert.equal(f.dispatch('wheel', gesture).defaultPrevented, false);
  modal.hidden = true;
  assert.equal(f.dispatch('wheel', { ...gesture, target:f.textarea }).defaultPrevented, true);
  assert.equal(f.controller.percent, 110);
});

test('wheel native selector exposes four choices, applies immediately and links feedback', t => {
  const f = settingsFixture(t);
  const select = wheelSelect(f);
  assert.ok(select);
  assert.equal(select.props.value, 'Ctrl');
  assert.deepEqual(byType(select, 'option').map(node => node.props.value), ['Ctrl', 'Alt', 'Shift', 'Meta']);
  assert.match(wheelStatus(f), /当前滚轮：Ctrl/);
  assert.doesNotMatch(wheelStatus(f), /已保存/);
  for (const id of select.props['aria-describedby'].split(' ')) assert.equal(nodes(f.render(), node => node.props.id === id).length, 1);
  select.props.onChange({ target:{ value:'Shift' } });
  assert.equal(wheelSelect(f).props.value, 'Shift');
  assert.match(wheelStatus(f), /已生效并保存/);
  assert.match(text(f.render()), /只按所选一个修饰键/);
  assert.match(text(f.render()), /普通滚轮不接管/);
  assert.equal(select.props.onKeyDown, undefined);
  assert.equal(select.props.autoFocus, undefined);
});

test('blocked wheel writes/removals apply only to the page and report accurate feedback', t => {
  const f = settingsFixture(t);
  wheelSelect(f).props.onChange({ target:{ value:'Alt' } });
  const stored = f.storage.get('dsh-plugin-chat-zoom:v1:wheel');
  f.win.localStorage.setItem = () => { throw new Error('blocked'); };
  f.win.localStorage.removeItem = () => { throw new Error('blocked'); };
  wheelSelect(f).props.onChange({ target:{ value:'Meta' } });
  assert.equal(f.controller.getSnapshot().wheelConfig.modifier, 'Meta');
  assert.match(wheelStatus(f), /本页已生效.*无法保存/);
  assert.equal(f.storage.get('dsh-plugin-chat-zoom:v1:wheel'), stored);
  button(f.render(), '恢复默认滚轮').props.onClick();
  assert.equal(f.controller.getSnapshot().wheelConfig.modifier, 'Ctrl');
  assert.match(wheelStatus(f), /本页已生效.*无法删除/);
  assert.equal(f.storage.get('dsh-plugin-chat-zoom:v1:wheel'), stored);
});

test('absent storage still permits session wheel choice without throwing', t => {
  const f = fixture(t);
  Object.defineProperty(f.win, 'localStorage', { get() { throw new Error('blocked'); } });
  const active = api.mountChatZoom(f.win);
  t.after(() => active.dispose());
  assert.equal(active.getSnapshot().wheelConfig.modifier, 'Ctrl');
  assert.equal(active.setWheelConfig(wheelConfig('Alt')).ok, true);
  assert.match(active.getSnapshot().wheelMessage, /本页已生效.*无法保存/);
  active.resetWheelConfig();
  assert.match(active.getSnapshot().wheelMessage, /无法删除/);
});

test('wheel controls remain inert when unsupported or disposed and listeners clean up', t => {
  const f = settingsFixture(t, false);
  assert.equal(wheelSelect(f).props.disabled, true);
  assert.equal(button(f.render(), '恢复默认滚轮').props.disabled, true);
  assert.equal(f.controller.setWheelConfig(wheelConfig('Alt')).ok, false);
  assert.equal(f.controller.getSnapshot().wheelConfig.modifier, 'Ctrl');
  const activeFixture = fixture(t);
  const active = activeFixture.controller;
  active.setWheelConfig(wheelConfig('Meta'));
  active.dispose();
  assert.equal(active.setWheelConfig(wheelConfig('Alt')).ok, false);
  active.resetWheelConfig();
  assert.equal(active.getSnapshot().wheelConfig.modifier, 'Meta');
  assert.equal(activeFixture.listeners.size, 0);
  assert.equal(activeFixture.flow.getAttribute('data-dsh-chat-zoom-owner'), null);
});

const statusText = f => text(nodes(f.render(), node => node.props.role === 'status' && !node.props.id)[0]);

test('settings show an initial status without claiming a stored preference', t => {
  const f = settingsFixture(t);
  assert.match(statusText(f), /当前聊天倍率 100%/);
  assert.doesNotMatch(statusText(f), /已保存/);
  assert.equal(f.storage.size, 0);
  assert.equal(nodes(f.render(), node => node.props.role === 'status' && !node.props.id)[0].props['aria-atomic'], 'true');
  assert.equal(byType(f.render(), 'output')[0].props['aria-live'], 'off');
});

test('settings announce changes and distinguish reset from removing just the zoom key', t => {
  const f = settingsFixture(t);
  byType(f.render(), 'select')[0].props.onChange({ target: { value: '150' } });
  assert.match(statusText(f), /150%.*保存/);
  button(f.render(), '恢复 100%').props.onClick();
  assert.match(statusText(f), /100%.*保存/);
  f.storage.set('unrelated', 'keep');
  button(f.render(), '清除倍率记忆').props.onClick();
  assert.match(statusText(f), /已恢复 100%，并清除/);
  assert.equal(f.storage.has('dsh-plugin-chat-zoom:v1:percent'), false);
  assert.equal(f.storage.get('unrelated'), 'keep');
  button(f.render(), '恢复 100%').props.onClick();
  assert.equal(f.storage.get('dsh-plugin-chat-zoom:v1:percent'), '100');
  assert.match(statusText(f), /100%.*已保存/);
});

test('same-level selection retries saving and replaces stale clear feedback', t => {
  const f = settingsFixture(t);
  button(f.render(), '清除倍率记忆').props.onClick();
  byType(f.render(), 'select')[0].props.onChange({ target: { value: '100' } });
  assert.equal(f.storage.get('dsh-plugin-chat-zoom:v1:percent'), '100');
  assert.match(statusText(f), /100%.*已保存/);
  assert.doesNotMatch(statusText(f), /并清除/);
});

test('blocked storage reports change, same-level retry and clear failures truthfully', t => {
  const f = settingsFixture(t);
  const setItem = f.win.localStorage.setItem;
  f.win.localStorage.setItem = () => { throw new Error('storage blocked'); };
  byType(f.render(), 'select')[0].props.onChange({ target: { value: '140' } });
  assert.equal(text(byType(f.render(), 'output')[0]), '140%');
  assert.match(statusText(f), /无法保存/);
  byType(f.render(), 'select')[0].props.onChange({ target: { value: '140' } });
  assert.match(statusText(f), /无法保存/);
  f.win.localStorage.setItem = setItem;
  byType(f.render(), 'select')[0].props.onChange({ target: { value: '140' } });
  assert.match(statusText(f), /已保存/);
  f.win.localStorage.removeItem = () => { throw new Error('remove blocked'); };
  button(f.render(), '清除倍率记忆').props.onClick();
  assert.equal(text(byType(f.render(), 'output')[0]), '100%');
  assert.match(statusText(f), /已恢复 100%，但无法访问/);
  assert.doesNotMatch(statusText(f), /并清除/);
});

test('reset and clear have linked descriptions and no custom keyboard interception', t => {
  const f = settingsFixture(t);
  const tree = f.render();
  const reset = button(tree, '恢复 100%');
  const clear = button(tree, '清除倍率记忆');
  const id = reset.props['aria-describedby'];
  assert.equal(clear.props['aria-describedby'], id);
  const description = nodes(tree, node => node.props.id === id);
  assert.equal(description.length, 1);
  assert.match(text(description[0]), /恢复默认倍率并保存 100%/);
  assert.match(text(description[0]), /删除本插件的倍率记录；再次调整会重新保存/);
  assert.match(text(tree), /Tab \/ Shift\+Tab.*方向键.*Enter 或空格/);
  for (const control of [...byType(tree, 'button'), ...byType(tree, 'select')]) {
    assert.equal(control.props.tabIndex, undefined);
    assert.equal(control.props.onKeyDown, undefined);
    assert.equal(control.props.autoFocus, undefined);
  }
  f.doc.activeElement = f.settings;
  for (const key of ['Tab', 'ArrowDown', 'Enter', ' ']) {
    assert.equal(f.dispatch('keydown', { key, ctrlKey: false }).defaultPrevented, false);
  }
});

// D5: deterministic scheduling/layout arithmetic, never real browser geometry.
test('shifted physical Minus matches the normalized Minus binding, not arbitrary underscore keys', t => {
  const f = fixture(t);
  f.doc.activeElement = f.textarea;
  f.controller.setPercent(140);
  const event = f.dispatch('keydown', { key:'_', code:'Minus', shiftKey:true });
  assert.equal(event.defaultPrevented, true);
  assert.equal(f.controller.percent, 130);
  assert.equal(f.dispatch('keydown', { key:'_', code:'KeyQ', shiftKey:true }).defaultPrevented, false);
  assert.equal(f.dispatch('keydown', { key:'_', code:'Minus', shiftKey:true, ctrlKey:false }).defaultPrevented, false);
  for (const extra of [{ isComposing:true }, { keyCode:229 }, { getModifierState:() => true }, { altKey:true }, { defaultPrevented:true }, { cancelable:false }]) {
    const blocked = f.dispatch('keydown', { key:'_', code:'Minus', shiftKey:true, ...extra });
    assert.equal(blocked.stopped, undefined);
    assert.equal(f.controller.percent, 130);
  }
  f.controller.setKeyboardConfig(keyboardConfig('Alt+J', 'Alt+Minus', 'F9'));
  assert.equal(f.dispatch('keydown', { key:'_', code:'Minus', shiftKey:true }).defaultPrevented, false);
  assert.equal(f.dispatch('keydown', { key:'_', code:'Minus', shiftKey:true, ctrlKey:false, altKey:true }).defaultPrevented, true);
  assert.equal(f.controller.percent, 120);
  f.doc.activeElement = f.button;
  assert.equal(f.dispatch('keydown', { key:'_', code:'Minus', shiftKey:true, ctrlKey:false, altKey:true }).defaultPrevented, false);
});

test('hint expires five seconds after the most recent adjustment without claiming focus', t => {
  const f = fixture(t);
  const hint = f.root.querySelector('[data-dsh-chat-zoom-hint]');
  assert.equal(hint.hidden, true);
  f.controller.change(1);
  assert.equal(hint.hidden, false);
  f.tick(4999);
  assert.equal(hint.hidden, false);
  f.controller.change(1);
  f.tick(1);
  assert.equal(hint.hidden, false, 'old deadline must not hide a renewed hint');
  f.tick(4999);
  assert.equal(hint.hidden, true);
  assert.equal(f.doc.activeElement, f.body);
  assert.equal(hint.style.pointerEvents, undefined); // noninteractive behavior is in owned CSS
  assert.match(f.head.children[0].textContent, /pointer-events:none/);
});

test('dispose cancels pending timers, frames, observers, owned UI and later mutations', t => {
  const f = fixture(t);
  f.controller.change(1);
  f.mutate([{ type:'attributes', target:f.root }]);
  assert.ok(f.timers.size > 0 && f.frames.size > 0);
  f.controller.dispose();
  f.controller.dispose();
  assert.equal(f.timers.size, 0);
  assert.equal(f.frames.size, 0);
  assert.equal([...f.observers].some(observer => observer.active), false);
  assert.equal(f.listeners.size, 0);
  assert.equal(f.head.children.length, 0);
  assert.equal(f.root.querySelector('[data-dsh-chat-zoom-hint]'), null);
  const stored = [...f.storage];
  f.controller.setPercent(180);
  f.controller.clearMemory();
  f.controller.resetKeyboardConfig();
  f.controller.resetWheelConfig();
  f.mutate([{ type:'attributes', target:f.root }]);
  f.tick(10000); f.flushFrames();
  assert.deepEqual([...f.storage], stored);
  assert.equal(f.win[Symbol.for('dsh-plugin-chat-zoom:instance')], undefined);
});

test('remount restores previous owner markers and never erases a later external owner', t => {
  const f = fixture(t);
  f.controller.dispose();
  f.flow.setAttribute('data-dsh-chat-zoom-owner', 'previous-owner');
  const first = api.mountChatZoom(f.win);
  assert.equal(f.flow.getAttribute('data-dsh-chat-zoom-owner'), 'dsh-plugin-chat-zoom');
  first.dispose();
  assert.equal(f.flow.getAttribute('data-dsh-chat-zoom-owner'), 'previous-owner');
  const second = api.mountChatZoom(f.win);
  t.after(() => second.dispose());
  f.flow.setAttribute('data-dsh-chat-zoom-owner', 'later-owner');
  second.dispose();
  assert.equal(f.flow.getAttribute('data-dsh-chat-zoom-owner'), 'later-owner');
});

test('discovery handles hero, unsupported phase, hidden roots and returning chat without global fallback', t => {
  const f = fixture(t);
  f.flow.remove();
  f.root.setAttribute('data-content-phase', 'hero');
  const discover = () => { f.mutate([{ type:'attributes', target:f.root }]); f.tick(0); };
  discover();
  assert.equal(f.composer.getAttribute('data-dsh-chat-zoom-owner'), 'dsh-plugin-chat-zoom');
  f.root.setAttribute('data-content-phase', 'other'); discover();
  assert.equal(f.composer.getAttribute('data-dsh-chat-zoom-owner'), null);
  assert.equal(f.dispatch('wheel', { target:f.textarea, deltaY:-1 }).defaultPrevented, false);
  f.root.setAttribute('data-content-phase', 'hero');
  f.root.hidden = true; discover();
  assert.equal(f.composer.getAttribute('data-dsh-chat-zoom-owner'), null);
  f.root.hidden = false; discover();
  assert.equal(f.dispatch('wheel', { target:f.textarea, deltaY:-1 }).defaultPrevented, true);
  assert.equal(f.body.getAttribute('data-dsh-chat-zoom-owner'), null);
  assert.equal(f.sidebar.getAttribute('data-dsh-chat-zoom-owner'), null);
  assert.equal(f.settings.getAttribute('data-dsh-chat-zoom-owner'), null);
});

test('multiple panels share percentage while retaining per-panel wheel gates and one live hint', t => {
  const f = fixture(t);
  const root = f.body.appendChild(new Element('div', { 'data-conversation-content':'', 'data-conversation-region':'chat' }));
  const scroller = root.appendChild(new Element('div', { 'data-conversation-scroll':'' }));
  const flow = scroller.appendChild(new Element('div', { 'data-chat-flow':'' }));
  const composer = scroller.appendChild(new Element('div', { 'data-composer-seat':'', 'data-conversation-region':'composer' }));
  f.mutate([{ type:'childList', addedNodes:[root], removedNodes:[] }]); f.tick(0);
  assert.equal(flow.getAttribute('data-dsh-chat-zoom-owner'), 'dsh-plugin-chat-zoom');
  f.dispatch('wheel', { target:f.flow, deltaY:-1 });
  f.dispatch('wheel', { target:flow, deltaY:-1 });
  assert.equal(f.controller.percent, 120);
  const hints = f.body.querySelectorAll('[data-dsh-chat-zoom-hint]');
  assert.equal(hints.length, 2);
  assert.equal(hints.filter(hint => hint.getAttribute('role') === 'status').length, 1);
  assert.ok(hints.every(hint => hint.textContent === '缩放 120%'));
  f.controller.dispose();
  assert.equal(flow.getAttribute('data-dsh-chat-zoom-owner'), null);
  assert.equal(composer.getAttribute('data-dsh-chat-zoom-owner'), null);
  assert.equal(f.body.querySelectorAll('[data-dsh-chat-zoom-hint]').length, 0);
});

test('modeled anchor math restores an offset immediately and after the next animation frame', t => {
  const f = fixture(t);
  f.scroller.scrollTop = 200;
  const anchor = f.flow.appendChild(new Element('div', { 'data-chat-anchor-key':'synthetic-anchor' }));
  let contentTop = 250;
  anchor.getBoundingClientRect = () => {
    const top = contentTop - f.scroller.scrollTop;
    return { top, bottom:top + 40, height:40 };
  };
  Object.defineProperty(f.head.children[0], 'textContent', { set() { contentTop = 300; } });
  f.controller.setPercent(150);
  assert.equal(f.scroller.scrollTop, 250);
  contentTop = 320; f.flushFrames();
  assert.equal(f.scroller.scrollTop, 270);
});

test('modeled tail follows updated height while anchorless mid-chat retains scrollTop', t => {
  const f = fixture(t);
  Object.defineProperty(f.head.children[0], 'textContent', { set() { f.scroller.scrollHeight = 1200; } });
  f.controller.setPercent(150);
  assert.equal(f.scroller.scrollTop, 800);
  f.scroller.scrollHeight = 1300; f.flushFrames();
  assert.equal(f.scroller.scrollTop, 900);
  f.scroller.scrollTop = 200;
  f.controller.setPercent(160); f.flushFrames();
  assert.equal(f.scroller.scrollTop, 200);
});

test('legacy percentage records remain readable without migration or malformed-record overwrites', t => {
  const f = fixture(t);
  f.controller.dispose();
  for (const [raw, expected] of [['80',80], ['137',137], ['200',200], ['79',100], ['201',100], ['1e2',100], ['100.0',100], ['',100], ['null',100]]) {
    f.storage.set('dsh-plugin-chat-zoom:v1:percent', raw);
    const active = api.mountChatZoom(f.win);
    assert.equal(active.percent, expected);
    assert.equal(f.storage.get('dsh-plugin-chat-zoom:v1:percent'), raw);
    assert.equal(active.getSnapshot().keyboardConfig.bindings.zoomIn, 'Ctrl+Plus');
    assert.equal(active.getSnapshot().wheelConfig.modifier, 'Ctrl');
    active.dispose();
  }
});
