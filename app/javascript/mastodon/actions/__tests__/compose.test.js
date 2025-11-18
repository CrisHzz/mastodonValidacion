import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitCompose, changeCompose } from '../compose';
import api from 'mastodon/api';

vi.mock('mastodon/api');
vi.mock('mastodon/actions/alerts', () => ({
  showAlert: vi.fn(),
  showAlertForError: vi.fn(),
}));
vi.mock('mastodon/features/compose/util/counter', () => ({
  countableText: (text) => text,
}));
vi.mock('mastodon/components/router', () => ({
  browserHistory: {
    push: vi.fn(),
    location: { pathname: '/publish' },
    goBack: vi.fn(),
  },
}));
vi.mock('./importer', () => ({
  importFetchedStatus: vi.fn(() => ({ type: 'IMPORT_FETCHED_STATUS' })),
  importFetchedAccounts: vi.fn(() => ({ type: 'IMPORT_FETCHED_ACCOUNTS' })),
}));
vi.mock('./modal', () => ({
  openModal: vi.fn(() => ({ type: 'OPEN_MODAL' })),
}));
vi.mock('./timelines', () => ({
  updateTimeline: vi.fn(() => ({ type: 'UPDATE_TIMELINE' })),
}));

describe('compose actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('changeCompose', () => {
    it('dispatches COMPOSE_CHANGE action with text', () => {
      const text = 'New post text';
      const action = changeCompose(text);

      expect(action).toEqual({
        type: 'COMPOSE_CHANGE',
        text: text,
      });
    });

    it('handles empty text', () => {
      const action = changeCompose('');

      expect(action).toEqual({
        type: 'COMPOSE_CHANGE',
        text: '',
      });
    });
  });

  describe('submitCompose', () => {
    const createMockState = (overrides = {}) => {
      const defaultState = {
        getIn: vi.fn((path) => {
          if (path[0] === 'compose') {
            if (path[1] === 'text') return overrides.text || '';
            if (path[1] === 'media_attachments') return overrides.media_attachments || { size: 0 };
            if (path[1] === 'id') return overrides.id || null;
            if (path[1] === 'quoted_status_id') return overrides.quoted_status_id || null;
            if (path[1] === 'spoiler') return overrides.spoiler || false;
            if (path[1] === 'spoiler_text') return overrides.spoiler_text || '';
            if (path[1] === 'in_reply_to') return overrides.in_reply_to || null;
            if (path[1] === 'sensitive') return overrides.sensitive || false;
            if (path[1] === 'privacy') return overrides.privacy || 'public';
            if (path[1] === 'poll') return overrides.poll || null;
            if (path[1] === 'language') return overrides.language || 'en';
            if (path[1] === 'idempotencyKey') return overrides.idempotencyKey || null;
          }
          if (path[0] === 'server' && path[1] === 'server' && path[2] === 'configuration') {
            if (path[3] === 'statuses' && path[4] === 'max_characters') {
              return 500;
            }
          }
          return null;
        }),
      };
      return defaultState;
    };

    const createMockDispatch = () => {
      return vi.fn((action) => {
        if (typeof action === 'function') {
          return action(mockDispatch, createMockState);
        }
        return action;
      });
    };

    let mockDispatch;
    let mockApiRequest;

    beforeEach(() => {
      mockDispatch = createMockDispatch();
      mockApiRequest = vi.fn().mockResolvedValue({
        data: {
          id: '123',
          text: 'Test status',
          account: { id: '1', username: 'test' },
          visibility: 'public',
          in_reply_to_id: null,
          tags: [],
        },
      });
      api.mockReturnValue({
        request: mockApiRequest,
        post: mockApiRequest,
        get: mockApiRequest,
        put: mockApiRequest,
      });
    });

      it('dispatches blank post error when text and media are empty', async () => {
        const { showAlert } = await vi.importMock('mastodon/actions/alerts');
        const state = createMockState({ text: '', media_attachments: { size: 0 } });
        const dispatch = vi.fn((action) => {
          if (typeof action === 'function') {
            return action(dispatch, () => state);
          }
          return action;
        });

        submitCompose()(dispatch, () => state);

        await new Promise(resolve => setTimeout(resolve, 0));

        expect(showAlert).toHaveBeenCalledWith({
          message: expect.objectContaining({
            id: 'compose.error.blank_post',
          }),
        });
      });

    it('calls API with correct payload when submitting valid post', async () => {
      const state = createMockState({
        text: 'Test post',
        media_attachments: { size: 0, map: vi.fn(() => []) },
        privacy: 'public',
        sensitive: false,
        spoiler: false,
        poll: null,
        language: 'en',
        in_reply_to: null,
        quoted_status_id: null,
        idempotencyKey: null,
      });

      const dispatch = vi.fn((action) => {
        if (typeof action === 'function') {
          return action(dispatch, () => state);
        }
        return action;
      });

      await submitCompose()(dispatch, () => state);

      expect(mockApiRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/v1/statuses',
          method: 'post',
          data: expect.objectContaining({
            status: 'Test post',
            visibility: 'public',
            sensitive: false,
            spoiler_text: '',
            language: 'en',
          }),
        })
      );
    });

    it('dispatches COMPOSE_SUBMIT_REQUEST before API call', async () => {
      const state = createMockState({
        text: 'Test post',
        media_attachments: { size: 0, map: vi.fn(() => []) },
      });

      const dispatchedActions = [];
      const dispatch = vi.fn((action) => {
        if (typeof action === 'function') {
          return action(dispatch, () => state);
        }
        dispatchedActions.push(action);
        return action;
      });

      await submitCompose()(dispatch, () => state);

      const requestAction = dispatchedActions.find(a => a.type === 'COMPOSE_SUBMIT_REQUEST');
      expect(requestAction).toBeDefined();
    });

    it('dispatches COMPOSE_SUBMIT_SUCCESS on successful API response', async () => {
      const state = createMockState({
        text: 'Test post',
        media_attachments: { size: 0, map: vi.fn(() => []) },
      });

      const dispatchedActions = [];
      const dispatch = vi.fn((action) => {
        if (typeof action === 'function') {
          return action(dispatch, () => state);
        }
        dispatchedActions.push(action);
        return action;
      });

      await submitCompose()(dispatch, () => state);

      await new Promise(resolve => setTimeout(resolve, 0));

      const successAction = dispatchedActions.find(a => a.type === 'COMPOSE_SUBMIT_SUCCESS');
      expect(successAction).toBeDefined();
      expect(successAction.status).toBeDefined();
    });

    it('dispatches COMPOSE_SUBMIT_FAIL on API error', async () => {
      const state = createMockState({
        text: 'Test post',
        media_attachments: { size: 0, map: vi.fn(() => []) },
      });

      const error = new Error('API Error');
      mockApiRequest.mockRejectedValueOnce(error);

      const dispatchedActions = [];
      const dispatch = vi.fn((action) => {
        if (typeof action === 'function') {
          return action(dispatch, () => state);
        }
        dispatchedActions.push(action);
        return action;
      });

      await submitCompose()(dispatch, () => state);

      await new Promise(resolve => setTimeout(resolve, 0));

      const failAction = dispatchedActions.find(a => a.type === 'COMPOSE_SUBMIT_FAIL');
      expect(failAction).toBeDefined();
      expect(failAction.error).toBe(error);
    });

    it('includes media_ids in API payload when media is attached', async () => {
      const mediaAttachments = [
        { get: vi.fn((key) => key === 'id' ? 'media1' : null) },
        { get: vi.fn((key) => key === 'id' ? 'media2' : null) },
      ];
      const state = createMockState({
        text: 'Test post',
        media_attachments: {
          size: 2,
          map: vi.fn((fn) => mediaAttachments.map(fn)),
        },
      });

      const dispatch = vi.fn((action) => {
        if (typeof action === 'function') {
          return action(dispatch, () => state);
        }
        return action;
      });

      await submitCompose()(dispatch, () => state);

      expect(mockApiRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            media_ids: ['media1', 'media2'],
          }),
        })
      );
    });
  });
});

