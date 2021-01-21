import { EventEmitter } from 'events';
class MockRoom extends EventEmitter {
    constructor() {
        super(...arguments);
        this.state = 'connected';
        this.disconnect = jest.fn();
        this.localParticipant = {
            publishTrack: jest.fn(),
            videoTracks: [{ setPriority: jest.fn() }],
        };
    }
}
const mockRoom = new MockRoom();
class MockTrack extends EventEmitter {
    constructor(kind) {
        super();
        this.kind = '';
        this.stop = jest.fn();
        this.kind = kind;
    }
}
class MockPreflightTest extends EventEmitter {
    constructor() {
        super(...arguments);
        this.stop = jest.fn();
    }
}
const mockPreflightTest = new MockPreflightTest();
const twilioVideo = {
    connect: jest.fn(() => Promise.resolve(mockRoom)),
    createLocalTracks: jest.fn(() => Promise.resolve([new MockTrack('video'), new MockTrack('audio')])),
    testPreflight: jest.fn(() => mockPreflightTest),
};
export { mockRoom, mockPreflightTest };
export default twilioVideo;
