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
    before(:all) do
      School.delete_all
      School.create(name: "Seattle University", state: "WA", years: 4,
            net_price_avg: 33557, net_price_low: 28004, loan_avg: 25000,
            loan_low: 23000, p_over_25_k: 0.752, earn_avg: 45300,
            earn_low: 48900, control: "private non-profit")
      School.create(name: "Montana State University", state: "MT",
            p_over_25_k: 0.462, years: 4, net_price_avg: 3345, control: "public",
            net_price_low: 0, loan_avg: 22345, loan_low: 20987,
            earn_avg: 32345, earn_low: 30987)
      School.create(name: "Seattle Central College", state: "WA",
            p_over_25_k: 0.555, years: 2, net_price_avg: 2345, control: "public",
            net_price_low: 1234, loan_avg: 12345, loan_low: 0,
            earn_avg: 35345, earn_low: 0)
    end

    describe "self.school_search" do

      it "search finds a 4 year school" do
        search = School.school_search("seattle", 4)
        expect(search.first.name).to eq "Seattle University"
      end

      it "search finds a 2 year school" do
        search = School.school_search("seattle", 2)
        expect(search.first.name).to eq "Seattle Central College"
      end

      it "2 year search does not look 4 year schools" do
        search = School.school_search("montana", 2)
        expect(search).to be_empty
      end
    end

    describe "self.price_query" do
      let (:ids) {School.pluck(:id)}
      let (:string_ids) {ids.join(",")}

      it "returns schools sorted by net price" do
        schools = School.price_query(ids, "net_price_low")

        expect(schools.first.name).to eq "Seattle Central College"
        expect(schools.last.name).to eq "Seattle University"
      end

      it "returns net_price_avg if net_price_low is 0" do
        schools = School.price_query(ids, "net_price_low")

        expect(schools[1].net_price).to eq 3345
      end

      it "formats input correctly using the price_prep method" do
        schools = School.price_prep("low", string_ids)

        expect(schools.first.name).to eq "Seattle Central College"
        expect(schools.last.name).to eq "Seattle University"
      end

    end

    describe "self.cyl_query" do
      let (:ids) {School.pluck(:id)}
      let (:string_ids) {ids.join(",")}

      it "returns loan_avg if loan_low is 0" do
        schools = School.cyl_query(ids, "loan_low", "earn_low")

          expect(schools.last.loan).to eq 12345
      end

      it "returns earn_avg if earn_low is 0" do
          schools = School.cyl_query(ids, "loan_low", "earn_low")

        expect(schools.last.earn).to eq 35345
      end

      it "returns both loan_avg and loan if both available" do
        schools = School.cyl_query(ids, "loan_low", "earn_low")

          expect(schools.first.loan_avg).to eq 25000
          expect(schools.first.loan).to eq 23000 #converts passed in param to loan
      end

      it "returns both earn_avg and earn if both available" do
          schools = School.cyl_query(ids, "loan_low", "earn_low")

        expect(schools.first.earn_avg).to eq 45300
        expect(schools.first.earn).to eq 48900
      end

      it "formats input correctly using the cyl_prep method" do
        schools = School.cyl_prep("low", string_ids)

        expect(schools.first.name).to eq "Seattle University"
        expect(schools.last.name).to eq "Seattle Central College"
      end
    end
  end
end
