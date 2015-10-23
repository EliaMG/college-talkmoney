require 'rails_helper'
require 'pry'
RSpec.describe School, type: :model do
  describe "model validations" do

    it "makes a school in the test db" do
      School.create(name: "Seattle University", state: "WA", net_price_avg: 12345, control: "private non-profit")

      expect(School.first.name).to eq "Seattle University"
    end

    it "won't make a school without a name" do
      school = School.create(state: "MT", net_price_avg: 1345, control: "public")

      expect(school).to_not be_valid
      expect(school.errors.keys).to include(:name)
    end

    it "won't make schools with the same name" do
      school = School.create(name: "Montana State University", state: "MT", net_price_avg: 1345, control: "public")
      school2 = School.create(name: "Montana State University", state: "MT", net_price_avg: 1345, control: "public")

      expect(school2).to_not be_valid
      expect(school2.errors.keys).to include(:name)
    end

  end

  describe "model methods" do
    before :each do
      @school1 = School.create(name: "Seattle University", state: "WA", years: 4,
                 net_price_avg: 33557, net_price_low: 28004, loan_avg: 25000,
                 loan_low: 23000, p_over_25_k: 0.752, earn_avg: 45300,
                 earn_low: 48900, control: "private non-profit")
      @school2 = School.create(name: "Montana State University", state: "MT",
                 p_over_25_k: 0.462, years: 4, net_price_avg: 2345, control: "public",
                 net_price_low: 1234, loan_avg: 12345, loan_low: 10987,
                 earn_avg: 32345, earn_low: 30987)
      @school2 = School.create(name: "Seattle Central College", state: "WA",
                 p_over_25_k: 0.555, years: 2, net_price_avg: 2345, control: "public",
                 net_price_low: 1234, loan_avg: 12345, loan_low: 10987,
                 earn_avg: 32345, earn_low: 30987)
    end

    it "search finds a 4 year school" do
      search = School.school_search("seattle", 4)
      expect(search.first.name).to eq "Seattle University"
    end
  end
end
