class PointsController < ApplicationController

  before_action :set_point_with_photos, only: [:show, :marker]
  def index
    @points = Point.all
    respond_to do |format|
      format.html
      format.json do
        render json: @points.to_json(
          only: [:id, :name, :description, :location],
          methods: [:longitude, :latitude]
        )
      end
    end
  end

  def show
  end

  def marker
    respond_to do |format|
      format.html do
        render partial: "marker", locals: { point: @point }
      end
      format.json do
        render json: {
          id: @point.id,
          name: @point.name,
          description: @point.description,
          lat: @point.latitude,
          lng: @point.longitude,
          photos: @point.photos.map do |photo|
            {
              id: photo.id,
              url: url_for(photo),
              filename: photo.filename.to_s,
              bytes: photo.byte_size
            }
          end
        }
      end
    end
  end

  def create
    @point = Point.new(point_params)

    if @point.save
      redirect_to points_path
    else
      render :new, status: :unprocessable_entity
    end
  end

  def new
    @point = Point.new
  end

  private

  def set_point_with_photos
    @point = Point.with_attached_photos.find(params[:id])
  end
  def point_params
    params.require(:point).permit(:name, :description, :latitude, :longitude, photos: [])
  end
end
