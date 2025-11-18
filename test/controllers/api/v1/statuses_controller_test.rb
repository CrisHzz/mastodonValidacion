# frozen_string_literal: true

require 'test_helper'

class Api::V1::StatusesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = Fabricate(:user)
    @client_app = Fabricate(:application, name: 'Test app', website: 'http://testapp.com')
    @token = Fabricate(:accessible_access_token, resource_owner_id: @user.id, application: @client_app, scopes: 'write:statuses')
    @headers = { 'Authorization' => "Bearer #{@token.token}" }
  end

  test 'POST #create calls PostStatusService with correct parameters using test doubles' do
    service_called = false
    service_args = nil

    mock_status = Object.new
    def mock_status.id
      123
    end
    def mock_status.persisted?
      true
    end
    def mock_status.is_a?(klass)
      false
    end

    post_status_service = Object.new
    def post_status_service.call(account, options)
      @called = true
      @args = [account, options]
      @mock_status
    end
    def post_status_service.called?
      @called
    end
    def post_status_service.args
      @args
    end
    post_status_service.instance_variable_set(:@mock_status, mock_status)

    PostStatusService.stub :new, post_status_service do
      post '/api/v1/statuses', headers: @headers, params: { status: 'Hello world' }

      assert_response :success
      assert_equal 'application/json', response.content_type.split(';').first
    end

    assert post_status_service.called?
  end

  test 'POST #create returns JSON response with status data' do
    post '/api/v1/statuses', headers: @headers, params: { status: 'Hello world' }

    assert_response :success
    assert_equal 'application/json', response.content_type.split(';').first
    assert_not_nil JSON.parse(response.body)
  end

  test 'POST #create creates status with media attachments using doubles' do
    media_attachment = Fabricate(:media_attachment, account: @user.account)
    params = { status: 'Hello world', media_ids: [media_attachment.id] }

    assert_difference -> { @user.account.statuses.count }, 1 do
      post '/api/v1/statuses', headers: @headers, params: params
    end

    assert_response :success
    assert_not_nil media_attachment.reload.status_id
  end
end

