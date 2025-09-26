class CreatePoints < ActiveRecord::Migration[8.0]
  def change
    create_table :points do |t|
      t.string :name, null: false
      t.string :description
      t.geography :location, srid: 4326, type: "point", null: false
      t.timestamps
    end
    add_index :points, :location, using: :gist
  end
end
