require 'rails_helper'
require 'pry'
RSpec.describe SchoolsController, type: :controller do
  before(:all) do
    School.delete_all
    School.create(name: "Seattle University", state: "WA", years: 4,
               net_price_avg: 33557, net_price_low: 28004, loan_avg: 25000,
               loan_low: 23000, p_over_25_k: 0.752, earn_avg: 45300,
               earn_low: 48900, control: "private non-profit")
  end

  describe "search function" do
    before :each do
      get :search, term: "seattle u", years: 4, format: :json
    end

    it "should be successful" do
      expect(response).to be_ok
    end

    it "should return a json response object" do
      expect(response.header['Content-Type']).to include 'application/json'
    end

    context "the returned json object" do
      it "has the right keys" do

        data = JSON.parse response.body
        %w(id name state).each do |key|
          expect(data.map(&:keys).flatten.uniq).to include key
        end
      end
    end
  end

  describe "get schools function" do
    let (:school_id) {School.first.id}
    before :each do
      get :getschools, {
        "inc": "low",
        "school-ids": school_id
      }
    end

    it "should be successful" do
      expect(response).to be_ok
    end

    it "should return a json response object" do
      expect(response.header['Content-Type']).to include 'application/json'
    end

    context "the returned json object" do
      it "has the right keys" do
        data = JSON.parse response.body

        %w(name control price net_price_avg loan_avg loan earn_avg earn).each do |key|
          expect(data.map(&:keys).flatten.uniq).to include key
        end
      end
    end
  end

  describe "handles user hitting submit with no schools" do

    it "compare schools with no input does not break the page" do
      get :getschools, {
        "inc": "low",
        "school-ids": ""
      }
      data = JSON.parse response.body

      expect(response).to be_ok
      expect(data.length).to eq 0
    end
    
  end
end
