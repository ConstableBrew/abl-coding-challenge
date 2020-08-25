import {store} from "src/store";
import * as FeedActions from "./FeedActions";

export class Feed {
  constructor({url}) {
    this.ws = null;
    this.url = url;

    this.connect();
  }

  connect() {
    const {url} = this;
    if (!this.ws || this.ws && this.ws.readyState >= 2) {
      this.ws = new WebSocket(url); 
    }
    const ws = this.ws;
    ws.onclose = () => store.dispatch(FeedActions.feedClosed());
    ws.onopen = () => store.dispatch(FeedActions.feedOpened());
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

  onError(error) {
    console.error("A socket error ocurred, re-establishing connection...", error);
    this.disconnect();
    setTimeout(() => this.connect(), 1000);
  }

  onMessage(event) {
    const message = JSON.parse(event.data);
    const {sourceName: channel, ts: t, val: y} = message;
    store.dispatch(FeedActions.feedMessage({channel, t, y}));
  }
}
