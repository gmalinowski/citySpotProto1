class Point < ActiveRecord::Base
  has_many_attached :photos

  attr_accessor :longitude, :latitude

  validates :photos, length: { maximum: 6 }
  validate :photos_size_validation
  validates :name, presence: true
  validates :location, presence: true

  before_validation :set_location
  after_find :populate_virtual_coords


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
