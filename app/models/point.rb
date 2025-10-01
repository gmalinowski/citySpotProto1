class Point < ActiveRecord::Base
  has_many_attached :photos

  attr_accessor :longitude, :latitude

  validates :photos, length: { maximum: 6 }
  validate :photos_size_validation
  validates :name, presence: true
  validates :location, presence: true

  before_validation :set_location
  after_find :populate_virtual_coords

  after_create_commit do |point|
    PointsChannel.broadcast_to :all_clients, { action: :create, point: {
      id: point.id,
      name: point.name,
      latitude: point.latitude,
      longitude: point.longitude,
    } }
  end
  after_destroy_commit do |point|
    PointsChannel.broadcast_to :all_clients, { action: :destroy, point: {
      id: point.id
    } }
  end

  private

  def photos_size_validation
    photos.each do |photo|
      if photo.byte_size > 5.megabytes
        errors.add(:photos, "is too large (max is 5MB per image)")
      end
    end
  end
  def set_location
    return if latitude.blank? || longitude.blank?
    point = RGeo::Geographic.spherical_factory(srid: 4326).point(longitude, latitude)
    self.location = point
  end
  def populate_virtual_coords
    self.longitude = location&.x
    self.latitude  = location&.y
  end
end
