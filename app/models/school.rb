class School < ActiveRecord::Base
  validates :name, presence: true, uniqueness: true

  def self.school_search(term, year)
    where('LOWER(name) LIKE :term AND years= :year', term: "%#{term.downcase}%", year: year)
  end

  def self.price_prep(inc, schools)
    ids = schools.split(',').map(&:to_i) #"22,33,444" to [22, 33, 444]
    ids.uniq! # removes duplicates
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
    ids.uniq!
    loan = "loan_" + inc #avg to loan_avg -column name
    earn = "earn_" + inc
    self.cyl_query(ids, loan, earn)
  end

  def self.cyl_query(ids, loan, earn)
    schools = []
    ids.each do |id|
      school = School.select("name", "loan_avg", "#{loan} AS loan", "earn_avg",
                             "#{earn} AS earn", "p_over_25_k").where(["id = ?", id]).first
      if school.loan == 0
        school.loan = school.loan_avg
      end
      if school.earn == 0
        school.earn = school.earn_avg
      end
      schools << school
    end
    return schools
  end
end
