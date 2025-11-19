# frozen_string_literal: true

require 'test_helper'

class Api::V1::PollsControllerTest < ActionDispatch::IntegrationTest
  fixtures :accounts, :users, :statuses, :polls, :oauth_applications, :oauth_access_tokens

  setup do
    @user = users(:alice)
    @account = @user.account
    @status = statuses(:alice_status_with_poll)
    @poll = polls(:alice_poll)
    @client_app = Doorkeeper::Application.find_by(name: 'Test app')
    @token = Doorkeeper::AccessToken.find_by(token: 'test_token_1234567890abcdef')
    @headers = { 'Authorization' => "Bearer #{@token.token}" }
  end

  test 'GET #show returns poll data as JSON when authenticated' do
    get "/api/v1/polls/#{@poll.id}", headers: @headers

    assert_response :success
    assert_equal 'application/json', response.content_type.split(';').first

    json_response = JSON.parse(response.body)
    assert_not_nil json_response
    assert_equal @poll.id, json_response['id']
  end

  test 'GET #show returns poll data with options' do
    get "/api/v1/polls/#{@poll.id}", headers: @headers

    assert_response :success
    json_response = JSON.parse(response.body)
    assert_not_nil json_response['options']
    assert_equal 2, json_response['options'].size
  end

  test 'GET #show returns 404 when poll does not exist' do
    get '/api/v1/polls/999999', headers: @headers

    assert_response :not_found
  end

  test 'GET #show returns 401 when not authenticated' do
    get "/api/v1/polls/#{@poll.id}"

    assert_response :unauthorized
  end

  test 'GET #show authorizes access to poll status' do
    private_poll = polls(:private_poll)

    get "/api/v1/polls/#{private_poll.id}", headers: @headers

    assert_response :not_found
  end

  test 'GET #show refreshes poll when possibly_stale? is true' do
    remote_poll = polls(:remote_poll)

    fetch_service = Minitest::Mock.new
    fetch_service.expect :call, true, [remote_poll, @account]

    ActivityPub::FetchRemotePollService.stub :new, -> { fetch_service } do
      remote_poll.stub :possibly_stale?, true do
        Poll.stub :find, remote_poll do
          get "/api/v1/polls/#{remote_poll.id}", headers: @headers
        end
      end
    end

    assert_response :success
    fetch_service.verify
  end

  test 'GET #show does not refresh poll when possibly_stale? is false' do
    fetch_service = Minitest::Mock.new

    @poll.stub :possibly_stale?, false do
      ActivityPub::FetchRemotePollService.stub :new, -> { fetch_service } do
        get "/api/v1/polls/#{@poll.id}", headers: @headers
      end
    end

    assert_response :success
  end

  test 'GET #show does not refresh poll when user is not signed in' do
    fetch_service = Minitest::Mock.new

    @poll.stub :possibly_stale?, true do
      ActivityPub::FetchRemotePollService.stub :new, -> { fetch_service } do
        get "/api/v1/polls/#{@poll.id}"
      end
    end

    assert_response :unauthorized
  end

  test 'GET #show returns poll with include_results flag' do
    serializer = Minitest::Mock.new
    serializer.expect :serialize, { 'id' => @poll.id }, [{ include_results: true }]

    REST::PollSerializer.stub :new, serializer do
      get "/api/v1/polls/#{@poll.id}", headers: @headers
    end

    assert_response :success
    serializer.verify
  end
end

