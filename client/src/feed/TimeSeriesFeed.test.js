import {TimeSeriesFeed} from "./TimeSeriesFeed";
import WS from "jest-websocket-mock";

describe("TimeSeriesFeed", () => {
    jest.useFakeTimers();
    let server, feed;

    const factory = async (config) => {
        const url = "ws://localhost:1234/";
        const defaultConfig = {
            url,
        };
        server = new WS(url);
        feed = new TimeSeriesFeed({
            ...defaultConfig,
            ...config,
        });
        await server.connected;
    };

    afterEach(() => {
        WS.clean();
        jest.restoreAllMocks();
        jest.clearAllTimers();
    })

    describe("Lifecycle callbacks", () => {
        // TODO: Figure out why mock websockets aren't triggering onOpen. The fn callback has been verified to be working in production
        xit("Successful socket connection triggers onOpen callback", async () => {
            const onOpen = jest.fn();
            factory({onOpen});
            expect(onOpen).toHaveBeenCalled();
            expect(feed.readyState()).toEqual(WebSocket.OPEN);
        });

        it("Closed socket triggers onClose callback", async () => {
            const onClose = jest.fn();
            factory({onClose});
            server.close();
            await server.closed;
            expect(onClose).toHaveBeenCalled();
            expect(feed.readyState()).toEqual(WebSocket.CLOSED);
        });
    });

    describe("Pub Sub", () => {
        it("Emits to subscribers only when message is received", async () => {
            factory();
            const aFn = jest.fn();
            const aUnsub = feed.subscribe("ASDF", aFn);
            
            const bFn = jest.fn();
            const bUnsub = feed.subscribe("FOOBAR", bFn);

            await server.send(JSON.stringify({ts: 0, val: 0, sourceName: "ASDF"}));

            expect(aFn).toHaveBeenCalled();
            expect(bFn).not.toHaveBeenCalled();
        });

        it("Does not emit to unsubscribed listeners", async () => {
            factory();
            const aFn = jest.fn();
            const aUnsub = feed.subscribe("ASDF", aFn);
            
            const bFn = jest.fn();
            const bUnsub = feed.subscribe("FOOBAR", bFn);

            aUnsub();

            await server.send(JSON.stringify({ts: 0, val: 0, sourceName: "ASDF"}));

            expect(aFn).not.toHaveBeenCalled();
            expect(bFn).not.toHaveBeenCalled();
        });

        it("Ignores bad data", async () => {
            factory();
            const aFn = jest.fn();
            feed.subscribe("ASDF", aFn);
            await server.send(JSON.stringify({ts: "foo", val: 123, sourceName: "ASDF"}));
            await server.send(JSON.stringify({ts: 456, val: "bar", sourceName: "ASDF"}));
            const data = feed.getData("ASDF");
            
            expect(aFn).not.toHaveBeenCalled();
        });

        it("Emits to subscribers when explicitely triggerd publish", async () => {
            factory();
            const aFn = jest.fn();
            const aUnsub = feed.subscribe("ASDF", aFn);

            feed.publish("ASDF");

            expect(aFn).toHaveBeenCalled();
        });

        it("Ignores publish events for buffers that don't exist", async () => {
            factory();
            const aFn = jest.fn();
            const aUnsub = feed.subscribe("ASDF", aFn);

            feed.publish("FOOBAR");

            expect(aFn).not.toHaveBeenCalled();
        });
    });

    describe("Data buffer", () => {
        it("Retains data stream messages", async () => {
            factory();
            const aFn = jest.fn();
            feed.subscribe("ASDF", aFn);
            await server.send(JSON.stringify({ts: 123, val: 123, sourceName: "ASDF"}));
            await server.send(JSON.stringify({ts: 456, val: 456, sourceName: "ASDF"}));
            const data = feed.getData("ASDF");
            expect(data).toEqual(expect.arrayContaining([{t: 123, y: 123}, {t: 456, y: 456}]));
        });
    });

    describe("Error handling", () => {
        it("Logs connection errors", async () => {
            factory();
            jest.spyOn(console, "error").mockImplementation(() => null);

            server.error();

            expect(console.error).toHaveBeenCalledWith("A socket error ocurred, re-establishing connection...", expect.any(Object));
        });
        it("Attempts to reconnect", async () => {
            factory();
            jest.spyOn(console, "error").mockImplementation(() => null);
            jest.spyOn(feed, "connect");

            server.error();
            jest.advanceTimersByTime(1000);

            expect(feed.connect).toHaveBeenCalled();
        });
    });
});
