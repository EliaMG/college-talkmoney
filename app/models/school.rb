class School < ActiveRecord::Base
  validates :name, presence: true, uniqueness: true

  def self.school_search(term, year)
    where('LOWER(name) LIKE :term AND years= :year', term: "%#{term.downcase}%", year: year)
  end

  def self.data_prep(inc, schools)
    ids = schools.split(',').map(&:to_i) # "22,33,444" to [22, 33, 444]
    ids.uniq! # removes duplicates
    price = "net_price_" + inc # avg to net_price_avg -column name
    loan = "loan_" + inc
    earn = "earn_" + inc
    self.data_query(ids, price, loan, earn)
  end

  def self.data_query(ids, price, loan, earn)
    schools = []
    ids.each do |id|
      school = School.select("name", "control", "net_price_avg", "#{price} AS price",
                             "loan_avg", "#{loan} AS loan", "earn_avg",
                             "#{earn} AS earn").where(["id = ?", id]).first
      if school.price == 0
         school.price = school.net_price_avg
      end
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
