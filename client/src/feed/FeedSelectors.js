export const selectChannelNames = (state) => Object.keys(state.feed.buffers);
export const selectChannelData = (state) => state.feed.buffers;
export const selectChannelSchema = (state) => state.feed.schema;
export const selectReadyState = (state) => state.feed.readyState;
