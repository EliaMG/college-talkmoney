class School < ActiveRecord::Base

  def self.school_search(term, year)
    where('LOWER(name) LIKE :term AND years= :year', term: "%#{term.downcase}%", year: year)
  end
end
