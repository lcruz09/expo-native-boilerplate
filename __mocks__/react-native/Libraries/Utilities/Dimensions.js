/**
 * Manual mock for React Native's Dimensions API.
 * This is loaded automatically by Jest before any modules that import Dimensions.
 */

const mockDimensions = {
  width: 400,
  height: 800,
};

const Dimensions = {
  get: jest.fn(() => mockDimensions),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  set: jest.fn((dims) => {
    mockDimensions.width = dims.width;
    mockDimensions.height = dims.height;
  }),
};

module.exports = Dimensions;
