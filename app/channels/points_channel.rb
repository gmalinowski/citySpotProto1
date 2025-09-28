class PointsChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    # stream_from :all_clients
    stream_for :all_clients
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
