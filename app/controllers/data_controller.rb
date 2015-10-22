class DataController < ApplicationController


private
  def mock_data
    schools = [
      { name: "University of Montana", net_price: 12345, carnegie: "public 4-year" },
      { name: "Seattle University", net_price: 32346, carnegie: "private 4-year" },
      { name: "Highline College", net_price: 7233, carnegie: "public 2-year" },
      { name: "Gallatin College", net_price: 9233, carnegie: "public 2-year" },
      { name: "University of Kentucky", net_price: 22233, carnegie: "public 4-year" } ]
    schools.sort_by! { |k| k[:net_price] }
    return schools
  end

end
