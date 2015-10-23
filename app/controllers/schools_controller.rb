class SchoolsController < ApplicationController

  def search
    @schools = School.school_search(params[:term], params[:years])

    respond_to do |format|
      format.html
      format.json { render json: @schools.select('id', 'name', 'state') }
    end
  end

  def pricegraph
    schools = School.price_prep(params["inc"], params["school-ids"])
    begin
      data = schools
      code = :ok
    rescue
      data = {}
      code = :no_content
    end
    render json: data.as_json, code: code
  end

  def cylinders
    schools = School.cyl_prep(params["inc"], params["school-ids"])
    begin
      data = schools
      code = :ok
    rescue
      data = {}
      code = :no_content
    end
    render json: data.as_json, code: code
  end
end
