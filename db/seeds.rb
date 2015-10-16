require 'csv'

# h/t to http://blog.andreamostosi.name/2013/06/encoding-csv-and-ruby/ for the encoding line

 CSV.foreach("db/seedscleaned.csv", encoding: "iso-8859-1:UTF-8", headers: true) do |row|

   School.create(
     name: row[0],
     url: row[4],
     city: row[1],
     state: row[2],
     zip: row[3],
     lat: row[16],
     long: row[17],
     control: row[15],
     years: row[9],
     distance_only: row[20],
     net_price_avg: row[23],
     net_price_low: row[24],
     net_price_mid: row[25],
     net_price_high: row[26],
     loan_avg: row[44],
     loan_low: row[45],
     loan_mid: row[46],
     loan_high: row[47],
     rpy_rt_avg: row[40],
     rpy_rt_low: row[41],
     rpy_rt_mid: row[42],
     rpy_rt_high: row[43],
     debt_90: row[49],
     debt_75: row[50],
     debt_25: row[51],
     debt_10: row[52],
     p_over_25_k: row[53],
     earn_mean: row[54],
     earn_med: row[55],
     earn_low: row[60],
     earn_mid: row[61],
     earn_high: row[62]
   )
  end
