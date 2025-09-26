class PointsController < ApplicationController
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

  def photos
    point = Point.find(params[:id])
        render json: {
          id: point.id,
          name: point.name,
          description: point.description,
          lat: point.latitude,
          lng: point.longitude,
          photos: point.photos.map do |photo|
            {
              id: photo.id,
              url: url_for(photo),
              filename: photo.filename.to_s,
              bytes: photo.byte_size
            }
            end
        }
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

  def point_params
    params.require(:point).permit(:name, :description, :latitude, :longitude, photos: [])
  end
end
