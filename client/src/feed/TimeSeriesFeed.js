import {isNumber} from "src/utils";

const MAX_BUFFER_SIZE = 500;

export class TimeSeriesFeed {
  constructor({
    url,
    eventKey = "sourceName",
    onOpen,
    onClose,
  }) {
    this.ws = null;
    this.eventKey = eventKey;
    this.buffers = {};
    this.subscribers = {};
    this.url = url;
    this.onOpen = onOpen;
    this.onClose = onClose;

    this.connect();
  }

  connect() {
    const {url, onOpen, onClose} = this;
    if (!this.ws || this.ws && this.ws.readyState >= 2) {
      this.ws = new WebSocket(url); 
    }
    const ws = this.ws;
    onClose && (ws.onclose = onClose);
    onOpen && (ws.onopen = onOpen);
    ws.onerror = (error) => this.onError(error);
    ws.onmessage = (event) => this.onMessage(event);
  }

  disconnect() {
    if (this.ws && (
        this.ws.readyState === WebSocket.CONNECTING ||
        this.ws.readyState === WebSocket.OPEN
      )
    ) {
      this.ws.close();
    }
  }

  readyState() {
    return this.ws?.readyState ?? WebSocket.CLOSED;
  }

  subscribe(sourceName, callback) {
    if (!this.subscribers[sourceName]) {
      this.subscribers[sourceName] = new Map();
    }

    if (!this.buffers[sourceName]) {
      const buffer = [];
      this.buffers[sourceName] = buffer;

      // Fill buffer with empty data to prevent hyperactive label placement as new data comes in
      // let t = Date.now() - MAX_BUFFER_SIZE;
      // while (buffer.length < MAX_BUFFER_SIZE) {
      //   buffer.push({
      //     t: undefined,t++,
      //     y: undefined,
      //   })
      // }
    }

    const key = Symbol();
    const subs = this.subscribers[sourceName];
    subs.set(key, callback);

    const unsubscribe = () => {
      subs.delete(key); // Remove the listener
      if (!subs.size) {
        // Clear out the buffer if we have no subscribers to the channel
        delete this.buffers[sourceName];
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
    const data = this.buffers[sourceName];
    return data;
  }

  onError(error) {
    console.error("A socket error ocurred, re-establishing connection...", error);
    this.disconnect();
    setTimeout(() => this.connect(), 1000);
  }

  onMessage(event) {
    const message = JSON.parse(event.data);
    const {[this.eventKey]: sourceName, ts: t, val: y} = message;
    let buffer = this.buffers[sourceName];
    if (!buffer) {
      // Only record messages for streams we have listeners for
      return;
    }
    if (!isNumber(t) || !isNumber(y)) {
      // Guard against bad data
      return;
    }

    buffer.push({t, y});
    if (buffer.length >= MAX_BUFFER_SIZE) {
      buffer.shift(); 
    }

    this.publish(sourceName);
  }
}
