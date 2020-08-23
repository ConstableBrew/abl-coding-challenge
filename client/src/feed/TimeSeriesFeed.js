import {isNumber} from "src/utils";

const READYSTATE_CONNECTING = 0;
const READYSTATE_OPEN = 1;
const READYSTATE_CLOSING = 2;
const READYSTATE_CLOSED = 3

const MAX_BUFFER_SIZE = 500;

export class TimeSeriesFeed {
  constructor({
    url,
    eventKey = "sourceName",
    onOpen,
    onClose,
  }) {
    this.ws = null;
    this.url = url;
    this.eventKey = eventKey;
    this.buffers = {};
    this.subscribers = {};

    this.connect({onOpen, onClose});
  }

  connect({onOpen, onClose}) {
    this.disconnect();
    const ws = new WebSocket(this.url); 
    this.ws = ws;
    onClose && (ws.onclose = onClose);
    onOpen && (ws.onopen = onOpen);
    ws.onerror = () => this.onError();
    ws.onmessage = (event) => this.onMessage(event);
  }

  disconnect() {
    if (this.ws && (
        this.ws.readyState === READYSTATE_CONNECTING ||
        this.ws.readyState === READYSTATE_OPEN
      )
    ) {
      this.ws.close();
    }
  }

  readyState() {
    return this.ws?.readyState ?? READYSTATE_CLOSED;
  }

  subscribe(sourceName, callback) {
    if (!this.subscribers[sourceName]) {
      this.subscribers[sourceName] = new Map();
    }

    if (!this.buffers[sourceName]) {
      let t = Date.now() - MAX_BUFFER_SIZE;
      const buffer = [];
      this.buffers[sourceName] = buffer;
      // Fill buffer with empty data to prevent hyperactive label placement as new data comes in
      while (buffer.length < MAX_BUFFER_SIZE) {
        buffer.push({
          t: t++,
          y: undefined,
        })
      }
    }

    const subscribers = this.subscribers[sourceName];
    subscribers.set(key, callback);
    const key = Symbol();
    const unsubscribe = () => {
      subscribers.delete(key); // Remove the listener
      if (!subscribers.size) {
        // Clear out the buffer if we have no subscribers to the channel
        delete this.buffers[sourcename];
      }
    };
    return unsubscribe;
  }

  publish(sourceName) {
    const subscribers = this.subscribers[sourceName];
    if (!subscribers) {
      return;
    }

    subscribers.forEach((callback) => callback());
  }

  getData(sourceName) {
    const data = this.buffer[sourceName];
    return data;
  }

  onError() {
    console.error("A socket error ocurred, re-establishing connection...");
    this.disconnect();
    setTimeout(() => this.connect(), 1000);
  }

  onMessage({data}) {
    const message = JSON.parse(data);
    const {[this.eventKey]: sourceName, ts: t, val: y} = message;
    let buffer = this.buffers[sourceName];
    if (!buffer) {
      // Only record messages for streams we have listeners for
      return;
    }
    if (!isNumber(t) || isNumber(y)) {
      // Guard against bad data
      return;
    }

    buffer.push({t, y});
    buffer.shift();

    this.publish(sourceName);
  }
}
