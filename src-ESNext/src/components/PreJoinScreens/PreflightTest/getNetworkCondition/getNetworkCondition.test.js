import getNetworkCondition, { getSingleNetworkCondition } from './getNetworkCondition';
import { NetworkCondition } from '../PreflightTest';
describe('the getSingleNetworkCondition function', () => {
    it('should return NetworkCondition.Green when the provided stat is undefined', () => {
        expect(getSingleNetworkCondition(undefined, 10, 100)).toBe(NetworkCondition.Green);
    });
    it('should return NetworkCondition.Green when the provided stat is below the Yellow threshold', () => {
        expect(getSingleNetworkCondition(1, 10, 100)).toBe(NetworkCondition.Green);
    });
    it('should return NetworkCondition.Yellow when the provided stat is below the Red thresold and above the Yellow threshold', () => {
        expect(getSingleNetworkCondition(50, 10, 100)).toBe(NetworkCondition.Yellow);
    });
    it('should return NetworkCondition.Red when the provided stat is above the Red threshold', () => {
        expect(getSingleNetworkCondition(200, 10, 100)).toBe(NetworkCondition.Red);
    });
});
describe('the getNetworkCondition function', () => {
    it('should return NetworkCondition.Green when all stats in the report are Green', () => {
        const mockReport = {
            stats: {
                rtt: { average: 10 },
                jitter: { average: 10 },
                packetLoss: { average: 1 },
            },
        };
        expect(getNetworkCondition(mockReport)).toBe(NetworkCondition.Green);
    });
    it('should return NetworkCondition.Yellow when one stat in the report is Yellow', () => {
        const mockReport = {
            stats: {
                rtt: { average: 10 },
                jitter: { average: 10 },
                packetLoss: { average: 3 },
            },
        };
        expect(getNetworkCondition(mockReport)).toBe(NetworkCondition.Yellow);
    });
    it('should return NetworkCondition.Red when one stat in the report is Red', () => {
        const mockReport = {
            stats: {
                rtt: { average: 1000 },
                jitter: { average: 10 },
                packetLoss: { average: 1 },
            },
        };
        expect(getNetworkCondition(mockReport)).toBe(NetworkCondition.Red);
    });
});
