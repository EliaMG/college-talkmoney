require 'rails_helper'

RSpec.describe SchoolsController, type: :controller do

  describe "search function" do
    before :each do
      get :search, term: "seattle u", years: 4
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
end
