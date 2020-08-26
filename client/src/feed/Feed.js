import {store} from "src/store";
import * as FeedActions from "./FeedActions";

export class Feed {
  constructor({url}) {
    this.ws = null;
    this.url = url;
    this.isAlive = false;
    this.heartbeatInterval = null;

    this.connect();
  }

  connect() {
    const {url} = this;

    if (this.ws) {
      this.disconnect();
    }

    const ws = new WebSocket(url); 
    this.ws = ws;
    ws.onclose = (event) => this.onClose(event);
    ws.onopen = (event) => this.onOpen(event);
    ws.onerror = (error) => this.onError(error);
    ws.onmessage = (event) => this.onMessage(event);
  }

  disconnect() {
    this.isAlive = false;
    if (this.ws) {
      this.ws.close(1000);
      this.ws = null;
    }
  }

  onClose(event) {
    this.isAlive = false;
    store.dispatch(FeedActions.feedClosed());

    if (event?.code !== 1000) {
      console.warn("A socket error ocurred. Attempting to re-establish the connection...");
      setTimeout(() => this.connect(), 1000);
    }
  }

  onError(event) {
    console.error("Socket Error", event);
  }

  onMessage(event) {
    const message = JSON.parse(event.data);
    const {sourceName: channel, ts: t, val: y} = message;
    store.dispatch(FeedActions.feedMessage({channel, t, y}));
  }

  onOpen(event) {
    this.isAlive = true;
    // this.heartbeatInterval = setInterval(() => {
    //   if (!this.isAlive) return;
    //   console.info('WS Heartbeat');
    //   ws.send(""); // Hack. Does this help detect if the conneciton is lost? Doesn't the browser already implement ping/pong? Does it help keep it alive?
    // }, 30000);

    store.dispatch(FeedActions.feedOpened());
  }
}
