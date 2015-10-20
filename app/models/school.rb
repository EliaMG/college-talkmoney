class School < ActiveRecord::Base

  def self.school_search(term)

    where('LOWER(name) LIKE :term', term: "%#{term.downcase}%")

  end

end
