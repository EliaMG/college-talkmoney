class CreateSchools < ActiveRecord::Migration
  def change
    create_table :schools do |t|
      t.string :name
      t.string :url
      t.string :city
      t.string :state
      t.string :zip
      t.float :lat
      t.float :long
      t.string :control
      t.integer :years
      t.boolean :distance_only
      t.integer :net_price_avg
      t.integer :net_price_low
      t.integer :net_price_mid
      t.integer :net_price_high
      t.integer :loan_avg
      t.integer :loan_low
      t.integer :loan_mid
      t.integer :loan_high
      t.float :rpy_rt_avg
      t.float :rpy_rt_low
      t.float :rpy_rt_mid
      t.float :rpy_rt_high
      t.integer :debt_90
      t.integer :debt_75
      t.integer :debt_25
      t.integer :debt_10
      t.float :p_over_25_k
      t.integer :earn_mean
      t.integer :earn_med
      t.integer :earn_low
      t.integer :earn_mid
      t.integer :earn_high

      t.timestamps null: false
    end
  end
end
