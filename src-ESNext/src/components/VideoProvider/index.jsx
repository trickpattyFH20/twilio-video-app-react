import React, { createContext } from 'react';
import { SelectedParticipantProvider } from './useSelectedParticipant/useSelectedParticipant';
import AttachVisibilityHandler from './AttachVisibilityHandler/AttachVisibilityHandler';
import useHandleRoomDisconnectionErrors from './useHandleRoomDisconnectionErrors/useHandleRoomDisconnectionErrors';
import useHandleOnDisconnect from './useHandleOnDisconnect/useHandleOnDisconnect';
import useHandleTrackPublicationFailed from './useHandleTrackPublicationFailed/useHandleTrackPublicationFailed';
import useLocalTracks from './useLocalTracks/useLocalTracks';
import useRoom from './useRoom/useRoom';
import useScreenShareToggle from './useScreenShareToggle/useScreenShareToggle';
export const VideoContext = createContext(null);
export function VideoProvider({ options, children, onError = () => { }, onDisconnect = () => { } }) {
    const onErrorCallback = (error) => {
        console.log(`ERROR: ${error.message}`, error);
        onError(error);
    };
    const { localTracks, getLocalVideoTrack, getLocalAudioTrack, isAcquiringLocalTracks, removeLocalVideoTrack, getAudioAndVideoTracks, } = useLocalTracks();
    const { room, isConnecting, connect } = useRoom(localTracks, onErrorCallback, options);
    // Register onError and onDisconnect callback functions.
    useHandleRoomDisconnectionErrors(room, onError);
    useHandleTrackPublicationFailed(room, onError);
    useHandleOnDisconnect(room, onDisconnect);
    const [isSharingScreen, toggleScreenShare] = useScreenShareToggle(room, onError);
    return (<VideoContext.Provider value={{
        room,
        localTracks,
        isConnecting,
        onError: onErrorCallback,
        onDisconnect,
        getLocalVideoTrack,
        getLocalAudioTrack,
        connect,
        isAcquiringLocalTracks,
        removeLocalVideoTrack,
        isSharingScreen,
        toggleScreenShare,
        getAudioAndVideoTracks,
    }}>
      <SelectedParticipantProvider room={room}>{children}</SelectedParticipantProvider>
      
      <AttachVisibilityHandler />
    </VideoContext.Provider>);
}
