class DataController < ApplicationController
  def price_graph
    begin
      data = mock_data
      code = :ok
    rescue
      data = {}
      code = :no_content
      end

    render json: data.as_json, code: code
  end

  def user_input
    # @data =
  end

  def year
    begin
      data = School.where(years: params[:year]).pluck(:name, :state)
      code = :ok
    rescue
      data = {}
      code = :no_content
      end

    render json: data.as_json, code: code
  end

  # def four_year
  #   begin
  #     data = School.where(years: 4).pluck(:name, :state)
  #     code = :ok
  #   rescue
  #     data = {}
  #     code = :no_content
  #     end
  #
  #   render json: data.as_json, code: code
  # end

private
  def mock_data
    schools = [
      { name: "University of Montana", net_price: 12345, carnegie: "public 4-year" },
      { name: "Seattle University", net_price: 32346, carnegie: "private 4-year" },
      { name: "Highline College", net_price: 7233, carnegie: "public 2-year" },
      { name: "Gallatin College", net_price: 9233, carnegie: "public 2-year" } ]
    schools.sort_by! { |k| k[:net_price] }
    return schools
  end

end
