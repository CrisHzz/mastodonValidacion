import { configureStore } from '@reduxjs/toolkit';

describe('Store Configuration', () => {
  it('should create a store', () => {
    const store = configureStore({
      reducer: {
        test: (state = {}) => state,
      },
    });
    
    expect(store).toBeDefined();
    expect(store.getState()).toBeDefined();
  });

  it('should have dispatch method', () => {
    const store = configureStore({
      reducer: {
        test: (state = {}) => state,
      },
    });
    
    expect(store.dispatch).toBeInstanceOf(Function);
  });

  it('should have getState method', () => {
    const store = configureStore({
      reducer: {
        test: (state = {}) => state,
      },
    });
    
    expect(store.getState).toBeInstanceOf(Function);
  });

  it('should have subscribe method', () => {
    const store = configureStore({
      reducer: {
        test: (state = {}) => state,
      },
    });
    
    expect(store.subscribe).toBeInstanceOf(Function);
  });

  it('should allow dispatching actions', () => {
    const reducer = jest.fn((state = {}) => state);
    const store = configureStore({
      reducer: {
        test: reducer,
      },
    });
    
    store.dispatch({ type: 'TEST_ACTION' });
    expect(reducer).toHaveBeenCalled();
  });
});

