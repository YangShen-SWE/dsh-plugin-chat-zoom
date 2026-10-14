// Dependency-free regression harness: simulated DOM, not real-host acceptance.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const clientSource = await readFile(new URL('../lib/client.js', import.meta.url), 'utf8');
const factoryReturn = "    return createChatZoomClient(require('react'));";
assert.equal(clientSource.split(factoryReturn).length, 2, 'locate the client factory return exactly once');
let api;
vm.runInNewContext(clientSource.replace(factoryReturn,
  '    return { mountChatZoom };'), {
  window: { __ModuleLoader__: { load(definition) {
    assert.equal(definition.id, 'dsh-plugin-chat-zoom');
    api = definition.factory(() => { throw new Error('test must not load a separate React'); });
  } } }
});

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
    MutationObserver: class { observe() {} disconnect() {} },
    requestAnimationFrame: () => ++sequence, cancelAnimationFrame() {},
    setTimeout: () => ++sequence, clearTimeout() {},
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
    controller, dispatch, doc, body, html, root, flow, composer, textarea, editable,
    plainInput, textInput, button, link, send, file, checkbox, select, embedded,
    terminal, ignoredInput, sidebar, settings, storage, listeners,
    tick: amount => { clock += amount; }
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
