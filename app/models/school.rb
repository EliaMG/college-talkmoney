class School < ActiveRecord::Base
  # require 'pry'

  def self.school_search(term, year)
    where('LOWER(name) LIKE :term AND years= :year', term: "%#{term.downcase}%", year: year)
  end

  def self.prep_data(inc, schools)
    ids = schools.split(',').map(&:to_i) #"22,33,444" to [22, 33, 444]
    net_price = "net_price_" + inc
    self.query(ids, net_price)
  end

  def self.query(ids, net_price)
    schools = []
    ids.each do |id|
      school = School.select("name", "control", "#{net_price} AS net_price").where(["id = ?", id])
    schools << school
    end
    # binding.pry
    return schools.flatten
  end


end
