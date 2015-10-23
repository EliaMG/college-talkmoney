require 'rails_helper'

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
      School.create(name: "Seattle University", state: "WA", net_price_avg: 12345, control: "private non-profit")
      School.create(name: "Montana State University", state: "MT", net_price_avg: 1345, control: "public")
    end

    # it "makes a school in the test db" do
    #   expect(School.first.name).to eq "Seattle University"
    # end
    #


  end
end
