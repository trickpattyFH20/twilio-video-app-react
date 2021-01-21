import { act, renderHook } from '@testing-library/react-hooks';
import { EventEmitter } from 'events';
import React from 'react';
import useSelectedParticipant, { SelectedParticipantProvider } from './useSelectedParticipant';
describe('the useSelectedParticipant hook', () => {
    let mockRoom;
    let result;
    beforeEach(() => (mockRoom = new EventEmitter()));
    beforeEach(() => {
        ({ result } = renderHook(useSelectedParticipant, {
            wrapper: ({ children }) => <SelectedParticipantProvider room={mockRoom}>{children}</SelectedParticipantProvider>,
        }));
    });
    it('should return null as the default value', () => {
        expect(result.current[0]).toBe(null);
    });
    it('should set a selected participant', () => {
        act(() => result.current[1]('mockParticipant'));
        expect(result.current[0]).toBe('mockParticipant');
    });
    it('should set "null" as the selected participant when the user selects the currently selected participant', () => {
        act(() => result.current[1]('mockParticipant'));
        act(() => result.current[1]('mockParticipant'));
        expect(result.current[0]).toBe(null);
    });
    it('should set "null" as the selected participant on room disconnect', () => {
        act(() => result.current[1]('mockParticipant'));
        expect(result.current[0]).toBe('mockParticipant');
        act(() => {
            mockRoom.emit('disconnected');
        });
        expect(result.current[0]).toBe(null);
    });
    it('should set "null" as the selected participant when the participant disconnects from the room', () => {
        act(() => result.current[1]('mockParticipant'));
        act(() => {
            mockRoom.emit('participantDisconnected', 'mockParticipant');
        });
        expect(result.current[0]).toBe(null);
    });
    it('should not set "null" as the selected participant when a non-selected participant disconnects from the room', () => {
        act(() => result.current[1]('mockParticipant'));
        act(() => {
            mockRoom.emit('participantDisconnected', 'otherMockParticipant');
        });
        expect(result.current[0]).toBe('mockParticipant');
    });
});
