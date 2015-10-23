class School < ActiveRecord::Base

  def self.school_search(term, year)
    where('LOWER(name) LIKE :term AND years= :year', term: "%#{term.downcase}%", year: year)
  end

  def self.price_prep(inc, schools)
    ids = schools.split(',').map(&:to_i) #"22,33,444" to [22, 33, 444]
    net_price = "net_price_" + inc #avg to net_price_avg -column name
    self.price_query(ids, net_price)
  end

  def self.price_query(ids, net_price)
    schools = []
    ids.each do |id|
      school = School.select("name", "control", "net_price_avg", "#{net_price} AS net_price").where(["id = ?", id]).first
      if school.net_price == 0
        school.net_price = school.net_price_avg
      end
      schools << school
    end
    return schools.sort_by!(&:net_price)
  end

  def self.cyl_prep(inc, schools)
    ids = schools.split(',').map(&:to_i) #"22,33,444" to [22, 33, 444]
    net_price = "net_price_" + inc #avg to net_price_avg -column name
    self.cyl_query(ids, net_price)
  end



end
