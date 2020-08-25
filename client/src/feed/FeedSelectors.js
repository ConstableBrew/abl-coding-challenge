export const selectChannelNames = (state) => Object.keys(state.feed.buffers);
export const selectChannelData = (channel) => (state) => state.feed.buffers[channel];
