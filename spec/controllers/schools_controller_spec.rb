require 'rails_helper'
require 'pry'
RSpec.describe SchoolsController, type: :controller do

  describe "search function" do
    before :each do
      School.create(name: "Seattle University", state: "WA", net_price_avg: 12345, control: "private non-profit")
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

  # describe "pricegraph function" do
  #   before :each do
  #     get :pricegraph, {
  #       "inc": "low",
  #       "school-ids": "2666,1382,2828"
  #     }
  #   end
  #
  #   it "should be successful" do
  #     expect(response).to be_ok
  #   end
  #
  #   it "should return a json response object" do
  #     expect(response.header['Content-Type']).to include 'application/json'
  #   end
  #
  #   context "the returned json object" do
  #     it "has the right keys" do
  #       data = JSON.parse response.body
  #
  #       %w(name control net_price).each do |key|
  #         expect(data.map(&:keys).flatten.uniq).to include key
  #       end
  #     end
  #   end
  # end
end
