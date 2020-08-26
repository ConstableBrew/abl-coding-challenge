export const selectChannelNames = (state) => Object.keys(state.feed.buffers);
export const selectChannelData = (state) => state.feed.buffers;
