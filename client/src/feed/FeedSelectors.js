export const selectChannelNames = (state) => Object.keys(state.feed.buffers);
export const selectChannelData = (channelName) => (state) => state.feed.buffers[channelName];
